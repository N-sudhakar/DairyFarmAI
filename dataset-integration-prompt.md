# Dataset Integration Prompt — Milk Yield Prediction
### HTML + JavaScript | In-App Dataset (No Database Required)
### Based on TANUVAS, ICAR & NDDB South India Research Data

---

## Overview

All prediction datasets must be stored as **JavaScript constant objects** directly inside the app.
No external API, no database, no internet connection required.
The data lives inside the HTML/JS file itself and is loaded instantly when the page opens.
This makes the app work even in areas with poor internet — critical for rural South India farms.

---

## How to Structure the Dataset in JavaScript

All datasets must be declared as `const` objects at the top of the JavaScript file (or inside a
dedicated `data.js` file that is imported into the main app). They must be loaded before any
prediction function runs.

---

## Dataset 1 — Breed Baseline Yield Data

This dataset defines the **average daily milk yield range** and **305-day lactation yield**
for each breed common in South India.

Store it as a JavaScript object with breed name as the key:

### Data to Include:

| Breed Key | Breed Name | Min Yield (litres/day) | Max Yield (litres/day) | Average Yield (litres/day) | Peak Yield (litres/day) | 305-Day Total (litres) | Fat % |
|---|---|---|---|---|---|---|---|
| `jersey_cross` | Jersey Crossbred | 5 | 10 | 7.5 | 10 | 2400 | 5.0 |
| `hf_cross` | Holstein Friesian Crossbred | 8 | 15 | 11 | 15 | 4000 | 3.2 |
| `gir` | Gir (Indigenous) | 3 | 6 | 4.5 | 6 | 2000 | 4.8 |
| `sahiwal` | Sahiwal (Indigenous) | 4 | 7 | 5.5 | 7 | 2400 | 4.5 |
| `hf_gir_cross` | HF × Gir Crossbred | 6 | 12 | 9 | 12 | 3200 | 4.2 |
| `non_descript` | Non-Descript / Mixed | 2 | 4 | 3 | 4 | 900 | 4.0 |

### How It Is Used:
- When farmer selects a breed for an animal, the system reads `averageYield` as the base
- `peakYield` is used as the ceiling — prediction never exceeds this
- `fatPercent` is displayed on the animal card for buyer reference

---

## Dataset 2 — Wood's Lactation Curve Values

This is the most important dataset. It defines the **lactation curve multiplier** for each
day of the lactation cycle (Day 1 to Day 305).

Wood's model formula:
```
Yield on Day n = a × (n ^ b) × e^(−c × n)
```

Where for South India Jersey Crossbred (TANUVAS validated):
- `a` = 7.77 (scaling factor)
- `b` = 0.068 (rate of increase to peak)
- `c` = 0.0038 (rate of decline after peak)

### Instead of making the app calculate this formula live, pre-compute and store
the multiplier for every 10-day interval as a lookup table:

| DIM Range | Phase | Curve Multiplier |
|---|---|---|
| Day 1 – 10 | Early | 0.60 |
| Day 11 – 20 | Early | 0.72 |
| Day 21 – 30 | Early | 0.82 |
| Day 31 – 40 | Early | 0.90 |
| Day 41 – 50 | Rising to Peak | 0.96 |
| Day 51 – 60 | Peak | 1.00 |
| Day 61 – 70 | Peak | 0.99 |
| Day 71 – 80 | Peak | 0.97 |
| Day 81 – 90 | Peak | 0.95 |
| Day 91 – 110 | Mid Lactation | 0.91 |
| Day 111 – 130 | Mid Lactation | 0.87 |
| Day 131 – 150 | Mid Lactation | 0.83 |
| Day 151 – 170 | Mid Lactation | 0.78 |
| Day 171 – 190 | Mid Lactation | 0.74 |
| Day 191 – 210 | Late Lactation | 0.69 |
| Day 211 – 230 | Late Lactation | 0.63 |
| Day 231 – 250 | Late Lactation | 0.57 |
| Day 251 – 270 | Late Lactation | 0.50 |
| Day 271 – 305 | Dry-off Zone | 0.30 |
| Day 305+ | Dry Period | 0.00 |

### How It Is Used:
- System calculates current DIM = Today's Date − Calving Date
- Looks up the DIM in the curve table → gets the multiplier
- Multiplies it against the breed baseline yield
- For weekly/monthly forecasts → advances DIM by 1 each day and looks up next multiplier

### Lactation Phase Labels (for display on UI):
Store phase labels separately so the UI can show the farmer what phase the cow is in:

| Multiplier Range | Phase Label (English) | Farmer Advice |
|---|---|---|
| 0.00 – 0.55 | Dry Period | Prepare for next calving. Provide dry cow therapy. |
| 0.56 – 0.79 | Late Lactation | Yield declining. Plan dry-off date. Reduce milking stress. |
| 0.80 – 0.94 | Mid Lactation | Maintain consistent feeding. Yield stable. |
| 0.95 – 0.99 | Rising to Peak | Increase concentrate feed. Yield climbing. |
| 1.00 | Peak Lactation | Maximum yield. Do not change feed or routine. |

---

## Dataset 3 — Seasonal Multipliers (South India)

This dataset adjusts the prediction based on the current month.
The system must auto-detect the current month using JavaScript's `new Date().getMonth()`
and apply the correct multiplier — no manual input from the farmer.

| Month Number (JS) | Month Name | Season | Multiplier | Reason |
|---|---|---|---|---|
| 0 | January | Cool Dry | 1.00 | Comfortable temperature — full yield |
| 1 | February | Cool Dry | 1.00 | Good conditions |
| 2 | March | Early Summer | 0.92 | Temperature rising — mild heat stress begins |
| 3 | April | Summer | 0.82 | Peak heat stress — yield drops significantly |
| 4 | May | Summer | 0.80 | Hottest month — maximum heat stress in South India |
| 5 | June | SW Monsoon Onset | 0.90 | Relief from heat but humidity stress |
| 6 | July | SW Monsoon | 0.93 | Good fodder availability — yield recovering |
| 7 | August | SW Monsoon | 0.95 | Stable monsoon — good yield |
| 8 | September | SW Monsoon End | 0.95 | Good conditions continue |
| 9 | October | NE Monsoon Onset | 0.97 | Cool and wet — near best conditions |
| 10 | November | NE Monsoon | 1.00 | Best season for South India dairy — peak conditions |
| 11 | December | Post Monsoon | 1.00 | Cool and dry — excellent yield conditions |

### Heat Stress Alert Logic:
- If current month is March, April, or May → show a yellow warning banner:
  *"Summer heat stress season — ensure shading, extra water (60–80 litres/cow/day),
  and additional green fodder to reduce yield loss"*
- If current month is April or May and breed is HF Crossbred → upgrade to red alert:
  *"HF crossbred cows are highly sensitive to heat — consider cooling fans or
  wet gunny bags to prevent severe yield drop"*

---

## Dataset 4 — Parity Multipliers

This dataset adjusts yield based on which lactation number (parity) the cow is currently in.
Parity must be stored in the cattle inventory record and auto-fetched during prediction.

| Parity Number | Lactation Description | Multiplier | Farmer Note |
|---|---|---|---|
| 1 | First Lactation (Heifer) | 0.80 | Young cow — body still developing. Lower yield is normal. |
| 2 | Second Lactation | 0.92 | Yield improving significantly from first lactation. |
| 3 | Third Lactation | 1.00 | Prime productive parity — expect maximum yield. |
| 4 | Fourth Lactation | 1.00 | Yield stable at peak. Monitor health closely. |
| 5 | Fifth Lactation | 0.90 | Yield beginning to decline. Watch for mastitis risk. |
| 6 | Sixth Lactation | 0.78 | Significant decline. Assess economic viability. |
| 7+ | Seventh Lactation and above | 0.65 | Low yield. Consider culling or retirement. |

### Parity Alert Logic:
- If parity = 1 and farmer expects high yield → show info message:
  *"First lactation cows normally give 20% less than their full potential.
  Yield will improve in the next lactation."*
- If parity ≥ 6 → show advisory:
  *"This cow is in her {parity}th lactation. Yield has declined naturally.
  Evaluate if continued milking is profitable for your farm."*

---

## How All 4 Datasets Work Together — Prediction Flow

The JavaScript prediction function must follow this exact sequence:

```
Step 1 → Read animal's breed → look up BREED DATASET → get averageYield (base)

Step 2 → Calculate DIM (Days in Milk):
         DIM = Today's Date − Animal's Calving Date (in days)

Step 3 → Look up DIM in LACTATION CURVE DATASET → get curveMultiplier

Step 4 → Read animal's parity from cattle inventory
         → look up PARITY DATASET → get parityMultiplier

Step 5 → Auto-detect current month using new Date().getMonth()
         → look up SEASONAL DATASET → get seasonMultiplier

Step 6 → Calculate final prediction:
         predictedDailyYield = averageYield
                               × curveMultiplier
                               × parityMultiplier
                               × seasonMultiplier

Step 7 → For weekly forecast:
         Loop Step 2–6 for DIM, DIM+1, DIM+2 ... DIM+6
         Sum all 7 daily predictions = weeklyYield

Step 8 → For monthly forecast:
         Loop Step 2–6 for DIM to DIM+29
         Sum all 30 daily predictions = monthlyYield

Step 9 → Display all three: dailyYield, weeklyYield, monthlyYield
```

---

## Dataset File Structure Recommendation

For a clean HTML + JavaScript project, organise the datasets like this:

```
project/
│
├── index.html               ← Main app file
├── js/
│   ├── datasets.js          ← ALL 4 datasets stored here as const objects
│   ├── prediction.js        ← Prediction calculation functions
│   ├── milkRecords.js       ← Daily milk entry and history functions
│   └── app.js               ← Main app logic, UI rendering
├── css/
│   └── style.css            ← Styling
└── lang/
    └── translations.js      ← All 6 language strings
```

- `datasets.js` must be loaded **first** in the HTML `<script>` tag order
- All other JS files depend on the datasets being available in memory

---

## Data Validation Rules

Before any prediction runs, the system must validate:

| Check | If Missing | Action |
|---|---|---|
| Breed not selected | Cannot predict | Show: "Select breed to generate prediction" |
| Calving date not entered | Cannot calculate DIM | Show: "Enter calving date to start prediction" |
| Parity not entered | Use default parity = 1 | Show subtle note: "Parity assumed as 1st lactation" |
| DIM > 305 | Cow likely in dry period | Show: "This cow may be in dry period — verify calving date" |
| DIM < 0 | Calving date is in the future | Show: "Calving date is in the future — prediction will begin after calving" |

---

## Empty State Messages (All 6 Languages)

| Situation | English | Tamil | Hindi | Telugu | Kannada | Malayalam |
|---|---|---|---|---|---|---|
| No breed selected | Select breed to predict | இனத்தை தேர்ந்தெடுக்கவும் | नस्ल चुनें | జాతిని ఎంచుకోండి | ತಳಿ ಆಯ್ಕೆ ಮಾಡಿ | ഇനം തിരഞ്ഞെടുക്കുക |
| No calving date | Enter calving date | ஈன்ற தேதி உள்ளிடவும் | ब्याने की तारीख डालें | దూడ వేసిన తేదీ నమోదు చేయండి | ಕರು ಹಾಕಿದ ದಿನಾಂಕ ನಮೂದಿಸಿ | പ്രസവ തീയതി നൽകുക |
| Cow in dry period | Dry period — no prediction | வறண்ட காலம் | शुष्क काल | పాలివ్వని కాలం | ಒಣ ಅವಧಿ | വരണ്ട കാലം |

---

## Summary — What This Gives the Farmer

| What the App Shows | What It Means to the Farmer |
|---|---|
| "Your cow will give 6.2 litres today" | Plan how many buyers to call today |
| "This week: 43 litres → ₹1,505" | Know income before the week starts |
| "This month: 178 litres → ₹6,230" | Plan monthly household budget |
| "Peak lactation — do not change feed" | Protect the highest-earning days |
| "Summer heat stress — add extra water" | Prevent avoidable yield loss |
| "6th lactation — assess profitability" | Make smart culling decisions |
