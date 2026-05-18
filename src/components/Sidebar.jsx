import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, HeartPulse, Milk, Wheat, Baby, DollarSign,
    Bell, BrainCircuit, ChevronLeft, ChevronRight, Users, Syringe, TrendingUp, ClipboardList,
    Sun, Moon, Wallet
} from 'lucide-react';
import { alerts } from '../data/mockData';
import { vaccinationStats } from '../data/vaccinationData';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ collapsed, onToggle }) {
    const { t } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { label: t('overview'), items: [] },
        { path: '/', icon: LayoutDashboard, label: t('dashboard'), badge: null },
        { path: '/cows', icon: ClipboardList, label: t('cowManagement'), badge: null },
        { path: '/farm-costs', icon: Wallet, label: t('farmCosts') || 'Farm Costs', badge: null },
        { label: t('monitoring'), items: [] },
        { path: '/health', icon: HeartPulse, label: t('cowHealth'), badge: null },
        { path: '/production', icon: Milk, label: t('milkProduction'), badge: null },
        { path: '/feed', icon: Wheat, label: t('feedManagement'), badge: null },
        { path: '/reproduction', icon: Baby, label: t('reproduction'), badge: null },
        { path: '/vaccination', icon: Syringe, label: t('vaccination'), badge: vaccinationStats.overdue > 0 ? vaccinationStats.overdueAnimals : null },
        { label: t('intelligence'), items: [] },
        { path: '/prediction', icon: TrendingUp, label: t('milkPrediction'), badge: null },
        { path: '/financials', icon: DollarSign, label: t('financials'), badge: null },
        { path: '/labour', icon: Users, label: t('labourSalary'), badge: null },
        { path: '/alerts', icon: Bell, label: t('alerts'), badge: alerts.filter(a => !a.acknowledged).length },
        { path: '/insights', icon: BrainCircuit, label: t('aiInsights'), badge: null },
    ];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <button className="sidebar-collapse-btn" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">🐄</div>
                <div className="sidebar-brand-text">
                    <h2>DairyAI</h2>
                    <span>{t('smartFarmPlatform')}</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item, idx) => {
                    if (!item.path) {
                        return (
                            <div key={idx} className="sidebar-section-label">
                                {item.label}
                            </div>
                        );
                    }
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'active' : ''}`
                            }
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon className="sidebar-link-icon" size={18} />
                            <span>{item.label}</span>
                            {item.badge > 0 && (
                                <span className="sidebar-badge">{item.badge}</span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <div className="sidebar-theme-text">
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        <small>{theme === 'dark' ? 'Brighter dashboard' : 'Darker dashboard'}</small>
                    </div>
                </button>
            </div>
        </aside>
    );
}
