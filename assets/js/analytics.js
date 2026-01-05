/**
 * FIP-Score Calculator - Analytics Module
 * Hôpital Foch - CEREO
 * 
 * Tracks calculator usage statistics internally
 * Stats are kept private and not displayed publicly (as per team decision)
 */

// ================================
// Analytics Configuration
// ================================

const ANALYTICS_CONFIG = {
    // Threshold for FIP suspicion
    FIP_THRESHOLD: 48,
    
    // Debounce delay to avoid tracking rapid changes (in ms)
    DEBOUNCE_DELAY: 2000,
    
    // Storage keys
    STORAGE_KEYS: {
        TOTAL_CALCULATIONS: 'fip_total_calculations',
        FIP_SUSPICIONS: 'fip_suspicions',
        SESSION_TRACKED: 'fip_session_tracked',
        LAST_SCORE: 'fip_last_score'
    }
};

// ================================
// State Management
// ================================

let analyticsState = {
    lastTrackedScore: null,
    debounceTimer: null,
    sessionCalculations: 0,
    sessionSuspicions: 0
};

// ================================
// GoatCounter Integration
// ================================

/**
 * Send event to GoatCounter (if available)
 * Events can be viewed in the GoatCounter dashboard
 */
function sendGoatCounterEvent(eventName, eventData = {}) {
    try {
        if (typeof window.goatcounter !== 'undefined' && window.goatcounter.count) {
            window.goatcounter.count({
                path: `events/${eventName}`,
                title: eventName,
                event: true
            });
        }
    } catch (e) {
        // GoatCounter not available, silently fail
        console.debug('GoatCounter event not sent:', eventName);
    }
}

// ================================
// Score Tracking
// ================================

/**
 * Track a score calculation
 * Uses debouncing to avoid tracking rapid changes
 */
function trackScoreCalculation(score) {
    // Clear any pending debounce
    if (analyticsState.debounceTimer) {
        clearTimeout(analyticsState.debounceTimer);
    }
    
    // Don't track if score hasn't changed significantly
    if (analyticsState.lastTrackedScore === score) {
        return;
    }
    
    // Debounce the tracking
    analyticsState.debounceTimer = setTimeout(() => {
        performScoreTracking(score);
    }, ANALYTICS_CONFIG.DEBOUNCE_DELAY);
}

/**
 * Actually perform the score tracking after debounce
 */
function performScoreTracking(score) {
    // Only track non-zero scores (actual calculations)
    if (score === 0) {
        return;
    }
    
    analyticsState.lastTrackedScore = score;
    analyticsState.sessionCalculations++;
    
    // Track as a calculation event
    sendGoatCounterEvent('calculation');
    
    // Track if score is above threshold (FIP suspicion)
    if (score >= ANALYTICS_CONFIG.FIP_THRESHOLD) {
        analyticsState.sessionSuspicions++;
        sendGoatCounterEvent('fip-suspicion');
        
        // Log internally for debugging
        console.debug(`FIP-Score Analytics: Suspicion tracked (score: ${score})`);
    }
    
    // Update local storage counters (for internal reference)
    updateLocalCounters(score);
    
    console.debug(`FIP-Score Analytics: Calculation tracked (score: ${score})`);
}

/**
 * Update local storage counters
 * These are kept for internal reference only
 */
function updateLocalCounters(score) {
    try {
        // Increment total calculations
        const totalCalcs = parseInt(localStorage.getItem(ANALYTICS_CONFIG.STORAGE_KEYS.TOTAL_CALCULATIONS) || '0');
        localStorage.setItem(ANALYTICS_CONFIG.STORAGE_KEYS.TOTAL_CALCULATIONS, (totalCalcs + 1).toString());
        
        // Increment suspicions if applicable
        if (score >= ANALYTICS_CONFIG.FIP_THRESHOLD) {
            const suspicions = parseInt(localStorage.getItem(ANALYTICS_CONFIG.STORAGE_KEYS.FIP_SUSPICIONS) || '0');
            localStorage.setItem(ANALYTICS_CONFIG.STORAGE_KEYS.FIP_SUSPICIONS, (suspicions + 1).toString());
        }
        
        // Store last score
        localStorage.setItem(ANALYTICS_CONFIG.STORAGE_KEYS.LAST_SCORE, score.toString());
        
    } catch (e) {
        // LocalStorage not available
        console.debug('LocalStorage not available for analytics');
    }
}

// ================================
// Session Tracking
// ================================

/**
 * Track page view / session start
 */
function trackSessionStart() {
    try {
        // Check if this session has been tracked
        const sessionTracked = sessionStorage.getItem(ANALYTICS_CONFIG.STORAGE_KEYS.SESSION_TRACKED);
        
        if (!sessionTracked) {
            sendGoatCounterEvent('session-start');
            sessionStorage.setItem(ANALYTICS_CONFIG.STORAGE_KEYS.SESSION_TRACKED, 'true');
            console.debug('FIP-Score Analytics: New session started');
        }
    } catch (e) {
        // SessionStorage not available
    }
}

// ================================
// Internal Statistics (for team reference)
// ================================

/**
 * Get internal statistics (for debugging/admin purposes)
 * This is not displayed to users
 */
function getInternalStats() {
    try {
        return {
            totalCalculations: parseInt(localStorage.getItem(ANALYTICS_CONFIG.STORAGE_KEYS.TOTAL_CALCULATIONS) || '0'),
            fipSuspicions: parseInt(localStorage.getItem(ANALYTICS_CONFIG.STORAGE_KEYS.FIP_SUSPICIONS) || '0'),
            sessionCalculations: analyticsState.sessionCalculations,
            sessionSuspicions: analyticsState.sessionSuspicions,
            lastScore: parseInt(localStorage.getItem(ANALYTICS_CONFIG.STORAGE_KEYS.LAST_SCORE) || '0')
        };
    } catch (e) {
        return {
            totalCalculations: 0,
            fipSuspicions: 0,
            sessionCalculations: analyticsState.sessionCalculations,
            sessionSuspicions: analyticsState.sessionSuspicions,
            lastScore: 0
        };
    }
}

/**
 * Reset internal statistics (admin only)
 */
function resetInternalStats() {
    try {
        localStorage.removeItem(ANALYTICS_CONFIG.STORAGE_KEYS.TOTAL_CALCULATIONS);
        localStorage.removeItem(ANALYTICS_CONFIG.STORAGE_KEYS.FIP_SUSPICIONS);
        localStorage.removeItem(ANALYTICS_CONFIG.STORAGE_KEYS.LAST_SCORE);
        analyticsState.sessionCalculations = 0;
        analyticsState.sessionSuspicions = 0;
        console.debug('FIP-Score Analytics: Stats reset');
    } catch (e) {
        // LocalStorage not available
    }
}

// ================================
// Initialization
// ================================

document.addEventListener('DOMContentLoaded', function() {
    trackSessionStart();
    
    // Make debug functions available in console for team
    window.fipAnalytics = {
        getStats: getInternalStats,
        resetStats: resetInternalStats
    };
    
    console.debug('FIP-Score Analytics: Module initialized');
    console.debug('FIP-Score Analytics: Use fipAnalytics.getStats() to view internal statistics');
});

// Export tracking function for use by calculator.js
window.trackScoreCalculation = trackScoreCalculation;