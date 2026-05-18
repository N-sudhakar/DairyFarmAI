import React, { useState, useEffect, useMemo } from 'react';
import {
    Wheat, Pill, Users, Milk, Star, Plus, Save, Trash2, Edit3, X, Check,
    TrendingUp, TrendingDown, Calendar, IndianRupee, AlertCircle, ChevronDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const STORAGE_KEY = 'dairy_farm_costs';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function getStoredRecords() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch { return []; }
}

function saveRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = display;
        const end = value;
        if (start === end) return;
        const duration = 600;
        const startTime = Date.now();
        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setDisplay(start + (end - start) * ease);
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [value]);
    return <>{prefix}{Number(display).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{suffix}</>;
}

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

const EMPTY_FORM = {
    month: MONTHS[currentMonth],
    year: String(currentYear),
    feedCost: '',
    medicineCost: '',
    labourCost: '',
    milkPricePerLitre: '',
    feedScore: '3',
};

export default function FarmCosts() {
    const { t } = useLanguage();
    const [records, setRecords] = useState(getStoredRecords);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => { saveRecords(records); }, [records]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Summary stats
    const stats = useMemo(() => {
        if (records.length === 0) return { totalFeed: 0, totalMedicine: 0, totalLabour: 0, avgMilkPrice: 0, avgFeedScore: 0, totalCost: 0 };
        const totalFeed = records.reduce((s, r) => s + r.feedCost, 0);
        const totalMedicine = records.reduce((s, r) => s + r.medicineCost, 0);
        const totalLabour = records.reduce((s, r) => s + r.labourCost, 0);
        const avgMilkPrice = records.reduce((s, r) => s + r.milkPricePerLitre, 0) / records.length;
        const avgFeedScore = records.reduce((s, r) => s + r.feedScore, 0) / records.length;
        return { totalFeed, totalMedicine, totalLabour, avgMilkPrice, avgFeedScore, totalCost: totalFeed + totalMedicine + totalLabour };
    }, [records]);

    // Latest vs previous month trend
    const trend = useMemo(() => {
        if (records.length < 2) return null;
        const sorted = [...records].sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return MONTHS.indexOf(b.month) - MONTHS.indexOf(a.month);
        });
        const latest = sorted[0];
        const prev = sorted[1];
        const latestTotal = latest.feedCost + latest.medicineCost + latest.labourCost;
        const prevTotal = prev.feedCost + prev.medicineCost + prev.labourCost;
        const diff = latestTotal - prevTotal;
        const pct = prevTotal > 0 ? ((diff / prevTotal) * 100).toFixed(1) : 0;
        return { diff, pct, isUp: diff > 0 };
    }, [records]);

    const validate = () => {
        const errs = {};
        if (!form.feedCost || Number(form.feedCost) < 0) errs.feedCost = 'Enter valid feed cost';
        if (!form.medicineCost && form.medicineCost !== '0') errs.medicineCost = 'Enter medicine cost';
        if (!form.labourCost || Number(form.labourCost) < 0) errs.labourCost = 'Enter valid labour cost';
        if (!form.milkPricePerLitre || Number(form.milkPricePerLitre) <= 0) errs.milkPricePerLitre = 'Enter valid milk price';

        // Check duplicate month/year (only for new records)
        if (!editingId) {
            const exists = records.find(r => r.month === form.month && r.year === form.year);
            if (exists) errs.month = 'Record for this month already exists';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        const record = {
            id: editingId || `FC-${Date.now()}`,
            month: form.month,
            year: form.year,
            feedCost: Number(form.feedCost),
            medicineCost: Number(form.medicineCost),
            labourCost: Number(form.labourCost),
            milkPricePerLitre: Number(form.milkPricePerLitre),
            feedScore: Number(form.feedScore),
            totalCost: Number(form.feedCost) + Number(form.medicineCost) + Number(form.labourCost),
            createdAt: new Date().toISOString(),
        };

        if (editingId) {
            setRecords(records.map(r => r.id === editingId ? record : r));
            showToast(`${form.month} ${form.year} record updated`);
        } else {
            setRecords([...records, record]);
            showToast(`${form.month} ${form.year} record added`);
        }
        setShowModal(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
    };

    const handleEdit = (record) => {
        setEditingId(record.id);
        setForm({
            month: record.month,
            year: String(record.year),
            feedCost: String(record.feedCost),
            medicineCost: String(record.medicineCost),
            labourCost: String(record.labourCost),
            milkPricePerLitre: String(record.milkPricePerLitre),
            feedScore: String(record.feedScore),
        });
        setErrors({});
        setShowModal(true);
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;
        setRecords(records.filter(r => r.id !== deleteConfirm.id));
        showToast(`${deleteConfirm.month} ${deleteConfirm.year} record deleted`, 'warning');
        setDeleteConfirm(null);
    };

    const handleOpenAdd = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setShowModal(true);
    };

    // Sort records: newest first
    const sortedRecords = useMemo(() => {
        return [...records].sort((a, b) => {
            if (a.year !== b.year) return Number(b.year) - Number(a.year);
            return MONTHS.indexOf(b.month) - MONTHS.indexOf(a.month);
        });
    }, [records]);

    const feedScoreLabel = (score) => {
        if (score >= 5) return 'Excellent';
        if (score >= 4) return 'Good';
        if (score >= 3) return 'Average';
        if (score >= 2) return 'Below Avg';
        return 'Poor';
    };

    const feedScoreColor = (score) => {
        if (score >= 4) return '#10b981';
        if (score >= 3) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="animate-fade-in">
            {/* Summary Cards */}
            <div className="grid-4 stagger mb-24">
                <div className="stat-card green">
                    <div className="stat-card-icon"><Wheat size={20} /></div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={stats.totalFeed} prefix="₹" />
                    </div>
                    <div className="stat-card-label">Total Feed Cost</div>
                    <div className="stat-card-trend">{records.length} month(s) recorded</div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-card-icon"><Pill size={20} /></div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={stats.totalMedicine} prefix="₹" />
                    </div>
                    <div className="stat-card-label">Total Medicine Cost</div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-card-icon"><Users size={20} /></div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={stats.totalLabour} prefix="₹" />
                    </div>
                    <div className="stat-card-label">Total Labour Cost</div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-card-icon"><Milk size={20} /></div>
                    <div className="stat-card-value">
                        ₹{stats.avgMilkPrice.toFixed(1)}<span style={{fontSize:'12px',opacity:0.7}}>/L</span>
                    </div>
                    <div className="stat-card-label">Avg Milk Price</div>
                    {trend && (
                        <div className={`stat-card-trend ${trend.isUp ? '' : 'up'}`}>
                            {trend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {' '}{trend.isUp ? '+' : ''}₹{trend.diff.toLocaleString('en-IN')} ({trend.pct}%) vs prev month
                        </div>
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <div className="card mb-24" style={{ padding: '12px 16px' }}>
                <div className="cm-toolbar">
                    <div className="cm-toolbar-left">
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                            📋 Monthly Farm Cost Records
                        </h3>
                    </div>
                    <button className="cm-add-btn" onClick={handleOpenAdd}>
                        <Plus size={16} />
                        <span>Add Monthly Record</span>
                    </button>
                </div>
            </div>

            {/* Records Table */}
            {sortedRecords.length > 0 ? (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="cm-table-wrapper">
                        <table className="cm-table">
                            <thead>
                                <tr>
                                    <th>Month / Year</th>
                                    <th>🌾 Feed Cost</th>
                                    <th>💊 Medicine Cost</th>
                                    <th>👷 Labour Cost</th>
                                    <th>🥛 Milk Price/L</th>
                                    <th>⭐ Feed Score</th>
                                    <th>💰 Total Cost</th>
                                    <th style={{ textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedRecords.map(rec => (
                                    <tr key={rec.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Calendar size={14} color="var(--text-muted)" />
                                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {rec.month} {rec.year}
                                                </span>
                                            </div>
                                        </td>
                                        <td>₹{rec.feedCost.toLocaleString('en-IN')}</td>
                                        <td>₹{rec.medicineCost.toLocaleString('en-IN')}</td>
                                        <td>₹{rec.labourCost.toLocaleString('en-IN')}</td>
                                        <td>
                                            <span style={{ fontWeight: 600, color: '#10b981' }}>
                                                ₹{rec.milkPricePerLitre}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                                                background: `${feedScoreColor(rec.feedScore)}15`,
                                                color: feedScoreColor(rec.feedScore),
                                            }}>
                                                <Star size={12} /> {rec.feedScore} — {feedScoreLabel(rec.feedScore)}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                                                ₹{rec.totalCost.toLocaleString('en-IN')}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="cm-actions">
                                                <button className="cm-action-btn edit" onClick={() => handleEdit(rec)} title="Edit">
                                                    <Edit3 size={14} />
                                                </button>
                                                <button className="cm-action-btn delete" onClick={() => setDeleteConfirm(rec)} title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="cm-table-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{sortedRecords.length} record(s)</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            Grand Total: ₹{stats.totalCost.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="cm-empty-hero">
                    <div className="cm-empty-icon">📊</div>
                    <h3>No Cost Records Yet</h3>
                    <p>Start tracking your monthly farm expenses — feed, medicine, labour costs and milk pricing — all in one place.</p>
                    <button className="cm-add-btn" onClick={handleOpenAdd} style={{ margin: '20px auto 0' }}>
                        <Plus size={16} />
                        <span>Add First Monthly Record</span>
                    </button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="cm-modal-overlay" onClick={() => { setShowModal(false); setEditingId(null); }}>
                    <div className="cm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
                        <div className="cm-modal-header">
                            <h3>{editingId ? 'Edit Monthly Record' : 'Add Monthly Record'}</h3>
                            <button className="cm-close-btn" onClick={() => { setShowModal(false); setEditingId(null); }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="cm-modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {/* Month & Year */}
                            <div className="cm-form-row">
                                <div className="cm-form-group">
                                    <label>Month <span className="cm-required">*</span></label>
                                    <div className="cm-select-wrapper">
                                        <select
                                            className="cm-select"
                                            value={form.month}
                                            onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                                        >
                                            {MONTHS.map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="cm-select-icon" />
                                    </div>
                                    {errors.month && <span className="cm-field-error"><AlertCircle size={12} /> {errors.month}</span>}
                                </div>
                                <div className="cm-form-group">
                                    <label>Year <span className="cm-required">*</span></label>
                                    <div className="cm-select-wrapper">
                                        <select
                                            className="cm-select"
                                            value={form.year}
                                            onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                                        >
                                            {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="cm-select-icon" />
                                    </div>
                                </div>
                            </div>

                            {/* Feed Cost */}
                            <div className="cm-form-divider">🌾 Cost Details</div>
                            <div className="cm-form-row">
                                <div className="cm-form-group">
                                    <label>Feed Cost / Month (₹) <span className="cm-required">*</span></label>
                                    <input
                                        type="number" className={`cm-input ${errors.feedCost ? 'error' : ''}`}
                                        placeholder="e.g. 15000"
                                        min="0" value={form.feedCost}
                                        onChange={e => setForm(f => ({ ...f, feedCost: e.target.value }))}
                                    />
                                    {errors.feedCost && <span className="cm-field-error"><AlertCircle size={12} /> {errors.feedCost}</span>}
                                </div>
                                <div className="cm-form-group">
                                    <label>Medicine Cost / Month (₹) <span className="cm-required">*</span></label>
                                    <input
                                        type="number" className={`cm-input ${errors.medicineCost ? 'error' : ''}`}
                                        placeholder="e.g. 2000"
                                        min="0" value={form.medicineCost}
                                        onChange={e => setForm(f => ({ ...f, medicineCost: e.target.value }))}
                                    />
                                    {errors.medicineCost && <span className="cm-field-error"><AlertCircle size={12} /> {errors.medicineCost}</span>}
                                </div>
                            </div>

                            <div className="cm-form-row">
                                <div className="cm-form-group">
                                    <label>Labour Cost / Month (₹) <span className="cm-required">*</span></label>
                                    <input
                                        type="number" className={`cm-input ${errors.labourCost ? 'error' : ''}`}
                                        placeholder="e.g. 8000"
                                        min="0" value={form.labourCost}
                                        onChange={e => setForm(f => ({ ...f, labourCost: e.target.value }))}
                                    />
                                    {errors.labourCost && <span className="cm-field-error"><AlertCircle size={12} /> {errors.labourCost}</span>}
                                </div>
                                <div className="cm-form-group">
                                    <label>Milk Price / Litre (₹) <span className="cm-required">*</span></label>
                                    <input
                                        type="number" className={`cm-input ${errors.milkPricePerLitre ? 'error' : ''}`}
                                        placeholder="e.g. 35"
                                        min="1" max="100" step="0.5" value={form.milkPricePerLitre}
                                        onChange={e => setForm(f => ({ ...f, milkPricePerLitre: e.target.value }))}
                                    />
                                    {errors.milkPricePerLitre && <span className="cm-field-error"><AlertCircle size={12} /> {errors.milkPricePerLitre}</span>}
                                </div>
                            </div>

                            {/* Feed Score */}
                            <div className="cm-form-divider">⭐ Feed Quality Score</div>
                            <div className="cm-form-group" style={{ marginBottom: '16px' }}>
                                <label>Feed Score (1-5)</label>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                    {[1, 2, 3, 4, 5].map(fs => (
                                        <button
                                            key={fs}
                                            type="button"
                                            onClick={() => setForm(f => ({ ...f, feedScore: String(fs) }))}
                                            style={{
                                                width: '48px', height: '48px', borderRadius: '12px', border: '2px solid',
                                                borderColor: form.feedScore === String(fs) ? feedScoreColor(fs) : 'rgba(245,240,232,0.1)',
                                                background: form.feedScore === String(fs) ? `${feedScoreColor(fs)}18` : 'transparent',
                                                color: form.feedScore === String(fs) ? feedScoreColor(fs) : 'var(--text-secondary)',
                                                fontWeight: 800, fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1px',
                                            }}
                                        >
                                            <span>{fs}</span>
                                            <span style={{ fontSize: '7px', fontWeight: 600, opacity: 0.8 }}>
                                                {fs === 1 ? 'Poor' : fs === 2 ? 'Low' : fs === 3 ? 'Avg' : fs === 4 ? 'Good' : 'Best'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="cm-modal-footer">
                            <button className="cm-btn-secondary" onClick={() => { setShowModal(false); setEditingId(null); }}>
                                Cancel
                            </button>
                            <button className="cm-btn-primary" onClick={handleSave}>
                                <Save size={16} />
                                {editingId ? 'Save Changes' : 'Add Record'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="cm-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="cm-modal cm-modal-small" onClick={e => e.stopPropagation()}>
                        <div className="cm-delete-content">
                            <div className="cm-delete-icon">
                                <Trash2 size={28} />
                            </div>
                            <h3>Delete Record?</h3>
                            <p>Are you sure you want to delete the record for <strong>{deleteConfirm.month} {deleteConfirm.year}</strong>?</p>
                            <p className="cm-delete-warning">This action cannot be undone.</p>
                            <div className="cm-delete-actions">
                                <button className="cm-btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                                <button className="cm-btn-danger" onClick={handleDelete}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`cm-toast ${toast.type}`}>
                    {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
}
