# AI-Based Milk Yield & Profit Prediction System for Dairy Farms
### Semester Project — Complete ML Web Application Prompt
### HTML + JavaScript Frontend | Python Flask Backend | Scikit-learn ML Models

---

## Project Title

**AI-Based Milk Yield and Profit Prediction System for Small and Medium Dairy Farms**
**with Multi-Language Support (English, Tamil, Hindi, Telugu, Kannada, Malayalam)**

---

## Project Purpose

Build a complete, real-world, AI-powered web application that helps dairy farmers:
- Predict the **next day's milk yield** per cow using Machine Learning
- Predict the **expected daily profit** from milk sales using Machine Learning
- Manage their **herd, daily milk records, and expenses** in one system
- View a **farm-level dashboard** with total yield, revenue, and profit summaries

This system must work as a **real deployable product** — not just a demo —
suitable for small and medium scale dairy farms across South India.

---

## Application Architecture

```
Frontend (HTML + JavaScript)
        ↓
Backend API (Python — Flask)
        ↓
Machine Learning Models (Scikit-learn)
        ↓
Database (SQLite — stored inside app, no server needed)
```

- Frontend sends farmer inputs to the Flask API
- Flask API feeds inputs into the trained ML model
- ML model returns prediction
- Frontend displays result on dashboard

---

## Module 1 — Cow Management Module

### Purpose
Store and manage complete information about every cow on the farm.

### Data Fields Per Cow

| Field | Description | Example |
|---|---|---|
| cow_id | Unique identifier | COW-101 |
| name | Cow name (optional) | Lakshmi |
| breed | Breed type | Jersey Crossbred |
| age | Age in years | 5 |
| parity | Current lactation number | 3 |
| lactation_stage | Days in Milk (DIM) | 72 |
| calving_date | Date of last calving | 2024-12-28 |
| status | Active / Dry / Pregnant / Sold | Active |
| weight_kg | Body weight in kg | 380 |

### Breed Options (South India Specific)
- Jersey Crossbred
- Holstein Friesian (HF) Crossbred
- Gir (Indigenous)
- Sahiwal (Indigenous)
- HF × Gir Crossbred
- Non-Descript / Mixed

### Features
- Add, edit, delete cow records
- Auto-calculate Days in Milk (DIM) from calving date
- Auto-calculate lactation stage from DIM
- Show active vs dry cow count on dashboard
- Multi-language labels across all 6 languages

---

## Module 2 — Daily Milk Entry Module

### Purpose
Record actual morning and evening milk production for every cow every day.
This recorded data becomes the **training and input data** for the ML model.

### Data Fields Per Entry

| Field | Description | Example |
|---|---|---|
| entry_id | Auto-generated ID | 1 |
| cow_id | Linked to cow record | COW-101 |
| date | Date of entry | 2025-03-09 |
| morning_milk_litres | Morning milking quantity | 10.5 |
| evening_milk_litres | Evening milking quantity | 9.0 |
| total_milk_litres | Auto-calculated total | 19.5 |
| feed_cost_rs | Feed cost for that day (₹) | 280 |
| medicine_cost_rs | Medicine cost for that day (₹) | 0 |
| labour_cost_rs | Labour cost for that day (₹) | 120 |
| total_expense_rs | Auto-calculated total expense | 400 |
| notes | Optional field | Cow was restless |

### Features
- Morning + evening input → auto-total
- Feed, medicine, labour costs entered daily
- Auto-link to cow record via cow_id
- 7-day history table per cow
- Alert if today's entry is missing for active cows

---

## Module 3 — Milk Yield Prediction Module (Machine Learning)

### Purpose
Use a trained ML model to predict the **next day's milk yield** for each cow
based on her individual history and farm conditions.

---

### Input Features for ML Model (Feature Set)

| Feature | Description | Type |
|---|---|---|
| breed_encoded | Breed as numeric code | Integer |
| age | Cow age in years | Float |
| parity | Lactation number | Integer |
| lactation_stage_dim | Days in Milk today | Integer |
| prev_milk_day1 | Yesterday's total milk (litres) | Float |
| prev_milk_day2 | Day before yesterday's milk | Float |
| prev_milk_day3 | 3 days ago milk | Float |
| feed_cost_rs | Today's feed cost (₹) | Float |
| season_code | Season encoded (0=Summer, 1=Monsoon, 2=Winter) | Integer |
| month | Current month (1–12) | Integer |

### Target Variable (What ML Predicts)
```
milk_yield → Next day's predicted milk yield in litres
```

---

### Dataset Design for Training

Build a training dataset CSV with the following columns:

```
cow_id, breed_encoded, age, parity, lactation_stage_dim,
prev_milk_day1, prev_milk_day2, prev_milk_day3,
feed_cost_rs, season_code, month, milk_yield
```

#### Breed Encoding (Numeric Mapping)
| Breed | Encoded Value |
|---|---|
| Jersey Crossbred | 1 |
| HF Crossbred | 2 |
| Gir | 3 |
| Sahiwal | 4 |
| HF × Gir Cross | 5 |
| Non-Descript | 6 |

#### Season Encoding
| Season | Encoded Value | Months |
|---|---|---|
| Summer (Heat Stress) | 0 | March, April, May |
| Monsoon | 1 | June, July, August, September, October, November |
| Winter / Cool Dry | 2 | December, January, February |

#### Minimum Dataset Size Required
- Minimum **500 rows** for training (recommended: 2,000+ rows)
- Each row = one cow's one day of data
- Data must cover all breeds, all seasons, all parity levels

#### Sample Row
```
COW-101, 1, 5, 3, 72, 19.5, 18.8, 20.1, 280, 2, 12, 20.3
```
*Jersey crossbred, age 5, 3rd lactation, DIM 72, previous 3 days milk,
feed cost ₹280, winter season, December, predicted yield = 20.3 litres*

---

### ML Pipeline — Step by Step

```
Step 1 → Load dataset (CSV file)
          ↓
Step 2 → Data Cleaning
         - Remove rows with missing values
         - Remove outliers (yield < 1 litre or > 40 litres)
         - Check for duplicate entries
          ↓
Step 3 → Feature Engineering
         - Encode breed as integer
         - Encode season as integer
         - Calculate rolling average of prev_milk_day1/2/3
          ↓
Step 4 → Feature Selection
         - Use correlation analysis to confirm all features matter
         - Drop features with correlation < 0.05 with target
          ↓
Step 5 → Train-Test Split
         - 80% training data / 20% testing data
         - Use random_state = 42 for reproducibility
          ↓
Step 6 → Train Model
         - Try 3 algorithms (compare performance):
           → Linear Regression (baseline)
           → Random Forest Regressor
           → XGBoost Regressor (recommended for best accuracy)
          ↓
Step 7 → Evaluate Model
         - Mean Absolute Error (MAE) — target: below 1.5 litres
         - Root Mean Square Error (RMSE)
         - R² Score — target: above 0.85
          ↓
Step 8 → Save Best Model
         - Save as milk_yield_model.pkl using joblib
          ↓
Step 9 → Deploy via Flask API
         - Load model on Flask startup
         - Accept POST request with feature inputs
         - Return predicted milk yield as JSON response
```

---

### Algorithm Comparison (Use All Three — Pick Best)

| Algorithm | Pros | Expected R² Score |
|---|---|---|
| Linear Regression | Simple, fast, easy to explain | 0.70 – 0.80 |
| Random Forest | Handles non-linear patterns well | 0.82 – 0.90 |
| XGBoost | Best accuracy, handles missing data | 0.88 – 0.95 |

**Recommendation:** Use **Random Forest** for the semester project —
good accuracy, easy to explain to evaluators, no complex tuning needed.

---

## Module 4 — Profit Prediction Module (Machine Learning)

### Purpose
Use a second trained ML model to predict the **expected daily profit**
from milk sales after deducting all farm expenses.

### Profit Formula (Ground Truth for Training)
```
profit = (milk_yield × milk_price_per_litre) − total_daily_expense

total_daily_expense = feed_cost + medicine_cost + labour_cost
```

### Input Features for Profit ML Model

| Feature | Description |
|---|---|
| predicted_milk_yield | Output from Milk Yield Model (litres) |
| milk_price_rs | Current milk selling price per litre (₹) |
| feed_cost_rs | Today's feed cost (₹) |
| medicine_cost_rs | Medicine cost (₹) |
| labour_cost_rs | Labour cost (₹) |
| breed_encoded | Breed as integer |
| lactation_stage_dim | Days in Milk |
| season_code | Season as integer |

### Target Variable
```
profit → Expected profit for the day in ₹
```

### Dataset Design for Profit Model

```
cow_id, predicted_milk_yield, milk_price_rs, feed_cost_rs,
medicine_cost_rs, labour_cost_rs, breed_encoded,
lactation_stage_dim, season_code, profit
```

#### Sample Row
```
COW-101, 20.3, 40, 280, 0, 120, 1, 72, 2, 412
```
*Predicted yield 20.3 L × ₹40 = ₹812 income − ₹400 expenses = ₹412 profit*

### Profit ML Pipeline
- Same pipeline as Milk Yield Model
- Save as `profit_model.pkl`
- Recommended algorithm: **Random Forest Regressor**

---

## Flask API — Endpoints

The Python Flask backend must expose the following API endpoints:

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/predict/milk` | POST | Accept features → return predicted milk yield |
| `/api/predict/profit` | POST | Accept features → return predicted profit |
| `/api/cows` | GET | Return all cow records |
| `/api/cows/add` | POST | Add new cow |
| `/api/milk/entry` | POST | Save daily milk entry |
| `/api/milk/history/<cow_id>` | GET | Return 30-day milk history for a cow |
| `/api/dashboard` | GET | Return farm summary totals |

### Sample API Request — Milk Prediction
```
POST /api/predict/milk
{
  "breed_encoded": 1,
  "age": 5,
  "parity": 3,
  "lactation_stage_dim": 72,
  "prev_milk_day1": 19.5,
  "prev_milk_day2": 18.8,
  "prev_milk_day3": 20.1,
  "feed_cost_rs": 280,
  "season_code": 2,
  "month": 12
}
```

### Sample API Response
```
{
  "cow_id": "COW-101",
  "predicted_milk_yield_litres": 20.3,
  "confidence": "High",
  "lactation_phase": "Peak Lactation"
}
```

---

## Dashboard Module

### Farm Summary Cards (Top of Dashboard)
| Card | Value Shown |
|---|---|
| Total Active Cows | Count of cows with status = Active |
| Total Milk Today | Sum of all cows' total milk entries for today (litres) |
| Total Predicted Yield Tomorrow | Sum of all ML predictions for tomorrow (litres) |
| Total Income Today | Total milk today × milk price per litre (₹) |
| Total Expenses Today | Sum of all cows' expenses today (₹) |
| Net Profit Today | Income − Expenses (₹) |
| Predicted Profit Tomorrow | ML predicted profit for all cows (₹) |

### Per Cow Prediction Card
For each active cow, show:
- Cow name + ID + breed
- Today's actual yield (litres)
- Tomorrow's predicted yield (litres) — from ML model
- Today's profit (₹)
- Tomorrow's predicted profit (₹) — from ML model
- Lactation phase (Early / Peak / Mid / Late / Dry)
- Alert badge if yield is dropping

### Graphs & Charts
- **7-day actual vs predicted yield** line chart per cow
- **Monthly milk trend** bar chart for entire farm
- **Expense breakdown** pie chart (feed vs medicine vs labour)
- **Profit trend** line chart — last 30 days

---

## Prediction Output Example

```
┌─────────────────────────────────────┐
│  COW-101 — Lakshmi (Jersey Cross)  │
├─────────────────────────────────────┤
│  Today's Actual Yield:   19.5 L    │
│  Tomorrow's Prediction:  20.3 L ↑  │
│  Lactation Phase:        Peak      │
│  Today's Profit:         ₹380      │
│  Tomorrow's Profit:      ₹412 ↑    │
└─────────────────────────────────────┘
```

---

## Farm-Level Summary Output Example

```
┌──────────────────────────────────────────┐
│           FARM DASHBOARD                 │
├──────────────────────────────────────────┤
│  Total Cows:              12             │
│  Active Milking Cows:     10             │
│  Total Milk Today:        210 L          │
│  Predicted Tomorrow:      218 L          │
│  Total Income Today:      ₹8,400         │
│  Total Expenses Today:    ₹5,200         │
│  Net Profit Today:        ₹3,200         │
│  Predicted Profit:        ₹3,520         │
└──────────────────────────────────────────┘
```

---

## Dataset Sources for Training

Use the following real-world data sources to build your training dataset:

| Source | Data Available | URL |
|---|---|---|
| NDDB (National Dairy Development Board) | Breed-wise yield data, India | nddb.coop |
| TANUVAS Research | Tamil Nadu Jersey crossbred yield data | tanuvas.ac.in |
| ICAR — NDRI | Lactation curve research data | icar.org.in |
| Kaggle | Dairy cow milk yield datasets (global) | kaggle.com |
| Synthetic generation | Use Wood's formula to generate 2,000 rows | Manual |

**Recommended approach for semester project:**
Generate a **synthetic but realistic dataset** of 2,000 rows using:
- Wood's lactation curve formula for yield values
- South India breed averages as baselines
- Add ±10% random variation to simulate real farm noise
- This is an accepted and standard practice in academic ML projects

---

## Model Evaluation — What to Show Evaluators

Train all 3 algorithms and present a comparison table:

| Metric | Linear Regression | Random Forest | XGBoost |
|---|---|---|---|
| MAE (litres) | ~2.1 | ~1.2 | ~0.9 |
| RMSE (litres) | ~2.8 | ~1.6 | ~1.2 |
| R² Score | ~0.74 | ~0.88 | ~0.93 |
| Training Time | Fast | Medium | Slow |
| Best For | Explanation | Balance | Accuracy |

**Justify your final model choice** in the project report based on this table.

---

## Multi-Language Support

All UI text must switch between 6 languages:
**English | Tamil | Hindi | Telugu | Kannada | Malayalam**

Key prediction output terms to translate:

| Term | Tamil | Hindi | Telugu | Kannada | Malayalam |
|---|---|---|---|---|---|
| Predicted Yield | கணிக்கப்பட்ட மகசூல் | अनुमानित उपज | అంచనా దిగుబడి | ಅಂದಾಜು ಇಳುವರಿ | പ്രവചിച്ച വിളവ് |
| Expected Profit | எதிர்பார்க்கப்படும் லாபம் | अपेक्षित लाभ | అంచనా లాభం | ನಿರೀಕ್ಷಿತ ಲಾಭ | പ്രതീക്ഷിത ലാഭം |
| Total Income | மொத்த வருமானம் | कुल आय | మొత్తం ఆదాయం | ಒಟ್ಟು ಆದಾಯ | ആകെ വരുമാനം |
| Net Profit | நிகர லாபம் | शुद्ध लाभ | నికర లాభం | ನಿವ್ವಳ ಲಾಭ | അറ്റ ലാഭം |
| Feed Cost | தீவன செலவு | चारा लागत | మేత ఖర్చు | ಮೇವಿನ ವೆಚ್ಚ | തീറ്റ ചെലവ് |
| Milk Price | பால் விலை | दूध का भाव | పాల ధర | ಹಾಲಿನ ಬೆಲೆ | പാൽ വില |

---

## Project Folder Structure

```
dairy-prediction-system/
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── cows.html
│   ├── milk-entry.html
│   ├── prediction.html
│   ├── js/
│   │   ├── app.js
│   │   ├── api.js           ← Calls Flask API endpoints
│   │   ├── charts.js        ← Chart rendering
│   │   └── translations.js  ← All 6 language strings
│   └── css/
│       └── style.css
│
├── backend/
│   ├── app.py               ← Flask app and API routes
│   ├── predict.py           ← Load model and run predictions
│   ├── database.py          ← SQLite database operations
│   └── models/
│       ├── milk_yield_model.pkl
│       └── profit_model.pkl
│
├── ml/
│   ├── dataset.csv          ← Training dataset
│   ├── train_milk_model.py  ← Train milk yield model
│   ├── train_profit_model.py← Train profit model
│   └── evaluate_models.py   ← Compare all 3 algorithms
│
└── README.md
```

---

## Why This Project Is Strong for Evaluation

| Criterion | What This Project Demonstrates |
|---|---|
| Machine Learning | Two trained regression models (yield + profit) |
| Real-world problem | South India dairy farming — affects millions |
| Data analytics | Feature engineering, model evaluation, accuracy metrics |
| Web application | Full-stack HTML + Flask — complete deployable product |
| Decision support | Actionable predictions farmers can use daily |
| Multi-language | 6 Indian language support — inclusive design |
| Research backing | TANUVAS, ICAR, NDDB, Wood's lactation curve |
| Competitive advantage | Alert system, seasonal adjustments, per-cow cards |
