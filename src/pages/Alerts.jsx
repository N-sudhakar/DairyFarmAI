import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock, Filter, ShieldAlert, Heart, Wheat, DollarSign } from 'lucide-react';
import AnimatedNumber from '../components/AnimatedNumber';
import EmptyState from '../components/EmptyState';
import { alerts as initialAlerts } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

const categoryIcons = {
    Health: Heart,
    Reproduction: ShieldAlert,
    Feed: Wheat,
    Quality: AlertTriangle,
    Financial: DollarSign,
};

export default function Alerts() {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [alerts, setAlerts] = useState(initialAlerts);

    const handleAcknowledge = (alertId) => {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    };

    const filteredAlerts = alerts.filter(alert => {
        const matchCategory = filter === 'All' || alert.category === filter;
        const matchStatus = statusFilter === 'All' ||
            (statusFilter === 'New' && !alert.acknowledged) ||
            (statusFilter === 'Acknowledged' && alert.acknowledged);
        return matchCategory && matchStatus;
    });

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const highCount = alerts.filter(a => a.severity === 'high').length;
    const warningCount = alerts.filter(a => a.severity === 'warning').length;
    const infoCount = alerts.filter(a => a.severity === 'info').length;

    return (
        <div className="animate-fade-in">
            {/* Alert Stats */}
            <div className="grid-4 stagger mb-24">
                <div className="stat-card" style={{ borderTop: '3px solid var(--color-critical)' }}>
                    <div className="stat-card-icon" style={{ background: 'rgba(220, 38, 38, 0.15)', color: 'var(--color-critical)' }}>
                        <AlertTriangle size={20} />
                    </div>
                    <div className="stat-card-value"><AnimatedNumber value={criticalCount} /></div>
                    <div className="stat-card-label">Critical Alerts</div>
                </div>
                <div className="stat-card" style={{ borderTop: '3px solid var(--color-danger)' }}>
                    <div className="stat-card-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--color-danger)' }}>
                        <ShieldAlert size={20} />
                    </div>
                    <div className="stat-card-value"><AnimatedNumber value={highCount} /></div>
                    <div className="stat-card-label">High Priority</div>
                </div>
                <div className="stat-card" style={{ borderTop: '3px solid var(--color-warning)' }}>
                    <div className="stat-card-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-warning)' }}>
                        <Clock size={20} />
                    </div>
                    <div className="stat-card-value"><AnimatedNumber value={warningCount} /></div>
                    <div className="stat-card-label">Warnings</div>
                </div>
                <div className="stat-card" style={{ borderTop: '3px solid var(--color-info)' }}>
                    <div className="stat-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-info)' }}>
                        <Bell size={20} />
                    </div>
                    <div className="stat-card-value"><AnimatedNumber value={infoCount} /></div>
                    <div className="stat-card-label">Informational</div>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-24" style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <Filter size={16} color="var(--text-muted)" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Category:</span>
                    <div className="tab-group">
                        {['All', 'Health', 'Reproduction', 'Feed', 'Quality', 'Financial'].map(f => (
                            <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                                {f}
                            </button>
                        ))}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '12px' }}>Status:</span>
                    <div className="tab-group">
                        {['All', 'New', 'Acknowledged'].map(s => (
                            <button key={s} className={`tab-btn ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Alert List */}
            <div className="stagger">
                {filteredAlerts.length > 0 ? (
                    filteredAlerts.map(alert => {
                        const Icon = categoryIcons[alert.category] || AlertTriangle;
                        return (
                            <div key={alert.id} className={`card ${alert.acknowledged ? 'alert-item acknowledged' : 'alert-item'}`} style={{ marginBottom: '12px', padding: '0' }}>
                                <div style={{ display: 'flex', gap: '16px', padding: '20px' }}>
                                    <div className={`alert-icon ${alert.severity}`} style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                                        <Icon size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                            <span className={`badge ${alert.severity}`}>{alert.severity.toUpperCase()}</span>
                                            <span className={`badge ${alert.acknowledged ? 'success' : 'warning'}`}>
                                                {alert.acknowledged ? '✓ Acknowledged' : 'New'}
                                            </span>
                                            <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>{alert.time}</span>
                                        </div>
                                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                                            {alert.title}
                                        </h3>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                                            {alert.message}
                                        </p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                                                <div style={{ fontSize: '10px', color: 'var(--color-success)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                                                    ✅ Recommended Action
                                                </div>
                                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{alert.action}</p>
                                            </div>
                                            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                                                <div style={{ fontSize: '10px', color: 'var(--color-danger)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                                                    ⚠️ Cost if Ignored
                                                </div>
                                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{alert.costIfIgnored}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {!alert.acknowledged && (
                                    <div style={{ display: 'flex', gap: '8px', padding: '10px 20px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-glass-light)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
                                        <button className="rec-card-action" style={{ padding: '6px 16px' }} onClick={() => handleAcknowledge(alert.id)}>
                                            <CheckCircle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                            Acknowledge
                                        </button>
                                        <button style={{ padding: '6px 16px', border: '1px solid var(--border-color-light)', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>
                                            Dismiss
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <EmptyState
                        icon={Bell}
                        title="No Alerts"
                        message="All systems running smoothly. Alerts will appear here when your herd needs attention."
                    />
                )}
            </div>
        </div>
    );
}
