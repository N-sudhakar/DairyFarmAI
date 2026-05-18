// ============================================
// DairyAI — Cow Store (localStorage persistence)
// Starts empty — farmers add their own data
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { DATASET_COWS } from './datasetCows';

const STORAGE_KEY = 'dairyai_cows';

/**
 * Read cows from localStorage (plain function — works outside React)
 */
export function getCows() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

/**
 * Save cows to localStorage
 */
function saveCows(cows) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cows));
    window.dispatchEvent(new Event('dairyai_cows_updated'));
}

/**
 * Generate the next cow ID (COW-1101, COW-1102, ...)
 */
function generateId(cows) {
    if (cows.length === 0) return 'COW-101';
    const maxNum = cows.reduce((max, cow) => {
        const num = parseInt(cow.id.replace(/\D/g, ''), 10) || 0;
        return num > max ? num : max;
    }, 0);
    return `COW-${maxNum + 1}`;
}

/**
 * React hook for cow CRUD with localStorage persistence
 */
export function useCowStore() {
    const [cows, setCows] = useState(getCows);

    // Listen for updates from other components / tabs
    useEffect(() => {
        const handleUpdate = () => setCows(getCows());
        window.addEventListener('dairyai_cows_updated', handleUpdate);
        window.addEventListener('storage', handleUpdate);
        return () => {
            window.removeEventListener('dairyai_cows_updated', handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    const addCow = useCallback((cowData) => {
        const current = getCows();
        const newCow = {
            id: generateId(current),
            name: cowData.name || 'Unnamed',
            breed: cowData.breed || 'Non-Descript',
            breedEncoded: cowData.breedEncoded || 6,
            age: Number(cowData.age) || 3,
            weight: Number(cowData.weight) || 300,
            parity: Number(cowData.parity) || 1,
            dim: Number(cowData.dim) || 0,
            lastCalving: cowData.lastCalving || null,
            status: cowData.status || 'Healthy',
            healthScore: Number(cowData.healthScore) || 75,
            dailyYield: Number(cowData.dailyYield) || 0,
            morningMilk: Number(cowData.morningMilk) || 0,
            eveningMilk: Number(cowData.eveningMilk) || 0,
            prevDay1: Number(cowData.prevDay1) || 0,
            prevDay2: Number(cowData.prevDay2) || 0,
            prevDay3: Number(cowData.prevDay3) || 0,
            feedScore: Number(cowData.feedScore) || 3,
            feedCost: Number(cowData.feedCost) || 0,
            medicineCost: Number(cowData.medicineCost) || 0,
            labourCost: Number(cowData.labourCost) || 0,
            totalExpense: Number(cowData.totalExpense) || 0,
            milkPrice: Number(cowData.milkPrice) || 35,
            income: Number(cowData.income) || 0,
            profit: Number(cowData.profit) || 0,
            month: Number(cowData.month) || (new Date().getMonth() + 1),
            seasonCode: Number(cowData.seasonCode) || 0,
            predictedYield: Number(cowData.predictedYield) || 0,
            temperature: Number(cowData.temperature) || 38.5,
            scc: Number(cowData.scc) || 150000,
            diseases: cowData.diseases || {
                mastitis: 0.05,
                lameness: 0.03,
                ketosis: 0.02,
                respiratory: 0.01,
                metabolic: 0.02,
            },
            createdAt: new Date().toISOString(),
        };
        const updated = [...current, newCow];
        saveCows(updated);
        setCows(updated);
        return newCow;
    }, []);

    const updateCow = useCallback((id, updates) => {
        const current = getCows();
        const updated = current.map(cow =>
            cow.id === id ? { ...cow, ...updates } : cow
        );
        saveCows(updated);
        setCows(updated);
    }, []);

    const deleteCow = useCallback((id) => {
        const current = getCows();
        const updated = current.filter(cow => cow.id !== id);
        saveCows(updated);
        setCows(updated);
    }, []);

    /**
     * Load the 1000-cow dataset (demo/import)
     */
    const loadDataset = useCallback(() => {
        saveCows(DATASET_COWS);
        setCows(DATASET_COWS);
    }, []);

    /**
     * Clear all cows (reset to empty)
     */
    const clearAll = useCallback(() => {
        saveCows([]);
        setCows([]);
    }, []);

    return { cows, addCow, updateCow, deleteCow, loadDataset, clearAll };
}
