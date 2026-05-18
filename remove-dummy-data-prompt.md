# Remove Dummy Data — Real-Time Cattle Farm Management System

## Context

This system is built for **real small and medium scale cattle farmers**.  
Every screen must start **completely empty and clean** — no pre-filled sample records, no fake cattle names, no placeholder numbers.  
A farmer opening this app for the first time should see a **fresh, professional system** ready for their own data.

---

## What Must Be Removed

### Cattle Inventory
- Remove all sample cattle records (e.g., "Cow 001", "Bessie", "Bull A")
- Remove any pre-filled Tag IDs, breed names, weights, or ages
- Remove hardcoded status values assigned to fake animals

### Expense Records
- Remove all sample expense entries (e.g., "Feed - ₹5000", "Medicine - ₹1200")
- Remove any pre-filled dates, amounts, or descriptions
- Remove dummy category totals

### Sales Records
- Remove all sample sale entries (e.g., "Buyer: Ramu", "Sale Price: ₹25000")
- Remove any pre-filled buyer names, sale dates, or cattle references

### Dashboard
- All summary cards must show **zero (0)** or **₹0** on first load
- No fake chart data, no placeholder graph bars or pie slices
- No hardcoded "recent activity" entries

### Profit Analysis
- All profit, income, cost, and margin values must start at **₹0 / 0%**
- Monthly breakdown table must be empty until real transactions are entered
- No sample bar charts or trend lines with fake numbers

---

## Empty State Design (Very Important)

When a section has no data yet, show a **helpful, farmer-friendly empty state message** instead of a blank screen. Examples:

| Section | Empty State Message |
|---|---|
| Cattle Inventory | "No cattle added yet. Start by adding your first animal." |
| Expenses | "No expenses recorded. Add your first expense entry." |
| Sales | "No sales recorded yet. Record your first sale here." |
| Dashboard | "Welcome! Add your cattle and expenses to see your farm summary." |
| Profit Analysis | "No data available yet. Add expenses and sales to view profit analysis." |

These messages must also be translated into all 6 languages (English, Tamil, Hindi, Telugu, Kannada, Malayalam).

---

## Default Values on Forms

- All form input fields must be **blank by default** when opened
- Dropdowns should show a **neutral placeholder** (e.g., "Select Type", "Select Category")
- Date fields should default to **today's date** (this is practical for real farmers)
- No pre-selected radio buttons or checkboxes unless it is a logical default (e.g., Status = Healthy when adding a new animal — this is a reasonable farm default)

---

## Dashboard Behavior on First Load

- Total Cattle → **0**
- Total Expenses → **₹0**
- Total Revenue → **₹0**
- Net Profit → **₹0**
- Cattle breakdown chart → hidden or shows "No data" until at least one animal is added
- Recent activity → shows "No recent activity" message

---

## Real Farmer Guidance (From 50 Years of Field Experience)

Small and medium scale farmers are not tech-savvy users — they need:

- **No confusion from fake data** that looks real and misleads them
- **Clear starting point** — the system must feel like a fresh notebook, not a demo
- **Immediate trust** — if a farmer sees "Cow 001 - Sold for ₹18,000" on first open, they will distrust the system
- **Fast first entry** — the first "Add Cattle" form should be the most prominent call-to-action on an empty inventory screen
- A **"Get Started" prompt or button** on the dashboard that guides new users to add their first cattle record

---

## Summary Checklist

- [ ] All cattle records removed
- [ ] All expense records removed
- [ ] All sales records removed
- [ ] All dashboard values reset to 0 / ₹0
- [ ] All charts hidden or show empty state until real data is entered
- [ ] All form fields blank by default
- [ ] Empty state messages added to every section
- [ ] Empty state messages translated in all 6 languages
- [ ] Date fields default to today's date
- [ ] Status field defaults to "Healthy" for new cattle (practical farm default)
- [ ] No hardcoded strings, names, amounts, or IDs anywhere in the UI
