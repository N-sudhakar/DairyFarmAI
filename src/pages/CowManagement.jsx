import React, { useState, useMemo } from 'react';
import {
    Plus, Search, Edit3, Trash2, X, Check, AlertCircle,
    ChevronDown, Calendar, Weight, Thermometer, Heart, Milk,
    Filter, Download, Upload, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useCowStore } from '../data/useCowStore';
import { BREED_DATA } from '../data/predictionDatasets';
import { useLanguage } from '../context/LanguageContext';

const BREED_OPTIONS = Object.keys(BREED_DATA);
const STATUS_OPTIONS = ['Healthy', 'At Risk', 'Critical'];
const FEED_SCORE_OPTIONS = [1, 2, 3, 4, 5];

const ROWS_PER_PAGE = 50;

const EMPTY_FORM = {
    name: '',
    breed: 'Jersey',
    age: '',
    weight: '',

    dim: '',
    lastCalving: '',
    status: 'Healthy',
    healthScore: '75',
    dailyYield: '',
    morningMilk: '',
    eveningMilk: '',
    feedScore: '3',

    temperature: '38.5',
};

export default function CowManagement() {
    const { t } = useLanguage();
    const { cows, addCow, updateCow, deleteCow } = useCowStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingCow, setEditingCow] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [toast, setToast] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortField, setSortField] = useState('id');
    const [sortDir, setSortDir] = useState('asc');
    const [page, setPage] = useState(0);

    // Filtered and sorted cows
    const filteredCows = useMemo(() => {
        let result = cows.filter(cow => {
            const matchSearch = !search ||
                (cow.name || '').toLowerCase().includes(search.toLowerCase()) ||
                (cow.id || '').toLowerCase().includes(search.toLowerCase()) ||
                (cow.breed || '').toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === 'All' || cow.status === statusFilter;
            return matchSearch && matchStatus;
        });
        result.sort((a, b) => {
            let aVal = a[sortField], bVal = b[sortField];
            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
            }
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return result;
    }, [cows, search, statusFilter, sortField, sortDir]);

    // Pagination
    const totalPages = Math.ceil(filteredCows.length / ROWS_PER_PAGE);
    const pagedCows = filteredCows.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

    // Stats
    const stats = useMemo(() => ({
        total: cows.length,
        healthy: cows.filter(c => c.status === 'Healthy').length,
        atRisk: cows.filter(c => c.status === 'At Risk').length,
        critical: cows.filter(c => c.status === 'Critical').length,
        totalYield: parseFloat(cows.reduce((s, c) => s + (Number(c.dailyYield) || 0), 0).toFixed(1)),
        totalProfit: parseFloat(cows.reduce((s, c) => s + (Number(c.profit) || 0), 0).toFixed(0)),
    }), [cows]);

    // Toast helper
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Open add modal
    const handleAdd = () => {
        setEditingCow(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setModalOpen(true);
    };

    // Open edit modal
    const handleEdit = (cow) => {
        setEditingCow(cow);
        setForm({
            name: cow.name || '',
            breed: cow.breed || 'Jersey',
            age: String(cow.age || ''),
            weight: String(cow.weight || ''),

            dim: String(cow.dim || ''),
            lastCalving: cow.lastCalving || '',
            status: cow.status || 'Healthy',
            healthScore: String(cow.healthScore || '75'),
            dailyYield: String(cow.dailyYield || ''),
            morningMilk: String(cow.morningMilk || ''),
            eveningMilk: String(cow.eveningMilk || ''),
            feedScore: String(cow.feedScore || '3'),
            temperature: String(cow.temperature || '38.5'),
        });
        setErrors({});
        setModalOpen(true);
    };

    // Validate form
    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = t('fieldRequired') || 'Required';
        if (!form.age || Number(form.age) < 0 || Number(form.age) > 25) errs.age = t('invalidAge') || 'Enter valid age (0-25)';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // Save cow
    const handleSave = () => {
        if (!validate()) return;
        const morning = Number(form.morningMilk) || 0;
        const evening = Number(form.eveningMilk) || 0;
        const totalYield = morning + evening || Number(form.dailyYield) || 0;

        const cowData = {
            name: form.name.trim(),
            breed: form.breed,
            age: Number(form.age),
            weight: Number(form.weight) || 300,
            dim: Number(form.dim) || 0,
            lastCalving: form.lastCalving || null,
            status: form.status,
            healthScore: Number(form.healthScore) || 75,
            dailyYield: totalYield,
            morningMilk: morning,
            eveningMilk: evening,
            feedScore: Number(form.feedScore) || 3,
            temperature: Number(form.temperature) || 38.5,
        };

        if (editingCow) {
            updateCow(editingCow.id, cowData);
            showToast(t('cowUpdated') || `${cowData.name} updated successfully`);
        } else {
            addCow(cowData);
            showToast(t('cowAdded') || `${cowData.name} added successfully`);
        }
        setModalOpen(false);
    };

    // Delete cow
    const handleDelete = () => {
        if (!deleteConfirm) return;
        deleteCow(deleteConfirm.id);
        showToast(t('cowDeleted') || `${deleteConfirm.name} deleted`, 'warning');
        setDeleteConfirm(null);
    };

    // Sort handler
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const statusColor = (status) => {
        if (status === 'Healthy') return 'var(--color-success)';
        if (status === 'At Risk') return 'var(--color-warning)';
        return 'var(--color-danger)';
    };

    const statusBg = (status) => {
        if (status === 'Healthy') return 'rgba(16,185,129,0.12)';
        if (status === 'At Risk') return 'rgba(245,158,11,0.12)';
        return 'rgba(239,68,68,0.12)';
    };

    const profitColor = (val) => val >= 0 ? '#10b981' : '#ef4444';

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDir === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <div className="animate-fade-in">
            {/* Stats Cards */}
            <div className="grid-4 stagger mb-24">
                <div className="stat-card blue">
                    <div className="stat-card-icon">🐄</div>
                    <div className="stat-card-value">{stats.total}</div>
                    <div className="stat-card-label">{t('totalCows') || 'Total Cows'}</div>
                </div>
                <div className="stat-card green">
                    <div className="stat-card-icon"><Heart size={20} /></div>
                    <div className="stat-card-value">{stats.healthy}</div>
                    <div className="stat-card-label">{t('healthyCows') || 'Healthy'}</div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-card-icon">🥛</div>
                    <div className="stat-card-value">{stats.totalYield}<span style={{fontSize:'12px',opacity:0.7}}>L</span></div>
                    <div className="stat-card-label">{t('totalDailyYield') || 'Total Yield'}</div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-card-icon">💰</div>
                    <div className="stat-card-value" style={{color: profitColor(stats.totalProfit)}}>₹{Number(stats.totalProfit).toLocaleString()}</div>
                    <div className="stat-card-label">{t('dailyProfit') || 'Daily Profit'}</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="card mb-24" style={{ padding: '12px 16px' }}>
                <div className="cm-toolbar">
                    <div className="cm-toolbar-left">
                        <div className="header-search" style={{ width: '240px' }}>
                            <Search size={14} color="var(--text-muted)" />
                            <input
                                placeholder={t('searchCows') || 'Search by name, ID, breed...'}
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(0); }}
                            />
                        </div>
                        <div className="tab-group">
                            {['All', ...STATUS_OPTIONS].map(s => (
                                <button
                                    key={s}
                                    className={`tab-btn ${statusFilter === s ? 'active' : ''}`}
                                    onClick={() => { setStatusFilter(s); setPage(0); }}
                                >
                                    {s === 'All' ? (t('all') || 'All') : s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="cm-add-btn" onClick={handleAdd}>
                        <Plus size={16} />
                        <span>{t('addNewCow') || 'Add New Cow'}</span>
                    </button>
                </div>
            </div>

            {/* Cow Table */}
            {filteredCows.length > 0 ? (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="cm-table-wrapper">
                        <table className="cm-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('id')} className="cm-sortable">
                                        {t('tagId') || 'Tag ID'}<SortIcon field="id" />
                                    </th>
                                    <th onClick={() => handleSort('name')} className="cm-sortable">
                                        {t('cowName') || 'Name'}<SortIcon field="name" />
                                    </th>
                                    <th onClick={() => handleSort('breed')} className="cm-sortable">
                                        {t('breed') || 'Breed'}<SortIcon field="breed" />
                                    </th>
                                    <th onClick={() => handleSort('age')} className="cm-sortable">
                                        {t('age') || 'Age'}<SortIcon field="age" />
                                    </th>

                                    <th onClick={() => handleSort('dim')} className="cm-sortable">
                                        DIM<SortIcon field="dim" />
                                    </th>
                                    <th onClick={() => handleSort('dailyYield')} className="cm-sortable">
                                        {t('dailyYield') || 'Yield'}<SortIcon field="dailyYield" />
                                    </th>
                                    <th onClick={() => handleSort('feedScore')} className="cm-sortable">
                                        {t('feedScore') || 'Feed'}<SortIcon field="feedScore" />
                                    </th>
                                    <th onClick={() => handleSort('profit')} className="cm-sortable">
                                        {t('profitPerDay') || 'Profit'}<SortIcon field="profit" />
                                    </th>
                                    <th onClick={() => handleSort('status')} className="cm-sortable">
                                        {t('status') || 'Status'}<SortIcon field="status" />
                                    </th>
                                    <th style={{ textAlign: 'center' }}>{t('actions') || 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedCows.map(cow => (
                                    <tr key={cow.id}>
                                        <td>
                                            <span className="cm-tag-id">{cow.id}</span>
                                        </td>
                                        <td>
                                            <div className="cm-cow-name-cell">
                                                <div className="cm-cow-avatar">🐄</div>
                                                <span className="cm-cow-name">{cow.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="cm-breed-badge">{cow.breed}</span></td>
                                        <td>{cow.age} {t('yrs') || 'yrs'}</td>

                                        <td><span style={{opacity:0.8}}>{cow.dim || '—'}</span></td>
                                        <td><strong>{cow.dailyYield || 0}</strong> L</td>
                                        <td>
                                            <span style={{
                                                display:'inline-block',width:'22px',height:'22px',lineHeight:'22px',
                                                textAlign:'center',borderRadius:'6px',fontSize:'11px',fontWeight:700,
                                                background: cow.feedScore >= 4 ? 'rgba(16,185,129,0.15)' : cow.feedScore >= 3 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                                                color: cow.feedScore >= 4 ? '#10b981' : cow.feedScore >= 3 ? '#f59e0b' : '#ef4444',
                                            }}>{cow.feedScore || '—'}</span>
                                        </td>
                                        <td>
                                            <span style={{fontWeight:600, color: profitColor(cow.profit || 0), fontFamily:'Outfit'}}>
                                                {(cow.profit || 0) >= 0 ? '+' : ''}₹{(cow.profit || 0).toFixed(0)}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className="cm-status-pill"
                                                style={{ color: statusColor(cow.status), background: statusBg(cow.status) }}
                                            >
                                                {cow.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="cm-actions">
                                                <button className="cm-action-btn edit" onClick={() => handleEdit(cow)} title={t('edit') || 'Edit'}>
                                                    <Edit3 size={14} />
                                                </button>
                                                <button className="cm-action-btn delete" onClick={() => setDeleteConfirm(cow)} title={t('delete') || 'Delete'}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="cm-table-footer" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span>{t('showing') || 'Showing'} {page * ROWS_PER_PAGE + 1}–{Math.min((page + 1) * ROWS_PER_PAGE, filteredCows.length)} {t('of') || 'of'} {filteredCows.length} {t('cows') || 'cows'}</span>
                        {totalPages > 1 && (
                            <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                                <button className="cm-action-btn edit" disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{opacity:page===0?0.3:1}}>
                                    <ChevronLeft size={16} />
                                </button>
                                <span style={{fontSize:'12px',color:'var(--text-secondary)',minWidth:'60px',textAlign:'center'}}>
                                    Page {page + 1} / {totalPages}
                                </span>
                                <button className="cm-action-btn edit" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={{opacity:page>=totalPages-1?0.3:1}}>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : cows.length === 0 ? (
                <div className="cm-empty-hero">
                    <div className="cm-empty-icon">🐄</div>
                    <h3>{t('noCowsYet') || 'No Cows Registered Yet'}</h3>
                    <p>{t('noCowsDesc') || 'Add your first cow to start tracking health, milk production, and get AI-powered predictions.'}</p>
                    <button className="cm-add-btn" onClick={handleAdd} style={{ margin: '20px auto 0' }}>
                        <Plus size={16} />
                        <span>{t('addFirstCow') || 'Add Your First Cow'}</span>
                    </button>
                </div>
            ) : (
                <div className="cm-empty-hero" style={{ padding: '40px' }}>
                    <p style={{ color: 'var(--text-muted)' }}>{t('noResults') || 'No cows match your search'}</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            {modalOpen && (
                <div className="cm-modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="cm-modal" onClick={e => e.stopPropagation()} style={{maxWidth:'600px'}}>
                        <div className="cm-modal-header">
                            <h3>{editingCow ? (t('editCow') || 'Edit Cow') : (t('addNewCow') || 'Add New Cow')}</h3>
                            <button className="cm-close-btn" onClick={() => setModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="cm-modal-body" style={{maxHeight:'60vh',overflowY:'auto'}}>
                            {/* Row 1: Name + Breed */}
                            <div className="cm-form-row">
                                <div className="cm-form-group">
                                    <label>{t('cowName') || 'Cow Name'} <span className="cm-required">*</span></label>
                                    <input
                                        type="text"
                                        className={`cm-input ${errors.name ? 'error' : ''}`}
                                        placeholder={t('enterCowName') || 'e.g. Lakshmi, Gauri...'}
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    />
                                    {errors.name && <span className="cm-field-error">{errors.name}</span>}
                                </div>
                                <div className="cm-form-group">
                                    <label>{t('breed') || 'Breed'}</label>
                                    <div className="cm-select-wrapper">
                                        <select
                                            className="cm-select"
                                            value={form.breed}
                                            onChange={e => setForm(f => ({ ...f, breed: e.target.value }))}
                                        >
                                            {BREED_OPTIONS.map(b => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="cm-select-icon" />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Age + Weight */}
                            <div className="cm-form-row">
                                <div className="cm-form-group">
                                    <label>{t('age') || 'Age'} ({t('years') || 'years'}) <span className="cm-required">*</span></label>
                                    <input
                                        type="number"
                                        className={`cm-input ${errors.age ? 'error' : ''}`}
                                        placeholder="e.g. 4"
                                        min="0" max="25" step="0.1"
                                        value={form.age}
                                        onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                                    />
                                    {errors.age && <span className="cm-field-error">{errors.age}</span>}
                                </div>
                                <div className="cm-form-group">
                                    <label>{t('weight') || 'Weight'} (kg)</label>
                                    <input
                                        type="number"
                                        className="cm-input"
                                        placeholder="e.g. 350"
                                        min="50" max="1000"
                                        value={form.weight}
                                        onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Row 3: DIM */}
                            <div className="cm-form-row">
                                <div className="cm-form-group">
                                    <label>DIM ({t('daysInMilk') || 'Days in Milk'})</label>
                                    <input
                                        type="number"
                                        className="cm-input"
                                        placeholder="e.g. 120"
                                        min="0" max="365"
                                        value={form.dim}
                                        onChange={e => setForm(f => ({ ...f, dim: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Row 4: Calving Date + Status */}
                            <div className="cm-form-row">
                                <div className="cm-form-group">
                                    <label>{t('lastCalvingDate') || 'Last Calving Date'}</label>
                                    <input
                                        type="date"
                                        className="cm-input"
                                        value={form.lastCalving}
                                        onChange={e => setForm(f => ({ ...f, lastCalving: e.target.value }))}
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label>{t('healthStatus') || 'Health Status'}</label>
                                    <div className="cm-select-wrapper">
                                        <select
                                            className="cm-select"
                                            value={form.status}
                                            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                        >
                                            {STATUS_OPTIONS.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={14} className="cm-select-icon" />
                                    </div>
                                </div>
                            </div>

                            {/* Milk Section */}
                            <div className="cm-form-divider">🥛 {t('milkRecord') || 'Milk Record'}</div>
                            <div className="cm-form-row triple">
                                <div className="cm-form-group">
                                    <label>{t('morningMilk') || 'Morning'} (L)</label>
                                    <input
                                        type="number" className="cm-input"
                                        placeholder="e.g. 3.5" min="0" max="25" step="0.1"
                                        value={form.morningMilk}
                                        onChange={e => setForm(f => ({ ...f, morningMilk: e.target.value }))}
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label>{t('eveningMilk') || 'Evening'} (L)</label>
                                    <input
                                        type="number" className="cm-input"
                                        placeholder="e.g. 2.8" min="0" max="25" step="0.1"
                                        value={form.eveningMilk}
                                        onChange={e => setForm(f => ({ ...f, eveningMilk: e.target.value }))}
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label>{t('totalYield') || 'Total'} (L)</label>
                                    <input
                                        type="number" className="cm-input"
                                        placeholder="Auto" min="0" max="50" step="0.1"
                                        value={form.dailyYield || (Number(form.morningMilk || 0) + Number(form.eveningMilk || 0) || '')}
                                        onChange={e => setForm(f => ({ ...f, dailyYield: e.target.value }))}
                                    />
                                </div>
                            </div>



                            {/* Optional: Health Score + Temperature */}
                            <div className="cm-form-divider">{t('optionalMetrics') || 'Optional Metrics'}</div>
                            <div className="cm-form-row triple">
                                <div className="cm-form-group">
                                    <label>{t('healthScore') || 'Health Score'}</label>
                                    <input
                                        type="number" className="cm-input"
                                        placeholder="0-100" min="0" max="100"
                                        value={form.healthScore}
                                        onChange={e => setForm(f => ({ ...f, healthScore: e.target.value }))}
                                    />
                                </div>
                                <div className="cm-form-group">
                                    <label>{t('temperature') || 'Temp'} (°C)</label>
                                    <input
                                        type="number" className="cm-input"
                                        placeholder="38.5" min="35" max="42" step="0.1"
                                        value={form.temperature}
                                        onChange={e => setForm(f => ({ ...f, temperature: e.target.value }))}
                                    />
                                </div>
                                <div className="cm-form-group" />
                            </div>
                        </div>

                        <div className="cm-modal-footer">
                            <button className="cm-btn-secondary" onClick={() => setModalOpen(false)}>
                                {t('cancel') || 'Cancel'}
                            </button>
                            <button className="cm-btn-primary" onClick={handleSave}>
                                <Check size={16} />
                                {editingCow ? (t('saveChanges') || 'Save Changes') : (t('addCow') || 'Add Cow')}
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
                            <h3>{t('deleteCow') || 'Delete Cow?'}</h3>
                            <p>{t('deleteConfirmMsg') || `Are you sure you want to delete`} <strong>{deleteConfirm.name}</strong> ({deleteConfirm.id})?</p>
                            <p className="cm-delete-warning">{t('deleteWarning') || 'This action cannot be undone.'}</p>
                            <div className="cm-delete-actions">
                                <button className="cm-btn-secondary" onClick={() => setDeleteConfirm(null)}>
                                    {t('cancel') || 'Cancel'}
                                </button>
                                <button className="cm-btn-danger" onClick={handleDelete}>
                                    <Trash2 size={14} />
                                    {t('confirmDelete') || 'Delete'}
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
