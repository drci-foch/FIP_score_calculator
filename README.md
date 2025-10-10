# FIP-Score Calculator

Clinical decision support tool for screening **FIP1L1::PDGFRA-associated Hypereosinophilic Syndrome (HES)**.
Developed by the Data Unit at **Hôpital Foch**, Suresnes, France.

---

## 📋 Overview

The FIP-Score is a validated screening tool that helps clinicians identify patients with hypereosinophilia who should undergo testing for the FIP1L1::PDGFRA fusion gene. 

**Key Performance Metrics:**
- Sensitivity: 85.7%
- Specificity: 97.0%
- AUC: 0.986
- Cutoff: ≥ 48 points

---

## 🚀 Quick Start

### Option 1: Direct Use
Simply open `index.html` in any modern web browser. No server required!

### Option 2: Local Development Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Then open: http://localhost:8000
```

---

## 📁 Project Structure

```
fip-score-calculator/
├── README.md                 # This file
├── index.html               # Main application file
├── assets/
│   ├── css/
│   │   └── style.css       # Stylesheet with Hôpital Foch branding
│   ├── js/
│   │   └── calculator.js   # Calculator logic
│   └── images/
│       ├── logo-foch.svg   # Hôpital Foch logo (to be added)
│       └── favicon.ico     # Favicon (to be added)
└── docs/
    └── reference.pdf       # Scientific publication (optional)
```

---

## 🎨 Branding

The application uses **Hôpital Foch's** official color palette:

- **Primary Blue**: `#003d82`
- **Light Blue**: `#0066cc`
- **Teal Accent**: `#00a8a8`
- **Font**: Montserrat

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fip-score-calculator.git
cd fip-score-calculator
```
### 2. Test Locally

Open `index.html` in your browser or use a local server.

---

## 📊 The FIP-Score

### Parameters (8 criteria)

| Parameter | Points | Criteria |
|-----------|--------|----------|
| Age < 66 years | +9 | Patient younger than 66 |
| Male sex | +9 | Male gender |
| Splenomegaly | +18 | Palpable or radiological |
| No GI involvement | +11 | No gastrointestinal symptoms |
| Lymphomatoid papulosis | +9 | Present |
| Elevated vitamin B12 | +15 | > 1000 ng/L |
| Elevated tryptase | +13 | > 11.5 µg/L |
| Normal IgE levels | +12 | < 150 kUI/L |

**Maximum Score**: 96 points  
**Decision Threshold**: ≥ 48 points

### Interpretation

- **Score ≥ 48**: FIP1L1::PDGFRA fusion gene testing **recommended**
  - Perform RT-PCR or FISH
  - Consider bone marrow aspiration
  - Consider NGS-based gene panels

- **Score < 48**: FIP1L1::PDGFRA-associated HES **unlikely**
  - Investigate other causes of hypereosinophilia
  - Clinical judgment remains paramount

---

## 🌐 Features

✅ **Bilingual**: English and French  
✅ **Responsive Design**: Works on mobile, tablet, and desktop  
✅ **Accessible**: WCAG 2.1 compliant  
✅ **No Dependencies**: Pure HTML/CSS/JavaScript  
✅ **Offline Capable**: Works without internet connection  
✅ **Print Friendly**: Optimized for printing results

---

## 📚 Scientific Reference

**Stammler R**, Vallée A, Rohmer J, *et al.*  
*Development and validation of the FIP-Score for the screening of FIP1L1::PDGFRA-associated hypereosinophilic syndrome.*  
**Journal of Allergy and Clinical Immunology: In Practice.** 2025 (in press).

---

## 👥 Authors & Contributors

**Lead Authors:**
- Romain Stammler, MD
- Alexandre Vallée, MD, PhD
- Julien Rohmer, MD
- Matthieu Groh, MD

**On behalf of:**
- COHESion Study Group
- CEREO (Centre de Référence des Syndromes Hyperéosinophiliques)
- GBMHM (Groupe de Biologistes Moléculaires Hématologues)

---

## ⚖️ License & Disclaimer

### Medical Disclaimer

**This calculator is intended for healthcare professionals only** and should be used as a clinical decision support tool. It does not replace clinical judgment or comprehensive patient evaluation.

Always consider:
- Complete clinical context
- Patient history
- Physical examination
- Other diagnostic tests
- Current guidelines

### Copyright

© 2025 Hôpital Foch - CEREO. All rights reserved.

The FIP-Score and this calculator are provided for clinical and educational purposes. Commercial use requires permission.

---

## 🐛 Bug Reports & Feature Requests

Please open an issue on GitHub or contact the development team.

---

## 🙏 Acknowledgments

We are grateful to all patients who participated in the FIPEO and COHESion studies, as well as their treating physicians.

**Funding**: The COHESion study is supported by AstraZeneca and GlaxoSmithKline.

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Production Ready ✅
