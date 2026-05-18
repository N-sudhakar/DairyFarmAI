# Cattle Vaccination Timeline Module — Prompt
### Based on 30+ Years of South India Cattle Disease & Vaccination Data
### Sources: ICAR, NDDB, Tamil Nadu Spatio-Temporal Disease Study (2002–2014), NADCP, Dairy Knowledge Portal

---

## Why This Module Matters (Field Reality)

In South India — especially Tamil Nadu, Andhra Pradesh, Karnataka, and Kerala — cattle deaths from
**preventable diseases** are the single largest cause of farm loss for small and medium farmers.
From 30 years of outbreak data:

- **HS (Haemorrhagic Septicaemia)** kills up to **89.47% of infected cattle in Tamil Nadu** — yet it is 100% preventable with a ₹15 vaccine given before monsoon
- **FMD outbreaks** in Tamil Nadu caused **2,463 cattle and buffalo infections between 2002–2008 alone**, with 394 deaths
- **BQ (Black Quarter)** spikes sharply at **onset of both Southwest (June) and Northeast (October–November) monsoons**
- **Anthrax** peaks during **two rainfall periods** — June and November — and is zoonotic (spreads to humans)
- Most South Indian farmers **miss vaccinations because there is no reminder system** — this module solves that

---

## Module Overview

Add a **Vaccination Timeline** module to the existing Cattle Management System.
Each animal's vaccination history must be tracked individually.
The system must calculate upcoming due dates automatically and alert the farmer before deadlines.

---

## Diseases to Track — South India Specific (All 8)

| # | Disease | Local Risk Level | Critical Season in South India |
|---|---------|-----------------|-------------------------------|
| 1 | FMD (Foot & Mouth Disease) | 🔴 Very High | Southwest Monsoon — June/July |
| 2 | HS (Haemorrhagic Septicaemia) | 🔴 Very High | Pre-Northeast Monsoon — September/October |
| 3 | BQ (Black Quarter) | 🔴 High | Both monsoon onsets — May & September |
| 4 | Anthrax | 🟠 High | Both rainfall peaks — June & November |
| 5 | Brucellosis | 🟠 High (Female calves only) | One-time, age 4–8 months |
| 6 | Theileriosis (Tick Fever) | 🟡 Medium-High | Post-monsoon — November to January |
| 7 | Lumpy Skin Disease (LSD) | 🟠 High (Recent outbreak) | Year-round, peaks in monsoon |
| 8 | Mastitis Prevention Dry Cow Therapy | 🟡 Medium | At each dry-off period |

---

## Vaccination Schedule — Exact Rules Per Disease

### 1. FMD — Foot and Mouth Disease
- **First dose:** 4 months of age
- **Booster:** 1 month after first dose
- **Repeat:** Every 6 months (twice yearly) — mandatory per NADCP government programme
- **South India timing:** Give doses in **May** (before SW monsoon) and **November** (before NE monsoon)
- **Alert:** 15 days before due date
- **Risk note:** FMD causes milk yield to drop by 25–40% even in non-fatal cases — high economic impact

### 2. HS — Haemorrhagic Septicaemia
- **First dose:** 6 months of age
- **Booster:** None required
- **Repeat:** Annually — **must be given before monsoon onset**
- **South India timing:** Give in **May–June every year**, before Southwest monsoon
- **Alert:** 30 days before due (critical — missing this is fatal)
- **Risk note:** Mortality rate up to 89.47% in Tamil Nadu; animal dies within 1–2 days of symptoms — no time to react without prior vaccination

### 3. BQ — Black Quarter
- **First dose:** 6 months of age
- **Repeat:** Annually before monsoon
- **South India timing:** Give in **May every year**
- **Alert:** 21 days before due
- **Risk note:** BQ spores persist in soil for decades; grazing cattle in waterlogged post-monsoon fields are at highest risk

### 4. Anthrax
- **First dose:** 6 months of age
- **Repeat:** Annually before monsoon
- **South India timing:** Give in **May every year**
- **Alert:** 21 days before due
- **Risk note:** Zoonotic — can spread to farm workers and family. Anthrax outbreaks are highest in Thiruvannamalai district (TN) historically

### 5. Brucellosis
- **Who:** Female calves only (heifers)
- **When:** One-time vaccination between **4–8 months of age**
- **Repeat:** Never — once in lifetime only
- **Alert:** System should flag female calves approaching 4 months of age
- **Risk note:** Causes abortion in late pregnancy, infertility, and interrupted lactation — devastating for dairy farms

### 6. Theileriosis (Tick Fever)
- **First dose:** 2 months of age
- **Repeat:** Every 3 years (or annually in high-tick-burden areas)
- **South India timing:** Risk is highest **November–January** (post-NE monsoon, tick population surge)
- **Alert:** 30 days before due

### 7. Lumpy Skin Disease (LSD)
- **First dose:** Any age, first available opportunity
- **Repeat:** Annually
- **South India timing:** Year-round risk; peak during monsoon months
- **Alert:** 15 days before annual due date
- **Risk note:** LSD is a newer threat — major outbreaks across Tamil Nadu and Karnataka since 2019; ICAR now recommends inclusion in routine schedule

### 8. Combined HS + BQ Vaccine (Raksha TriovacTM)
- Many South Indian government vets administer a **combined FMD + HS + BQ trivalent vaccine** in a single shot
- System should support recording **combo vaccines** that cover multiple diseases in one entry
- If a combo vaccine is recorded, mark all covered diseases as vaccinated on that date

---

## Vaccination Record — Fields Per Entry

Each vaccination record for each animal must capture:

- **Animal Tag ID** (linked to cattle inventory)
- **Disease / Vaccine Name**
- **Date Administered**
- **Vaccine Brand / Batch Number** (important for govt. NADCP compliance)
- **Dose (ml)**
- **Route** (Subcutaneous / Intramuscular)
- **Administered By** (Farmer / Govt. Vet / Private Vet)
- **Next Due Date** (auto-calculated by system based on schedule rules above)
- **Notes / Observations**

---

## Auto-Calculation Rules

The system must automatically calculate **Next Due Date** when a vaccination is saved:

| Vaccine | Auto-calculate Next Due |
|---------|------------------------|
| FMD | +6 months from last dose |
| HS | +12 months from last dose |
| BQ | +12 months from last dose |
| Anthrax | +12 months from last dose |
| Brucellosis | Mark as "Lifetime Complete" — no next due |
| Theileriosis | +3 years from last dose |
| LSD | +12 months from last dose |

---

## Alert & Reminder System (Critical Feature — Competitor Advantage)

This is what will make this product **beat all competitors** — most farm apps only show records, they do not alert farmers in advance.

### Alert Levels

| Alert Type | Trigger | Display |
|---|---|---|
| 🟢 Up to Date | Vaccination current | Green badge on animal card |
| 🟡 Due Soon | 30 days before due date | Yellow warning — "Vaccination due in X days" |
| 🔴 Overdue | Past due date | Red urgent alert — "OVERDUE — vaccinate immediately" |
| ⚫ Never Vaccinated | No record exists for a required vaccine | Black flag — "No record found — first dose needed" |

### Where Alerts Must Appear
- **Dashboard** — show total count of animals with overdue or due-soon vaccinations as a summary card
- **Cattle Inventory list** — show colour-coded badge next to each animal's name
- **Individual Animal Profile** — full vaccination history table with next due dates highlighted
- **Dedicated Vaccination Timeline page** — full farm view, all animals, all vaccines, sorted by urgency

---

## Vaccination Timeline Page — Layout

This page gives the farmer a **complete upcoming vaccination calendar** for the entire farm:

### View 1 — Urgent List (Default)
- Sorted by urgency: Overdue first → Due this week → Due this month → Due next month → Up to date
- Each row: Animal Tag | Animal Name | Vaccine | Last Given | Next Due | Days Remaining | Status badge

### View 2 — Monthly Calendar
- A calendar view showing which animals need which vaccines on which dates
- Helps farmer plan vet visits in bulk (cost-saving — one vet visit for 10 animals instead of 10 visits)

### View 3 — By Disease
- Filter by disease type (e.g., "Show all animals due for FMD")
- Useful during government NADCP vaccination drives

---

## South India Seasonal Vaccination Calendar (Built-in Reference)

Display this as a **reference guide** inside the app so farmers know the "why" behind reminders:

| Month | Action Required |
|-------|----------------|
| **April–May** | Give HS, BQ, Anthrax vaccines — before Southwest monsoon |
| **May–June** | Give FMD dose 1 of the year |
| **September** | Give FMD dose 2 of the year — before Northeast monsoon |
| **October** | Repeat HS vaccine check for animals that missed May dose |
| **November–December** | Monitor for Theileriosis (tick fever) — post-NE monsoon risk |
| **Year-round** | Check LSD status; vaccinate new calves per age schedule |
| **At 4 months (female calves)** | Brucellosis — one-time only |

---

## Individual Animal Vaccination Card

Each animal in inventory must have a **Vaccination Card** view showing:

- A table of all 8 diseases
- For each disease: Last vaccinated date | Next due date | Status (Up to date / Due soon / Overdue / Not applicable)
- A visual timeline strip showing past vaccinations as dots on a line
- Print/share button so farmer can show the card to a vet or buyer (builds buyer trust and animal value)

---

## Language Support

All vaccination module text — disease names, alert messages, status labels, button labels, form field labels, seasonal guidance text — must be available in all 6 languages:

**English | Tamil | Hindi | Telugu | Kannada | Malayalam**

### Key Terms Translation Reference

| Term | Tamil | Hindi | Telugu | Kannada | Malayalam |
|------|-------|-------|--------|---------|-----------|
| Vaccination | தடுப்பூசி | टीकाकरण | టీకా | ಲಸಿಕೆ | വാക്സിനേഷൻ |
| Due Date | நிலுவை தேதி | नियत तारीख | గడువు తేదీ | ಗಡುವು ದಿನಾಂಕ | കാലതാമസ തീയതി |
| Overdue | தாமதமானது | अतिदेय | గడువు మించింది | ವಿಳಂಬವಾಗಿದೆ | കാലതാമസം |
| Next Dose | அடுத்த டோஸ் | अगली खुराक | తదుపరి డోస్ | ಮುಂದಿನ ಡೋಸ್ | അടുത്ത ഡോസ് |
| Completed | முடிந்தது | पूर्ण | పూర్తయింది | ಪೂರ್ಣಗೊಂಡಿದೆ | പൂർത്തിയായി |
| Vet Visit | மருத்துவர் வருகை | पशु चिकित्सक | పశువైద్య సందర్శన | ಪಶು ವೈದ್ಯ ಭೇಟಿ | വെറ്ററിനറി സന്ദർശനം |
| FMD | கాலுவாய் நோய் | खुरपका-मुंहपका | గాలికుంటు వ్యాధి | ಕಾಲು ಬಾಯಿ ರೋಗ | കുളമ്പ് രോഗം |
| HS | ரத்த நாளம் | रक्तस्रावी पूतिता | రక్తస్రావ వ్యాధి | ರಕ್ತಸ್ರಾವಿ ರೋಗ | ഹെമററേജിക് സെപ്റ്റിസീമിയ |
| BQ | கறுப்பு காய்ச்சல் | ब्लैक क्वार्टर | నల్ల వ్యాధి | ಕಪ್ಪು ತ್ರೈಮಾಸಿಕ | ബ്ലാക്ക് ക്വാർട്ടർ |
| Anthrax | ஆந்த்ராக்ஸ் | एंथ्रेक्स | యాంత్రాక్స్ | ಆಂಥ್ರಾಕ್ಸ್ | ആന്ത്രാക്സ് |
| Brucellosis | புருசெல்லோசிஸ் | ब्रुसेलोसिस | బ్రూసెల్లోసిస్ | ಬ್ರೂಸೆಲ್ಲೋಸಿಸ್ | ബ്രൂസെല്ലോസിസ് |

---

## Empty State & First-Use Guidance

- When no vaccination records exist for an animal: show **"No vaccinations recorded yet. Tap to add first vaccination."**
- When a new animal is added to the farm: system should **automatically generate a suggested vaccination schedule** based on the animal's age — no manual setup needed
- New calf added at 1 month old? System auto-shows: "FMD due at 4 months | BQ due at 6 months | HS due at 6 months" etc.

---

## Competitive Advantage Summary

| Feature | Typical Farm Apps | This System |
|---------|-------------------|-------------|
| Vaccination records | ✅ Basic entry | ✅ Full history |
| Auto due date calculation | ❌ Manual | ✅ Automatic |
| Overdue alerts | ❌ None | ✅ 3-level alert system |
| South India seasonal calendar | ❌ None | ✅ Built-in |
| Per-animal vaccination card | ❌ None | ✅ Printable card |
| Disease-specific risk info | ❌ None | ✅ Tamil Nadu data-backed |
| 6-language support | ❌ English only | ✅ All 6 languages |
| Auto schedule for new calves | ❌ None | ✅ Age-based auto schedule |
| Combo vaccine support | ❌ None | ✅ Trivalent vaccine entry |
