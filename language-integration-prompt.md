# Language Integration Prompt — Cattle Management System

## Objective

Add **multi-language support** to the existing Cattle Management System.  
The system must support **6 languages**, switchable at any time without refreshing the page.

---

## Languages to Support

| # | Language   | Native Script |
|---|------------|---------------|
| 1 | English    | English       |
| 2 | Tamil      | தமிழ்          |
| 3 | Hindi      | हिन्दी          |
| 4 | Telugu     | తెలుగు         |
| 5 | Kannada    | ಕನ್ನಡ          |
| 6 | Malayalam  | മലയാളം        |

---

## Language Switcher UI

- Place a **language selector** (dropdown or button group) in the top navigation/header
- Display each language in its **own native script** (e.g., தமிழ், हिन्दी)
- The selected language should be highlighted/active
- Switching language must **instantly update all visible text** without page reload

---

## What Must Be Translated

Every piece of visible text in the UI must switch based on the selected language, including:

- **Navigation menu** items
- **Page headings and subheadings**
- **Button labels** (Add, Save, Edit, Delete, Cancel, Search, etc.)
- **Form field labels and placeholders**
- **Table column headers**
- **Status values** (Healthy, Sick, Pregnant, Sold, etc.)
- **Category names** (Feed, Medicine, Labor, Equipment, etc.)
- **Dashboard card titles** (Total Cattle, Total Expenses, Net Profit, etc.)
- **Empty state messages** (e.g., "No records found")
- **Validation/error messages**
- **Confirmation messages**

---

## Implementation Approach

- Create a **central translations object** containing all text strings for all 6 languages
- Use a **language state variable** to track the currently selected language
- All UI components must **read text from the translations object** using the active language key
- Do **not** hardcode any display text directly in the UI — all strings must come from the translations object
- Numbers and currency (₹) do **not** need to be translated — only labels and messages

---

## Translation Reference

Below are the key strings that must be translated for all 6 languages:

### Navigation
| Key | English | Tamil | Hindi | Telugu | Kannada | Malayalam |
|-----|---------|-------|-------|--------|---------|-----------|
| Dashboard | Dashboard | டாஷ்போர்டு | डैशबोर्ड | డాష్‌బోర్డ్ | ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ | ഡാഷ്‌ബോർഡ് |
| Cattle | Cattle | கால்நடை | पशु | పశువులు | ದನಗಳು | കന്നുകാലികൾ |
| Expenses | Expenses | செலவுகள் | खर्च | ఖర్చులు | ಖರ್ಚುಗಳು | ചെലവുകൾ |
| Sales | Sales | விற்பனை | बिक्री | అమ్మకాలు | ಮಾರಾಟ | വിൽപ്പന |
| Profit Analysis | Profit Analysis | லாப பகுப்பாய்வு | लाभ विश्लेषण | లాభ విశ్లేషణ | ಲಾಭ ವಿಶ್ಲೇಷಣೆ | ലാഭ വിശകലനം |

### Common Buttons
| Key | English | Tamil | Hindi | Telugu | Kannada | Malayalam |
|-----|---------|-------|-------|--------|---------|-----------|
| Add | Add | சேர்க்க | जोड़ें | జోడించు | ಸೇರಿಸು | ചേർക്കുക |
| Save | Save | சேமி | सहेजें | సేవ్ చేయి | ಉಳಿಸು | സേവ് ചെയ്യുക |
| Edit | Edit | திருத்து | संपादित करें | సవరించు | ಸಂಪಾದಿಸು | എഡിറ്റ് ചെയ്യുക |
| Delete | Delete | நீக்கு | हटाएं | తొలగించు | ಅಳಿಸು | ഇല്ലാതാക്കുക |
| Cancel | Cancel | ரத்து | रद्द करें | రద్దు చేయి | ರದ್ದುಮಾಡು | റദ്ദാക്കുക |
| Search | Search | தேடு | खोजें | వెతుకు | ಹುಡುಕು | തിരയുക |

### Cattle Status
| Key | English | Tamil | Hindi | Telugu | Kannada | Malayalam |
|-----|---------|-------|-------|--------|---------|-----------|
| Healthy | Healthy | ஆரோக்கியம் | स्वस्थ | ఆరోగ్యం | ಆರೋಗ್ಯಕರ | ആരോഗ്യമുള്ളത് |
| Sick | Sick | நோய்வாய்ப்பட்டது | बीमार | అనారోగ్యం | ಅನಾರೋಗ್ಯ | രോഗി |
| Pregnant | Pregnant | கர்ப்பமாக | गर्भवती | గర్భవతి | ಗರ್ಭಿಣಿ | ഗർഭിണി |
| Sold | Sold | விற்கப்பட்டது | बेचा गया | అమ్మబడింది | ಮಾರಲಾಗಿದೆ | വിറ്റു |

### Expense Categories
| Key | English | Tamil | Hindi | Telugu | Kannada | Malayalam |
|-----|---------|-------|-------|--------|---------|-----------|
| Feed | Feed | தீவனம் | चारा | మేత | ಮೇವು | തീറ്റ |
| Medicine | Medicine | மருந்து | दवाई | మందు | ಔಷಧ | മരുന്ന് |
| Labor | Labor | தொழிலாளர் | मजदूरी | కూలి | ಕಾರ್ಮಿಕ | തൊഴിൽ |
| Equipment | Equipment | உபகரணம் | उपकरण | పరికరాలు | ಉಪಕರಣ | ഉപകരണം |
| Other | Other | மற்றவை | अन्य | ఇతరాలు | ಇತರೆ | മറ്റുള്ളവ |

### Dashboard Cards
| Key | English | Tamil | Hindi | Telugu | Kannada | Malayalam |
|-----|---------|-------|-------|--------|---------|-----------|
| Total Cattle | Total Cattle | மொத்த கால்நடை | कुल पशु | మొత్తం పశువులు | ಒಟ್ಟು ದನಗಳು | ആകെ കന്നുകാലികൾ |
| Total Expenses | Total Expenses | மொத்த செலவு | कुल खर्च | మొత్తం ఖర్చులు | ಒಟ್ಟು ಖರ್ಚು | ആകെ ചെലവ് |
| Total Revenue | Total Revenue | மொத்த வருவாய் | कुल राजस्व | మొత్తం ఆదాయం | ಒಟ್ಟು ಆದಾಯ | ആകെ വരുമാനം |
| Net Profit | Net Profit | நிகர லாபம் | शुद्ध लाभ | నికర లాభం | ನಿವ್ವಳ ಲಾಭ | അистий ലാഭം |

---

## Notes

- The **default language** on load should be **English**
- The selected language preference should persist during the session
- Font rendering for all Indian scripts must display correctly (use a web-safe or Google Font that supports Devanagari, Tamil, Telugu, Kannada, and Malayalam scripts)
- Recommended font: **Noto Sans** (covers all 6 language scripts)
