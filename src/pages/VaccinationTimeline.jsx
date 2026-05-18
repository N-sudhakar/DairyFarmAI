import React, { useState, useMemo } from 'react';
import {
    Syringe, AlertTriangle, CheckCircle2, Clock, XCircle,
    Filter, Calendar, ListOrdered, ChevronRight, Shield, Bug,
    ChevronDown, ChevronUp, Info, User, MapPin
} from 'lucide-react';
import { vaccinationRecords, vaccinationStats, DISEASES, SEASONAL_CALENDAR } from '../data/vaccinationData';
import { useLanguage } from '../context/LanguageContext';

// ─── Status Badge ─────────────────────────────────────────────
function StatusBadge({ status, t }) {
    const config = {
        overdue: { label: t('overdueVacc'), className: 'vacc-badge-overdue', icon: <XCircle size={12} /> },
        dueSoon: { label: t('dueSoon'), className: 'vacc-badge-due-soon', icon: <Clock size={12} /> },
        upToDate: { label: t('upToDate'), className: 'vacc-badge-up-to-date', icon: <CheckCircle2 size={12} /> },
        neverVaccinated: { label: t('neverVaccinated'), className: 'vacc-badge-never', icon: <AlertTriangle size={12} /> },
        completed: { label: t('lifetimeComplete'), className: 'vacc-badge-completed', icon: <CheckCircle2 size={12} /> },
        tooYoung: { label: 'Too Young', className: 'vacc-badge-too-young', icon: <Clock size={12} /> },
    };
    const c = config[status] || config.upToDate;
    return <span className={`vacc-badge ${c.className}`}>{c.icon} {c.label}</span>;
}

// ─── Clickable Stat Card ──────────────────────────────────────
function StatCard({ icon, label, value, color, subtext, active, onClick }) {
    return (
        <div
            className={`vacc-stat-card ${active ? 'vacc-stat-active' : ''}`}
            style={{ '--vacc-accent': color }}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <div className="vacc-stat-top">
                <div className="vacc-stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
                <span className="vacc-stat-value">{value}</span>
            </div>
            <span className="vacc-stat-label">{label}</span>
            {subtext && <span className="vacc-stat-sub" style={{ color }}>{subtext}</span>}
            {active && <div className="vacc-stat-indicator" style={{ background: color }} />}
        </div>
    );
}

// ─── Expandable Row Detail ────────────────────────────────────
function VaccHistoryDetail({ record }) {
    if (!record.history || record.history.length === 0) {
        return (
            <div className="vacc-detail-empty">
                <Info size={16} />
                <span>No vaccination history recorded. First dose recommended.</span>
            </div>
        );
    }
    return (
        <div className="vacc-detail">
            <div className="vacc-detail-header">
                <span>📋 Vaccination History ({record.history.length} records)</span>
            </div>
            <div className="vacc-detail-timeline">
                {record.history.map((h, i) => (
                    <div key={i} className="vacc-detail-entry">
                        <div className="vacc-detail-dot" />
                        <div className="vacc-detail-line" />
                        <div className="vacc-detail-info">
                            <div className="vacc-detail-date">📅 {h.date}</div>
                            <div className="vacc-detail-meta">
                                <span>💉 {h.vaccine}</span>
                                <span>📏 {h.dose} • {h.route}</span>
                                <span>👨‍⚕️ {h.administeredBy}</span>
                                {h.batch && <span>🏷️ Batch: {h.batch}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── URGENT LIST TAB ──────────────────────────────────────────
function UrgentListTab({ records, t, activeStatFilter }) {
    const [expandedRow, setExpandedRow] = useState(null);

    const filtered = useMemo(() => {
        let list = records.filter(r => r.status !== 'tooYoung' && r.status !== 'completed');
        if (activeStatFilter && activeStatFilter !== 'all') {
            list = list.filter(r => r.status === activeStatFilter);
        }
        const priority = { overdue: 0, neverVaccinated: 1, dueSoon: 2, upToDate: 3 };
        list.sort((a, b) => {
            const pDiff = (priority[a.status] ?? 99) - (priority[b.status] ?? 99);
            if (pDiff !== 0) return pDiff;
            return (a.daysRemaining ?? 9999) - (b.daysRemaining ?? 9999);
        });
        return list.slice(0, 80);
    }, [records, activeStatFilter]);

    const toggleRow = (key) => {
        setExpandedRow(prev => prev === key ? null : key);
    };

    return (
        <div className="vacc-tab-content animate-fade-in">
            {/* Results count */}
            <div className="vacc-results-count">
                Showing <strong>{filtered.length}</strong> vaccination records
                {activeStatFilter && activeStatFilter !== 'all' && (
                    <span className="vacc-results-filter"> — filtered by <em>{
                        activeStatFilter === 'overdue' ? t('overdueVacc') :
                            activeStatFilter === 'dueSoon' ? t('dueSoon') :
                                activeStatFilter === 'neverVaccinated' ? t('neverVaccinated') :
                                    t('upToDate')
                    }</em></span>
                )}
            </div>

            {/* Table */}
            <div className="card" style={{ overflow: 'auto' }}>
                <table className="data-table vacc-table">
                    <thead>
                        <tr>
                            <th style={{ width: 30 }}></th>
                            <th>{t('animalTag')}</th>
                            <th>{t('name')}</th>
                            <th>{t('vaccination')}</th>
                            <th>{t('lastGiven')}</th>
                            <th>{t('nextDue')}</th>
                            <th>{t('daysRemaining')}</th>
                            <th>{t('status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((rec, idx) => {
                            const key = `${rec.cowId}-${rec.diseaseId}-${idx}`;
                            const isExpanded = expandedRow === key;
                            return (
                                <React.Fragment key={key}>
                                    <tr
                                        className={`vacc-row-clickable ${rec.status === 'overdue' ? 'vacc-row-overdue' : ''} ${isExpanded ? 'vacc-row-expanded' : ''}`}
                                        onClick={() => toggleRow(key)}
                                    >
                                        <td className="vacc-expand-cell">
                                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </td>
                                        <td><strong className="vacc-tag">{rec.cowId}</strong></td>
                                        <td>
                                            <div className="vacc-cow-name">
                                                <User size={13} />
                                                {rec.cowName}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="vacc-disease-pill" style={{ borderColor: DISEASES.find(d => d.id === rec.diseaseId)?.color || '#666' }}>
                                                {rec.diseaseName}
                                            </span>
                                        </td>
                                        <td className="vacc-date">{rec.lastGiven || <em style={{ opacity: 0.5 }}>{t('never')}</em>}</td>
                                        <td className="vacc-date">{rec.nextDue || '—'}</td>
                                        <td>
                                            {rec.status === 'overdue' ? (
                                                <span className="vacc-days-overdue">⚠️ {Math.abs(rec.daysRemaining)} {t('daysOverdue')}</span>
                                            ) : rec.status === 'neverVaccinated' ? (
                                                <span className="vacc-days-overdue">🚨 {t('vaccinateNow')}</span>
                                            ) : rec.daysRemaining !== null ? (
                                                <span className="vacc-days-left">{rec.daysRemaining} {t('daysLeft')}</span>
                                            ) : '—'}
                                        </td>
                                        <td><StatusBadge status={rec.status} t={t} /></td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="vacc-detail-row">
                                            <td colSpan={8}>
                                                <VaccHistoryDetail record={rec} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── SEASONAL CALENDAR TAB ────────────────────────────────────
function SeasonalCalendarTab({ t }) {
    const [expandedCard, setExpandedCard] = useState(null);
    const urgencyColors = {
        critical: '#ef4444',
        high: '#f59e0b',
        watch: '#3b82f6',
        medium: '#8b5cf6',
        ongoing: '#10b981',
        'age-based': '#d97706',
    };

    return (
        <div className="vacc-tab-content animate-fade-in">
            <h3 className="vacc-section-title">
                <Calendar size={20} />
                {t('seasonalGuide')}
            </h3>

            <div className="vacc-seasonal-grid">
                {SEASONAL_CALENDAR.map((item, i) => (
                    <div
                        key={i}
                        className={`vacc-seasonal-card ${expandedCard === i ? 'vacc-seasonal-expanded' : ''}`}
                        style={{ borderLeft: `4px solid ${urgencyColors[item.urgency] || '#6b7280'}` }}
                        onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="vacc-seasonal-header">
                            <span className="vacc-seasonal-emoji">{item.emoji}</span>
                            <span className="vacc-seasonal-month">{item.month}</span>
                            <ChevronRight size={14} className={`vacc-seasonal-chevron ${expandedCard === i ? 'rotated' : ''}`} />
                        </div>
                        <p className="vacc-seasonal-action">{item.action}</p>
                        {expandedCard === i && (
                            <div className="vacc-seasonal-extra animate-fade-in">
                                <div className="vacc-seasonal-tip">
                                    <Info size={14} />
                                    <span>
                                        {item.urgency === 'critical' ? 'Critical period — schedule vet visit immediately.' :
                                            item.urgency === 'high' ? 'High priority — plan vaccinations this period.' :
                                                item.urgency === 'watch' ? 'Monitor animals closely during this period.' :
                                                    'Routine check recommended.'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Disease Reference Cards */}
            <h3 className="vacc-section-title" style={{ marginTop: 32 }}>
                <Shield size={20} />
                Disease Risk Reference
            </h3>
            <div className="vacc-disease-grid">
                {DISEASES.map(d => (
                    <div key={d.id} className="vacc-disease-card" style={{ borderTop: `3px solid ${d.color}` }}>
                        <div className="vacc-disease-card-header">
                            <span className="vacc-disease-card-emoji">{d.riskEmoji}</span>
                            <strong>{d.shortName}</strong>
                            <span className="vacc-disease-card-season">{d.season}</span>
                        </div>
                        <p className="vacc-disease-card-note">{d.riskNote}</p>
                        <div className="vacc-disease-card-meta">
                            <span>💉 {d.vaccine}</span>
                            <span>📏 {d.dose} • {d.route}</span>
                            <span>🔁 {d.lifetimeOnly ? 'One-time' : `Every ${d.repeatMonths} months`}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── BY DISEASE TAB ───────────────────────────────────────────
function ByDiseaseTab({ records, t }) {
    const [selectedDisease, setSelectedDisease] = useState('fmd');
    const [expandedRow, setExpandedRow] = useState(null);

    const filtered = useMemo(() => {
        return records
            .filter(r => r.diseaseId === selectedDisease && r.status !== 'tooYoung')
            .sort((a, b) => {
                const priority = { overdue: 0, neverVaccinated: 1, dueSoon: 2, completed: 3, upToDate: 4 };
                return (priority[a.status] ?? 99) - (priority[b.status] ?? 99);
            })
            .slice(0, 60);
    }, [records, selectedDisease]);

    const disease = DISEASES.find(d => d.id === selectedDisease);
    const stats = {
        overdue: records.filter(r => r.diseaseId === selectedDisease && r.status === 'overdue').length,
        dueSoon: records.filter(r => r.diseaseId === selectedDisease && r.status === 'dueSoon').length,
        upToDate: records.filter(r => r.diseaseId === selectedDisease && (r.status === 'upToDate' || r.status === 'completed')).length,
        never: records.filter(r => r.diseaseId === selectedDisease && r.status === 'neverVaccinated').length,
    };

    const toggleRow = (key) => setExpandedRow(prev => prev === key ? null : key);

    return (
        <div className="vacc-tab-content animate-fade-in">
            {/* Disease selector pills */}
            <div className="vacc-disease-pills">
                {DISEASES.map(d => (
                    <button
                        key={d.id}
                        className={`vacc-disease-pill-btn ${selectedDisease === d.id ? 'active' : ''}`}
                        style={{ '--pill-color': d.color }}
                        onClick={() => { setSelectedDisease(d.id); setExpandedRow(null); }}
                    >
                        <span className="vacc-pill-emoji">{d.riskEmoji}</span>
                        {d.shortName}
                    </button>
                ))}
            </div>

            {/* Disease mini stats */}
            <div className="vacc-disease-mini-stats">
                <div className="vacc-mini-stat vacc-mini-overdue" onClick={() => { }}>
                    <XCircle size={14} /> <strong>{stats.overdue}</strong> {t('overdueVacc')}
                </div>
                <div className="vacc-mini-stat vacc-mini-due-soon">
                    <Clock size={14} /> <strong>{stats.dueSoon}</strong> {t('dueSoon')}
                </div>
                <div className="vacc-mini-stat vacc-mini-up-to-date">
                    <CheckCircle2 size={14} /> <strong>{stats.upToDate}</strong> {t('upToDate')}
                </div>
                <div className="vacc-mini-stat vacc-mini-never">
                    <AlertTriangle size={14} /> <strong>{stats.never}</strong> {t('neverVaccinated')}
                </div>
            </div>

            {/* Risk note banner */}
            {disease && (
                <div className="vacc-risk-banner" style={{ borderLeft: `4px solid ${disease.color}` }}>
                    <AlertTriangle size={16} />
                    <div>
                        <strong>{disease.shortName}:</strong> {disease.riskNote}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="card" style={{ overflow: 'auto' }}>
                <table className="data-table vacc-table">
                    <thead>
                        <tr>
                            <th style={{ width: 30 }}></th>
                            <th>{t('animalTag')}</th>
                            <th>{t('name')}</th>
                            <th>{t('lastGiven')}</th>
                            <th>{t('nextDue')}</th>
                            <th>{t('daysRemaining')}</th>
                            <th>{t('status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((rec, idx) => {
                            const key = `${rec.cowId}-${idx}`;
                            const isExpanded = expandedRow === key;
                            return (
                                <React.Fragment key={key}>
                                    <tr
                                        className={`vacc-row-clickable ${rec.status === 'overdue' ? 'vacc-row-overdue' : ''} ${isExpanded ? 'vacc-row-expanded' : ''}`}
                                        onClick={() => toggleRow(key)}
                                    >
                                        <td className="vacc-expand-cell">
                                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </td>
                                        <td><strong className="vacc-tag">{rec.cowId}</strong></td>
                                        <td>
                                            <div className="vacc-cow-name">
                                                <User size={13} />
                                                {rec.cowName}
                                            </div>
                                        </td>
                                        <td className="vacc-date">{rec.lastGiven || <em style={{ opacity: 0.5 }}>{t('never')}</em>}</td>
                                        <td className="vacc-date">{rec.nextDue || '—'}</td>
                                        <td>
                                            {rec.status === 'overdue' ? (
                                                <span className="vacc-days-overdue">⚠️ {Math.abs(rec.daysRemaining)} {t('daysOverdue')}</span>
                                            ) : rec.status === 'neverVaccinated' ? (
                                                <span className="vacc-days-overdue">🚨 {t('vaccinateNow')}</span>
                                            ) : rec.daysRemaining !== null ? (
                                                <span className="vacc-days-left">{rec.daysRemaining} {t('daysLeft')}</span>
                                            ) : '—'}
                                        </td>
                                        <td><StatusBadge status={rec.status} t={t} /></td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className="vacc-detail-row">
                                            <td colSpan={7}>
                                                <VaccHistoryDetail record={rec} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// =================== MAIN COMPONENT ===================
export default function VaccinationTimeline() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('urgent');
    const [activeStatFilter, setActiveStatFilter] = useState('all');

    const tabs = [
        { id: 'urgent', label: t('urgentList'), icon: ListOrdered },
        { id: 'calendar', label: t('seasonalCalendar'), icon: Calendar },
        { id: 'disease', label: t('byDisease'), icon: Syringe },
    ];

    const handleStatClick = (filter) => {
        setActiveStatFilter(prev => prev === filter ? 'all' : filter);
        setActiveTab('urgent'); // Switch to urgent list to show filtered results
    };

    return (
        <div className="animate-fade-in">
            {/* Stat Cards — Clickable */}
            <div className="vacc-stats-row">
                <StatCard
                    icon={<XCircle size={20} />}
                    label={t('overdueVacc')}
                    value={vaccinationStats.overdue}
                    color="#ef4444"
                    subtext={`${vaccinationStats.overdueAnimals} animals`}
                    active={activeStatFilter === 'overdue'}
                    onClick={() => handleStatClick('overdue')}
                />
                <StatCard
                    icon={<Clock size={20} />}
                    label={t('dueSoon')}
                    value={vaccinationStats.dueSoon}
                    color="#f59e0b"
                    subtext={`${vaccinationStats.dueSoonAnimals} animals`}
                    active={activeStatFilter === 'dueSoon'}
                    onClick={() => handleStatClick('dueSoon')}
                />
                <StatCard
                    icon={<CheckCircle2 size={20} />}
                    label={t('upToDate')}
                    value={vaccinationStats.upToDate}
                    color="#10b981"
                    active={activeStatFilter === 'upToDate'}
                    onClick={() => handleStatClick('upToDate')}
                />
                <StatCard
                    icon={<AlertTriangle size={20} />}
                    label={t('neverVaccinated')}
                    value={vaccinationStats.neverVaccinated}
                    color="#6b7280"
                    active={activeStatFilter === 'neverVaccinated'}
                    onClick={() => handleStatClick('neverVaccinated')}
                />
            </div>

            {/* Tab Navigation */}
            <div className="labour-tabs mb-24">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`labour-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={16} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'urgent' && <UrgentListTab records={vaccinationRecords} t={t} activeStatFilter={activeStatFilter} />}
            {activeTab === 'calendar' && <SeasonalCalendarTab t={t} />}
            {activeTab === 'disease' && <ByDiseaseTab records={vaccinationRecords} t={t} />}
        </div>
    );
}
