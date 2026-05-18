import React, { useState, useMemo } from 'react';
import {
    AreaChart, Area, ResponsiveContainer, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { Search, AlertTriangle, Activity, Thermometer, Heart, X } from 'lucide-react';
import AnimatedNumber from '../components/AnimatedNumber';
import EmptyState from '../components/EmptyState';
import { cows, farmStats } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

// Generate stable sparkline data using seed from cow id
function getSparkData(cow) {
    const seed = parseInt(cow.id.replace(/\D/g, ''), 10) || 0;
    return Array.from({ length: 7 }, (_, i) => ({
        d: `D${i + 1}`,
        v: Math.max(10, cow.healthScore + Math.floor(Math.sin(seed + i * 1.5) * 12)),
    }));
}

function CowDetailModal({ cow, onClose }) {
    const { t } = useLanguage();
    const sparkData = getSparkData(cow);
    const diseases = Object.entries(cow.diseases).sort((a, b) => b[1] - a[1]);

    return (
        <div className="cow-detail-overlay" onClick={onClose}>
            <div className="cow-detail-panel" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <div className="cow-avatar" style={{ width: '52px', height: '52px', fontSize: '26px' }}>🐄</div>
                        <div>
                            <h2>{cow.name}</h2>
                            <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>{cow.id} • {cow.breed} • Age {cow.age} yrs • Lactation Day {cow.lactationDay}</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={16} /></button>
                </div>

                {/* Health metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                    <div className="cow-stat" style={{ padding: '14px' }}>
                        <div className="cow-stat-value" style={{ color: cow.healthScore >= 70 ? 'var(--color-success)' : cow.healthScore >= 40 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                            {cow.healthScore}
                        </div>
                        <div className="cow-stat-label">{t('healthScore')}</div>
                    </div>
                    <div className="cow-stat" style={{ padding: '14px' }}>
                        <div className="cow-stat-value">{cow.dailyYield}L</div>
                        <div className="cow-stat-label">{t('dailyYield')}</div>
                    </div>
                    <div className="cow-stat" style={{ padding: '14px' }}>
                        <div className="cow-stat-value">{cow.temperature}°C</div>
                        <div className="cow-stat-label">{t('temperature')}</div>
                    </div>
                    <div className="cow-stat" style={{ padding: '14px' }}>
                        <div className="cow-stat-value">{cow.weight} kg</div>
                        <div className="cow-stat-label">{t('weight')}</div>
                    </div>
                </div>

                {/* Health trend chart */}
                <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>{t('healthTrend7Day')}</h4>
                    <div style={{ height: '120px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparkData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Line
                                    type="monotone" dataKey="v" name="Health"
                                    stroke={cow.healthScore >= 70 ? '#10b981' : cow.healthScore >= 40 ? '#f59e0b' : '#ef4444'}
                                    strokeWidth={2} dot={{ r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Disease risks */}
                <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>{t('diseaseRiskAnalysis')}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {diseases.map(([disease, prob]) => (
                        <div key={disease}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'capitalize' }}>
                                <span>{disease}</span>
                                <span style={{ fontWeight: 600, color: prob > 0.5 ? 'var(--color-danger)' : prob > 0.3 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                                    {(prob * 100).toFixed(0)}%
                                </span>
                            </div>
                            <div className="progress-bar" style={{ height: '8px' }}>
                                <div
                                    className={`progress-fill progress-fill-animated ${prob > 0.5 ? 'orange' : 'green'}`}
                                    style={{ width: `${prob * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status badge */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge ${cow.status === 'Critical' ? 'critical' : cow.status === 'At Risk' ? 'warning' : 'success'}`} style={{ fontSize: '12px', padding: '5px 14px' }}>
                        {cow.status}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        SCC: {cow.scc?.toLocaleString() || 'N/A'} cells/mL
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function CowHealth() {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedCow, setSelectedCow] = useState(null);

    const filteredCows = useMemo(() => cows.filter(cow => {
        const matchFilter = filter === 'All' || cow.status === filter;
        const matchSearch = cow.name.toLowerCase().includes(search.toLowerCase()) || cow.id.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    }).sort((a, b) => a.healthScore - b.healthScore).slice(0, 24), [filter, search]);

    return (
        <div className="animate-fade-in">
            {/* Summary Cards */}
            <div className="grid-4 stagger mb-24">
                <div className="stat-card green">
                    <div className="stat-card-icon"><Heart size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={farmStats.healthyCows} /></div>
                    <div className="stat-card-label">{t('healthyCows')}</div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-card-icon"><AlertTriangle size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={farmStats.atRiskCows} /></div>
                    <div className="stat-card-label">{t('atRisk')}</div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-card-icon"><Activity size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={farmStats.criticalCows} /></div>
                    <div className="stat-card-label">{t('critical')}</div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-card-icon"><Thermometer size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={farmStats.farmHealthScore} /></div>
                    <div className="stat-card-label">{t('avgHealthScore')}</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="card mb-24" style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div className="header-search" style={{ width: '220px' }}>
                        <Search size={14} color="var(--text-muted)" />
                        <input
                            placeholder={t('searchByNameId')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="tab-group">
                        {['All', 'Healthy', 'At Risk', 'Critical'].map(f => (
                            <button
                                key={f}
                                className={`tab-btn ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
                        {t('showing')} {filteredCows.length} {t('of')} {cows.length} {t('cows')}
                    </span>
                </div>
            </div>

            {/* Cow Grid or Empty State */}
            {filteredCows.length > 0 ? (
                <div className="grid-4 stagger">
                    {filteredCows.map(cow => {
                        const sparkData = getSparkData(cow);
                        const topDisease = Object.entries(cow.diseases).sort((a, b) => b[1] - a[1])[0];
                        return (
                            <div key={cow.id} className="cow-card" onClick={() => setSelectedCow(cow)}>
                                <div className="cow-card-header">
                                    <div className="cow-card-id">
                                        <div className="cow-avatar">🐄</div>
                                        <div>
                                            <h4>{cow.name}</h4>
                                            <span>{cow.id} • {cow.breed}</span>
                                        </div>
                                    </div>
                                    <span className={`health-dot ${cow.status === 'Healthy' ? 'healthy' : cow.status === 'At Risk' ? 'at-risk' : 'critical'}`}></span>
                                </div>

                                {/* Mini Sparkline */}
                                <div style={{ height: '40px', marginBottom: '10px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                                            <defs>
                                                <linearGradient id={`spark-${cow.id}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={cow.healthScore >= 70 ? '#10b981' : cow.healthScore >= 40 ? '#f59e0b' : '#ef4444'} stopOpacity={0.3} />
                                                    <stop offset="100%" stopColor={cow.healthScore >= 70 ? '#10b981' : cow.healthScore >= 40 ? '#f59e0b' : '#ef4444'} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                type="monotone"
                                                dataKey="v"
                                                stroke={cow.healthScore >= 70 ? '#10b981' : cow.healthScore >= 40 ? '#f59e0b' : '#ef4444'}
                                                strokeWidth={1.5}
                                                fill={`url(#spark-${cow.id})`}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="cow-card-stats">
                                    <div className="cow-stat">
                                        <div className="cow-stat-value" style={{ color: cow.healthScore >= 70 ? 'var(--color-success)' : cow.healthScore >= 40 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                                            {cow.healthScore}
                                        </div>
                                        <div className="cow-stat-label">{t('health')}</div>
                                    </div>
                                    <div className="cow-stat">
                                        <div className="cow-stat-value">{cow.dailyYield}L</div>
                                        <div className="cow-stat-label">{t('yield')}</div>
                                    </div>
                                    <div className="cow-stat">
                                        <div className="cow-stat-value">{cow.temperature}°</div>
                                        <div className="cow-stat-label">{t('temp')}</div>
                                    </div>
                                    <div className="cow-stat">
                                        <div className="cow-stat-value" style={{ fontSize: '12px', textTransform: 'capitalize' }}>
                                            {topDisease[1] > 0.3 ? topDisease[0] : '—'}
                                        </div>
                                        <div className="cow-stat-label">{t('risk')}</div>
                                    </div>
                                </div>

                                {/* Disease Risk Bars */}
                                {cow.status !== 'Healthy' && (
                                    <div style={{ marginTop: '10px' }}>
                                        {Object.entries(cow.diseases)
                                            .filter(([, v]) => v > 0.2)
                                            .sort((a, b) => b[1] - a[1])
                                            .slice(0, 2)
                                            .map(([disease, prob]) => (
                                                <div key={disease} style={{ marginBottom: '4px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'capitalize' }}>
                                                        <span>{disease}</span>
                                                        <span>{(prob * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div
                                                            className={`progress-fill progress-fill-animated ${prob > 0.6 ? 'orange' : 'green'}`}
                                                            style={{ width: `${prob * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={Heart}
                    title={t('noCattleAdded') || 'No Cattle Added Yet'}
                    message={t('noCattleMessage') || 'Register your first animal to start monitoring health, tracking diseases, and receiving smart alerts.'}
                />
            )}

            {/* Cow Detail Modal */}
            {selectedCow && (
                <CowDetailModal cow={selectedCow} onClose={() => setSelectedCow(null)} />
            )}
        </div>
    );
}
