import React, { useState } from 'react';
import { Wheat, Clock, AlertTriangle, DollarSign, Package, TrendingDown } from 'lucide-react';
import AnimatedNumber from '../components/AnimatedNumber';
import EmptyState from '../components/EmptyState';
import { feedSchedule, feedInventory, savingRecommendations } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export default function FeedManagement() {
    const { t } = useLanguage();
    const [feedTab, setFeedTab] = useState('Today');
    const totalDailyCost = feedSchedule.length > 0 ? feedSchedule.reduce((s, g) => {
        const cost = parseInt(g.cost.replace(/[₹,/day]/g, ''));
        return s + cost * g.count;
    }, 0) : 0;
    const isEmpty = feedSchedule.length === 0 && feedInventory.length === 0;

    return (
        <div className="animate-fade-in">
            {/* Summary Cards */}
            <div className="grid-4 stagger mb-24">
                <div className="stat-card green">
                    <div className="stat-card-icon"><Wheat size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={totalDailyCost / 1000} prefix="₹" suffix="K" /></div>
                    <div className="stat-card-label">{t('dailyFeedCost')}</div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-card-icon"><Package size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={6} /></div>
                    <div className="stat-card-label">{t('feedTypesActive')}</div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-card-icon"><AlertTriangle size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={2} /></div>
                    <div className="stat-card-label">{t('lowStockItems')}</div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-card-icon"><TrendingDown size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={8.2} prefix="₹" decimals={1} /></div>
                    <div className="stat-card-label">{t('feedCostPerLitre')}</div>
                </div>
            </div>

            <div className="grid-2-1 mb-24">
                {/* Feeding Schedule */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{t('todaysFeedingSchedule')}</h3>
                        <div className="tab-group">
                            {['Today', 'Tomorrow'].map(t => (
                                <button key={t} className={`tab-btn ${feedTab === t ? 'active' : ''}`} onClick={() => setFeedTab(t)}>{t}</button>
                            ))}
                        </div>
                    </div>
                    {feedSchedule.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>{t('cattleGroup')}</th>
                                    <th>{t('count')}</th>
                                    <th>{t('dryMatter')}</th>
                                    <th>{t('protein')}</th>
                                    <th>{t('cost')}</th>
                                    <th>{t('timing')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedSchedule.map(schedule => (
                                    <tr key={schedule.group}>
                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{schedule.group}</td>
                                        <td><span className="badge info">{schedule.count} cows</span></td>
                                        <td>{schedule.dryMatter}</td>
                                        <td>{schedule.protein}</td>
                                        <td style={{ color: 'var(--color-warning)', fontWeight: 600 }}>{schedule.cost}</td>
                                        <td style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{schedule.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState icon={Wheat} title="No Feed Schedule" message="Set up feeding groups and schedules to manage nutrition for your herd." compact />
                    )}
                </div>

                {/* Feed Inventory */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{t('feedInventory')}</h3>
                    </div>
                    {feedInventory.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {feedInventory.map(item => (
                                <div key={item.item} style={{
                                    padding: '12px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-glass-light)',
                                    border: item.status === 'critical' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-color)',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.item}</span>
                                        <span className={`badge ${item.status === 'good' ? 'success' : item.status === 'warning' ? 'warning' : 'critical'}`}>
                                            {item.daysRemaining}d left
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Stock: {item.stock}</div>
                                    <div className="progress-bar" style={{ height: '6px' }}>
                                        <div
                                            className={`progress-fill progress-fill-animated ${item.status === 'good' ? 'green' : item.status === 'warning' ? 'orange' : 'orange'}`}
                                            style={{ width: `${Math.min((item.daysRemaining / 15) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={Package} title="No Inventory" message="Add feed items to track stock levels and get low-stock alerts." compact />
                    )}
                </div>
            </div>

            {/* AI Cost Optimization Recommendations */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">{t('aiCostOptimization')}</h3>
                    <span className="badge success">
                        Total Savings: ₹{savingRecommendations.reduce((s, r) => s + r.saving, 0).toLocaleString()}/mo
                    </span>
                </div>
                {savingRecommendations.length > 0 ? (
                    <div className="grid-4 stagger">
                        {savingRecommendations.map((rec, idx) => (
                            <div key={idx} className="rec-card">
                                <div className="rec-card-header">
                                    <div className="rec-card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                                        {rec.icon}
                                    </div>
                                    <h4>{rec.title}</h4>
                                </div>
                                <p>{rec.description}</p>
                                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-success)', fontFamily: 'Outfit' }}>
                                        ₹{rec.saving.toLocaleString()}
                                    </span>
                                    <span className="badge info">{rec.confidence}% confidence</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState icon={TrendingDown} title="No Recommendations" message="AI-powered cost optimization suggestions will appear once enough feed data is available." />
                )}
            </div>
        </div>
    );
}
