import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ComposedChart, Line, Bar, Legend
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Receipt, ArrowUpRight } from 'lucide-react';
import AnimatedNumber from '../components/AnimatedNumber';
import EmptyState from '../components/EmptyState';
import { financials, profitTrend, priceForecast, marketPrices, savingRecommendations } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { useCows } from '../context/CowContext';

const WARM_COLORS = ['#d4a039', '#40916c', '#c4704c', '#5b7fa5', '#7a7468'];

export default function Financials() {
    const { t } = useLanguage();
    const [priceTab, setPriceTab] = useState('history');
    const totalCost = financials.costBreakdown.length > 0 ? financials.costBreakdown.reduce((s, c) => s + c.value, 0) : 0;
    const isEmpty = profitTrend.length === 0 && financials.costBreakdown.length === 0;

    return (
        <div className="animate-fade-in">
            {/* Summary Cards */}
            <div className="grid-4 stagger mb-24">
                <div className="stat-card green">
                    <div className="stat-card-icon"><DollarSign size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={financials.monthlyRevenue / 100000} prefix="₹" suffix="L" decimals={1} /></div>
                    <div className="stat-card-label">{t('monthlyRevenue')}</div>
                    <div className="stat-card-trend up"><TrendingUp size={12} /> +4.2%</div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-card-icon"><Receipt size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={(financials.monthlyFeedCost + financials.monthlyVetCost + financials.monthlyLabourCost + financials.monthlyEnergyCost + financials.monthlyOtherCost) / 100000} prefix="₹" suffix="L" decimals={1} /></div>
                    <div className="stat-card-label">{t('monthlyCosts')}</div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-card-icon"><PiggyBank size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={financials.monthlyProfit / 100000} prefix="₹" suffix="L" decimals={1} /></div>
                    <div className="stat-card-label">{t('monthlyProfit')}</div>
                    <div className="stat-card-trend up"><TrendingUp size={12} /> +{financials.profitMargin}%</div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-card-icon"><ArrowUpRight size={20} /></div>
                    <div className="stat-card-value"><AnimatedNumber value={financials.monthlyProfit / 200} prefix="₹" /></div>
                    <div className="stat-card-label">{t('profitPerCow')}</div>
                </div>
            </div>

            {/* Revenue & Profit Trend + Cost Breakdown */}
            <div className="grid-2-1 mb-24">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Revenue, Cost & Profit Trend</h3>
                    </div>
                    {profitTrend.length > 0 ? (
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={profitTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#40916c" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#40916c" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,232,0.04)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} />
                                    <Tooltip contentStyle={{ background: '#1a1d17', border: '1px solid rgba(245,240,232,0.1)', borderRadius: '8px' }} labelStyle={{ color: '#f5f0e8' }} formatter={v => [`₹${(v / 100000).toFixed(2)}L`]} />
                                    <Bar dataKey="revenue" fill="#d4a039" opacity={0.35} radius={[3, 3, 0, 0]} name="Revenue" />
                                    <Bar dataKey="cost" fill="#c0392b" opacity={0.3} radius={[3, 3, 0, 0]} name="Cost" />
                                    <Line type="monotone" dataKey="profit" stroke="#40916c" strokeWidth={2.5} dot={{ fill: '#40916c', r: 3 }} name="Profit" />
                                    <Legend />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <EmptyState icon={TrendingUp} title="No Financial Data" message="Revenue, cost, and profit trends will appear once transactions are recorded." />
                    )}
                </div>

                {/* Cost Breakdown — Horizontal Bars */}
                <div className="card">
                    <h3 className="card-title" style={{ marginBottom: '16px' }}>Cost Breakdown</h3>
                    {financials.costBreakdown.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {financials.costBreakdown.map((item, idx) => {
                                const pct = totalCost > 0 ? Math.round((item.value / totalCost) * 100) : 0;
                                return (
                                    <div key={idx}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'DM Serif Display, serif' }}>
                                                ₹{(item.value / 1000).toFixed(0)}K
                                            </span>
                                        </div>
                                        <div style={{ height: '8px', background: 'rgba(245,240,232,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${pct}%`, height: '100%', background: WARM_COLORS[idx], borderRadius: '4px', transition: 'width 0.8s ease' }} />
                                        </div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{pct}%</div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState icon={Receipt} title="No Cost Data" message="Cost breakdown will appear once expenses are logged." compact />
                    )}
                </div>
            </div>

            {/* Market Price Section */}
            <div className="card mb-24">
                <div className="card-header">
                    <h3 className="card-title">{t('milkMarketPrice')}</h3>
                    <div className="tab-group">
                        <button className={`tab-btn ${priceTab === 'history' ? 'active' : ''}`} onClick={() => setPriceTab('history')}>History (90D)</button>
                        <button className={`tab-btn ${priceTab === 'forecast' ? 'active' : ''}`} onClick={() => setPriceTab('forecast')}>Forecast (30D)</button>
                    </div>
                </div>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                        {priceTab === 'history' ? (
                            <ComposedChart data={marketPrices} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,232,0.04)" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={8} />
                                <YAxis tick={{ fontSize: 10 }} domain={[24, 38]} tickFormatter={v => `₹${v}`} />
                                <Tooltip
                                    contentStyle={{ background: '#1a1d17', border: '1px solid rgba(245,240,232,0.1)', borderRadius: '8px' }}
                                    labelStyle={{ color: '#f5f0e8' }}
                                    formatter={v => [`₹${v}/L`]}
                                />
                                <Area type="monotone" dataKey="price" stroke="#d4a039" strokeWidth={2} fill="rgba(212, 160, 57, 0.1)" name="Spot Price" />
                                <Line type="monotone" dataKey="cooperative" stroke="#5b7fa5" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Cooperative Rate" />
                                <Legend />
                            </ComposedChart>
                        ) : (
                            <AreaChart data={priceForecast} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="priceConfidence" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#40916c" stopOpacity={0.15} />
                                        <stop offset="100%" stopColor="#40916c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,232,0.04)" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={3} />
                                <YAxis tick={{ fontSize: 10 }} domain={[26, 40]} tickFormatter={v => `₹${v}`} />
                                <Tooltip
                                    contentStyle={{ background: '#1a1d17', border: '1px solid rgba(245,240,232,0.1)', borderRadius: '8px' }}
                                    labelStyle={{ color: '#f5f0e8' }}
                                    formatter={v => [`₹${v}/L`]}
                                />
                                <Area type="monotone" dataKey="upper" stroke="none" fill="rgba(64, 145, 108, 0.1)" name="Upper Bound" />
                                <Area type="monotone" dataKey="lower" stroke="none" fill="rgba(64, 145, 108, 0.05)" name="Lower Bound" />
                                <Area type="monotone" dataKey="forecast" stroke="#40916c" strokeWidth={2} fill="url(#priceConfidence)" name="Forecast" />
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                </div>
                {priceTab === 'forecast' && (
                    <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(212, 160, 57, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(212, 160, 57, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <TrendingUp size={16} color="var(--color-primary)" />
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>AI Recommendation: Sell at ₹36/L next Tuesday</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                            Market price forecasted to peak. Redirect 20% volume to spot market for estimated additional revenue of ₹4,800/day. Confidence: 82%.
                        </p>
                    </div>
                )}
            </div>

            {/* Revenue Breakdown */}
            <div className="card">
                <h3 className="card-title" style={{ marginBottom: '16px' }}>Revenue Sources</h3>
                {(financials.revenueBreakdown || []).length > 0 ? (
                    <div className="grid-4">
                        {financials.revenueBreakdown.map((item, idx) => (
                            <div key={idx} className="financial-card">
                                <div className="financial-icon" style={{ background: `${WARM_COLORS[idx]}20`, color: WARM_COLORS[idx] }}>
                                    <DollarSign size={20} />
                                </div>
                                <div className="financial-details">
                                    <h4>{item.name}</h4>
                                    <div className="amount" style={{ color: 'var(--text-primary)' }}>
                                        ₹{(item.value / 100000).toFixed(2)}L
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState icon={DollarSign} title="No Revenue Sources" message="Revenue breakdown will appear once income is recorded." />
                )}
            </div>
        </div>
    );
}
