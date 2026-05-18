import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { HeartPulse, DollarSign, AlertTriangle, TrendingUp, Activity, Droplets } from 'lucide-react';
import GaugeChart from '../components/GaugeChart';
import AnimatedNumber from '../components/AnimatedNumber';
import EmptyState from '../components/EmptyState';
import { yieldHistory, alerts } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { useCows } from '../context/CowContext';

// Dynamic activity — built from real cow data
function buildActivityTimeline(cowList) {
    if (cowList.length === 0) return [];
    const totalYield = cowList.reduce((s, c) => s + (Number(c.dailyYield) || 0), 0).toFixed(1);
    const criticalCows = cowList.filter(c => c.status === 'Critical');
    const atRiskCows = cowList.filter(c => c.status === 'At Risk');
    const timeline = [];
    timeline.push({ time: '9:45 AM', text: `Morning milking completed — total yield **${totalYield}L** from ${cowList.length} cows`, type: '' });
    if (criticalCows.length > 0) {
        const c = criticalCows[0];
        timeline.push({ time: '9:12 AM', text: `Health alert triggered for **${c.id} (${c.name})**`, type: 'critical' });
    }
    if (atRiskCows.length > 0) {
        timeline.push({ time: '8:30 AM', text: `${atRiskCows.length} cows flagged as at-risk — review recommended`, type: 'warning' });
    }
    timeline.push({ time: '6:00 AM', text: `System ready — ${cowList.length} cattle records loaded`, type: '' });
    return timeline;
}

export default function Dashboard() {
    const { t } = useLanguage();
    const { cows, farmStats } = useCows();
    const [yieldTab, setYieldTab] = useState('30D');
    const topAlerts = alerts.slice(0, 4);
    const topCows = cows
        .filter(c => c.status !== 'Healthy')
        .sort((a, b) => a.healthScore - b.healthScore)
        .slice(0, 5);

    const filteredYield = yieldTab === '30D'
        ? yieldHistory
        : yieldTab === '7D'
            ? yieldHistory.slice(-7)
            : yieldHistory.slice(-1);

    const lastYield = yieldHistory.length > 0 ? yieldHistory[yieldHistory.length - 1] : null;
    const isEmpty = cows.length === 0;
    const activityTimeline = buildActivityTimeline(cows);

    return (
        <div className="animate-fade-in">
            {/* Stat Cards */}
            <div className="grid-4 stagger mb-24">
                <div className="stat-card green">
                    <div className="stat-card-icon">🐄</div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={farmStats.totalCows} />
                    </div>
                    <div className="stat-card-label">{t('totalCattle')}</div>
                    <div className="stat-card-trend up">
                        <TrendingUp size={12} /> {farmStats.healthyCows} {t('healthy').toLowerCase()}
                    </div>
                </div>

                <div className="stat-card blue">
                    <div className="stat-card-icon">🥛</div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={farmStats.totalDailyYield} suffix="L" />
                    </div>
                    <div className="stat-card-label">{t('todaysYield')}</div>
                    <div className="stat-card-trend up">
                        <TrendingUp size={12} /> {isEmpty ? '—' : '+3.2% vs yesterday'}
                    </div>
                </div>

                <div className="stat-card orange">
                    <div className="stat-card-icon">💰</div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={farmStats.dailyRevenue / 1000} prefix="₹" suffix="K" decimals={0} />
                    </div>
                    <div className="stat-card-label">{t('todaysRevenue')}</div>
                    <div className="stat-card-trend up">
                        <TrendingUp size={12} /> ₹{farmStats.milkPrice}/L
                    </div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-card-icon">⚠️</div>
                    <div className="stat-card-value">
                        <AnimatedNumber value={farmStats.criticalCows + farmStats.atRiskCows} />
                    </div>
                    <div className="stat-card-label">{t('cowsNeedAttention')}</div>
                    <div className="stat-card-trend down">
                        <AlertTriangle size={12} /> {farmStats.criticalCows} {t('critical').toLowerCase()}
                    </div>
                </div>
            </div>

            {/* Main Row: Yield Chart + Health Gauge */}
            <div className="grid-2-1 mb-24">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{t('milkYieldLast30')}</h3>
                        <div className="tab-group">
                            {['30D', '7D', t('today')].map(tb => (
                                <button
                                    key={tb}
                                    className={`tab-btn ${yieldTab === tb ? 'active' : ''}`}
                                    onClick={() => setYieldTab(tb)}
                                >
                                    {tb}
                                </button>
                            ))}
                        </div>
                    </div>
                    {filteredYield.length > 0 ? (
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={filteredYield} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#d4a039" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#d4a039" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,232,0.04)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={yieldTab === '7D' ? 0 : 4} />
                                    <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{ background: '#1a1d17', border: '1px solid rgba(245,240,232,0.1)', borderRadius: '8px' }}
                                        labelStyle={{ color: '#f5f0e8', fontWeight: 600 }}
                                        itemStyle={{ color: '#b8b0a0' }}
                                    />
                                    <Area type="monotone" dataKey="yield" stroke="#d4a039" strokeWidth={2} fill="url(#yieldGrad)" name="Yield (L)" animationDuration={1200} />
                                    <Area type="monotone" dataKey="target" stroke="#5b7fa5" strokeWidth={1.5} strokeDasharray="5 5" fill="none" name="Target" animationDuration={1200} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <EmptyState
                            icon={Droplets}
                            title={t('noDataYet') || 'No Yield Data Yet'}
                            message={t('noMilkData') || 'Milk yield records will appear here once you start logging production.'}
                        />
                    )}
                </div>

                {/* Health Gauge & Quick Stats */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                    <h3 className="card-title">{t('farmHealthScore')}</h3>
                    <GaugeChart value={farmStats.farmHealthScore} label={t('overallHealth')} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
                        <div className="cow-stat">
                            <div className="cow-stat-value text-success"><AnimatedNumber value={farmStats.healthyCows} /></div>
                            <div className="cow-stat-label">{t('healthy')}</div>
                        </div>
                        <div className="cow-stat">
                            <div className="cow-stat-value text-warning"><AnimatedNumber value={farmStats.atRiskCows} /></div>
                            <div className="cow-stat-label">{t('atRisk')}</div>
                        </div>
                        <div className="cow-stat">
                            <div className="cow-stat-value text-danger"><AnimatedNumber value={farmStats.criticalCows} /></div>
                            <div className="cow-stat-label">{t('critical')}</div>
                        </div>
                        <div className="cow-stat">
                            <div className="cow-stat-value" style={{ color: '#c4704c' }}><AnimatedNumber value={farmStats.avgDailyYield} decimals={1} suffix="L" /></div>
                            <div className="cow-stat-label">{t('avgYield')}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Alerts + Activity Timeline */}
            <div className="grid-2 mb-24">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{t('activeAlerts')}</h3>
                        <span className="badge critical">{alerts.filter(a => !a.acknowledged).length} {t('new').toLowerCase()}</span>
                    </div>
                    {topAlerts.length > 0 ? (
                        <div style={{ maxHeight: '320px', overflow: 'auto' }}>
                            {topAlerts.map((alert) => (
                                <div key={alert.id} className="alert-item">
                                    <div className={`alert-icon ${alert.severity}`}>
                                        <AlertTriangle size={18} />
                                    </div>
                                    <div className="alert-content">
                                        <h4>{alert.title}</h4>
                                        <p>{alert.message.substring(0, 80)}...</p>
                                    </div>
                                    <span className="alert-time">{alert.time}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-container compact">
                            <div className="empty-state-icon-wrap"><AlertTriangle size={28} strokeWidth={1.2} /></div>
                            <h3 className="empty-state-title">{t('noAlertsTitle') || 'No Alerts'}</h3>
                            <p className="empty-state-message">{t('noAlertsMessage') || 'All systems running smoothly. Alerts will appear here when attention is needed.'}</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{t('todaysActivity')}</h3>
                        <span className="badge success">{t('live')}</span>
                    </div>
                    {isEmpty ? (
                        <div className="empty-state-container compact">
                            <div className="empty-state-icon-wrap"><Activity size={28} strokeWidth={1.2} /></div>
                            <h3 className="empty-state-title">No Activity Yet</h3>
                            <p className="empty-state-message">Farm activity will be logged here once cattle are registered.</p>
                        </div>
                    ) : (
                        <div className="timeline" style={{ maxHeight: '320px', overflow: 'auto' }}>
                            {activityTimeline.map((event, i) => (
                                <div key={i} className={`timeline-item ${event.type}`}>
                                    <span className="timeline-item-time">{event.time}</span>
                                    <span className="timeline-item-content"
                                        dangerouslySetInnerHTML={{
                                            __html: event.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Row: Top Cows + Quality */}
            <div className="grid-2 mb-24">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{t('topCowsNeedAttention')}</h3>
                        <span className="badge warning">{t('rankedByRisk')}</span>
                    </div>
                    {topCows.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('cow')}</th>
                                    <th>{t('status')}</th>
                                    <th>{t('health')}</th>
                                    <th>{t('topRisk')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topCows.map((cow) => {
                                    const topDisease = Object.entries(cow.diseases).sort((a, b) => b[1] - a[1])[0];
                                    return (
                                        <tr key={cow.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '16px' }}>🐄</span>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{cow.name}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cow.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${cow.status === 'Critical' ? 'critical' : 'warning'}`}>
                                                    {cow.status}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: cow.healthScore < 40 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                                                    {cow.healthScore}
                                                </span>
                                            </td>
                                            <td style={{ textTransform: 'capitalize', fontSize: '12px' }}>
                                                {topDisease[0]} ({(topDisease[1] * 100).toFixed(0)}%)
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="empty-state-container compact">
                            <div className="empty-state-icon-wrap"><HeartPulse size={28} strokeWidth={1.2} /></div>
                            <h3 className="empty-state-title">{t('noCattleAdded') || 'No Cattle Added'}</h3>
                            <p className="empty-state-message">{t('noCattleMessage') || 'Add your first animal to start monitoring health and risk.'}</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{t('todaysMilkQuality')}</h3>
                    </div>
                    {lastYield ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="cow-stat" style={{ padding: '16px' }}>
                                <Droplets size={18} style={{ color: 'var(--color-info)', marginBottom: '8px' }} />
                                <div className="cow-stat-value" style={{ fontSize: '22px' }}>
                                    <AnimatedNumber value={lastYield.fat} decimals={1} suffix="%" />
                                </div>
                                <div className="cow-stat-label">{t('fatContent')}</div>
                            </div>
                            <div className="cow-stat" style={{ padding: '16px' }}>
                                <Activity size={18} style={{ color: '#c4704c', marginBottom: '8px' }} />
                                <div className="cow-stat-value" style={{ fontSize: '22px' }}>
                                    <AnimatedNumber value={lastYield.protein} decimals={1} suffix="%" />
                                </div>
                                <div className="cow-stat-label">{t('proteinContent')}</div>
                            </div>
                            <div className="cow-stat" style={{ padding: '16px' }}>
                                <HeartPulse size={18} style={{ color: 'var(--color-warning)', marginBottom: '8px' }} />
                                <div className="cow-stat-value" style={{ fontSize: '22px' }}>
                                    <AnimatedNumber value={lastYield.scc / 1000} decimals={0} suffix="K" />
                                </div>
                                <div className="cow-stat-label">{t('avgSCC')}</div>
                            </div>
                            <div className="cow-stat" style={{ padding: '16px' }}>
                                <DollarSign size={18} style={{ color: 'var(--color-success)', marginBottom: '8px' }} />
                                <div className="cow-stat-value" style={{ fontSize: '22px' }}>
                                    <AnimatedNumber value={farmStats.milkPrice} prefix="₹" />
                                </div>
                                <div className="cow-stat-label">{t('priceLitre')}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state-container compact">
                            <div className="empty-state-icon-wrap"><Droplets size={28} strokeWidth={1.2} /></div>
                            <h3 className="empty-state-title">No Quality Data</h3>
                            <p className="empty-state-message">Milk quality metrics will appear once production records are available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
