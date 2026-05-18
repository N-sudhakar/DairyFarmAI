import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { Baby, Calendar, Target, Heart, Clock, TrendingUp } from 'lucide-react';
import AnimatedNumber from '../components/AnimatedNumber';
import EmptyState from '../components/EmptyState';
import { estrusEvents, reproductionStats, cows } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];

export default function Reproduction() {
    const { t } = useLanguage();
    const conceptionData = [
        { month: 'Sep', rate: 52 },
        { month: 'Oct', rate: 55 },
        { month: 'Nov', rate: 61 },
        { month: 'Dec', rate: 54 },
        { month: 'Jan', rate: 59 },
        { month: 'Feb', rate: 58 },
    ];

    const breedDistribution = [
        { name: 'Pregnant', value: reproductionStats.pregnantCows },
        { name: 'Open', value: reproductionStats.openCows },
    ];

    // Generate a simple calendar for the current month
    const calendarDays = [];
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const estrusdays = [3, 8, 14, 19, 24, 27]; // simulated estrus dates

    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    return (
        <div className="animate-fade-in">
            {/* Summary Cards */}
            <div className="grid-4 stagger mb-24">
                <div className="stat-card green">
                    <div className="stat-card-icon"><Target size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={reproductionStats.conceptionRate} suffix="%" /></div>
                    <div className="stat-card-label">{t('conceptionRate')}</div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-card-icon"><Baby size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={reproductionStats.pregnantCows} /></div>
                    <div className="stat-card-label">{t('pregnantCows')}</div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-card-icon"><Heart size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={reproductionStats.heatDetectionRate} suffix="%" /></div>
                    <div className="stat-card-label">{t('heatDetectionRate')}</div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-card-icon"><Clock size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={reproductionStats.avgDaysOpen} suffix="d" /></div>
                    <div className="stat-card-label">{t('avgDaysOpen')}</div>
                </div>
            </div>

            <div className="grid-2-1 mb-24">
                {/* Upcoming Estrus Predictions */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{t('upcomingEstrus')}</h3>
                        <span className="badge warning">{estrusEvents.length} upcoming</span>
                    </div>
                    {estrusEvents.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Cow</th>
                                    <th>Predicted Time</th>
                                    <th>Confidence</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estrusEvents.map(event => (
                                    <tr key={event.cowId}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>🐄</span>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{event.name}</div>
                                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{event.cowId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '12px', fontWeight: 500 }}>{event.predicted}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div className="progress-bar" style={{ width: '60px' }}>
                                                    <div className={`progress-fill progress-fill-animated ${event.confidence >= 85 ? 'green' : 'blue'}`} style={{ width: `${event.confidence}%` }} />
                                                </div>
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: event.confidence >= 85 ? 'var(--color-success)' : 'var(--color-info)' }}>
                                                    {event.confidence}%
                                                </span>
                                            </div>
                                        </td>
                                        <td><span className={`badge ${event.status === 'Active' ? 'critical' : 'info'}`}>{event.status}</span></td>
                                        <td><button className="rec-card-action" style={{ padding: '4px 12px', fontSize: '11px' }}>{event.action}</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState icon={Heart} title="No Estrus Events" message="Estrus predictions will appear here once reproductive tracking data is available." />
                    )}
                </div>

                {/* Estrus Calendar */}
                <div className="card">
                    <h3 className="card-title" style={{ marginBottom: '16px' }}>📅 Estrus Calendar — {now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '8px' }}>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <div key={d} style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, padding: '4px' }}>{d}</div>
                        ))}
                    </div>
                    <div className="calendar-grid">
                        {calendarDays.map((day, idx) => (
                            <div
                                key={idx}
                                className={`calendar-day ${day === now.getDate() ? 'today' : ''} ${day && estrusdays.includes(day) ? 'estrus' : ''} ${day ? 'active' : ''}`}
                            >
                                {day || ''}
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(245, 158, 11, 0.3)' }}></span> Estrus Event
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '2px', border: '1px solid var(--color-primary)' }}></span> Today
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid-2">
                {/* Conception Rate Trend */}
                <div className="card">
                    <h3 className="card-title" style={{ marginBottom: '16px' }}>Conception Rate Trend</h3>
                    <div className="chart-container-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={conceptionData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    labelStyle={{ color: '#f9fafb' }}
                                />
                                <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} name="Conception Rate %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pregnancy Distribution */}
                <div className="card">
                    <h3 className="card-title" style={{ marginBottom: '16px' }}>Herd Pregnancy Status</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                        <div style={{ width: '160px', height: '160px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={breedDistribution}
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {breedDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <div style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }}></span>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Pregnant</span>
                                </div>
                                <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--color-success)' }}>
                                    {reproductionStats.pregnantCows}
                                </span>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f59e0b' }}></span>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Open</span>
                                </div>
                                <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--color-warning)' }}>
                                    {reproductionStats.openCows}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-glass-light)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ color: 'var(--text-tertiary)' }}>Inseminations this month</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{reproductionStats.inseminationsThisMonth}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '6px' }}>
                            <span style={{ color: 'var(--text-tertiary)' }}>Confirmations this month</span>
                            <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{reproductionStats.confirmationsThisMonth}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '6px' }}>
                            <span style={{ color: 'var(--text-tertiary)' }}>Avg calving interval</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{reproductionStats.avgCalvingInterval} days</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
