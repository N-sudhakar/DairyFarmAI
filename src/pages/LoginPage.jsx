import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { GOOGLE_AUTH_ENABLED } from '../config/google';
import {
    Eye, EyeOff, Mail, Lock, Shield, ChevronRight,
    Activity, TrendingUp, Cpu, Globe, AlertCircle, Loader2, Check
} from 'lucide-react';

// Simple math CAPTCHA
function generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { question: `${a} + ${b} = ?`, answer: a + b };
}

export default function LoginPage() {
    const { login, loginWithGoogle, failedAttempts } = useAuth();
    const { t, language, setLanguage } = useLanguage();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Errors
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');

    // CAPTCHA
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [captcha, setCaptcha] = useState(generateCaptcha);
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState('');

    const emailRef = useRef(null);

    useEffect(() => {
        if (failedAttempts >= 3) {
            setShowCaptcha(true);
            setCaptcha(generateCaptcha());
            setCaptchaInput('');
        }
    }, [failedAttempts]);

    const validateEmail = (val) => {
        if (!val.trim()) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address';
        return '';
    };

    const validatePassword = (val) => {
        if (!val) return 'Password is required';
        return '';
    };

    const handleEmailBlur = () => setEmailError(validateEmail(email));
    const handlePasswordBlur = () => setPasswordError(validatePassword(password));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        const eErr = validateEmail(email);
        const pErr = validatePassword(password);
        setEmailError(eErr);
        setPasswordError(pErr);
        if (eErr || pErr) return;

        // CAPTCHA check
        if (showCaptcha) {
            if (parseInt(captchaInput) !== captcha.answer) {
                setCaptchaError('Incorrect answer. Please try again.');
                setCaptcha(generateCaptcha());
                setCaptchaInput('');
                return;
            }
            setCaptchaError('');
        }

        setIsSubmitting(true);
        try {
            const result = await login(email, password, remember);
            setShowSuccess(true);
            setTimeout(() => {
                navigate(result.redirectTo);
            }, 1200);
        } catch (err) {
            if (err.type === 'lockout') {
                setFormError(err.message);
            } else {
                setFormError(err.message);
                if (err.showCaptcha) {
                    setShowCaptcha(true);
                    setCaptcha(generateCaptcha());
                    setCaptchaInput('');
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };



    const googleLogin = useGoogleLogin({
        flow: 'implicit',
        onSuccess: async (tokenResponse) => {
            setGoogleLoading(true);
            setFormError('');
            try {
                // Fetch user info from Google using the access token
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await res.json();
                // Create a user from Google profile
                const result = await loginWithGoogle(null, profile);
                setShowSuccess(true);
                setTimeout(() => navigate(result.redirectTo || '/'), 1200);
            } catch (err) {
                setFormError(err.message || 'Google sign-in failed. Please try again.');
            } finally {
                setGoogleLoading(false);
            }
        },
        onError: () => {
            setFormError('Google sign-in was cancelled or failed.');
            setGoogleLoading(false);
        },
    });

    if (showSuccess) {
        return (
            <div className="auth-page">
                <div className="auth-success-screen">
                    <div className="auth-success-icon">
                        <Check size={48} />
                    </div>
                    <h2>{t('welcomeBack')}!</h2>
                    <p>{t('signIn')}...</p>
                    <div className="auth-success-loader" />
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            {/* Background orbs for auth pages */}
            <div className="auth-bg-orbs">
                <div className="auth-bg-orb auth-bg-orb-1" />
                <div className="auth-bg-orb auth-bg-orb-2" />
                <div className="auth-bg-orb auth-bg-orb-3" />
            </div>

            <div className="login-container">
                {/* Left Panel — Hero */}
                <div className="login-left">
                    <div className="login-left-overlay" />
                    <div className="login-left-content">
                        <div className="login-brand">
                            <div className="login-brand-icon">🐄</div>
                            <h1>DairyAI</h1>
                        </div>
                        <h2 className="login-tagline">Smart Farming,<br />Smarter Profits</h2>
                        <p className="login-subtitle">
                            Transform your dairy farm with AI-powered insights, health monitoring, and profit optimization.
                        </p>
                        <div className="login-features">
                            <div className="login-feature">
                                <div className="login-feature-icon"><Activity size={20} /></div>
                                <div>
                                    <strong>AI Health Monitoring</strong>
                                    <span>Real-time cattle health tracking</span>
                                </div>
                            </div>
                            <div className="login-feature">
                                <div className="login-feature-icon"><TrendingUp size={20} /></div>
                                <div>
                                    <strong>Profit Optimization</strong>
                                    <span>Maximize your farm revenue</span>
                                </div>
                            </div>
                            <div className="login-feature">
                                <div className="login-feature-icon"><Cpu size={20} /></div>
                                <div>
                                    <strong>Smart Feeding</strong>
                                    <span>Automated nutrition planning</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel — Form */}
                <div className="login-right">
                    <div className="login-form-card">
                        <div className="login-form-header">
                            <div className="login-form-logo">🐄</div>
                            <h2>{t('welcomeBack')}</h2>
                            <p>{t('signIn')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form" noValidate>
                            {formError && (
                                <div className="auth-error-banner">
                                    <AlertCircle size={16} />
                                    <span>{formError}</span>
                                </div>
                            )}

                            {/* Email */}
                            <div className={`auth-field ${emailError ? 'error' : ''}`}>
                                <label htmlFor="login-email">{t('email')}</label>
                                <div className="auth-input-wrapper">
                                    <Mail size={18} className="auth-input-icon" />
                                    <input
                                        ref={emailRef}
                                        id="login-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                                        onBlur={handleEmailBlur}
                                        autoComplete="email"
                                    />
                                </div>
                                {emailError && <span className="auth-field-error"><AlertCircle size={12} /> {emailError}</span>}
                            </div>

                            {/* Password */}
                            <div className={`auth-field ${passwordError ? 'error' : ''}`}>
                                <label htmlFor="login-password">{t('password')}</label>
                                <div className="auth-input-wrapper">
                                    <Lock size={18} className="auth-input-icon" />
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
                                        onBlur={handlePasswordBlur}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="auth-toggle-pw"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {passwordError && <span className="auth-field-error"><AlertCircle size={12} /> {passwordError}</span>}
                            </div>

                            {/* Remember / Forgot */}
                            <div className="auth-row">
                                <label className="auth-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={e => setRemember(e.target.checked)}
                                    />
                                    <span className="auth-checkbox-mark" />
                                    <span>{t('rememberMe')}</span>
                                </label>
                                <Link to="/forgot-password" className="auth-link">{t('forgotPassword')}</Link>
                            </div>

                            {/* CAPTCHA */}
                            {showCaptcha && (
                                <div className="auth-captcha">
                                    <div className="auth-captcha-header">
                                        <Shield size={16} />
                                        <span>Security Verification</span>
                                    </div>
                                    <div className="auth-captcha-question">
                                        Solve: <strong>{captcha.question}</strong>
                                    </div>
                                    <input
                                        type="number"
                                        className="auth-captcha-input"
                                        placeholder="Your answer"
                                        value={captchaInput}
                                        onChange={e => { setCaptchaInput(e.target.value); setCaptchaError(''); }}
                                    />
                                    {captchaError && <span className="auth-field-error"><AlertCircle size={12} /> {captchaError}</span>}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                className="auth-btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        {t('signIn')}
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>

                            {/* Social divider */}
                            <div className="auth-divider">
                                <span>{t('or')}</span>
                            </div>

                            {/* Social login */}
                            <button type="button" className="auth-btn-social" onClick={() => googleLogin()} disabled={googleLoading}>
                                {googleLoading ? (
                                    <><Loader2 size={18} className="spin" /> Connecting to Google...</>
                                ) : (
                                    <><svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                        Continue with Google</>
                                )}
                            </button>
                            <button type="button" className="auth-btn-social" onClick={() => googleLogin()} disabled={googleLoading}>
                                {googleLoading ? (
                                    <><Loader2 size={18} className="spin" /> Connecting...</>
                                ) : (
                                    <><svg viewBox="0 0 24 24" width="18" height="18"><path d="M11.4 24H0V12.6L11.4 1.2V6H18V0h6v12.6L12.6 24H11.4zM1.2 22.8h9.6l10.8-10.8V1.2h-3.6v6H10.2V2.4L1.2 11.4v11.4z" fill="#00A4EF" /></svg>
                                        Continue with Microsoft</>
                                )}
                            </button>
                        </form>

                        {/* Register link */}
                        <div className="auth-footer-link">
                            {t('noAccount')} <Link to="/register">{t('signUp')}</Link>
                        </div>

                        {/* Security badge */}
                        <div className="auth-security-badge">
                            <Shield size={14} />
                            <span>Your data is encrypted and secure</span>
                        </div>
                    </div>

                    {/* Language selector */}
                    <div className="auth-language-selector">
                        <Globe size={14} />
                        <select value={language} onChange={e => setLanguage(e.target.value)}>
                            {LANGUAGES.map(l => (
                                <option key={l.code} value={l.code}>{l.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
