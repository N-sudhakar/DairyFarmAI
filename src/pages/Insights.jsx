import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { BrainCircuit, TrendingUp, Shield, Scissors, Target, Zap, AlertTriangle } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { diseaseRiskHeatmap, cullingCandidates, yieldForecast, benchmarks, savingRecommendations, cows } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export default function Insights() {
    const { t } = useLanguage();
    // Benchmark comparison data for radar chart
    const radarData = [
        { metric: 'Yield', farm: (benchmarks.farmAvgYield / benchmarks.topFarmsYield * 100).toFixed(0), regional: (benchmarks.regionalAvgYield / benchmarks.topFarmsYield * 100).toFixed(0), top: 100 },
        { metric: 'SCC (Low=Good)', farm: ((1 - benchmarks.farmSCC / 250000) * 100).toFixed(0), regional: ((1 - benchmarks.regionalSCC / 250000) * 100).toFixed(0), top: ((1 - benchmarks.topFarmsSCC / 250000) * 100).toFixed(0) },
        { metric: 'Feed Cost', farm: ((1 - benchmarks.farmFeedCost / 12) * 100).toFixed(0), regional: ((1 - benchmarks.regionalFeedCost / 12) * 100).toFixed(0), top: ((1 - benchmarks.topFarmsFeedCost / 12) * 100).toFixed(0) },
        { metric: 'Profit/Cow', farm: (benchmarks.farmProfitPerCow / benchmarks.topFarmsProfitPerCow * 100).toFixed(0), regional: (benchmarks.regionalProfitPerCow / benchmarks.topFarmsProfitPerCow * 100).toFixed(0), top: 100 },
    ];

    return (
        <div className="animate-fade-in">
            {/* AI Insight Cards */}
            <div className="grid-3 stagger mb-24">
                <div className="rec-card" style={{ borderLeft: '3px solid var(--color-success)' }}>
                    <div className="rec-card-header">
                        <div className="rec-card-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>
                            <TrendingUp size={16} />
                        </div>
                        <h4>Yield Forecast</h4>
                    </div>
                    <p>30-day milk yield projected at <strong style={{ color: 'var(--color-success)' }}>+2.8%</strong> above current levels. Optimal conditions forecasted for the next 2 weeks.</p>
                    <div style={{ marginTop: '8px', padding: '8px 12px', background: 'var(--bg-glass-light)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        Confidence: 84% • Updated 2h ago
                    </div>
                </div>

                <div className="rec-card" style={{ borderLeft: '3px solid var(--color-warning)' }}>
                    <div className="rec-card-header">
                        <div className="rec-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-warning)' }}>
                            <Shield size={16} />
                        </div>
                        <h4>Disease Risk Alert</h4>
                    </div>
                    <p>Moderate increase in <strong style={{ color: 'var(--color-warning)' }}>mastitis risk</strong> detected in next 5 days across Barn-2 cluster. 8 cows in elevated risk zone.</p>
                    <div style={{ marginTop: '8px', padding: '8px 12px', background: 'var(--bg-glass-light)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        Model: LSTM + Isolation Forest • Drift: Normal
                    </div>
                </div>

                <div className="rec-card" style={{ borderLeft: '3px solid var(--color-info)' }}>
                    <div className="rec-card-header">
                        <div className="rec-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-info)' }}>
                            <Zap size={16} />
                        </div>
                        <h4>Optimization Potential</h4>
                    </div>
                    <p>AI identifies <strong style={{ color: 'var(--color-info)' }}>₹64,096/month</strong> in untapped savings through feed optimization, preventive health, and market timing.</p>
                    <div style={{ marginTop: '8px', padding: '8px 12px', background: 'var(--bg-glass-light)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        Based on 200 cows • 4 optimization areas
                    </div>
                </div>
            </div>

            {/* Disease Risk Heatmap + Yield Forecast */}
            <div className="grid-2 mb-24">
                {/* Heatmap */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">🔥 Disease Risk Heatmap — Next 14 Days</h3>
                    </div>
                    {(diseaseRiskHeatmap.days || []).length > 0 && (diseaseRiskHeatmap.data || []).length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(14, 1fr)', gap: '3px', marginBottom: '4px' }}>
                                <div></div>
                                {diseaseRiskHeatmap.days.map((day, i) => (
                                    <div key={i} style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center' }}>{day}</div>
                                ))}
                            </div>
                            {diseaseRiskHeatmap.categories.map((cat, catIdx) => (
                                <div key={cat} style={{ display: 'grid', gridTemplateColumns: '100px repeat(14, 1fr)', gap: '3px', marginBottom: '3px' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center' }}>{cat}</div>
                                    {(diseaseRiskHeatmap.data[catIdx] || []).map((level, dayIdx) => (
                                        <div key={dayIdx} className={`heatmap-cell level-${level}`} title={`${cat}: Risk Level ${level} on ${diseaseRiskHeatmap.days[dayIdx]}`} />
                                    ))}
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', fontSize: '10px', color: 'var(--text-muted)' }}>
                                <span>Low</span>
                                {[0, 1, 2, 3, 4].map(l => (
                                    <div key={l} className={`heatmap-cell level-${l}`} style={{ width: '16px', height: '16px', display: 'inline-block' }} />
                                ))}
                                <span>High</span>
                            </div>
                        </div>
                    ) : (
                        <EmptyState icon={Shield} title="No Risk Data" message="Disease risk heatmap will appear once health monitoring data is available." compact />
                    )}
                </div>

                {/* Yield Forecast */}
                <div className="card">
                    <h3 className="card-title" style={{ marginBottom: '16px' }}>📈 30-Day Yield Forecast</h3>
                    {yieldForecast.length > 0 ? (
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={yieldForecast} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={3} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} labelStyle={{ color: '#f9fafb' }} />
                                    <Area type="monotone" dataKey="upper" stroke="none" fill="rgba(16, 185, 129, 0.08)" name="Upper Bound" />
                                    <Area type="monotone" dataKey="lower" stroke="none" fill="white" fillOpacity={0} name="Lower Bound" />
                                    <Area type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} fill="url(#forecastGrad)" name="Forecast (L)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <EmptyState icon={TrendingUp} title="No Forecast Data" message="Yield forecast will appear once sufficient production history is available." compact />
                    )}
                </div>
            </div>

            {/* Culling Candidates + Benchmark Radar */}
            <div className="grid-2 mb-24">
                {/* Culling Candidates */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">✂️ Optimal Culling Candidates</h3>
                        <span className="badge warning">{cullingCandidates.length} reviewed</span>
                    </div>
                    {cullingCandidates.length > 0 ? (
                        <table className="data-table">
                            <thead><tr><th>Cow</th><th>Age</th><th>Avg Yield</th><th>Issue</th><th>Decision</th></tr></thead>
                            <tbody>
                                {cullingCandidates.map(cow => (
                                    <tr key={cow.cowId}>
                                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>🐄</span><div><div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{cow.name}</div><div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{cow.cowId}</div></div></div></td>
                                        <td>{cow.age}y (P{cow.parity})</td>
                                        <td style={{ fontFamily: 'Outfit', fontWeight: 600 }}>{cow.avgYield}L</td>
                                        <td style={{ fontSize: '12px' }}>{cow.healthHistory}</td>
                                        <td>
                                            <span className={`badge ${cow.recommendation === 'Cull' ? 'critical' : 'warning'}`}>{cow.recommendation}</span>
                                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{cow.financialJustification}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState icon={Scissors} title="No Culling Candidates" message="AI-driven culling recommendations will appear once enough herd data is analyzed." compact />
                    )}
                </div>

                {/* Benchmark Comparison */}
                <div className="card">
                    <h3 className="card-title" style={{ marginBottom: '16px' }}>📊 Farm Performance vs Benchmarks</h3>
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                <PolarRadiusAxis tick={false} domain={[0, 100]} axisLine={false} />
                                <Radar name="Your Farm" dataKey="farm" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                                <Radar name="Regional Avg" dataKey="regional" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={1.5} />
                                <Radar name="Top 10%" dataKey="top" stroke="#3b82f6" fill="none" strokeWidth={1} strokeDasharray="4 4" />
                                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px', fontSize: '11px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '16px', height: '3px', background: '#10b981', borderRadius: '2px' }}></span>
                            <span style={{ color: 'var(--text-secondary)' }}>Your Farm</span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '16px', height: '3px', background: '#f59e0b', borderRadius: '2px' }}></span>
                            <span style={{ color: 'var(--text-secondary)' }}>Regional Avg</span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '16px', height: '3px', background: '#3b82f6', borderRadius: '2px', borderTop: '1px dashed #3b82f6' }}></span>
                            <span style={{ color: 'var(--text-secondary)' }}>Top 10%</span>
                        </span>
                    </div>
                    {/* Benchmark Table */}
                    <div style={{ marginTop: '16px' }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>Metric</th><th>Your Farm</th><th>Regional</th><th>Top 10%</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Avg Yield (L/cow/day)</td>
                                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>{benchmarks.farmAvgYield}</td>
                                    <td>{benchmarks.regionalAvgYield}</td>
                                    <td style={{ color: 'var(--color-info)' }}>{benchmarks.topFarmsYield}</td>
                                </tr>
                                <tr>
                                    <td>SCC (cells/mL)</td>
                                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>{(benchmarks.farmSCC / 1000).toFixed(0)}K</td>
                                    <td>{(benchmarks.regionalSCC / 1000).toFixed(0)}K</td>
                                    <td style={{ color: 'var(--color-info)' }}>{(benchmarks.topFarmsSCC / 1000).toFixed(0)}K</td>
                                </tr>
                                <tr>
                                    <td>Feed Cost (₹/L)</td>
                                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>₹{benchmarks.farmFeedCost}</td>
                                    <td>₹{benchmarks.regionalFeedCost}</td>
                                    <td style={{ color: 'var(--color-info)' }}>₹{benchmarks.topFarmsFeedCost}</td>
                                </tr>
                                <tr>
                                    <td>Profit/Cow/Mo (₹)</td>
                                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>₹{benchmarks.farmProfitPerCow.toLocaleString()}</td>
                                    <td>₹{benchmarks.regionalProfitPerCow.toLocaleString()}</td>
                                    <td style={{ color: 'var(--color-info)' }}>₹{benchmarks.topFarmsProfitPerCow.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Model Performance Summary */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">🤖 AI Model Performance Summary</h3>
                    <span className="badge success">All models online</span>
                </div>
                <div className="grid-4 stagger">
                    {[
                        { name: 'Mastitis Detection', metric: 'Sensitivity', value: '87%', target: '>85%', status: 'pass', model: 'LSTM + Threshold' },
                        { name: 'Estrus Prediction', metric: 'Detection Rate', value: '91%', target: '>90%', status: 'pass', model: 'GBT + LSTM Ensemble' },
                        { name: 'Yield Forecast', metric: 'MAPE (7-day)', value: '6.2%', target: '<8%', status: 'pass', model: 'Temporal Fusion Transformer' },
                        { name: 'Lameness Detection', metric: "Cohen's Kappa", value: '0.78', target: '>0.75', status: 'pass', model: 'Pose Est. + LSTM' },
                    ].map((model, idx) => (
                        <div key={idx} style={{
                            padding: '16px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-color)',
                        }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{model.name}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--color-success)' }}>{model.value}</span>
                                <span className="badge success">✓ {model.status}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{model.metric} (Target: {model.target})</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Model: {model.model}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
