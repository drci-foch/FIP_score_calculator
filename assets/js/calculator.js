/**
 * FIP-Score Calculator - JavaScript
 * Hôpital Foch - CEREO
 * 
 * Calculator logic for screening FIP1L1::PDGFRA-associated HES
 */

// ================================
// Global State
// ================================

let currentLanguage = 'en';

// Score weights for each criterion
const CRITERIA_WEIGHTS = {
    age: 9,
    sex: 9,
    splenomegaly: 18,
    'no-gi': 11,
    papulosis: 9,
    b12: 15,
    tryptase: 13,
    ige: 12
};

const THRESHOLD = 48;
const MAX_SCORE = 96;

// ================================
// Initialization
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculator
    calculateScore();
    
    // Set initial language
    setLanguage('en');
});

// ================================
// Score Calculation
// ================================

function toggleCriterion(element, checkboxId) {
    const checkbox = document.getElementById(checkboxId);
    checkbox.checked = !checkbox.checked;
    calculateScore();
}

function calculateScore() {
    let totalScore = 0;
    
    // Update visual state of criterion cards
    const criteria = document.querySelectorAll('.criterion-card');
    criteria.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            card.classList.add('selected');
            totalScore += CRITERIA_WEIGHTS[checkbox.id];
        } else if (checkbox) {
            card.classList.remove('selected');
        }
    });
    
    // Update score display
    updateScoreDisplay(totalScore);
    
    // Update interpretation
    updateInterpretation(totalScore);
    
    // Track analytics (if analytics module is loaded)
    if (typeof trackScoreCalculation === 'function') {
        trackScoreCalculation(totalScore);
    }
}

function updateScoreDisplay(score) {
    const scoreElement = document.getElementById('score');
    const scoreBarElement = document.getElementById('score-bar');
    
    // Animate score change
    scoreElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        scoreElement.textContent = score;
        scoreElement.style.transform = 'scale(1)';
    }, 150);
    
    // Update progress bar
    const percentage = (score / MAX_SCORE) * 100;
    scoreBarElement.style.width = percentage + '%';
}

function updateInterpretation(score) {
    const interpretationCard = document.getElementById('interpretation-card');
    const interpretationIcon = document.getElementById('interpretation-icon');
    const interpretationTitle = document.getElementById('interpretation-title');
    const interpretationText = document.getElementById('interpretation-text');
    const recommendationCard = document.getElementById('recommendation-card');
    const recommendationTitle = document.getElementById('recommendation-title');
    const recommendationText = document.getElementById('recommendation-text');
    
    if (score === 0) {
        interpretationCard.style.display = 'none';
        recommendationCard.style.display = 'none';
        return;
    }
    
    // Show interpretation card
    interpretationCard.style.display = 'block';
    recommendationCard.style.display = 'block';
    
    if (score >= THRESHOLD) {
        // High probability - Testing recommended
        interpretationIcon.textContent = '⚠️';
        recommendationCard.classList.remove('negative');
        recommendationCard.classList.add('positive');
        
        if (currentLanguage === 'en') {
            interpretationTitle.textContent = `Score ≥ ${THRESHOLD}: FIP1L1::PDGFRA-associated HES suspected`;
            interpretationText.textContent = `With a score of ${score} points, testing for FIP1L1::PDGFRA fusion gene is recommended.`;
            
            recommendationTitle.innerHTML = '⚠️ Testing Recommended';
            recommendationText.innerHTML = `
                <p><strong>FIP1L1::PDGFRA fusion gene testing should be performed</strong></p>
                <ul>
                    <li>Method: RT-PCR or FISH on peripheral blood and/or bone marrow</li>
                    <li>Consider bone marrow aspiration with conventional karyotyping</li>
                    <li>Consider Next Generation Sequencing-based gene panel tests</li>
                    <li>Look for translocations involving ABL1, PDGFRA, PDGFRB, or FGFR1</li>
                </ul>
                <p style="margin-top: 16px;"><em>Note: This score has 85.7% sensitivity and 97.0% specificity in identifying F/P-associated HES.</em></p>
            `;
        } else {
            interpretationTitle.textContent = `Score ≥ ${THRESHOLD} : SHE associé à FIP1L1::PDGFRA suspecté`;
            interpretationText.textContent = `Avec un score de ${score} points, la recherche du gène de fusion FIP1L1::PDGFRA est recommandée.`;
            
            recommendationTitle.innerHTML = '⚠️ Recherche recommandée';
            recommendationText.innerHTML = `
                <p><strong>La recherche du gène de fusion FIP1L1::PDGFRA doit être effectuée</strong></p>
                <ul>
                    <li>Méthode : RT-PCR ou FISH sur sang périphérique et/ou moelle osseuse</li>
                    <li>Envisager une aspiration médullaire avec caryotype conventionnel</li>
                    <li>Envisager des tests de panel génétique par séquençage de nouvelle génération</li>
                    <li>Rechercher des translocations impliquant ABL1, PDGFRA, PDGFRB ou FGFR1</li>
                </ul>
                <p style="margin-top: 16px;"><em>Note : Ce score a une sensibilité de 85,7% et une spécificité de 97,0% pour identifier le SHE associé à F/P.</em></p>
            `;
        }
    } else {
        // Low probability - Testing not warranted
        interpretationIcon.textContent = '✓';
        recommendationCard.classList.remove('positive');
        recommendationCard.classList.add('negative');
        
        if (currentLanguage === 'en') {
            interpretationTitle.textContent = `Score < ${THRESHOLD}: FIP1L1::PDGFRA-associated HES unlikely`;
            interpretationText.textContent = `With a score of ${score} points, FIP1L1::PDGFRA-associated HES is unlikely.`;
            
            recommendationTitle.innerHTML = '✓ Low Probability';
            recommendationText.innerHTML = `
                <p><strong>FIP1L1::PDGFRA fusion gene testing is not warranted at this point</strong></p>
                <p>Consider investigating other causes of hypereosinophilia:</p>
                <ul>
                    <li>Parasitic infections</li>
                    <li>Drug-induced hypereosinophilia</li>
                    <li>Allergic conditions</li>
                    <li>Lymphocytic variant HES</li>
                    <li>Other secondary causes</li>
                </ul>
                <p style="margin-top: 16px;"><strong>Note:</strong> If clinical suspicion remains high or if the patient shows steroid resistance, further investigations including F/P testing may still be indicated based on clinical judgment.</p>
            `;
        } else {
            interpretationTitle.textContent = `Score < ${THRESHOLD} : SHE associé à FIP1L1::PDGFRA peu probable`;
            interpretationText.textContent = `Avec un score de ${score} points, un SHE associé à FIP1L1::PDGFRA est peu probable.`;
            
            recommendationTitle.innerHTML = '✓ Faible probabilité';
            recommendationText.innerHTML = `
                <p><strong>La recherche du gène de fusion FIP1L1::PDGFRA n'est pas justifiée à ce stade</strong></p>
                <p>Envisager d'autres causes d'hyperéosinophilie :</p>
                <ul>
                    <li>Infections parasitaires</li>
                    <li>Hyperéosinophilie médicamenteuse</li>
                    <li>Conditions allergiques</li>
                    <li>SHE variant lymphocytaire</li>
                    <li>Autres causes secondaires</li>
                </ul>
                <p style="margin-top: 16px;"><strong>Note :</strong> Si la suspicion clinique reste élevée ou si le patient présente une résistance aux corticoïdes, des investigations supplémentaires incluant la recherche de F/P peuvent toujours être indiquées selon le jugement clinique.</p>
            `;
        }
    }
}

// ================================
// Language Management
// ================================

function setLanguage(lang) {
    currentLanguage = lang;
    
    // Update button states
    document.getElementById('btn-en').classList.remove('active');
    document.getElementById('btn-fr').classList.remove('active');
    document.getElementById('btn-' + lang).classList.add('active');
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-' + lang + ']');
    elements.forEach(element => {
        const translation = element.getAttribute('data-' + lang);
        
        // Check if element contains HTML or just text
        if (element.tagName === 'P' || element.tagName === 'SPAN' || element.tagName === 'LI') {
            element.innerHTML = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Update interpretation with current score
    const currentScore = parseInt(document.getElementById('score').textContent);
    updateInterpretation(currentScore);
    
    // Store language preference
    try {
        localStorage.setItem('fip-score-language', lang);
    } catch (e) {
        // LocalStorage not available
    }
}

// ================================
// Reset Function
// ================================

function resetCalculator() {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Remove selected class from all cards
    const cards = document.querySelectorAll('.criterion-card');
    cards.forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset score
    document.getElementById('score').textContent = '0';
    document.getElementById('score-bar').style.width = '0%';
    
    // Hide interpretation
    document.getElementById('interpretation-card').style.display = 'none';
    document.getElementById('recommendation-card').style.display = 'none';
    
    // Add animation feedback
    const resetBtn = document.querySelector('.reset-btn');
    resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        resetBtn.style.transform = 'scale(1)';
    }, 150);
}

// ================================
// Utility Functions
// ================================

// Restore language preference on load
(function restoreLanguagePreference() {
    try {
        const savedLanguage = localStorage.getItem('fip-score-language');
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
            setLanguage(savedLanguage);
        }
    } catch (e) {
        // LocalStorage not available, use default
    }
})();

// ================================
// Copy Email Function
// ================================

function copyEmail() {
    const email = 'cereo@hopital-foch.com';
    const btn = document.getElementById('copy-email-btn');
    const feedback = document.getElementById('copy-feedback');
    
    // Copy to clipboard
    navigator.clipboard.writeText(email).then(() => {
        // Show success feedback
        btn.classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(() => {
            btn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            btn.classList.add('copied');
            setTimeout(() => {
                btn.classList.remove('copied');
            }, 2000);
        } catch (e) {
            console.error('Copy failed', e);
        }
        document.body.removeChild(textArea);
    });
}

// Export functions for global access
window.calculateScore = calculateScore;
window.toggleCriterion = toggleCriterion;
window.setLanguage = setLanguage;
window.resetCalculator = resetCalculator;
window.copyEmail = copyEmail;