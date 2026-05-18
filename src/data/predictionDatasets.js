// ============================================
// DairyAI — Prediction Datasets & Engine
// Based on TANUVAS, ICAR & NDDB South India Research Data
// All data stored in-app — no database or API required
// ============================================

// ─── Dataset 1: Breed Baseline Yields ─────────────────────────
export const BREED_DATA = {
    'Jersey': {
        key: 'jersey_cross',
        fullName: 'Jersey Crossbred',
        minYield: 5, maxYield: 10, avgYield: 7.5, peakYield: 10,
        total305Day: 2400, fatPercent: 5.0,
        bestFor: 'Tamil Nadu plains — most common',
        heatSensitivity: 'moderate',
    },
    'Holstein-Friesian': {
        key: 'hf_cross',
        fullName: 'Holstein Friesian Crossbred',
        minYield: 8, maxYield: 15, avgYield: 11, peakYield: 15,
        total305Day: 4000, fatPercent: 3.2,
        bestFor: 'Intensive farms with good feed',
        heatSensitivity: 'high',
    },
    'Gir': {
        key: 'gir',
        fullName: 'Gir (Indigenous)',
        minYield: 3, maxYield: 6, avgYield: 4.5, peakYield: 6,
        total305Day: 2000, fatPercent: 4.8,
        bestFor: 'A2 milk, heat tolerant',
        heatSensitivity: 'low',
    },
    'Sahiwal': {
        key: 'sahiwal',
        fullName: 'Sahiwal (Indigenous)',
        minYield: 4, maxYield: 7, avgYield: 5.5, peakYield: 7,
        total305Day: 2400, fatPercent: 4.5,
        bestFor: 'Dry zone, disease resistant',
        heatSensitivity: 'low',
    },
    'HF Cross': {
        key: 'hf_gir_cross',
        fullName: 'HF × Gir Crossbred',
        minYield: 6, maxYield: 12, avgYield: 9, peakYield: 12,
        total305Day: 3200, fatPercent: 4.2,
        bestFor: 'Balanced — ideal for South India',
        heatSensitivity: 'moderate',
    },
    'Non-Descript': {
        key: 'non_descript',
        fullName: 'Non-Descript / Mixed',
        minYield: 2, maxYield: 4, avgYield: 3, peakYield: 4,
        total305Day: 900, fatPercent: 4.0,
        bestFor: 'Baseline for unknown breed farms',
        heatSensitivity: 'low',
    },
};

// ─── Dataset 2: Wood's Lactation Curve Lookup ─────────────────
// Pre-computed multipliers from Wood's model: Y = a × n^b × e^(−c×n)
// a=7.77, b=0.068, c=0.0038 (TANUVAS validated for South India Jersey Cross)
export const LACTATION_CURVE = [
    { dimMin: 1, dimMax: 10, phase: 'Early', multiplier: 0.60 },
    { dimMin: 11, dimMax: 20, phase: 'Early', multiplier: 0.72 },
    { dimMin: 21, dimMax: 30, phase: 'Early', multiplier: 0.82 },
    { dimMin: 31, dimMax: 40, phase: 'Early', multiplier: 0.90 },
    { dimMin: 41, dimMax: 50, phase: 'Rising to Peak', multiplier: 0.96 },
    { dimMin: 51, dimMax: 60, phase: 'Peak', multiplier: 1.00 },
    { dimMin: 61, dimMax: 70, phase: 'Peak', multiplier: 0.99 },
    { dimMin: 71, dimMax: 80, phase: 'Peak', multiplier: 0.97 },
    { dimMin: 81, dimMax: 90, phase: 'Peak', multiplier: 0.95 },
    { dimMin: 91, dimMax: 110, phase: 'Mid Lactation', multiplier: 0.91 },
    { dimMin: 111, dimMax: 130, phase: 'Mid Lactation', multiplier: 0.87 },
    { dimMin: 131, dimMax: 150, phase: 'Mid Lactation', multiplier: 0.83 },
    { dimMin: 151, dimMax: 170, phase: 'Mid Lactation', multiplier: 0.78 },
    { dimMin: 171, dimMax: 190, phase: 'Mid Lactation', multiplier: 0.74 },
    { dimMin: 191, dimMax: 210, phase: 'Late Lactation', multiplier: 0.69 },
    { dimMin: 211, dimMax: 230, phase: 'Late Lactation', multiplier: 0.63 },
    { dimMin: 231, dimMax: 250, phase: 'Late Lactation', multiplier: 0.57 },
    { dimMin: 251, dimMax: 270, phase: 'Late Lactation', multiplier: 0.50 },
    { dimMin: 271, dimMax: 305, phase: 'Dry-off Zone', multiplier: 0.30 },
    { dimMin: 306, dimMax: 9999, phase: 'Dry Period', multiplier: 0.00 },
];

// ─── Dataset 3: Seasonal Multipliers (South India) ────────────
// Auto-applied based on current month — no farmer input needed
export const SEASONAL_MULTIPLIERS = [
    { month: 0, name: 'January', season: 'Cool Dry', multiplier: 1.00, reason: 'Comfortable temperature — full yield' },
    { month: 1, name: 'February', season: 'Cool Dry', multiplier: 1.00, reason: 'Good conditions' },
    { month: 2, name: 'March', season: 'Early Summer', multiplier: 0.92, reason: 'Temperature rising — mild heat stress begins' },
    { month: 3, name: 'April', season: 'Summer', multiplier: 0.82, reason: 'Peak heat stress — yield drops significantly' },
    { month: 4, name: 'May', season: 'Summer', multiplier: 0.80, reason: 'Hottest month — maximum heat stress' },
    { month: 5, name: 'June', season: 'SW Monsoon Onset', multiplier: 0.90, reason: 'Relief from heat but humidity stress' },
    { month: 6, name: 'July', season: 'SW Monsoon', multiplier: 0.93, reason: 'Good fodder availability — yield recovering' },
    { month: 7, name: 'August', season: 'SW Monsoon', multiplier: 0.95, reason: 'Stable monsoon — good yield' },
    { month: 8, name: 'September', season: 'SW Monsoon End', multiplier: 0.95, reason: 'Good conditions continue' },
    { month: 9, name: 'October', season: 'NE Monsoon Onset', multiplier: 0.97, reason: 'Cool and wet — near best conditions' },
    { month: 10, name: 'November', season: 'NE Monsoon', multiplier: 1.00, reason: 'Best season for South India dairy — peak conditions' },
    { month: 11, name: 'December', season: 'Post Monsoon', multiplier: 1.00, reason: 'Cool and dry — excellent yield conditions' },
];

// ─── Dataset 4: Parity Multipliers ───────────────────────────
export const PARITY_MULTIPLIERS = [
    { parity: 1, description: 'First Lactation (Heifer)', multiplier: 0.80, note: 'Young cow — body still developing. Lower yield is normal.' },
    { parity: 2, description: 'Second Lactation', multiplier: 0.92, note: 'Yield improving significantly from first lactation.' },
    { parity: 3, description: 'Third Lactation', multiplier: 1.00, note: 'Prime productive parity — expect maximum yield.' },
    { parity: 4, description: 'Fourth Lactation', multiplier: 1.00, note: 'Yield stable at peak. Monitor health closely.' },
    { parity: 5, description: 'Fifth Lactation', multiplier: 0.90, note: 'Yield beginning to decline. Watch for mastitis risk.' },
    { parity: 6, description: 'Sixth Lactation', multiplier: 0.78, note: 'Significant decline. Assess economic viability.' },
    { parity: 7, description: 'Seventh Lactation and above', multiplier: 0.65, note: 'Low yield. Consider culling or retirement.' },
];

// ─── Feed Score Definitions ──────────────────────────────────
export const FEED_SCORES = [
    { score: 5, label: 'Excellent', multiplier: 1.00, description: 'Fully balanced diet — green + dry + concentrate + mineral + adequate water' },
    { score: 4, label: 'Good', multiplier: 0.90, description: 'Good diet — minor gaps in supplements' },
    { score: 3, label: 'Moderate', multiplier: 0.80, description: 'Missing concentrate or mineral supplement' },
    { score: 2, label: 'Poor', multiplier: 0.65, description: 'Limited diet — mainly dry fodder' },
    { score: 1, label: 'Very Poor', multiplier: 0.50, description: 'Only dry fodder, no green, no concentrate' },
];

// ─── Lactation Phase Labels & Advice ──────────────────────────
export const PHASE_LABELS = [
    { minMult: 0.00, maxMult: 0.00, phase: 'Dry Period', advice: 'Prepare for next calving. Provide dry cow therapy.', color: '#6b7280', emoji: '🔴' },
    { minMult: 0.01, maxMult: 0.55, phase: 'Late Lactation', advice: 'Yield declining. Plan dry-off date. Reduce milking stress.', color: '#f59e0b', emoji: '🟡' },
    { minMult: 0.56, maxMult: 0.79, phase: 'Mid Lactation', advice: 'Maintain consistent feeding. Yield stable.', color: '#3b82f6', emoji: '🔵' },
    { minMult: 0.80, maxMult: 0.94, phase: 'Mid Lactation', advice: 'Maintain consistent feeding. Yield stable.', color: '#3b82f6', emoji: '🔵' },
    { minMult: 0.95, maxMult: 0.99, phase: 'Rising to Peak', advice: 'Increase concentrate feed. Yield climbing.', color: '#10b981', emoji: '🟢' },
    { minMult: 1.00, maxMult: 1.00, phase: 'Peak Lactation', advice: 'Maximum yield. Do not change feed or routine.', color: '#10b981', emoji: '⭐' },
];

// ─── Dataset 5: Daily Expense Estimates per Breed (₹/day) ────
// Based on South India feed costs: green fodder ₹3-5/kg, concentrate ₹25-35/kg
export const EXPENSE_DATA = {
    'Jersey': { feedCost: 180, medicineCost: 15, labourCost: 80, totalDailyExpense: 275 },
    'Holstein-Friesian': { feedCost: 280, medicineCost: 20, labourCost: 80, totalDailyExpense: 380 },
    'Gir': { feedCost: 120, medicineCost: 10, labourCost: 80, totalDailyExpense: 210 },
    'Sahiwal': { feedCost: 140, medicineCost: 10, labourCost: 80, totalDailyExpense: 230 },
    'HF Cross': { feedCost: 220, medicineCost: 15, labourCost: 80, totalDailyExpense: 315 },
    'Non-Descript': { feedCost: 90, medicineCost: 8, labourCost: 80, totalDailyExpense: 178 },
};

// ============================================
// PREDICTION ENGINE
// ============================================

/**
 * Get the lactation curve multiplier for a given DIM
 */
export function getCurveMultiplier(dim) {
    if (dim <= 0) return { multiplier: 0, phase: 'Pre-Calving' };
    const entry = LACTATION_CURVE.find(e => dim >= e.dimMin && dim <= e.dimMax);
    return entry || { multiplier: 0, phase: 'Dry Period' };
}

/**
 * Get the parity multiplier
 */
export function getParityMultiplier(parity) {
    if (parity >= 7) return PARITY_MULTIPLIERS[6];
    return PARITY_MULTIPLIERS.find(p => p.parity === parity) || PARITY_MULTIPLIERS[0];
}

/**
 * Get the seasonal multiplier for a given month (0-11)
 */
export function getSeasonalMultiplier(month) {
    return SEASONAL_MULTIPLIERS[month] || SEASONAL_MULTIPLIERS[0];
}

/**
 * Get feed score multiplier
 */
export function getFeedMultiplier(feedScore) {
    const entry = FEED_SCORES.find(f => f.score === feedScore);
    return entry ? entry.multiplier : 0.80; // default moderate
}

/**
 * Get the phase label and advice for a multiplier value
 */
export function getPhaseInfo(multiplier) {
    if (multiplier <= 0) return PHASE_LABELS[0]; // Dry
    // Find matching phase
    for (let i = PHASE_LABELS.length - 1; i >= 0; i--) {
        if (multiplier >= PHASE_LABELS[i].minMult) return PHASE_LABELS[i];
    }
    return PHASE_LABELS[0];
}

/**
 * Calculate Days in Milk from calving date
 */
export function calculateDIM(calvingDate) {
    if (!calvingDate) return -1;
    const calving = new Date(calvingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    calving.setHours(0, 0, 0, 0);
    const diffMs = today - calving;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Predict daily yield for a single day at a specific DIM
 */
export function predictYieldAtDIM(breedKey, dim, parity, feedScore = 3, monthOverride = null) {
    const breed = BREED_DATA[breedKey];
    if (!breed) return 0;

    const baseYield = breed.avgYield;
    const curve = getCurveMultiplier(dim);
    const parityData = getParityMultiplier(parity);
    const month = monthOverride !== null ? monthOverride : new Date().getMonth();
    const seasonal = getSeasonalMultiplier(month);
    const feedMult = getFeedMultiplier(feedScore);

    const predicted = baseYield * curve.multiplier * parityData.multiplier * seasonal.multiplier * feedMult;
    return Math.min(predicted, breed.peakYield);
}

/**
 * Get expense estimates for a breed
 */
export function getExpenseEstimate(breedKey, feedScore = 3) {
    const base = EXPENSE_DATA[breedKey] || EXPENSE_DATA['Non-Descript'];
    // Adjust feed cost by feed score — better feed costs more
    const feedMultiplier = feedScore >= 5 ? 1.20 : feedScore >= 4 ? 1.10 : feedScore >= 3 ? 1.00 : feedScore >= 2 ? 0.85 : 0.70;
    const adjustedFeed = Math.round(base.feedCost * feedMultiplier);
    return {
        feedCost: adjustedFeed,
        medicineCost: base.medicineCost,
        labourCost: base.labourCost,
        totalDailyExpense: adjustedFeed + base.medicineCost + base.labourCost,
    };
}

/**
 * Main prediction function — generates full prediction for a cow
 * @param {Object} cow - Cow object with breed, lastCalving, parity, etc.
 * @param {number} feedScore - Feed score (1-5), defaults to 3
 * @param {number} milkPricePerLitre - Price in ₹, defaults to 35
 * @returns Full prediction object with yield + profit
 */
export function generatePrediction(cow, feedScore = 3, milkPricePerLitre = 35) {
    const breedKey = cow.breed;
    const breed = BREED_DATA[breedKey];
    if (!breed) {
        return { valid: false, error: 'unknownBreed', breedKey };
    }

    // Calculate DIM
    const dim = cow.lactationDay || calculateDIM(cow.lastCalving);
    if (dim < 0) {
        return { valid: false, error: 'noCalvingDate' };
    }

    const parity = cow.parity || 1;
    const currentMonth = new Date().getMonth();

    // Current day prediction
    const curve = getCurveMultiplier(dim);
    const parityData = getParityMultiplier(parity);
    const seasonal = getSeasonalMultiplier(currentMonth);
    const feedMult = getFeedMultiplier(feedScore);
    const dailyYield = predictYieldAtDIM(breedKey, dim, parity, feedScore);

    // Expense estimates
    const expenses = getExpenseEstimate(breedKey, feedScore);

    // Weekly forecast (next 7 days)
    let weeklyYield = 0;
    const weeklyBreakdown = [];
    for (let d = 0; d < 7; d++) {
        const futureDIM = dim + d;
        // Account for month changes in weekly forecast
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + d);
        const futureMonth = futureDate.getMonth();
        const dayYield = predictYieldAtDIM(breedKey, futureDIM, parity, feedScore, futureMonth);
        weeklyYield += dayYield;
        weeklyBreakdown.push({
            day: d + 1,
            dim: futureDIM,
            yield: parseFloat(dayYield.toFixed(1)),
            date: futureDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        });
    }

    // Monthly forecast (next 30 days)
    let monthlyYield = 0;
    for (let d = 0; d < 30; d++) {
        const futureDIM = dim + d;
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + d);
        const futureMonth = futureDate.getMonth();
        monthlyYield += predictYieldAtDIM(breedKey, futureDIM, parity, feedScore, futureMonth);
    }

    // 3-month forecast
    let threeMonthYield = 0;
    for (let d = 0; d < 90; d++) {
        const futureDIM = dim + d;
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + d);
        const futureMonth = futureDate.getMonth();
        threeMonthYield += predictYieldAtDIM(breedKey, futureDIM, parity, feedScore, futureMonth);
    }

    // Revenue calculations
    const dailyRevenue = dailyYield * milkPricePerLitre;
    const weeklyRevenue = weeklyYield * milkPricePerLitre;
    const monthlyRevenue = monthlyYield * milkPricePerLitre;

    // Profit calculations
    const dailyProfit = dailyRevenue - expenses.totalDailyExpense;
    const weeklyProfit = weeklyRevenue - (expenses.totalDailyExpense * 7);
    const monthlyProfit = monthlyRevenue - (expenses.totalDailyExpense * 30);

    // Phase info
    const phaseInfo = getPhaseInfo(curve.multiplier);

    // Alerts
    const alerts = [];

    // Heat stress alerts
    if ([2, 3, 4].includes(currentMonth)) {
        if (currentMonth >= 3 && breed.heatSensitivity === 'high') {
            alerts.push({
                type: 'error',
                message: 'HF crossbred cows are highly sensitive to heat — consider cooling fans or wet gunny bags to prevent severe yield drop',
            });
        } else {
            alerts.push({
                type: 'warning',
                message: 'Summer heat stress season — ensure shading, extra water (60–80 litres/cow/day), and additional green fodder',
            });
        }
    }

    // Parity advisories
    if (parity === 1) {
        alerts.push({
            type: 'info',
            message: 'First lactation cow — normally gives 20% less than full potential. Yield will improve in next lactation.',
        });
    } else if (parity >= 6) {
        alerts.push({
            type: 'warning',
            message: `This cow is in her ${parity}th lactation. Yield has declined naturally. Evaluate if continued milking is profitable.`,
        });
    }

    // Dry-off alert
    if (dim >= 270 && dim <= 305) {
        alerts.push({
            type: 'warning',
            message: 'Plan dry-off period — expected in next 2–3 weeks. Prepare for next calving.',
        });
    }

    // Profit warning
    if (dailyProfit < 0 && !isDryCheck(dim, curve)) {
        alerts.push({
            type: 'error',
            message: `This cow is running at a loss (₹${Math.abs(dailyProfit).toFixed(0)}/day). Review feed costs and consider yield improvement strategies.`,
        });
    }

    // Yield status
    const isDry = isDryCheck(dim, curve);

    return {
        valid: true,
        cowId: cow.id,
        cowName: cow.name,
        breed: breed.fullName,
        breedKey,

        // DIM & Phase
        dim,
        phase: isDry ? 'Dry Period' : curve.phase,
        phaseInfo,
        isDry,

        // Multipliers (for transparency)
        multipliers: {
            curve: curve.multiplier,
            parity: parityData.multiplier,
            seasonal: seasonal.multiplier,
            feed: feedMult,
            combined: parseFloat((curve.multiplier * parityData.multiplier * seasonal.multiplier * feedMult).toFixed(3)),
        },

        // Yield predictions
        dailyYield: parseFloat(dailyYield.toFixed(1)),
        weeklyYield: parseFloat(weeklyYield.toFixed(1)),
        monthlyYield: parseFloat(monthlyYield.toFixed(0)),
        threeMonthYield: parseFloat(threeMonthYield.toFixed(0)),
        weeklyBreakdown,

        // Revenue
        dailyRevenue: parseFloat(dailyRevenue.toFixed(0)),
        weeklyRevenue: parseFloat(weeklyRevenue.toFixed(0)),
        monthlyRevenue: parseFloat(monthlyRevenue.toFixed(0)),

        // Expenses & Profit
        expenses,
        dailyProfit: parseFloat(dailyProfit.toFixed(0)),
        weeklyProfit: parseFloat(weeklyProfit.toFixed(0)),
        monthlyProfit: parseFloat(monthlyProfit.toFixed(0)),
        profitMargin: dailyRevenue > 0 ? parseFloat(((dailyProfit / dailyRevenue) * 100).toFixed(1)) : 0,

        // Context
        season: seasonal,
        parityInfo: parityData,
        breedData: breed,
        feedScore,
        milkPrice: milkPricePerLitre,

        // Alerts
        alerts,
    };
}

function isDryCheck(dim, curve) {
    return dim > 305 || curve.multiplier === 0;
}

/**
 * Generate predictions for all cows in the farm
 */
export function generateFarmPredictions(cows, feedScore = 3, milkPricePerLitre = 35) {
    const predictions = cows.map(cow => generatePrediction(cow, feedScore, milkPricePerLitre));
    const validPredictions = predictions.filter(p => p.valid && !p.isDry);
    const dryCount = predictions.filter(p => p.valid && p.isDry).length;

    // Farm-level expense & profit
    const totalDailyExpense = validPredictions.reduce((s, p) => s + p.expenses.totalDailyExpense, 0);
    const totalDailyRevenue = parseFloat(validPredictions.reduce((s, p) => s + p.dailyRevenue, 0).toFixed(0));
    const totalDailyProfit = totalDailyRevenue - totalDailyExpense;

    return {
        predictions,
        summary: {
            totalCows: cows.length,
            activeMilking: validPredictions.length,
            dryPeriod: dryCount,
            totalDailyYield: parseFloat(validPredictions.reduce((s, p) => s + p.dailyYield, 0).toFixed(1)),
            totalWeeklyYield: parseFloat(validPredictions.reduce((s, p) => s + p.weeklyYield, 0).toFixed(0)),
            totalMonthlyYield: parseFloat(validPredictions.reduce((s, p) => s + p.monthlyYield, 0).toFixed(0)),
            totalDailyRevenue,
            totalWeeklyRevenue: parseFloat(validPredictions.reduce((s, p) => s + p.weeklyRevenue, 0).toFixed(0)),
            totalMonthlyRevenue: parseFloat(validPredictions.reduce((s, p) => s + p.monthlyRevenue, 0).toFixed(0)),
            // Expenses
            totalDailyExpense,
            totalWeeklyExpense: totalDailyExpense * 7,
            totalMonthlyExpense: totalDailyExpense * 30,
            // Profit
            totalDailyProfit,
            totalWeeklyProfit: parseFloat(validPredictions.reduce((s, p) => s + p.weeklyProfit, 0).toFixed(0)),
            totalMonthlyProfit: parseFloat(validPredictions.reduce((s, p) => s + p.monthlyProfit, 0).toFixed(0)),
            profitMargin: totalDailyRevenue > 0 ? parseFloat(((totalDailyProfit / totalDailyRevenue) * 100).toFixed(1)) : 0,
            profitableCows: validPredictions.filter(p => p.dailyProfit > 0).length,
            lossMakingCows: validPredictions.filter(p => p.dailyProfit <= 0).length,
            // Yield stats
            avgDailyYield: validPredictions.length > 0
                ? parseFloat((validPredictions.reduce((s, p) => s + p.dailyYield, 0) / validPredictions.length).toFixed(1))
                : 0,
            peakCows: validPredictions.filter(p => p.phase === 'Peak' || p.phase === 'Rising to Peak').length,
            decliningCows: validPredictions.filter(p => p.phase === 'Late Lactation' || p.phase === 'Dry-off Zone').length,
        },
    };
}

