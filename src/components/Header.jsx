import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Clock, User, Settings, LogOut, Shield, HelpCircle, Globe, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { cows, alerts } from '../data/mockData';

export default function Header({ collapsed }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { t, language, setLanguage } = useLanguage();
    const [time, setTime] = useState(new Date());
    const [profileOpen, setProfileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const langRef = useRef(null);

    const pageTitles = useMemo(() => ({
        '/': { title: t('pageDashboardTitle'), subtitle: t('pageDashboardSub') },
        '/health': { title: t('pageHealthTitle'), subtitle: t('pageHealthSub') },
        '/production': { title: t('pageProductionTitle'), subtitle: t('pageProductionSub') },
        '/feed': { title: t('pageFeedTitle'), subtitle: t('pageFeedSub') },
        '/reproduction': { title: t('pageReproTitle'), subtitle: t('pageReproSub') },
        '/financials': { title: t('pageFinTitle'), subtitle: t('pageFinSub') },
        '/alerts': { title: t('pageAlertsTitle'), subtitle: t('pageAlertsSub') },
        '/insights': { title: t('pageInsightsTitle'), subtitle: t('pageInsightsSub') },
        '/labour': { title: t('pageLabourTitle'), subtitle: t('pageLabourSub') },
        '/vaccination': { title: t('vaccinationTimeline'), subtitle: t('vaccination') },
        '/prediction': { title: t('milkPrediction'), subtitle: t('predictionSubtitle') },
        '/support': { title: t('helpSupport'), subtitle: t('supportSubtitle') },
        '/cows': { title: t('pageCowsTitle'), subtitle: t('pageCowsSub') },
    }), [language, t]);

    const page = pageTitles[location.pathname] || pageTitles['/'];

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
            if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchResults = useMemo(() => {
        if (!searchQuery || searchQuery.length < 2) return { cows: [], alerts: [], pages: [] };
        const q = searchQuery.toLowerCase();
        const matchedCows = cows.filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.breed.toLowerCase().includes(q) || c.status.toLowerCase().includes(q)).slice(0, 5);
        const matchedAlerts = alerts.filter(a => a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q)).slice(0, 3);
        const matchedPages = Object.entries(pageTitles).filter(([, v]) => v.title.toLowerCase().includes(q)).map(([path, v]) => ({ path, title: v.title })).slice(0, 3);
        return { cows: matchedCows, alerts: matchedAlerts, pages: matchedPages };
    }, [searchQuery, pageTitles]);

    const hasResults = searchResults.cows.length > 0 || searchResults.alerts.length > 0 || searchResults.pages.length > 0;

    const formatTime = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const formatDate = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

    const getInitials = () => {
        if (!user?.fullName) return 'RK';
        const parts = user.fullName.split(' ');
        return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
    };

    const getDisplayName = () => {
        if (!user?.fullName) return 'Ramesh K.';
        const parts = user.fullName.split(' ');
        if (parts.length >= 2) return `${parts[0]} ${parts[parts.length - 1][0]}.`;
        return parts[0];
    };

    const handleLogout = () => { setProfileOpen(false); logout(); navigate('/login'); };
    const goToProfilePage = (path) => { setProfileOpen(false); navigate(path); };

    const currentLang = LANGUAGES.find(l => l.code === language);

    return (
        <header className={`header ${collapsed ? 'collapsed' : ''}`}>
            <div className="header-left">
                <div className="header-title">
                    <h1>{page.title}</h1>
                    <p>{page.subtitle}</p>
                </div>
            </div>

            <div className="header-right">
                <div className="header-sync">
                    <span className="live-dot" />
                    <span>{t('live')}</span>
                </div>

                <button
                    className="header-icon-btn theme-toggle-btn"
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                <div className="header-clock">
                    <Clock size={13} />
                    <span>{formatTime(time)}</span>
                    <span style={{ color: 'var(--text-muted)' }}>|</span>
                    <span>{formatDate(time)}</span>
                </div>

                {/* Language Switcher */}
                <div className="language-switcher" ref={langRef}>
                    <button
                        className={`language-switcher-btn ${langOpen ? 'active' : ''}`}
                        onClick={() => setLangOpen(!langOpen)}
                        title="Change Language"
                    >
                        <Globe size={15} />
                        <span>{currentLang?.native || 'English'}</span>
                        <ChevronDown size={12} className={langOpen ? 'rotated' : ''} />
                    </button>
                    {langOpen && (
                        <div className="language-switcher-dropdown">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
                                    className={`language-switcher-item ${language === lang.code ? 'active' : ''}`}
                                    onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                                >
                                    <span className="language-switcher-native">{lang.native}</span>
                                    <span className="language-switcher-label">{lang.label}</span>
                                    {language === lang.code && <span className="language-switcher-check">✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="header-search" ref={searchRef} style={{ position: 'relative' }}>
                    <Search size={15} color="var(--text-muted)" />
                    <input
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                        onFocus={() => searchQuery.length >= 2 && setSearchOpen(true)}
                        onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                    />
                    {searchOpen && searchQuery.length >= 2 && (
                        <div className="header-search-dropdown">
                            {!hasResults && (
                                <div className="header-search-empty">{t('noResults')} "{searchQuery}"</div>
                            )}
                            {searchResults.pages.length > 0 && (
                                <div className="header-search-group">
                                    <div className="header-search-group-label">{t('pages')}</div>
                                    {searchResults.pages.map((p) => (
                                        <div key={p.path} className="header-search-item" onClick={() => { navigate(p.path); setSearchOpen(false); setSearchQuery(''); }}>
                                            <span className="header-search-icon">📄</span>
                                            <span>{p.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {searchResults.cows.length > 0 && (
                                <div className="header-search-group">
                                    <div className="header-search-group-label">{t('cows')}</div>
                                    {searchResults.cows.map((c) => (
                                        <div key={c.id} className="header-search-item" onClick={() => { navigate('/health'); setSearchOpen(false); setSearchQuery(''); }}>
                                            <span className="header-search-icon">🐄</span>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>{c.name} <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{c.id}</span></span>
                                                <span style={{ fontSize: '11px', color: c.status === 'Critical' ? 'var(--color-danger)' : c.status === 'At Risk' ? 'var(--color-warning)' : 'var(--color-success)' }}>{c.status} • {c.breed}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {searchResults.alerts.length > 0 && (
                                <div className="header-search-group">
                                    <div className="header-search-group-label">{t('alerts')}</div>
                                    {searchResults.alerts.map((a) => (
                                        <div key={a.id} className="header-search-item" onClick={() => { navigate('/alerts'); setSearchOpen(false); setSearchQuery(''); }}>
                                            <span className="header-search-icon">⚠️</span>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>{a.title}</span>
                                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button className="header-icon-btn" title={t('notifications')}>
                    <Bell size={18} />
                    <span className="badge" />
                </button>

                {/* Profile dropdown */}
                <div className="header-profile-wrapper" ref={dropdownRef}>
                    <div
                        className={`header-profile ${profileOpen ? 'active' : ''}`}
                        onClick={() => setProfileOpen(!profileOpen)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setProfileOpen(!profileOpen)}
                    >
                        <div className="header-profile-avatar">{getInitials()}</div>
                        <span className="header-profile-name">{getDisplayName()}</span>
                        <ChevronDown size={14} color="var(--text-muted)" className={`header-chevron ${profileOpen ? 'rotated' : ''}`} />
                    </div>

                    {profileOpen && (
                        <div className="header-profile-dropdown">
                            <div className="header-dropdown-user">
                                <div className="header-dropdown-avatar">{getInitials()}</div>
                                <div>
                                    <p className="header-dropdown-name">{user?.fullName || 'Ramesh Kumar'}</p>
                                    <p className="header-dropdown-email">{user?.email || 'owner@dairyai.com'}</p>
                                    <span className="header-dropdown-role">{(user?.role || 'farm_owner').replace(/_/g, ' ')}</span>
                                </div>
                            </div>
                            <div className="header-dropdown-divider" />
                            <button className="header-dropdown-item" onClick={() => goToProfilePage('/profile')}>
                                <User size={15} />
                                <span>{t('myProfile')}</span>
                            </button>
                            <button className="header-dropdown-item" onClick={() => goToProfilePage('/settings')}>
                                <Settings size={15} />
                                <span>{t('accountSettings')}</span>
                            </button>
                            <button className="header-dropdown-item" onClick={() => goToProfilePage('/security')}>
                                <Shield size={15} />
                                <span>{t('securityDevices')}</span>
                            </button>
                            <button className="header-dropdown-item" onClick={() => goToProfilePage('/support')}>
                                <HelpCircle size={15} />
                                <span>{t('helpSupport')}</span>
                            </button>
                            <div className="header-dropdown-divider" />
                            <button className="header-dropdown-item danger" onClick={handleLogout}>
                                <LogOut size={15} />
                                <span>{t('signOut')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
