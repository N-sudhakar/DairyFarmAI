import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, BarChart, Bar, Legend, ComposedChart
} from 'recharts';
import { Droplets, TrendingUp, Award, AlertTriangle, Beaker } from 'lucide-react';
import AnimatedNumber from '../components/AnimatedNumber';
import EmptyState from '../components/EmptyState';
import { yieldHistory, qualityTrend, batchHistory, cows } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export default function MilkProduction() {
    const { t } = useLanguage();
    const [tab, setTab] = useState('yield');

    const topProducers = [...cows].sort((a, b) => b.dailyYield - a.dailyYield).slice(0, 10);
    const bottomProducers = [...cows].sort((a, b) => a.dailyYield - b.dailyYield).slice(0, 10);

    const avgYield = cows.length > 0 ? (cows.reduce((s, c) => s + c.dailyYield, 0) / cows.length).toFixed(1) : '0.0';
    const totalYield = cows.length > 0 ? cows.reduce((s, c) => s + c.dailyYield, 0).toFixed(0) : '0';
    const lastQuality = qualityTrend.length > 0 ? qualityTrend[qualityTrend.length - 1] : null;
    const isEmpty = cows.length === 0 && yieldHistory.length === 0;

    return (
        <div className="animate-fade-in">
            {/* Stat Cards */}
            <div className="grid-4 stagger mb-24">
                <div className="stat-card blue">
                    <div className="stat-card-icon">🥛</div>
                    <div className="stat-card-value"><AnimatedNumber value={Number(totalYield)} suffix="L" /></div>
                    <div className="stat-card-label">{t('totalDailyYield')}</div>
                    <div className="stat-card-trend up"><TrendingUp size={12} /> {isEmpty ? '—' : '+3.2%'}</div>
                </div>
                <div className="stat-card green">
                    <div className="stat-card-icon"><Droplets size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={Number(avgYield)} decimals={1} suffix="L" /></div>
                    <div className="stat-card-label">{t('avgYieldPerCow')}</div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-card-icon"><Award size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={lastQuality ? lastQuality.fat : 0} decimals={1} suffix="%" /></div>
                    <div className="stat-card-label">{t('avgFatContent')}</div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-card-icon"><Beaker size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={lastQuality ? lastQuality.scc / 1000 : 0} suffix="K" /></div>
                    <div className="stat-card-label">{t('avgSCC')}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="card mb-24" style={{ padding: '12px 16px' }}>
                <div className="tab-group">
                    <button className={`tab-btn ${tab === 'yield' ? 'active' : ''}`} onClick={() => setTab('yield')}>{t('yieldTrends')}</button>
                    <button className={`tab-btn ${tab === 'quality' ? 'active' : ''}`} onClick={() => setTab('quality')}>{t('qualityParams')}</button>
                    <button className={`tab-btn ${tab === 'ranking' ? 'active' : ''}`} onClick={() => setTab('ranking')}>{t('cowRanking')}</button>
                    <button className={`tab-btn ${tab === 'batches' ? 'active' : ''}`} onClick={() => setTab('batches')}>{t('batchHistory')}</button>
                </div>
            </div>

            {/* Tab Content */}
            {tab === 'yield' && (
                yieldHistory.length > 0 ? (
                    <div className="grid-2 mb-24">
                        <div className="card">
                            <h3 className="card-title" style={{ marginBottom: '16px' }}>{t('dailyMilkYieldVsTarget')}</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={yieldHistory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="yieldArea" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                                                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={3} />
                                        <YAxis tick={{ fontSize: 10 }} />
                                        <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} labelStyle={{ color: '#f9fafb' }} />
                                        <Area type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={2} fill="url(#yieldArea)" name="Yield (L)" />
                                        <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Target" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="card">
                            <h3 className="card-title" style={{ marginBottom: '16px' }}>Fat & Protein Content Trends</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={qualityTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
                                        <YAxis tick={{ fontSize: 10 }} domain={[2.5, 4.5]} />
                                        <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} labelStyle={{ color: '#f9fafb' }} />
                                        <Line type="monotone" dataKey="fat" stroke="#f59e0b" strokeWidth={2} dot={false} name="Fat %" />
                                        <Line type="monotone" dataKey="protein" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Protein %" />
                                        <Legend />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyState icon={Droplets} title="No Yield Data Yet" message="Start recording milk production to see yield trends and quality analysis here." />
                )
            )}

            {tab === 'quality' && (
                qualityTrend.length > 0 ? (
                    <div className="grid-2 mb-24">
                        <div className="card">
                            <h3 className="card-title" style={{ marginBottom: '16px' }}>{t('sccTrend')}</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={qualityTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="sccGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                                                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
                                        <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                                        <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} labelStyle={{ color: '#f9fafb' }} formatter={v => [`${(v / 1000).toFixed(0)}K cells/mL`, 'SCC']} />
                                        <Area type="monotone" dataKey="scc" stroke="#ef4444" strokeWidth={2} fill="url(#sccGrad)" name="SCC" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="card">
                            <h3 className="card-title" style={{ marginBottom: '16px' }}>{t('tbcTrend')}</h3>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={qualityTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
                                        <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                                        <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} labelStyle={{ color: '#f9fafb' }} formatter={v => [`${(v / 1000).toFixed(0)}K CFU/mL`, 'TBC']} />
                                        <Bar dataKey="tbc" fill="#3b82f6" radius={[3, 3, 0, 0]} name="TBC" opacity={0.7} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyState icon={Beaker} title="No Quality Data" message="Quality parameters like SCC and TBC will appear here once milk testing data is recorded." />
                )
            )}

            {tab === 'ranking' && (
                topProducers.length > 0 ? (
                    <div className="grid-2 mb-24">
                        <div className="card">
                            <h3 className="card-title" style={{ marginBottom: '16px' }}>{t('top10Producers')}</h3>
                            <table className="data-table">
                                <thead><tr><th>{t('rank')}</th><th>{t('cow')}</th><th>{t('breed')}</th><th>{t('yield')}</th></tr></thead>
                                <tbody>
                                    {topProducers.map((cow, i) => (
                                        <tr key={cow.id}>
                                            <td style={{ fontWeight: 700, color: i < 3 ? 'var(--color-primary)' : 'var(--text-secondary)' }}>#{i + 1}</td>
                                            <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>🐄</span><div><div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{cow.name}</div><div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{cow.id}</div></div></div></td>
                                            <td style={{ fontSize: '12px' }}>{cow.breed}</td>
                                            <td style={{ fontWeight: 700, fontFamily: 'Outfit', color: 'var(--color-primary)' }}>{cow.dailyYield}L</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="card">
                            <h3 className="card-title" style={{ marginBottom: '16px' }}>{t('bottom10Producers')}</h3>
                            <table className="data-table">
                                <thead><tr><th>{t('rank')}</th><th>{t('cow')}</th><th>{t('breed')}</th><th>{t('yield')}</th></tr></thead>
                                <tbody>
                                    {bottomProducers.map((cow, i) => (
                                        <tr key={cow.id}>
                                            <td style={{ fontWeight: 700, color: 'var(--color-danger)' }}>#{i + 1}</td>
                                            <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>🐄</span><div><div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{cow.name}</div><div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{cow.id}</div></div></div></td>
                                            <td style={{ fontSize: '12px' }}>{cow.breed}</td>
                                            <td style={{ fontWeight: 700, fontFamily: 'Outfit', color: 'var(--color-danger)' }}>{cow.dailyYield}L</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <EmptyState icon={Award} title="No Cattle Added" message="Add cattle to see top and bottom producers ranked by daily milk yield." />
                )
            )}

            {tab === 'batches' && (
                batchHistory.length > 0 ? (
                    <div className="card">
                        <h3 className="card-title" style={{ marginBottom: '16px' }}>{t('recentBatchReports')}</h3>
                        <table className="data-table">
                            <thead><tr><th>Batch ID</th><th>Date</th><th>Volume</th><th>Fat%</th><th>Protein%</th><th>SCC</th><th>Grade</th><th>Status</th></tr></thead>
                            <tbody>
                                {batchHistory.map(batch => (
                                    <tr key={batch.id}>
                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{batch.id}</td>
                                        <td>{batch.date}</td><td>{batch.volume}</td><td>{batch.fat}</td><td>{batch.protein}</td><td>{batch.scc}</td>
                                        <td><span className={`badge ${batch.grade === 'A+' ? 'success' : batch.grade === 'A' ? 'info' : 'warning'}`}>{batch.grade}</span></td>
                                        <td><span className={`badge ${batch.status === 'Accepted' ? 'success' : 'warning'}`}>{batch.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState icon={Droplets} title="No Batch Records" message="Batch quality reports will appear here once milk collection batches are logged." />
                )
            )}
        </div>
    );
}
