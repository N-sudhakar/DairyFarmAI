import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Eye, EyeOff, AlertCircle, Loader2, Check, X, ArrowLeft, ChevronRight, KeyRound } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ResetPasswordPage() {
    const { updatePassword } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showCpw, setShowCpw] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formError, setFormError] = useState('');

    const requirements = [
        { label: 'Minimum 8 characters', met: newPassword.length >= 8 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
        { label: 'One lowercase letter', met: /[a-z]/.test(newPassword) },
        { label: 'One number', met: /\d/.test(newPassword) },
        { label: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
    ];

    const allMet = requirements.every(r => r.met);
    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!allMet) { setFormError('Password does not meet all requirements'); return; }
        if (!passwordsMatch) { setFormError('Passwords do not match'); return; }

        setIsSubmitting(true);
        await updatePassword('mock-token', newPassword);
        setIsSubmitting(false);
        setSuccess(true);
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-bg-orbs">
                    <div className="auth-bg-orb auth-bg-orb-1" />
                    <div className="auth-bg-orb auth-bg-orb-2" />
                    <div className="auth-bg-orb auth-bg-orb-3" />
                </div>
                <div className="auth-center-container">
                    <div className="auth-center-card fade-in">
                        <div className="auth-center-icon success">
                            <Check size={32} />
                        </div>
                        <h2>Password Updated!</h2>
                        <p className="auth-center-desc">
                            Your password has been updated successfully. All other sessions have been signed out for your security.
                        </p>
                        <button className="auth-btn-primary" onClick={() => navigate('/login')} style={{ marginTop: 16 }}>
                            Return to Login <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-bg-orbs">
                <div className="auth-bg-orb auth-bg-orb-1" />
                <div className="auth-bg-orb auth-bg-orb-2" />
                <div className="auth-bg-orb auth-bg-orb-3" />
            </div>

            <div className="auth-center-container">
                <div className="auth-center-card">
                    <div className="auth-center-icon">
                        <KeyRound size={32} />
                    </div>
                    <h2>{t('newPassword')}</h2>
                    <p className="auth-center-desc">
                        Your new password must be different from your previous password.
                    </p>

                    <form onSubmit={handleSubmit} noValidate>
                        {formError && (
                            <div className="auth-error-banner">
                                <AlertCircle size={16} />
                                <span>{formError}</span>
                            </div>
                        )}

                        {/* New Password */}
                        <div className="auth-field">
                            <label>{t('newPassword')}</label>
                            <div className="auth-input-wrapper">
                                <Lock size={18} className="auth-input-icon" />
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                                <button type="button" className="auth-toggle-pw" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Password requirements */}
                        {newPassword && (
                            <div className="reset-requirements">
                                {requirements.map((r, i) => (
                                    <div key={i} className={`reset-req ${r.met ? 'met' : ''}`}>
                                        {r.met ? <Check size={12} /> : <X size={12} />}
                                        <span>{r.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div className="auth-field">
                            <label>{t('confirmPassword')}</label>
                            <div className="auth-input-wrapper">
                                <Lock size={18} className="auth-input-icon" />
                                <input
                                    type={showCpw ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                                <button type="button" className="auth-toggle-pw" onClick={() => setShowCpw(!showCpw)} tabIndex={-1}>
                                    {showCpw ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {confirmPassword && passwordsMatch && (
                                <span className="auth-field-success"><Check size={12} /> Passwords match</span>
                            )}
                            {confirmPassword && !passwordsMatch && (
                                <span className="auth-field-error"><X size={12} /> Passwords do not match</span>
                            )}
                        </div>

                        <button type="submit" className="auth-btn-primary" disabled={isSubmitting || !allMet || !passwordsMatch}>
                            {isSubmitting ? (
                                <><Loader2 size={18} className="spin" /> Updating...</>
                            ) : (
                                <>{t('updatePassword')} <ChevronRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <Link to="/login" className="auth-back-link">
                        <ArrowLeft size={14} /> {t('backToLogin')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
