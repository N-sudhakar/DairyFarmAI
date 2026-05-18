// ============================================
// Vaccination Timeline — Mock Data & Logic
// Based on 30+ years South India cattle disease data
// Sources: ICAR, NDDB, Tamil Nadu Disease Study, NADCP
// ============================================

import { cows } from './mockData';

// ─── Disease Configuration ────────────────────────────────────
export const DISEASES = [
    {
        id: 'fmd',
        name: 'FMD (Foot & Mouth Disease)',
        shortName: 'FMD',
        riskLevel: 'very-high',
        riskEmoji: '🔴',
        firstDoseMonths: 4,
        repeatMonths: 6,
        alertDaysBefore: 15,
        season: 'Southwest Monsoon — June/July',
        riskNote: 'Milk yield drops 25–40% even in non-fatal cases. High economic impact.',
        vaccine: 'FMD Trivalent (O, A, Asia1)',
        route: 'Subcutaneous',
        dose: '3 ml',
        lifetimeOnly: false,
        femaleOnly: false,
        color: '#ef4444',
    },
    {
        id: 'hs',
        name: 'HS (Haemorrhagic Septicaemia)',
        shortName: 'HS',
        riskLevel: 'very-high',
        riskEmoji: '🔴',
        firstDoseMonths: 6,
        repeatMonths: 12,
        alertDaysBefore: 30,
        season: 'Pre-NE Monsoon — Sep/Oct',
        riskNote: 'Mortality up to 89.47% in Tamil Nadu. Animal dies within 1–2 days of symptoms.',
        vaccine: 'HS Oil Adjuvant',
        route: 'Intramuscular',
        dose: '2 ml',
        lifetimeOnly: false,
        femaleOnly: false,
        color: '#dc2626',
    },
    {
        id: 'bq',
        name: 'BQ (Black Quarter)',
        shortName: 'BQ',
        riskLevel: 'high',
        riskEmoji: '🔴',
        firstDoseMonths: 6,
        repeatMonths: 12,
        alertDaysBefore: 21,
        season: 'Both monsoon onsets — May & Sep',
        riskNote: 'BQ spores persist in soil for decades. Grazing cattle in waterlogged fields at highest risk.',
        vaccine: 'BQ Alum Precipitated',
        route: 'Subcutaneous',
        dose: '5 ml',
        lifetimeOnly: false,
        femaleOnly: false,
        color: '#f97316',
    },
    {
        id: 'anthrax',
        name: 'Anthrax',
        shortName: 'Anthrax',
        riskLevel: 'high',
        riskEmoji: '🟠',
        firstDoseMonths: 6,
        repeatMonths: 12,
        alertDaysBefore: 21,
        season: 'Both rainfall peaks — Jun & Nov',
        riskNote: 'Zoonotic — spreads to farm workers and family. Historically highest in Thiruvannamalai (TN).',
        vaccine: 'Anthrax Spore Vaccine',
        route: 'Subcutaneous',
        dose: '1 ml',
        lifetimeOnly: false,
        femaleOnly: false,
        color: '#ea580c',
    },
    {
        id: 'brucellosis',
        name: 'Brucellosis',
        shortName: 'Brucellosis',
        riskLevel: 'high',
        riskEmoji: '🟠',
        firstDoseMonths: 4,
        repeatMonths: null, // One-time only
        alertDaysBefore: 30,
        season: 'One-time at 4–8 months (females only)',
        riskNote: 'Causes abortion in late pregnancy, infertility, and interrupted lactation.',
        vaccine: 'Brucella abortus S19',
        route: 'Subcutaneous',
        dose: '2 ml',
        lifetimeOnly: true,
        femaleOnly: true,
        color: '#d97706',
    },
    {
        id: 'theileriosis',
        name: 'Theileriosis (Tick Fever)',
        shortName: 'Theileriosis',
        riskLevel: 'medium-high',
        riskEmoji: '🟡',
        firstDoseMonths: 2,
        repeatMonths: 36, // Every 3 years
        alertDaysBefore: 30,
        season: 'Post-NE monsoon — Nov to Jan',
        riskNote: 'Risk highest November–January when tick population surges.',
        vaccine: 'Raksha Theileria',
        route: 'Intramuscular',
        dose: '3 ml',
        lifetimeOnly: false,
        femaleOnly: false,
        color: '#eab308',
    },
    {
        id: 'lsd',
        name: 'Lumpy Skin Disease (LSD)',
        shortName: 'LSD',
        riskLevel: 'high',
        riskEmoji: '🟠',
        firstDoseMonths: 3,
        repeatMonths: 12,
        alertDaysBefore: 15,
        season: 'Year-round, peaks in monsoon',
        riskNote: 'Major outbreaks across Tamil Nadu and Karnataka since 2019. ICAR recommends routine inclusion.',
        vaccine: 'Goat Pox Vaccine (heterologous)',
        route: 'Subcutaneous',
        dose: '1 ml',
        lifetimeOnly: false,
        femaleOnly: false,
        color: '#f59e0b',
    },
];

// ─── Seasonal Calendar Reference ──────────────────────────────
export const SEASONAL_CALENDAR = [
    { month: 'April–May', action: 'Give HS, BQ, Anthrax vaccines — before Southwest monsoon', urgency: 'critical', emoji: '💉' },
    { month: 'May–June', action: 'Give FMD dose 1 of the year', urgency: 'high', emoji: '🦶' },
    { month: 'June–August', action: 'Monitor monsoon-related disease onset. No new vaccinations during illness.', urgency: 'watch', emoji: '🌧️' },
    { month: 'September', action: 'Give FMD dose 2 of the year — before NE monsoon', urgency: 'high', emoji: '🦶' },
    { month: 'October', action: 'HS vaccine check for animals that missed May dose', urgency: 'medium', emoji: '🔄' },
    { month: 'Nov–Dec', action: 'Monitor for Theileriosis (tick fever) — post-NE monsoon risk', urgency: 'watch', emoji: '🕷️' },
    { month: 'Year-round', action: 'Check LSD status; vaccinate new calves per age schedule', urgency: 'ongoing', emoji: '📋' },
    { month: 'At 4 months ♀', action: 'Brucellosis — one-time vaccination for female calves only', urgency: 'age-based', emoji: '🐄' },
];

// ─── Vaccination Record Generator ─────────────────────────────
const VETS = ['Dr. Venkatesh', 'Govt. Vet Camp', 'Farmer Self', 'Dr. Priya (Private)'];
const BRANDS = {
    fmd: ['Raksha FMD', 'Indian Immunologicals FMD'],
    hs: ['Raksha HS', 'HS Oil Adjuvant (IVRI)'],
    bq: ['Raksha BQ', 'BQ Vaccine (IVRI)'],
    anthrax: ['Anthrax Spore Vaccine (IVRI)'],
    brucellosis: ['Brucella S19 (IAH&VB)'],
    theileriosis: ['Raksha Theileria'],
    lsd: ['Goat Pox LSD (Hester)', 'Lumpi-ProVac (ICAR)'],
};

function addMonths(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

function daysBetween(a, b) {
    return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function getAlertStatus(nextDueDate, disease) {
    if (!nextDueDate) return 'completed'; // Brucellosis lifetime complete
    const now = new Date();
    const daysUntilDue = daysBetween(now, nextDueDate);
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= disease.alertDaysBefore) return 'dueSoon';
    return 'upToDate';
}

function generateRecordsForCow(cow) {
    const now = new Date();
    const records = [];
    const cowAgeMonths = cow.age * 12;
    // Use cow id to create deterministic randomness
    const cowSeed = parseInt(cow.id.replace('COW-', ''));

    DISEASES.forEach((disease, dIdx) => {
        // Skip brucellosis for "male" cows (simulate ~50% female)
        if (disease.femaleOnly && cowSeed % 2 === 0) return;

        // Skip if cow is too young for first dose
        if (cowAgeMonths < disease.firstDoseMonths) {
            records.push({
                cowId: cow.id,
                cowName: cow.name,
                diseaseId: disease.id,
                diseaseName: disease.shortName,
                status: 'tooYoung',
                lastGiven: null,
                nextDue: null,
                daysRemaining: null,
                history: [],
            });
            return;
        }

        // Determine vaccination coverage (realistic: ~70% up-to-date, ~20% overdue, ~10% never)
        const coverage = ((cowSeed * 7 + dIdx * 13) % 100);

        if (coverage < 10) {
            // Never vaccinated
            records.push({
                cowId: cow.id,
                cowName: cow.name,
                diseaseId: disease.id,
                diseaseName: disease.shortName,
                status: 'neverVaccinated',
                lastGiven: null,
                nextDue: null,
                daysRemaining: null,
                history: [],
            });
            return;
        }

        // Generate vaccination history
        const history = [];
        let lastDate;

        if (disease.lifetimeOnly) {
            // For brucellosis: vaccinated once when young
            const vaccDate = new Date(now);
            vaccDate.setMonth(vaccDate.getMonth() - (cowAgeMonths - 5)); // Given at ~5 months
            const brandList = BRANDS[disease.id] || ['Generic'];
            history.push({
                date: vaccDate.toISOString().slice(0, 10),
                vaccine: brandList[0],
                batch: `B${Math.floor(Math.random() * 9000 + 1000)}`,
                dose: disease.dose,
                route: disease.route,
                administeredBy: VETS[cowSeed % VETS.length],
                notes: 'One-time lifetime vaccination',
            });
            records.push({
                cowId: cow.id,
                cowName: cow.name,
                diseaseId: disease.id,
                diseaseName: disease.shortName,
                status: 'completed',
                lastGiven: vaccDate.toISOString().slice(0, 10),
                nextDue: null,
                daysRemaining: null,
                history,
            });
            return;
        }

        // Regular repeating vaccines — generate 1-4 past entries
        const numPastDoses = Math.min(1 + ((cowSeed + dIdx) % 4), Math.floor(cowAgeMonths / (disease.repeatMonths || 12)));
        for (let d = numPastDoses; d >= 1; d--) {
            const monthsAgo = d * disease.repeatMonths + ((coverage > 80) ? 0 : Math.floor((cowSeed % 3) * 2));
            const vaccDate = new Date(now);
            vaccDate.setMonth(vaccDate.getMonth() - monthsAgo);
            // Add some days variation
            vaccDate.setDate(vaccDate.getDate() + (cowSeed % 15) - 7);
            const brandList = BRANDS[disease.id] || ['Generic'];
            history.push({
                date: vaccDate.toISOString().slice(0, 10),
                vaccine: brandList[cowSeed % brandList.length],
                batch: `B${Math.floor(Math.random() * 9000 + 1000)}`,
                dose: disease.dose,
                route: disease.route,
                administeredBy: VETS[(cowSeed + d) % VETS.length],
                notes: '',
            });
            lastDate = vaccDate;
        }

        // Last dose (most recent)
        const lastDoseMonthsAgo = coverage > 70
            ? Math.floor(disease.repeatMonths * 0.4 + (cowSeed % (disease.repeatMonths * 0.3)))  // Within schedule
            : disease.repeatMonths + Math.floor((cowSeed % 4) * 2); // Overdue

        const lastVaccDate = new Date(now);
        lastVaccDate.setMonth(lastVaccDate.getMonth() - lastDoseMonthsAgo);
        lastVaccDate.setDate(lastVaccDate.getDate() + (cowSeed % 10));
        const brandList = BRANDS[disease.id] || ['Generic'];
        history.push({
            date: lastVaccDate.toISOString().slice(0, 10),
            vaccine: brandList[cowSeed % brandList.length],
            batch: `B${Math.floor(Math.random() * 9000 + 1000)}`,
            dose: disease.dose,
            route: disease.route,
            administeredBy: VETS[cowSeed % VETS.length],
            notes: '',
        });

        // Calculate next due date
        const nextDue = addMonths(lastVaccDate, disease.repeatMonths);
        const daysRemaining = daysBetween(now, nextDue);
        const status = getAlertStatus(nextDue, disease);

        // Sort history by date
        history.sort((a, b) => new Date(a.date) - new Date(b.date));

        records.push({
            cowId: cow.id,
            cowName: cow.name,
            diseaseId: disease.id,
            diseaseName: disease.shortName,
            status,
            lastGiven: lastVaccDate.toISOString().slice(0, 10),
            nextDue: nextDue.toISOString().slice(0, 10),
            daysRemaining,
            history,
        });
    });

    return records;
}

// Generate all records
export const vaccinationRecords = cows.flatMap(cow => generateRecordsForCow(cow));

// Summary statistics
export const vaccinationStats = {
    upToDate: vaccinationRecords.filter(r => r.status === 'upToDate').length,
    dueSoon: vaccinationRecords.filter(r => r.status === 'dueSoon').length,
    overdue: vaccinationRecords.filter(r => r.status === 'overdue').length,
    neverVaccinated: vaccinationRecords.filter(r => r.status === 'neverVaccinated').length,
    completed: vaccinationRecords.filter(r => r.status === 'completed').length,
    totalAnimals: cows.length,
    overdueAnimals: [...new Set(vaccinationRecords.filter(r => r.status === 'overdue').map(r => r.cowId))].length,
    dueSoonAnimals: [...new Set(vaccinationRecords.filter(r => r.status === 'dueSoon').map(r => r.cowId))].length,
};
