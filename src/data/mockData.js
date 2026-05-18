// ============================================
// DairyAI — Clean Data Module
// Dynamically populated from cow records in localStorage
// ============================================
import { getCows } from './useCowStore';

// Cows are stored in localStorage — seeded from dataset on first load
export const cows = getCows();

// ─── Dynamically compute farm stats ─────────────────────────
function buildFarmStats(cowList) {
    const totalCows = cowList.length;
    const healthyCows = cowList.filter(c => c.status === 'Healthy').length;
    const atRiskCows = cowList.filter(c => c.status === 'At Risk').length;
    const criticalCows = cowList.filter(c => c.status === 'Critical').length;
    const totalDailyYield = cowList.reduce((s, c) => s + (Number(c.dailyYield) || 0), 0);
    const avgDailyYield = totalCows > 0 ? totalDailyYield / totalCows : 0;
    const totalIncome = cowList.reduce((s, c) => s + (Number(c.income) || 0), 0);
    const milkPrice = totalDailyYield > 0 ? Math.round(totalIncome / totalDailyYield) || 35 : 35;
    const dailyRevenue = totalIncome || totalDailyYield * milkPrice;
    const dailyFeedCost = cowList.reduce((s, c) => s + (Number(c.feedCost) || 0), 0);
    const avgHealthScore = totalCows > 0
        ? Math.round(cowList.reduce((s, c) => s + (Number(c.healthScore) || 0), 0) / totalCows) : 0;
    return {
        totalCows, healthyCows, atRiskCows, criticalCows,
        avgDailyYield: parseFloat(avgDailyYield.toFixed(1)),
        totalDailyYield: parseFloat(totalDailyYield.toFixed(1)),
        farmHealthScore: avgHealthScore,
        dailyRevenue: parseFloat(dailyRevenue.toFixed(0)),
        dailyFeedCost: parseFloat(dailyFeedCost.toFixed(0)),
        milkPrice,
    };
}

export const farmStats = buildFarmStats(cows);

// ─── Generate 30-day yield history from cow data ────────────
function buildYieldHistory(cowList) {
    if (cowList.length === 0) return [];
    const totalToday = cowList.reduce((s, c) => s + (Number(c.dailyYield) || 0), 0);
    const history = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date('2026-03-13');
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        // Add slight variation to simulate daily differences
        const variation = 1 + (Math.sin(i * 0.7) * 0.05) + (Math.cos(i * 1.3) * 0.03);
        const dayYield = parseFloat((totalToday * variation).toFixed(1));
        const target = parseFloat((totalToday * 1.05).toFixed(1));
        history.push({
            date: dateStr,
            yield: dayYield,
            target,
            fat: parseFloat((4.1 + Math.sin(i * 0.4) * 0.3).toFixed(1)),
            protein: parseFloat((3.3 + Math.cos(i * 0.5) * 0.15).toFixed(1)),
            scc: Math.round(180000 + Math.sin(i * 0.6) * 20000),
        });
    }
    return history;
}
export const yieldHistory = buildYieldHistory(cows);

// Empty yield forecast
export const yieldForecast = [];

// Empty market prices
export const marketPrices = [];

// Empty price forecast
export const priceForecast = [];

// No alerts on fresh start
export const alerts = [];

// No feed schedules
export const feedSchedule = [];

// No feed inventory
export const feedInventory = [];

// ─── Financial data from cow records ────────────────────────
function buildFinancials(cowList) {
    if (cowList.length === 0) return {
        monthlyRevenue: 0, monthlyFeedCost: 0, monthlyVetCost: 0,
        monthlyLabourCost: 0, monthlyEnergyCost: 0, monthlyOtherCost: 0,
        monthlyProfit: 0, profitMargin: 0, revenuePerCow: 0, feedCostPerLitre: 0,
        costBreakdown: [], revenueBreakdown: [],
    };

    const dailyIncome = cowList.reduce((s, c) => s + (Number(c.income) || 0), 0);
    const dailyFeed = cowList.reduce((s, c) => s + (Number(c.feedCost) || 0), 0);
    const dailyMedicine = cowList.reduce((s, c) => s + (Number(c.medicineCost) || 0), 0);
    const dailyLabour = cowList.reduce((s, c) => s + (Number(c.labourCost) || 0), 0);
    const dailyExpense = cowList.reduce((s, c) => s + (Number(c.totalExpense) || 0), 0);
    const dailyProfit = dailyIncome - dailyExpense;
    const totalYield = cowList.reduce((s, c) => s + (Number(c.dailyYield) || 0), 0);

    const monthlyRevenue = Math.round(dailyIncome * 30);
    const monthlyFeedCost = Math.round(dailyFeed * 30);
    const monthlyVetCost = Math.round(dailyMedicine * 30);
    const monthlyLabourCost = Math.round(dailyLabour * 30);
    const monthlyEnergyCost = Math.round(cowList.length * 5 * 30); // ~₹5/cow/day
    const monthlyOtherCost = Math.round(cowList.length * 3 * 30);
    const totalMonthlyCost = monthlyFeedCost + monthlyVetCost + monthlyLabourCost + monthlyEnergyCost + monthlyOtherCost;
    const monthlyProfit = monthlyRevenue - totalMonthlyCost;
    const profitMargin = monthlyRevenue > 0 ? parseFloat(((monthlyProfit / monthlyRevenue) * 100).toFixed(1)) : 0;

    return {
        monthlyRevenue,
        monthlyFeedCost,
        monthlyVetCost,
        monthlyLabourCost,
        monthlyEnergyCost,
        monthlyOtherCost,
        monthlyProfit,
        profitMargin,
        revenuePerCow: cowList.length > 0 ? Math.round(monthlyRevenue / cowList.length) : 0,
        feedCostPerLitre: totalYield > 0 ? parseFloat((dailyFeed / totalYield).toFixed(1)) : 0,
        costBreakdown: [
            { name: 'Feed & Fodder', value: monthlyFeedCost },
            { name: 'Veterinary & Medicine', value: monthlyVetCost },
            { name: 'Labour', value: monthlyLabourCost },
            { name: 'Energy & Utilities', value: monthlyEnergyCost },
            { name: 'Other', value: monthlyOtherCost },
        ],
        revenueBreakdown: [
            { name: 'Milk Sales (Cooperative)', value: Math.round(monthlyRevenue * 0.7) },
            { name: 'Milk Sales (Direct)', value: Math.round(monthlyRevenue * 0.2) },
            { name: 'By-products', value: Math.round(monthlyRevenue * 0.07) },
            { name: 'Other Income', value: Math.round(monthlyRevenue * 0.03) },
        ],
    };
}

export const financials = buildFinancials(cows);

// ─── Profit trend (6-month simulated) ───────────────────────
function buildProfitTrend(cowList) {
    if (cowList.length === 0) return [];
    const dailyIncome = cowList.reduce((s, c) => s + (Number(c.income) || 0), 0);
    const dailyExpense = cowList.reduce((s, c) => s + (Number(c.totalExpense) || 0), 0);
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const seasonalMultipliers = [0.92, 0.95, 1.0, 1.0, 1.0, 0.88]; // monsoon→winter→summer
    return months.map((m, i) => {
        const mult = seasonalMultipliers[i];
        const revenue = Math.round(dailyIncome * 30 * mult);
        const cost = Math.round(dailyExpense * 30 * (0.95 + Math.random() * 0.1));
        return { month: m, revenue, cost, profit: revenue - cost };
    });
}

export const profitTrend = buildProfitTrend(cows);

// No saving recommendations
export const savingRecommendations = [];

// No estrus events
export const estrusEvents = [];

// Reproduction stats — derived from cow data
export const reproductionStats = {
    conceptionRate: 0,
    heatDetectionRate: 0,
    avgDaysOpen: 0,
    pregnantCows: 0,
    openCows: 0,
    avgCalvingInterval: 0,
    inseminationsThisMonth: 0,
    confirmationsThisMonth: 0,
};

// Empty disease risk
export const diseaseRiskHeatmap = {
    categories: ['Mastitis', 'Lameness', 'Ketosis', 'Respiratory', 'Metabolic'],
    days: [],
    data: [],
};

// No culling candidates
export const cullingCandidates = [];

// Empty quality trend
export const qualityTrend = [];

// No batch history
export const batchHistory = [];

// ─── Benchmarks from dataset ────────────────────────────────
function buildBenchmarks(cowList) {
    if (cowList.length === 0) return {
        farmAvgYield: 0, regionalAvgYield: 0, topFarmsYield: 0,
        farmSCC: 0, regionalSCC: 0, topFarmsSCC: 0,
        farmFeedCost: 0, regionalFeedCost: 0, topFarmsFeedCost: 0,
        farmProfitPerCow: 0, regionalProfitPerCow: 0, topFarmsProfitPerCow: 0,
    };
    const totalYield = cowList.reduce((s, c) => s + (Number(c.dailyYield) || 0), 0);
    const avgYield = parseFloat((totalYield / cowList.length).toFixed(1));
    const avgProfit = Math.round(cowList.reduce((s, c) => s + (Number(c.profit) || 0), 0) / cowList.length);
    const avgFeedCost = Math.round(cowList.reduce((s, c) => s + (Number(c.feedCost) || 0), 0) / cowList.length);
    return {
        farmAvgYield: avgYield,
        regionalAvgYield: parseFloat((avgYield * 0.85).toFixed(1)),
        topFarmsYield: parseFloat((avgYield * 1.2).toFixed(1)),
        farmSCC: 180000,
        regionalSCC: 220000,
        topFarmsSCC: 150000,
        farmFeedCost: avgFeedCost,
        regionalFeedCost: Math.round(avgFeedCost * 1.1),
        topFarmsFeedCost: Math.round(avgFeedCost * 0.9),
        farmProfitPerCow: avgProfit,
        regionalProfitPerCow: Math.round(avgProfit * 0.75),
        topFarmsProfitPerCow: Math.round(avgProfit * 1.4),
    };
}

export const benchmarks = buildBenchmarks(cows);

// ============================================
// Labour Salary Module — Sample Data
// ============================================

export const workers = [
    {
        id: 'W-101',
        name: 'Ramesh',
        initial: 'R',
        color: '#40916c',
        type: 'Paid Worker',
        typeColor: '#40916c',
        productivityScore: 86,
        duties: ['Milking', 'Feeding', 'Record Keeping'],
        salaryType: 'Monthly Salary',
        baseSalary: 21000,
        cattleAssigned: 12,
        nickname: 'Ramu',
        age: 36,
        village: 'Nagapattinam',
        phone: '+91 98765 43210',
        emergencyContact: '+91 91234 56789',
        joinDate: '2023-04-15',
        paymentMethod: 'Bank Transfer',
        nonCashBenefits: [
            { name: 'Meals', monthlyValue: 2500 },
            { name: 'Housing', monthlyValue: 3500 },
        ],
        imputedValue: 0,
        skills: {
            experience: 12,
            canAI: true,
            canIdentifyDiseases: true,
            milkingMachine: true,
            canReadRecords: true,
        },
        avgMilkPerSession: 8.6,
    },
    {
        id: 'W-102',
        name: 'Savitri',
        initial: 'S',
        color: '#c4704c',
        type: 'Family Help',
        typeColor: '#c4704c',
        productivityScore: 72,
        duties: ['Calf Care', 'Watering', 'Cleaning'],
        salaryType: 'No Cash Payment',
        baseSalary: 0,
        cattleAssigned: 5,
        nickname: 'Savi',
        age: 29,
        village: 'Thanjavur',
        phone: '+91 99876 54321',
        emergencyContact: '+91 90123 45678',
        joinDate: '2022-11-01',
        paymentMethod: 'Family Share',
        nonCashBenefits: [
            { name: 'Meals', monthlyValue: 1800 },
            { name: 'Accommodation', monthlyValue: 2800 },
        ],
        imputedValue: 9800,
        skills: {
            experience: 8,
            canAI: false,
            canIdentifyDiseases: true,
            milkingMachine: false,
            canReadRecords: true,
        },
        avgMilkPerSession: 4.2,
    },
    {
        id: 'W-103',
        name: 'Anil',
        initial: 'A',
        color: '#5b7fa5',
        type: 'Daily Wage',
        typeColor: '#5b7fa5',
        productivityScore: 78,
        duties: ['Grazing', 'Fence Repair', 'Transport'],
        salaryType: 'Daily Wage',
        baseSalary: 900,
        cattleAssigned: 8,
        nickname: 'Anu',
        age: 31,
        village: 'Pudukkottai',
        phone: '+91 97654 32109',
        emergencyContact: '+91 93456 78012',
        joinDate: '2024-01-10',
        paymentMethod: 'Cash',
        nonCashBenefits: [
            { name: 'Meals', monthlyValue: 2200 },
        ],
        imputedValue: 0,
        skills: {
            experience: 6,
            canAI: false,
            canIdentifyDiseases: false,
            milkingMachine: true,
            canReadRecords: false,
        },
        avgMilkPerSession: 3.8,
    },
    {
        id: 'W-104',
        name: 'Priya',
        initial: 'P',
        color: '#d4a039',
        type: 'Contract Labour',
        typeColor: '#d4a039',
        productivityScore: 91,
        duties: ['Veterinary Assist', 'Record Audit', 'Milk Testing'],
        salaryType: 'Per Visit',
        baseSalary: 650,
        cattleAssigned: 0,
        nickname: 'Pri',
        age: 26,
        village: 'Kumbakonam',
        phone: '+91 96543 21098',
        emergencyContact: '+91 92345 67801',
        joinDate: '2024-09-12',
        paymentMethod: 'Mobile Wallet',
        nonCashBenefits: [],
        imputedValue: 0,
        skills: {
            experience: 10,
            canAI: true,
            canIdentifyDiseases: true,
            milkingMachine: true,
            canReadRecords: true,
        },
        avgMilkPerSession: 5.1,
    },
];

export const attendanceData = [
    {
        workerId: 'W-101',
        workerName: 'Ramesh',
        records: Array.from({ length: 18 }, (_, index) => ({
            date: `2026-05-${String(index + 1).padStart(2, '0')}`,
            status: index % 12 === 11 ? 'Festival Bonus Day' : index % 7 === 0 ? 'Absent' : index % 9 === 0 ? 'Half Day' : 'Present',
        })),
    },
    {
        workerId: 'W-102',
        workerName: 'Savitri',
        records: Array.from({ length: 18 }, (_, index) => ({
            date: `2026-05-${String(index + 1).padStart(2, '0')}`,
            status: index % 10 === 0 ? 'Sick Leave' : index % 6 === 0 ? 'Absent' : 'Present',
        })),
    },
    {
        workerId: 'W-103',
        workerName: 'Anil',
        records: Array.from({ length: 18 }, (_, index) => ({
            date: `2026-05-${String(index + 1).padStart(2, '0')}`,
            status: index % 8 === 0 ? 'Half Day' : index % 11 === 0 ? 'Absent' : 'Present',
        })),
    },
    {
        workerId: 'W-104',
        workerName: 'Priya',
        records: Array.from({ length: 18 }, (_, index) => ({
            date: `2026-05-${String(index + 1).padStart(2, '0')}`,
            status: index % 14 === 0 ? 'Festival Bonus Day' : 'Present',
        })),
    },
];

export const salaryRecords = [
    {
        workerId: 'W-101',
        name: 'Ramesh',
        type: 'Monthly Salary',
        daysWorked: 26,
        totalDays: 30,
        gross: 21000,
        deductions: [
            { reason: 'Advance Recovery', amount: 1200 },
        ],
        bonuses: [
            { reason: 'Festival Bonus', amount: 1800 },
        ],
        netPay: 21600,
        totalTrueCost: 26900,
        mealsValue: 2500,
        accommodationValue: 3500,
    },
    {
        workerId: 'W-102',
        name: 'Savitri',
        type: 'Family Help',
        daysWorked: 30,
        totalDays: 30,
        gross: 0,
        deductions: [],
        bonuses: [],
        netPay: 0,
        totalTrueCost: 14600,
        mealsValue: 1800,
        accommodationValue: 2800,
    },
    {
        workerId: 'W-103',
        name: 'Anil',
        type: 'Daily Wage',
        daysWorked: 22,
        totalDays: 30,
        gross: 19800,
        deductions: [
            { reason: 'Late Penalty', amount: 400 },
        ],
        bonuses: [
            { reason: 'Performance Bonus', amount: 1200 },
        ],
        netPay: 20600,
        totalTrueCost: 22800,
        mealsValue: 2200,
        accommodationValue: 0,
    },
    {
        workerId: 'W-104',
        name: 'Priya',
        type: 'Per Visit',
        daysWorked: 12,
        totalDays: 30,
        gross: 7800,
        deductions: [],
        bonuses: [
            { reason: 'Quality Incentive', amount: 600 },
        ],
        netPay: 8400,
        totalTrueCost: 8400,
        mealsValue: 0,
        accommodationValue: 0,
    },
];

export const advanceLedger = [
    {
        id: 'A-001',
        workerName: 'Ramesh',
        reason: 'Medical',
        note: 'Health checkup advance',
        amount: 6000,
        recovered: 2400,
        outstanding: 3600,
        date: '2026-04-05',
        recoveryPlan: '₹800/month recovery',
        history: [
            { month: 'Apr', deducted: 800 },
            { month: 'May', deducted: 800 },
        ],
    },
    {
        id: 'A-002',
        workerName: 'Anil',
        reason: 'Wedding',
        note: 'Ceremony advance',
        amount: 10000,
        recovered: 4000,
        outstanding: 6000,
        date: '2026-03-18',
        recoveryPlan: '₹1000/month until cleared',
        history: [
            { month: 'Apr', deducted: 1000 },
            { month: 'May', deducted: 1000 },
        ],
    },
];

export const labourCostTrend = [
    { month: 'Jan', cashSalaries: 58000, benefits: 13200, bonuses: 7600, contractLabour: 6200, costPerLitre: 4.8, milkLitres: 12500, totalLabour: 85000 },
    { month: 'Feb', cashSalaries: 59000, benefits: 12800, bonuses: 8200, contractLabour: 6300, costPerLitre: 4.9, milkLitres: 12400, totalLabour: 86300 },
    { month: 'Mar', cashSalaries: 60000, benefits: 13400, bonuses: 7000, contractLabour: 6500, costPerLitre: 5.0, milkLitres: 12300, totalLabour: 86900 },
    { month: 'Apr', cashSalaries: 61000, benefits: 13600, bonuses: 7800, contractLabour: 6400, costPerLitre: 5.1, milkLitres: 12200, totalLabour: 88800 },
    { month: 'May', cashSalaries: 62000, benefits: 13800, bonuses: 8300, contractLabour: 6600, costPerLitre: 5.2, milkLitres: 12100, totalLabour: 90700 },
];

export const festivalCalendar = [
    { festival: 'Pongal', status: 'paid', date: '2026-01-15', state: 'Tamil Nadu', estimatedTotal: 18200, bonusMultiple: '2x' },
    { festival: 'Holi', status: 'upcoming', date: '2026-03-25', state: 'Uttar Pradesh', estimatedTotal: 14600, bonusMultiple: '1.5x' },
    { festival: 'Diwali', status: 'upcoming', date: '2026-11-01', state: 'All India', estimatedTotal: 21800, bonusMultiple: '2.5x' },
];

export const labourSummary = {
    totalMonthlyLabourCost: 222000,
    labourCostPerLitre: 5.2,
    prevMonthCostPerLitre: 5.7,
    daysToNextSalary: 8,
    outstandingAdvances: 9600,
    totalWorkers: workers.length,
    paidWorkers: workers.filter(w => w.salaryType !== 'No Cash Payment').length,
    familyWorkers: workers.filter(w => w.salaryType === 'No Cash Payment').length,
    labourAsPercentOfIncome: 18,
    familyLabourValue: 9800,
    totalTrueLabourCost: salaryRecords.reduce((sum, r) => sum + r.totalTrueCost, 0),
};
