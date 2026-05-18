import React, { useState, useMemo } from 'react';
import {
    Milk, TrendingUp, Calendar, DollarSign, Activity,
    Search, ChevronDown, ChevronUp, AlertTriangle, Info,
    Sun, Droplets, BookOpen, BarChart3, ChevronRight,
    Clock, Zap, Target
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, CartesianGrid, Cell
} from 'recharts';
import {
    generateFarmPredictions, BREED_DATA, LACTATION_CURVE,
    SEASONAL_MULTIPLIERS, FEED_SCORES, getPhaseInfo
} from '../data/predictionDatasets';
import { useLanguage } from '../context/LanguageContext';
import { useCows } from '../context/CowContext';

// ─── Custom tooltip for charts ────────────────────────────────
function CurveTooltip({ active, payload }) {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
        <div className="pred-tooltip">
            <strong>Day {d.dim}</strong>
            <div>{d.yield.toFixed(1)} L/day</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>{d.phase}</div>
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
    return (
        <div className="pred-stat-card" style={{ '--pred-accent': color }}>
            <div className="pred-stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
            <div className="pred-stat-info">
                <span className="pred-stat-value">{value}</span>
                <span className="pred-stat-label">{label}</span>
                {sub && <span className="pred-stat-sub" style={{ color }}>{sub}</span>}
            </div>
        </div>
    );
}

// ─── Alert Banner ─────────────────────────────────────────────
function AlertBanner({ alerts }) {
    if (!alerts || alerts.length === 0) return null;
    return (
        <div className="pred-alerts">
            {alerts.map((a, i) => (
                <div key={i} className={`pred-alert pred-alert-${a.type}`}>
                    {a.type === 'error' ? <AlertTriangle size={15} /> :
                        a.type === 'warning' ? <AlertTriangle size={15} /> :
                            <Info size={15} />}
                    <span>{a.message}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Per-Cow Prediction Card ──────────────────────────────────
function CowPredictionCard({ pred, t, milkPrice, expanded, onToggle }) {
    if (!pred.valid) return null;

    // Generate lactation curve data for mini chart
    const curveData = useMemo(() => {
        return LACTATION_CURVE.filter(c => c.multiplier > 0).map(c => {
            const midDim = Math.floor((c.dimMin + c.dimMax) / 2);
            return {
                dim: midDim,
                yield: parseFloat((pred.breedData.avgYield * c.multiplier).toFixed(1)),
                phase: c.phase,
                isCurrent: pred.dim >= c.dimMin && pred.dim <= c.dimMax,
            };
        });
    }, [pred]);

    const phaseColor = pred.phaseInfo?.color || '#6b7280';

    return (
        <div className={`pred-cow-card ${expanded ? 'pred-cow-expanded' : ''}`}>
            {/* Header — always visible */}
            <div className="pred-cow-header" onClick={onToggle} role="button" tabIndex={0}>
                <div className="pred-cow-id-row">
                    <span className="pred-cow-tag">{pred.cowId}</span>
                    <span className="pred-cow-name">{pred.cowName}</span>
                    <span className="pred-cow-breed">{pred.breed}</span>
                </div>
                <div className="pred-cow-quick-stats">
                    <div className="pred-quick-yield">
                        <Milk size={14} />
                        <strong>{pred.dailyYield}</strong>
                        <span>L/day</span>
                    </div>
                    <div className="pred-phase-badge" style={{ background: `${phaseColor}18`, color: phaseColor }}>
                        {pred.phaseInfo?.emoji} {pred.phase}
                    </div>
                    <div className="pred-dim-badge">
                        Day {pred.dim}
                    </div>
                    {pred.isDry && <span className="pred-dry-badge">🔴 Dry</span>}
                    <ChevronRight size={16} className={`pred-chevron ${expanded ? 'rotated' : ''}`} />
                </div>
            </div>

            {/* Expanded Detail */}
            {expanded && (
                <div className="pred-cow-detail animate-fade-in">
                    {/* Alerts */}
                    <AlertBanner alerts={pred.alerts} />

                    {/* Yield Grid */}
                    <div className="pred-yield-grid">
                        <div className="pred-yield-box">
                            <span className="pred-yield-period">{t('dailyYield')}</span>
                            <span className="pred-yield-value">{pred.dailyYield} L</span>
                            <span className="pred-yield-revenue">₹{pred.dailyRevenue}</span>
                        </div>
                        <div className="pred-yield-box">
                            <span className="pred-yield-period">{t('thisWeek')}</span>
                            <span className="pred-yield-value">{pred.weeklyYield} L</span>
                            <span className="pred-yield-revenue">₹{pred.weeklyRevenue}</span>
                        </div>
                        <div className="pred-yield-box">
                            <span className="pred-yield-period">{t('thisMonth')}</span>
                            <span className="pred-yield-value">{pred.monthlyYield} L</span>
                            <span className="pred-yield-revenue">₹{pred.monthlyRevenue}</span>
                        </div>
                    </div>

                    {/* Expense & Profit Row */}
                    <div className="pred-profit-row">
                        <div className="pred-profit-box positive">
                            <span className="pred-profit-label">💰 Profit/day</span>
                            <span className={`pred-profit-value ${pred.dailyProfit >= 0 ? 'pos' : 'neg'}`}>
                                {pred.dailyProfit >= 0 ? '+' : ''}₹{pred.dailyProfit}
                            </span>
                            <span className="pred-profit-margin">{pred.profitMargin}% margin</span>
                        </div>
                        <div className="pred-expense-breakdown">
                            <span className="pred-expense-title">Daily Expenses: ₹{pred.expenses.totalDailyExpense}</span>
                            <div className="pred-expense-items">
                                <span>🌾 Feed: ₹{pred.expenses.feedCost}</span>
                                <span>💊 Medicine: ₹{pred.expenses.medicineCost}</span>
                                <span>👷 Labour: ₹{pred.expenses.labourCost}</span>
                            </div>
                        </div>
                    </div>

                    {/* Multiplier Breakdown */}
                    <div className="pred-mult-row">
                        <span className="pred-mult-label">🧮 Multipliers:</span>
                        <span className="pred-mult-chip">Curve: ×{pred.multipliers.curve}</span>
                        <span className="pred-mult-chip">Parity: ×{pred.multipliers.parity}</span>
                        <span className="pred-mult-chip">Season: ×{pred.multipliers.seasonal}</span>
                        <span className="pred-mult-chip">Feed: ×{pred.multipliers.feed}</span>
                        <span className="pred-mult-chip pred-mult-total">Combined: ×{pred.multipliers.combined}</span>
                    </div>

                    {/* Mini Lactation Curve */}
                    <div className="pred-curve-section">
                        <h4>{t('lactationCurve')} — {pred.breed}</h4>
                        <div style={{ width: '100%', height: 140 }}>
                            <ResponsiveContainer>
                                <AreaChart data={curveData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id={`curveGrad-${pred.cowId}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={phaseColor} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={phaseColor} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="dim" tick={{ fontSize: 10, fill: '#888' }} />
                                    <YAxis tick={{ fontSize: 10, fill: '#888' }} width={30} />
                                    <Tooltip content={<CurveTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="yield"
                                        stroke={phaseColor}
                                        fill={`url(#curveGrad-${pred.cowId})`}
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="pred-curve-marker">
                            📍 Current: Day {pred.dim} — {pred.phase} — {pred.dailyYield} L/day
                        </div>
                    </div>

                    {/* 7-Day Breakdown */}
                    <div className="pred-weekly-section">
                        <h4>{t('weeklyBreakdown')}</h4>
                        <div className="pred-weekly-bars">
                            {pred.weeklyBreakdown.map((d, i) => (
                                <div key={i} className="pred-weekly-bar-item">
                                    <div className="pred-bar-fill" style={{
                                        height: `${(d.yield / pred.breedData.peakYield) * 80}px`,
                                        background: phaseColor,
                                    }} />
                                    <span className="pred-bar-val">{d.yield}</span>
                                    <span className="pred-bar-label">{d.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Parity & Season Context */}
                    <div className="pred-context-row">
                        <div className="pred-context-chip">
                            🐄 Parity {pred.parityInfo.parity} — {pred.parityInfo.description}
                        </div>
                        <div className="pred-context-chip">
                            {pred.season.season} — ×{pred.season.multiplier}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Breed Guide Tab ──────────────────────────────────────────
function BreedGuideTab({ t }) {
    const breeds = Object.values(BREED_DATA);

    return (
        <div className="pred-tab-content animate-fade-in">
            <h3 className="pred-section-title">
                <BookOpen size={20} />
                {t('breedGuide')} — South India Dairy Breeds
            </h3>
            <div className="pred-breed-grid">
                {breeds.map(b => (
                    <div key={b.key} className="pred-breed-card">
                        <div className="pred-breed-header">
                            <strong>{b.fullName}</strong>
                            <span className="pred-breed-fat">{b.fatPercent}% fat</span>
                        </div>
                        <div className="pred-breed-stats">
                            <div className="pred-breed-stat">
                                <Milk size={14} />
                                <span>{b.minYield} – {b.maxYield} L/day</span>
                            </div>
                            <div className="pred-breed-stat">
                                <Calendar size={14} />
                                <span>{b.total305Day.toLocaleString()} L (305 days)</span>
                            </div>
                            <div className="pred-breed-stat">
                                <Sun size={14} />
                                <span>Heat sensitivity: {b.heatSensitivity}</span>
                            </div>
                        </div>
                        <p className="pred-breed-best">{b.bestFor}</p>
                    </div>
                ))}
            </div>

            {/* Season Reference */}
            <h3 className="pred-section-title" style={{ marginTop: 32 }}>
                <Sun size={20} />
                {t('seasonalImpact')} — South India Monthly Multipliers
            </h3>
            <div className="card" style={{ overflow: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Season</th>
                            <th>Multiplier</th>
                            <th>Impact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SEASONAL_MULTIPLIERS.map(s => {
                            const currentMonth = new Date().getMonth();
                            const isCurrent = s.month === currentMonth;
                            return (
                                <tr key={s.month} className={isCurrent ? 'pred-current-month' : ''}>
                                    <td>
                                        <strong>{s.name}</strong>
                                        {isCurrent && <span className="pred-now-badge">NOW</span>}
                                    </td>
                                    <td>{s.season}</td>
                                    <td>
                                        <span className={`pred-mult-badge ${s.multiplier < 0.90 ? 'low' : s.multiplier >= 1 ? 'high' : 'mid'}`}>
                                            ×{s.multiplier}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 12 }}>{s.reason}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// =================== MAIN COMPONENT ===================
export default function MilkPrediction() {
    const { t } = useLanguage();
    const { cows } = useCows();
    const [activeTab, setActiveTab] = useState('overview');
    const [feedScore, setFeedScore] = useState(3);
    const [milkPrice, setMilkPrice] = useState(35);
    const [expandedCow, setExpandedCow] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Generate all predictions
    const farmData = useMemo(() => {
        return generateFarmPredictions(cows, feedScore, milkPrice);
    }, [cows, feedScore, milkPrice]);

    const { predictions, summary } = farmData;

    // Filter cows by search
    const filteredPredictions = useMemo(() => {
        if (!searchQuery) return predictions.filter(p => p.valid);
        const q = searchQuery.toLowerCase();
        return predictions.filter(p =>
            p.valid && (
                p.cowId?.toLowerCase().includes(q) ||
                p.cowName?.toLowerCase().includes(q) ||
                p.breed?.toLowerCase().includes(q)
            )
        );
    }, [predictions, searchQuery]);

    // Current season info
    const currentMonth = new Date().getMonth();
    const currentSeason = SEASONAL_MULTIPLIERS[currentMonth];

    // Tabs
    const tabs = [
        { id: 'overview', label: t('farmOverview'), icon: BarChart3 },
        { id: 'percow', label: t('perCowPrediction'), icon: Target },
        { id: 'breeds', label: t('breedGuide'), icon: BookOpen },
    ];

    return (
        <div className="animate-fade-in">
            {/* Controls Bar */}
            <div className="pred-controls">
                <div className="pred-control-group">
                    <label>{t('milkPrice')}</label>
                    <div className="pred-price-input">
                        <span>₹</span>
                        <input
                            type="number"
                            value={milkPrice}
                            onChange={e => setMilkPrice(Math.max(1, parseInt(e.target.value) || 35))}
                            min="1" max="100"
                        />
                        <span>{t('perLitre')}</span>
                    </div>
                </div>
                <div className="pred-control-group">
                    <label>{t('feedScore')}</label>
                    <div className="pred-feed-selector">
                        {FEED_SCORES.map(f => (
                            <button
                                key={f.score}
                                className={`pred-feed-btn ${feedScore === f.score ? 'active' : ''}`}
                                onClick={() => setFeedScore(f.score)}
                                title={f.description}
                            >
                                {f.score}
                            </button>
                        ))}
                        <span className="pred-feed-label">{FEED_SCORES.find(f => f.score === feedScore)?.label}</span>
                    </div>
                </div>
                <div className="pred-season-badge">
                    <Sun size={14} />
                    {currentSeason.season} (×{currentSeason.multiplier})
                </div>
            </div>

            {/* Summary Stat Cards */}
            <div className="pred-stats-row pred-stats-6">
                <StatCard
                    icon={<Milk size={20} />}
                    label={t('predictedToday')}
                    value={`${summary.totalDailyYield} L`}
                    sub={`₹${summary.totalDailyRevenue.toLocaleString()} revenue`}
                    color="#f59e0b"
                />
                <StatCard
                    icon={<DollarSign size={20} />}
                    label="Net Profit / Day"
                    value={`₹${summary.totalDailyProfit?.toLocaleString() || 0}`}
                    sub={`${summary.profitMargin || 0}% margin`}
                    color={summary.totalDailyProfit >= 0 ? '#10b981' : '#ef4444'}
                />
                <StatCard
                    icon={<TrendingUp size={20} />}
                    label={t('weeklyForecast')}
                    value={`${summary.totalWeeklyYield.toLocaleString()} L`}
                    sub={`₹${summary.totalWeeklyProfit?.toLocaleString() || 0} profit`}
                    color="#10b981"
                />
                <StatCard
                    icon={<Calendar size={20} />}
                    label={t('monthlyForecast')}
                    value={`${summary.totalMonthlyYield.toLocaleString()} L`}
                    sub={`₹${summary.totalMonthlyProfit?.toLocaleString() || 0} profit`}
                    color="#3b82f6"
                />
                <StatCard
                    icon={<Activity size={20} />}
                    label={t('activeMilking')}
                    value={summary.activeMilking}
                    sub={`${summary.profitableCows || 0} profitable`}
                    color="#8b5cf6"
                />
                <StatCard
                    icon={<AlertTriangle size={20} />}
                    label="Expenses / Day"
                    value={`₹${summary.totalDailyExpense?.toLocaleString() || 0}`}
                    sub={`${summary.lossMakingCows || 0} at loss`}
                    color="#ef4444"
                />
            </div>

            {/* Global heat stress alert */}
            {[2, 3, 4].includes(currentMonth) && (
                <div className="pred-alert pred-alert-warning" style={{ marginBottom: 16 }}>
                    <AlertTriangle size={16} />
                    <span>
                        <strong>Summer heat stress season</strong> — ensure shading, extra water (60–80 L/cow/day), and additional green fodder to reduce yield loss
                    </span>
                </div>
            )}

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
            {activeTab === 'overview' && (
                <div className="pred-tab-content animate-fade-in">
                    {/* Phase Distribution */}
                    <div className="pred-phase-distribution">
                        <h3 className="pred-section-title">
                            <Activity size={18} />
                            Herd Lactation Distribution
                        </h3>
                        <div className="pred-phase-bars">
                            {['Early', 'Rising to Peak', 'Peak', 'Mid Lactation', 'Late Lactation', 'Dry-off Zone', 'Dry Period'].map(phase => {
                                const count = predictions.filter(p => p.valid && p.phase === phase).length;
                                const pct = predictions.length > 0 ? (count / predictions.length * 100) : 0;
                                const info = getPhaseInfo(
                                    phase === 'Peak' ? 1.0 : phase === 'Rising to Peak' ? 0.96 :
                                        phase === 'Mid Lactation' ? 0.85 : phase === 'Late Lactation' ? 0.60 :
                                            phase === 'Dry-off Zone' ? 0.30 : phase === 'Dry Period' ? 0 : 0.70
                                );
                                return (
                                    <div key={phase} className="pred-phase-row">
                                        <span className="pred-phase-name" style={{ color: info.color }}>
                                            {info.emoji} {phase}
                                        </span>
                                        <div className="pred-phase-bar-bg">
                                            <div className="pred-phase-bar-fill" style={{
                                                width: `${pct}%`,
                                                background: info.color,
                                            }} />
                                        </div>
                                        <span className="pred-phase-count">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Producers */}
                    <div className="card" style={{ marginTop: 20 }}>
                        <div className="card-header">
                            <h3>🏆 Top 10 Producers — Predicted Today</h3>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tag</th>
                                    <th>Name</th>
                                    <th>Breed</th>
                                    <th>DIM</th>
                                    <th>Phase</th>
                                    <th>Today (L)</th>
                                    <th>Revenue</th>
                                    <th>Expense</th>
                                    <th>Profit/day</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPredictions
                                    .filter(p => !p.isDry)
                                    .sort((a, b) => b.dailyYield - a.dailyYield)
                                    .slice(0, 10)
                                    .map((p, i) => (
                                        <tr key={p.cowId} className="pred-row-clickable" onClick={() => {
                                            setActiveTab('percow');
                                            setExpandedCow(p.cowId);
                                        }}>
                                            <td><strong>{i + 1}</strong></td>
                                            <td className="pred-tag">{p.cowId}</td>
                                            <td>{p.cowName}</td>
                                            <td style={{ fontSize: 12 }}>{p.breed}</td>
                                            <td>{p.dim}</td>
                                            <td>
                                                <span className="pred-phase-badge-sm" style={{
                                                    background: `${p.phaseInfo?.color}18`,
                                                    color: p.phaseInfo?.color
                                                }}>
                                                    {p.phase}
                                                </span>
                                            </td>
                                            <td><strong>{p.dailyYield}</strong></td>
                                            <td style={{ color: '#10b981' }}>₹{p.dailyRevenue}</td>
                                            <td style={{ color: '#ef4444', fontSize: 12 }}>₹{p.expenses?.totalDailyExpense}</td>
                                            <td style={{ color: p.dailyProfit >= 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                                                {p.dailyProfit >= 0 ? '+' : ''}₹{p.dailyProfit}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'percow' && (
                <div className="pred-tab-content animate-fade-in">
                    {/* Search */}
                    <div className="pred-search">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder={t('searchCows')}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <span className="pred-search-count">{filteredPredictions.filter(p => !p.isDry).length} active</span>
                    </div>

                    {/* Cow Cards */}
                    <div className="pred-cow-list">
                        {filteredPredictions
                            .sort((a, b) => {
                                // Show active first, then dry
                                if (a.isDry !== b.isDry) return a.isDry ? 1 : -1;
                                return b.dailyYield - a.dailyYield;
                            })
                            .slice(0, 50)
                            .map(pred => (
                                <CowPredictionCard
                                    key={pred.cowId}
                                    pred={pred}
                                    t={t}
                                    milkPrice={milkPrice}
                                    expanded={expandedCow === pred.cowId}
                                    onToggle={() => setExpandedCow(
                                        expandedCow === pred.cowId ? null : pred.cowId
                                    )}
                                />
                            ))}
                    </div>
                </div>
            )}

            {activeTab === 'breeds' && <BreedGuideTab t={t} />}
        </div>
    );
}
