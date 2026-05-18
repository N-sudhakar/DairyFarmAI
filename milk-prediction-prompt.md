# Milk Yield Prediction Module — Prompt
### Integrated into Existing Cattle Farm Management System
### Based on South India Dairy Research Data (TANUVAS, ICAR, NDDB)

---

## Field Reality (50 Years of Cattle Farming Experience)

In Tamil Nadu, **Jersey crossbred cattle account for 90% of total milk production**.
Research from TANUVAS on 75,627 Jersey crossbred cows (2012–2022) shows:
- Daily test-day milk yield ranges from **4.98 kg to 9.95 kg** depending on lactation stage
- **Peak yield occurs at lactation month 2** — then gradually declines
- **Season of calving, agroclimatic zone, parity, and feed** are the top non-genetic factors affecting yield
- A small farmer who cannot predict yield **wastes milk, loses buyers, and misses income**
- This module gives every small and medium farm the prediction power that only large organized farms had before

---

## Module Overview

Add a **Milk Yield Prediction** module to the existing Cattle Management System.
The module must predict:
- **Daily milk yield** (litres/day) — for next 7 days
- **Weekly milk forecast** (litres/week) — for next 4 weeks
- **Monthly milk forecast** (litres/month) — for next 3 months

Predictions must be based on real input data entered by the farmer for each animal.
All predictions must update automatically when input data changes.

---

## Prediction Input Factors

The system must collect the following inputs per animal to generate predictions:

### Factor 1 — Breed
| Breed | Expected Daily Yield Range | Notes |
|-------|---------------------------|-------|
| Jersey Crossbred (50% exotic) | 5 – 10 litres/day | Most common in Tamil Nadu, AP, Karnataka |
| Holstein Friesian (HF) Crossbred | 8 – 15 litres/day | Better yield, needs more feed & care |
| Gir (Indigenous) | 3 – 6 litres/day | Heat tolerant, A2 milk, lower but steady yield |
| Sahiwal (Indigenous) | 4 – 7 litres/day | Disease resistant, suited for dry zones |
| HF × Gir Crossbred | 6 – 12 litres/day | Balanced yield + adaptability |
| Non-Descript / Mixed | 2 – 4 litres/day | Baseline for unknown breed farms |

- Breed sets the **baseline yield ceiling** for predictions
- System must allow farmer to select breed from a dropdown (pre-filled from cattle inventory)

---

### Factor 2 — Lactation Stage (Days in Milk — DIM)
This is the single most important factor in milk prediction.

Based on the standard Wood's lactation curve used in South India research:

| Lactation Phase | Days in Milk (DIM) | Yield Pattern |
|---|---|---|
| Early Lactation | Day 1 – Day 60 | Rising to peak — yield increases daily |
| Peak Lactation | Day 61 – Day 90 | Highest yield — maintain feed closely |
| Mid Lactation | Day 91 – Day 180 | Gradual decline — 2.5% drop per month |
| Late Lactation | Day 181 – Day 270 | Accelerated decline — 5–8% drop per month |
| Dry Period | Day 271 – Day 305+ | Yield stops — prepare for next calving |

- System must capture **calving date** per animal (already in cattle inventory)
- Auto-calculate current **Days in Milk (DIM)** from calving date to today
- Use DIM to position the animal on the lactation curve
- **Peak yield occurs at approximately Day 48–60 postpartum** (backed by Gir cattle 31-year data from JAU, Junagadh)

---

### Factor 3 — Parity (Lactation Number)
Parity significantly affects yield. Based on South India farm data:

| Parity | Yield Multiplier | Notes |
|--------|-----------------|-------|
| 1st Lactation (Heifer) | Baseline × 0.80 | First calvers produce less — body still growing |
| 2nd Lactation | Baseline × 0.95 | Yield improving |
| 3rd Lactation | Baseline × 1.00 | Peak productive parity — best yield |
| 4th Lactation | Baseline × 1.00 | Stable — watch for decline signals |
| 5th Lactation | Baseline × 0.90 | Yield starts dropping |
| 6th+ Lactation | Baseline × 0.75 | Significant decline — consider culling |

- System must store parity number per animal in the cattle inventory
- Auto-fetch parity when generating milk prediction

---

### Factor 4 — Feed & Nutrition
Feed directly impacts yield — a well-fed cow gives 20–35% more milk than a poorly fed one.

Farmer must input current feeding level per animal:

| Feed Input | Options |
|---|---|
| Green Fodder | Quantity in kg/day (e.g., Napier grass, Maize, Sorghum) |
| Dry Fodder | Quantity in kg/day (e.g., Paddy straw, Sugarcane bagasse) |
| Concentrate Feed | Quantity in kg/day (e.g., Cattle feed cake, Bran) |
| Mineral Supplement | Yes / No |
| Water Access | Adequate / Restricted |

**Feed Score Calculation (Internal):**
Calculate a feed score from 1–5 based on inputs:
- Score 5 = Fully balanced diet (green + dry + concentrate + mineral + adequate water)
- Score 3 = Moderate — missing concentrate or mineral
- Score 1 = Poor — only dry fodder, no green, no concentrate

Apply feed score as a yield multiplier:
| Feed Score | Yield Multiplier |
|---|---|
| 5 (Excellent) | ×1.00 (full predicted yield) |
| 4 (Good) | ×0.90 |
| 3 (Moderate) | ×0.80 |
| 2 (Poor) | ×0.65 |
| 1 (Very Poor) | ×0.50 |

---

### Factor 5 — Season & Weather
South India has 3 major seasons that affect milk yield significantly:

| Season | Months | Impact on Yield | Yield Multiplier |
|--------|--------|----------------|-----------------|
| Summer (Hot & Dry) | March – May | Heat stress reduces yield by 15–25% | ×0.80 |
| Southwest Monsoon | June – September | Moderate — good fodder availability | ×0.95 |
| Northeast Monsoon | October – November | Best season — cool, good grass | ×1.00 |
| Winter / Cool Dry | December – February | Good yield — comfortable temperature | ×1.00 |

- System must auto-detect current month and apply seasonal multiplier automatically
- No manual input required from farmer for season — system handles it

**Heat Stress Alert:**
- During March–May, if the farm is in the plains of Tamil Nadu, Andhra Pradesh, or Telangana:
- Show a warning: *"Summer heat stress period — ensure shade, adequate water, and extra green fodder to maintain yield"*

---

### Factor 6 — Age of Cow
Age works together with parity but has an independent effect:

| Age Range | Status | Yield Implication |
|---|---|---|
| Under 3 years | Young heifer / 1st lactation | Lower yield — body still developing |
| 3 – 6 years | Prime productive age | Maximum yield potential |
| 6 – 9 years | Middle-aged | Stable — monitor for decline |
| 9 – 12 years | Older cow | Declining yield — assess culling |
| 12+ years | Aged | Minimal yield — primarily used for calving |

---

## Prediction Calculation Logic

The system must combine all 6 factors into a single prediction engine:

```
Base Yield = Breed Baseline Yield (litres/day)
Lactation Curve Factor = Wood's curve position based on DIM
Parity Multiplier = Based on lactation number
Feed Score Multiplier = Based on farmer's feed input
Season Multiplier = Auto-applied based on current month
Age Adjustment = Fine-tuned based on cow's age

Predicted Daily Yield = Base Yield
                        × Lactation Curve Factor
                        × Parity Multiplier
                        × Feed Score Multiplier
                        × Season Multiplier
                        × Age Adjustment
```

- **Weekly Forecast** = Sum of 7 daily predictions (accounting for DIM advancing each day)
- **Monthly Forecast** = Sum of 30 daily predictions (lactation curve moves forward each day)
- All three outputs (daily / weekly / monthly) must be shown simultaneously

---

## Milk Recording — Daily Actual Entry

Farmer must be able to **record actual milk collected** each day per animal:

| Field | Details |
|---|---|
| Animal Tag ID | Auto-linked from cattle inventory |
| Date | Today's date (auto-filled) |
| Morning Milking (litres) | Manual entry |
| Evening Milking (litres) | Manual entry |
| Total Daily Yield (litres) | Auto-calculated (morning + evening) |
| Notes | Optional (e.g., "cow was sick", "missed feed") |

- After actual yield is recorded, compare it to prediction:
  - If actual yield is **15% below prediction**: Show alert → *"Yield drop detected — check feed, health, and water"*
  - If actual yield is **25% below prediction for 3 consecutive days**: Show red alert → *"Significant yield drop — consult veterinarian"*

---

## Prediction Output Display

### Per Animal View
Show a **milk prediction card** for each animal with:
- Animal name + Tag ID + Breed
- Current Days in Milk (DIM) — e.g., "Day 72 of lactation"
- Current lactation phase — e.g., "Peak Lactation"
- Today's predicted yield — e.g., **"8.4 litres today"**
- This week's predicted yield — e.g., **"58.8 litres this week"**
- This month's predicted yield — e.g., **"245 litres this month"**
- A visual lactation curve chart showing where the cow is today on the curve
- Actual vs predicted comparison (if daily records have been entered)

### Farm Summary View (Dashboard Integration)
Add a **Milk Summary Card** on the main dashboard:
- Total predicted yield today (all animals combined) — in litres
- Total predicted yield this week — in litres
- Total predicted yield this month — in litres
- Estimated monthly revenue from milk (predicted litres × farmer's set milk price per litre)
- Number of animals currently in active lactation vs dry period

---

## Milk Price & Revenue Prediction

Allow farmer to set a **milk selling price per litre** (₹):
- Default: ₹35/litre (current average South India cooperative price)
- Farmer can update this anytime

Revenue Predictions:
- Today's estimated revenue = Predicted daily yield × price per litre
- Weekly estimated revenue = Predicted weekly yield × price per litre
- Monthly estimated revenue = Predicted monthly yield × price per litre

---

## Yield History & Trend Analysis

Track actual milk recorded over time and show:
- **7-day trend graph** — actual daily yield for last 7 days per animal
- **Monthly trend** — average daily yield per month, last 6 months
- **Prediction accuracy** — show how close predictions were to actual yield (%)
- Flag animals whose yield is consistently below breed average → *"This cow is underperforming for her breed — review feed and health"*

---

## Dry Period & Next Lactation Prediction

- When a cow reaches **Day 270+ of lactation (DIM 270)**: Show alert → *"Plan dry-off period — expected in next 2–3 weeks"*
- After dry-off is recorded, system predicts **next calving date** (based on gestation: ~280 days for cattle)
- After next calving date, automatically start next lactation cycle and reset DIM to Day 1

---

## Breed-Specific Yield Reference (Built-in Guide)

Show farmers a reference table inside the app so they understand expected yields:

| Breed | Daily Yield | 305-Day Yield | Fat % | Best For |
|-------|-------------|---------------|-------|----------|
| Jersey Crossbred | 5–10 litres | 2,400 kg avg | 4.5–5.5% | Tamil Nadu plains — most common |
| HF Crossbred | 8–15 litres | 3,500–4,500 kg | 3–3.5% | Intensive farms with good feed |
| Gir | 3–6 litres | 1,800–2,300 kg | 4.5–5% | A2 milk, heat tolerant |
| Sahiwal | 4–7 litres | 2,400 kg | 4.5% | Dry zone, disease resistant |
| HF × Gir Cross | 6–12 litres | 2,800–3,500 kg | 4–4.5% | Balanced — ideal for South India |

---

## Language Support

All labels, predictions, alerts, messages, chart titles, and button text must be available in all 6 languages:

**English | Tamil | Hindi | Telugu | Kannada | Malayalam**

### Key Terms Translation Reference

| Term | Tamil | Hindi | Telugu | Kannada | Malayalam |
|------|-------|-------|--------|---------|-----------|
| Milk Prediction | பால் கணிப்பு | दूध पूर्वानुमान | పాల అంచనా | ಹಾಲು ಮುನ್ಸೂಚನೆ | പാൽ പ്രവചനം |
| Daily Yield | தினசரி மகசூல் | दैनिक उपज | రోజువారీ దిగుబడి | ದೈನಂದಿನ ಇಳುವರಿ | ദൈനംദിന വിളവ് |
| Weekly Forecast | வாராந்திர முன்னறிவிப்பு | साप्ताहिक पूर्वानुमान | వారపు అంచనా | ವಾರದ ಮುನ್ಸೂಚನೆ | പ്രതിവാര പ്രവചനം |
| Monthly Forecast | மாதாந்திர முன்னறிவிப்பு | मासिक पूर्वानुमान | నెలవారీ అంచనా | ಮಾಸಿಕ ಮುನ್ಸೂಚನೆ | മാസിക പ്രവചനം |
| Lactation Stage | பால் உற்பத்தி நிலை | दुग्ध अवस्था | స్తన్యపాన దశ | ಹಾಲೂಡಿಸುವ ಹಂತ | മുലയൂട്ടൽ ഘട്ടം |
| Peak Yield | உச்ச உற்பத்தி | चरम उत्पादन | గరిష్ట దిగుబడి | ಗರಿಷ್ಠ ಇಳುವರಿ | പരമാവധി വിളവ് |
| Dry Period | வறண்ட காலம் | शुष्क काल | పాలివ్వని కాలం | ಒಣ ಅವಧಿ | വരണ്ട കാലം |
| Actual Yield | உண்மையான மகசூல் | वास्तविक उपज | వాస్తవ దిగుబడి | ನಿಜವಾದ ಇಳುವರಿ | യഥാർത്ഥ വിളവ് |
| Revenue | வருவாய் | राजस्व | ఆదాయం | ಆದಾಯ | വരുമാനം |
| Yield Drop Alert | மகசூல் குறைவு எச்சரிக்கை | उपज में गिरावट | దిగుబడి తగ్గింపు హెచ్చరిక | ಇಳುವರಿ ಇಳಿಕೆ ಎಚ್ಚರಿಕೆ | വിളവ് കുറവ് മുന്നറിയിപ്പ് |

---

## Empty States & First-Use Guidance

| Situation | Message |
|---|---|
| No calving date set for animal | "Add calving date to start milk prediction for this animal" |
| No daily milk records entered yet | "Record today's milk yield to compare with prediction" |
| Animal in dry period | "This animal is in dry period — prediction will resume after next calving" |
| No animals in active lactation | "No animals are currently in active lactation. Add calving records to begin." |

---

## Competitive Advantage Summary

| Feature | Typical Farm Apps | This System |
|---------|------------------|-------------|
| Breed-specific prediction | ❌ Generic | ✅ 6 South India breeds |
| Lactation curve (Wood's model) | ❌ None | ✅ DIM-based curve |
| Seasonal adjustment (South India) | ❌ None | ✅ Auto-applied per month |
| Feed score impact on yield | ❌ None | ✅ 5-level feed scoring |
| Parity-based adjustment | ❌ None | ✅ Per-lactation multiplier |
| Daily actual vs predicted alert | ❌ None | ✅ 15% drop auto-alert |
| Revenue prediction | ❌ None | ✅ Daily / Weekly / Monthly |
| Dry-off & next calving alert | ❌ None | ✅ Automated |
| 6-language support | ❌ None | ✅ All 6 languages |
| Integrated with cattle inventory | ✅ Sometimes | ✅ Fully linked |
