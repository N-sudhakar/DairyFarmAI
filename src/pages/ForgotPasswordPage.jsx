import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Loader2, ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setEmailError('Email address is required'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Please enter a valid email address'); return; }

        setIsSubmitting(true);
        await resetPassword(email);
        setIsSubmitting(false);
        setSubmitted(true);
    };

    return (
        <div className="auth-page">
            <div className="auth-bg-orbs">
                <div className="auth-bg-orb auth-bg-orb-1" />
                <div className="auth-bg-orb auth-bg-orb-2" />
                <div className="auth-bg-orb auth-bg-orb-3" />
            </div>

            <div className="auth-center-container">
                <div className="auth-center-card">
                    {!submitted ? (
                        <>
                            <div className="auth-center-icon">
                                <Lock size={32} />
                            </div>
                            <h2>{t('resetPassword')}</h2>
                            <p className="auth-center-desc">
                                {t('enterEmailReset')}
                            </p>

                            <form onSubmit={handleSubmit} noValidate>
                                <div className={`auth-field ${emailError ? 'error' : ''}`}>
                                    <label htmlFor="forgot-email">{t('email')}</label>
                                    <div className="auth-input-wrapper">
                                        <Mail size={18} className="auth-input-icon" />
                                        <input
                                            id="forgot-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                                        />
                                    </div>
                                    {emailError && <span className="auth-field-error"><AlertCircle size={12} /> {emailError}</span>}
                                </div>

                                <button type="submit" className="auth-btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <><Loader2 size={18} className="spin" /> Sending...</>
                                    ) : (
                                        <>{t('sendResetLink')} <ChevronRight size={18} /></>
                                    )}
                                </button>
                            </form>

                            <Link to="/login" className="auth-back-link">
                                <ArrowLeft size={14} /> {t('backToLogin')}
                            </Link>
                        </>
                    ) : (
                        <div className="fade-in">
                            <div className="auth-center-icon success">
                                <Mail size={32} />
                            </div>
                            <h2>Check Your Email</h2>
                            <p className="auth-center-desc">
                                If an account exists for <strong>{email}</strong>, we have sent a password reset link. The link will expire in one hour.
                            </p>
                            <div className="auth-help-text">
                                <p>Didn't receive an email?</p>
                                <ul>
                                    <li>Check your spam or junk folder</li>
                                    <li>Make sure you entered the correct email</li>
                                    <li>Wait a few minutes and try again</li>
                                </ul>
                            </div>
                            <Link to="/reset-password" className="auth-btn-primary" style={{ display: 'flex', marginTop: 16 }}>
                                Open Reset Page <ChevronRight size={18} />
                            </Link>
                            <Link to="/login" className="auth-back-link" style={{ marginTop: 16 }}>
                                <ArrowLeft size={14} /> {t('backToLogin')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
