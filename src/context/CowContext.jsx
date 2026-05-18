// ============================================
// DairyAI — Cow Context (reactive cow data for all pages)
// ============================================
import React, { createContext, useContext } from 'react';
import { useCowStore } from '../data/useCowStore';

const CowContext = createContext();

/**
 * Compute farmStats dynamically from real cow data
 */
function computeFarmStats(cows) {
    const totalCows = cows.length;
    const healthyCows = cows.filter(c => c.status === 'Healthy').length;
    const atRiskCows = cows.filter(c => c.status === 'At Risk').length;
    const criticalCows = cows.filter(c => c.status === 'Critical').length;
    const totalDailyYield = cows.reduce((sum, c) => sum + (Number(c.dailyYield) || 0), 0);
    const avgDailyYield = totalCows > 0 ? totalDailyYield / totalCows : 0;

    // Weighted average milk price from dataset
    const totalIncome = cows.reduce((sum, c) => sum + (Number(c.income) || 0), 0);
    const milkPrice = totalDailyYield > 0
        ? parseFloat((totalIncome / totalDailyYield).toFixed(0)) || 35
        : 35;

    const dailyRevenue = totalIncome > 0 ? totalIncome : totalDailyYield * milkPrice;

    // Expense & profit calculations from dataset
    const totalDailyFeedCost = cows.reduce((sum, c) => sum + (Number(c.feedCost) || 0), 0);
    const totalDailyMedicineCost = cows.reduce((sum, c) => sum + (Number(c.medicineCost) || 0), 0);
    const totalDailyLabourCost = cows.reduce((sum, c) => sum + (Number(c.labourCost) || 0), 0);
    const totalDailyExpense = cows.reduce((sum, c) => sum + (Number(c.totalExpense) || 0), 0);
    const totalDailyProfit = cows.reduce((sum, c) => sum + (Number(c.profit) || 0), 0);

    const avgHealthScore = totalCows > 0
        ? Math.round(cows.reduce((sum, c) => sum + (Number(c.healthScore) || 0), 0) / totalCows)
        : 0;

    const avgFeedScore = totalCows > 0
        ? parseFloat((cows.reduce((sum, c) => sum + (Number(c.feedScore) || 0), 0) / totalCows).toFixed(1))
        : 0;

    const profitableCows = cows.filter(c => (Number(c.profit) || 0) > 0).length;
    const lossMakingCows = cows.filter(c => (Number(c.profit) || 0) < 0).length;

    return {
        totalCows,
        healthyCows,
        atRiskCows,
        criticalCows,
        avgDailyYield: parseFloat(avgDailyYield.toFixed(1)),
        totalDailyYield: parseFloat(totalDailyYield.toFixed(1)),
        farmHealthScore: avgHealthScore,
        dailyRevenue: parseFloat(dailyRevenue.toFixed(0)),
        dailyFeedCost: parseFloat(totalDailyFeedCost.toFixed(0)),
        dailyMedicineCost: parseFloat(totalDailyMedicineCost.toFixed(0)),
        dailyLabourCost: parseFloat(totalDailyLabourCost.toFixed(0)),
        dailyExpense: parseFloat(totalDailyExpense.toFixed(0)),
        dailyProfit: parseFloat(totalDailyProfit.toFixed(0)),
        milkPrice,
        avgFeedScore,
        profitableCows,
        lossMakingCows,
    };
}

export function CowProvider({ children }) {
    const { cows, addCow, updateCow, deleteCow, loadDataset, clearAll } = useCowStore();
    const farmStats = computeFarmStats(cows);

    return (
        <CowContext.Provider value={{ cows, farmStats, addCow, updateCow, deleteCow, loadDataset, clearAll }}>
            {children}
        </CowContext.Provider>
    );
}

export function useCows() {
    const context = useContext(CowContext);
    if (!context) {
        throw new Error('useCows must be used within a CowProvider');
    }
    return context;
}
