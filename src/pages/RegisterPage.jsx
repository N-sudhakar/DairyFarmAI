import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_AUTH_ENABLED } from '../config/google';
import {
    User, Mail, Phone, Lock, Eye, EyeOff, Camera, Check, X, ChevronRight, ChevronLeft,
    AlertCircle, Loader2, Building2, MapPin, Map, Wheat, Globe, Shield, Milk,
    Star, Zap, Crown, CreditCard
} from 'lucide-react';

const FARM_TYPES = ['Dairy Only', 'Mixed Farm', 'Organic', 'Corporate'];
const BREEDS = ['Holstein-Friesian', 'Jersey', 'Gir', 'HF Cross', 'Other'];
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Australia', 'New Zealand', 'Canada'];
const STATES_MAP = {
    'India': ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Andhra Pradesh', 'Gujarat', 'Punjab', 'Haryana', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh'],
    'United States': ['California', 'Texas', 'Wisconsin', 'New York', 'Pennsylvania'],
    'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
    'New Zealand': ['Auckland', 'Canterbury', 'Waikato', 'Wellington'],
    'Canada': ['Ontario', 'Quebec', 'Alberta', 'British Columbia'],
};

function PasswordStrength({ password }) {
    const checks = [
        { label: 'At least 8 characters', test: password.length >= 8 },
        { label: 'One uppercase letter', test: /[A-Z]/.test(password) },
        { label: 'One lowercase letter', test: /[a-z]/.test(password) },
        { label: 'One number', test: /\d/.test(password) },
        { label: 'One special character', test: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];
    const score = checks.filter(c => c.test).length;
    const level = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';
    const label = score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong';

    return (
        <div className="pw-strength">
            <div className="pw-strength-bar">
                <div className={`pw-strength-fill ${level}`} style={{ width: `${(score / 5) * 100}%` }} />
            </div>
            <span className={`pw-strength-label ${level}`}>{label}</span>
            <div className="pw-strength-checks">
                {checks.map((c, i) => (
                    <div key={i} className={`pw-check ${c.test ? 'pass' : ''}`}>
                        {c.test ? <Check size={12} /> : <X size={12} />}
                        <span>{c.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function RegisterPage() {
    const { register, checkEmailAvailability, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Step 1 — Account Details
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState(null); // null | 'checking' | 'available' | 'taken'
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showCpw, setShowCpw] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

    // Step 2 — Farm Info
    const [farmName, setFarmName] = useState('');
    const [farmType, setFarmType] = useState('');
    const [cattleCount, setCattleCount] = useState('');
    const [breeds, setBreeds] = useState([]);
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [farmArea, setFarmArea] = useState('');
    const [dailyMilk, setDailyMilk] = useState('');
    const [isCoopMember, setIsCoopMember] = useState(false);
    const [coopName, setCoopName] = useState('');
    const [memberId, setMemberId] = useState('');

    // Step 3 — Plan
    const [selectedPlan, setSelectedPlan] = useState('starter');
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [newsletter, setNewsletter] = useState(true);

    // Errors
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');

    // Real-time email check
    useEffect(() => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailStatus(null);
            return;
        }
        setEmailStatus('checking');
        const timer = setTimeout(async () => {
            const result = await checkEmailAvailability(email);
            setEmailStatus(result.available ? 'available' : 'taken');
        }, 600);
        return () => clearTimeout(timer);
    }, [email, checkEmailAvailability]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setProfilePhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const toggleBreed = (breed) => {
        setBreeds(prev => prev.includes(breed) ? prev.filter(b => b !== breed) : [...prev, breed]);
    };

    // Validate step
    const validateStep = (s) => {
        const errs = {};
        if (s === 1) {
            if (!fullName.trim()) errs.fullName = 'Full name is required';
            else if (fullName.trim().length < 2) errs.fullName = 'Name must be at least 2 characters';
            if (!email.trim()) errs.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email format';
            else if (emailStatus === 'taken') errs.email = 'This email is already registered';
            if (!password) errs.password = 'Password is required';
            else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
            if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
            else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
        } else if (s === 2) {
            if (!farmName.trim()) errs.farmName = 'Farm name is required';
            else if (farmName.trim().length < 3) errs.farmName = 'Farm name must be at least 3 characters';
            if (!farmType) errs.farmType = 'Please select a farm type';
            if (!cattleCount || parseInt(cattleCount) <= 0) errs.cattleCount = 'Please enter a valid cattle count';
            if (breeds.length === 0) errs.breeds = 'Select at least one breed';
            if (!country) errs.country = 'Please select a country';
            if (!state) errs.state = 'Please select a state';
        } else if (s === 3) {
            if (!termsAccepted) errs.terms = 'You must accept the Terms of Service';
            if (!privacyAccepted) errs.privacy = 'You must accept the Privacy Policy';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const goNext = () => {
        if (validateStep(step)) setStep(s => s + 1);
    };

    const goBack = () => {
        setErrors({});
        setStep(s => s - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(3)) return;
        setIsSubmitting(true);
        setFormError('');
        try {
            await register(
                { fullName, email, password, phone: `${countryCode}${phone}`, profilePhoto: profilePhotoPreview },
                { farmName, farmType, cattleCount: parseInt(cattleCount), breeds, country, state, district, farmArea, dailyMilk, isCoopMember, coopName, memberId },
                { plan: selectedPlan, billingCycle, newsletter }
            );
            setShowSuccess(true);
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setFormError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const googleSignup = useGoogleLogin({
        flow: 'implicit',
        onSuccess: async (tokenResponse) => {
            setGoogleLoading(true);
            setFormError('');
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await res.json();
                const result = await loginWithGoogle(null, profile);
                setShowSuccess(true);
                setTimeout(() => navigate(result.redirectTo || '/'), 2500);
            } catch (err) {
                setFormError(err.message || 'Google sign-up failed. Please try again.');
            } finally {
                setGoogleLoading(false);
            }
        },
        onError: () => {
            setFormError('Google sign-up was cancelled or failed.');
            setGoogleLoading(false);
        },
    });

    if (showSuccess) {
        return (
            <div className="auth-page">
                <div className="auth-success-screen">
                    <div className="auth-success-icon bounce-in">
                        <Check size={48} />
                    </div>
                    <h2>Welcome to DairyAI!</h2>
                    <p>Setting up your farm dashboard...</p>
                    <div className="register-setup-steps">
                        <div className="register-setup-step active">
                            <Loader2 size={14} className="spin" />
                            <span>Creating your account</span>
                        </div>
                        <div className="register-setup-step">
                            <span>Setting up your farm profile</span>
                        </div>
                        <div className="register-setup-step">
                            <span>Activating free trial</span>
                        </div>
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

            <div className="register-container">
                {/* Side panel (desktop only) */}
                <div className="register-side-panel">
                    <div className="register-side-content">
                        <div className="login-brand">
                            <div className="login-brand-icon">🐄</div>
                            <h1>DairyAI</h1>
                        </div>
                        <div className="register-side-steps">
                            {[
                                { num: 1, title: 'Account Details', desc: 'Create your personal account' },
                                { num: 2, title: 'Farm Information', desc: 'Tell us about your farm' },
                                { num: 3, title: 'Plan & Agreement', desc: 'Choose your plan and start' },
                            ].map(s => (
                                <div key={s.num} className={`register-side-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'done' : ''}`}>
                                    <div className="register-side-step-num">
                                        {step > s.num ? <Check size={16} /> : s.num}
                                    </div>
                                    <div>
                                        <strong>{s.title}</strong>
                                        <span>{s.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main form */}
                <div className="register-main">
                    {/* Progress bar (mobile) */}
                    <div className="register-progress-mobile">
                        <div className="register-progress-bar">
                            <div className="register-progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
                        </div>
                        <span>Step {step} of 3</span>
                    </div>

                    <div className="register-form-card">
                        {formError && (
                            <div className="auth-error-banner">
                                <AlertCircle size={16} />
                                <span>{formError}</span>
                            </div>
                        )}

                        {/* STEP 1 */}
                        {step === 1 && (
                            <div className="register-step fade-in">
                                <h2>Create Your Account</h2>
                                <p className="register-step-desc">Let's set up your personal account first</p>

                                {/* Sign up with Google */}
                                <button type="button" className="auth-btn-social" style={{ marginBottom: 16 }} onClick={() => googleSignup()} disabled={googleLoading}>
                                    {googleLoading ? (
                                        <><Loader2 size={18} className="spin" /> Connecting to Google...</>
                                    ) : (
                                        <><svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                            Sign up with Google</>
                                    )}
                                </button>

                                <div className="auth-divider"><span>OR</span></div>

                                {/* Profile Photo */}
                                <div className="register-photo-upload">
                                    <label htmlFor="profile-photo" className="register-photo-circle">
                                        {profilePhotoPreview ? (
                                            <img src={profilePhotoPreview} alt="Profile" />
                                        ) : (
                                            <Camera size={24} />
                                        )}
                                        <div className="register-photo-overlay"><Camera size={14} /></div>
                                    </label>
                                    <input id="profile-photo" type="file" accept="image/*" onChange={handlePhotoChange} hidden />
                                    <span>Upload Profile Photo (Optional)</span>
                                </div>

                                {/* Full Name */}
                                <div className={`auth-field ${errors.fullName ? 'error' : ''}`}>
                                    <label>Full Name</label>
                                    <div className="auth-input-wrapper">
                                        <User size={18} className="auth-input-icon" />
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                        />
                                    </div>
                                    {errors.fullName && <span className="auth-field-error"><AlertCircle size={12} /> {errors.fullName}</span>}
                                </div>

                                {/* Email */}
                                <div className={`auth-field ${errors.email ? 'error' : ''}`}>
                                    <label>Email Address</label>
                                    <div className="auth-input-wrapper">
                                        <Mail size={18} className="auth-input-icon" />
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                        {emailStatus === 'checking' && <Loader2 size={16} className="spin auth-input-status" />}
                                        {emailStatus === 'available' && <Check size={16} className="auth-input-status success" />}
                                        {emailStatus === 'taken' && <X size={16} className="auth-input-status error" />}
                                    </div>
                                    {emailStatus === 'available' && <span className="auth-field-success"><Check size={12} /> Email is available</span>}
                                    {emailStatus === 'taken' && <span className="auth-field-error"><AlertCircle size={12} /> This email is already registered</span>}
                                    {errors.email && emailStatus !== 'taken' && <span className="auth-field-error"><AlertCircle size={12} /> {errors.email}</span>}
                                </div>

                                {/* Phone */}
                                <div className={`auth-field`}>
                                    <label>Phone Number (Optional)</label>
                                    <div className="auth-input-wrapper auth-phone-wrapper">
                                        <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="auth-country-code">
                                            <option value="+91">🇮🇳 +91</option>
                                            <option value="+1">🇺🇸 +1</option>
                                            <option value="+44">🇬🇧 +44</option>
                                            <option value="+61">🇦🇺 +61</option>
                                            <option value="+64">🇳🇿 +64</option>
                                        </select>
                                        <input
                                            type="tel"
                                            placeholder="Enter phone number"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className={`auth-field ${errors.password ? 'error' : ''}`}>
                                    <label>Password</label>
                                    <div className="auth-input-wrapper">
                                        <Lock size={18} className="auth-input-icon" />
                                        <input
                                            type={showPw ? 'text' : 'password'}
                                            placeholder="Create a strong password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                        <button type="button" className="auth-toggle-pw" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {password && <PasswordStrength password={password} />}
                                    {errors.password && <span className="auth-field-error"><AlertCircle size={12} /> {errors.password}</span>}
                                </div>

                                {/* Confirm Password */}
                                <div className={`auth-field ${errors.confirmPassword ? 'error' : ''}`}>
                                    <label>Confirm Password</label>
                                    <div className="auth-input-wrapper">
                                        <Lock size={18} className="auth-input-icon" />
                                        <input
                                            type={showCpw ? 'text' : 'password'}
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                        />
                                        <button type="button" className="auth-toggle-pw" onClick={() => setShowCpw(!showCpw)} tabIndex={-1}>
                                            {showCpw ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {confirmPassword && password === confirmPassword && (
                                        <span className="auth-field-success"><Check size={12} /> Passwords match</span>
                                    )}
                                    {confirmPassword && password !== confirmPassword && (
                                        <span className="auth-field-error"><X size={12} /> Passwords do not match</span>
                                    )}
                                    {errors.confirmPassword && <span className="auth-field-error"><AlertCircle size={12} /> {errors.confirmPassword}</span>}
                                </div>

                                <div className="register-nav-buttons">
                                    <Link to="/login" className="auth-btn-ghost">
                                        <ChevronLeft size={16} /> Back to Login
                                    </Link>
                                    <button type="button" className="auth-btn-primary" onClick={goNext}>
                                        Next <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <div className="register-step fade-in">
                                <h2>Farm Information</h2>
                                <p className="register-step-desc">Tell us about your dairy farm</p>

                                <div className="register-form-grid">
                                    {/* Farm Name */}
                                    <div className={`auth-field ${errors.farmName ? 'error' : ''}`}>
                                        <label>Farm Name</label>
                                        <div className="auth-input-wrapper">
                                            <Building2 size={18} className="auth-input-icon" />
                                            <input type="text" placeholder="Enter farm name" value={farmName} onChange={e => setFarmName(e.target.value)} />
                                        </div>
                                        {errors.farmName && <span className="auth-field-error"><AlertCircle size={12} /> {errors.farmName}</span>}
                                    </div>

                                    {/* Farm Type */}
                                    <div className={`auth-field ${errors.farmType ? 'error' : ''}`}>
                                        <label>Farm Type</label>
                                        <div className="auth-input-wrapper auth-select-wrapper">
                                            <Wheat size={18} className="auth-input-icon" />
                                            <select value={farmType} onChange={e => setFarmType(e.target.value)} className="auth-select">
                                                <option value="">Select farm type</option>
                                                {FARM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        {errors.farmType && <span className="auth-field-error"><AlertCircle size={12} /> {errors.farmType}</span>}
                                    </div>

                                    {/* Cattle count */}
                                    <div className={`auth-field ${errors.cattleCount ? 'error' : ''}`}>
                                        <label>Total Number of Cattle</label>
                                        <div className="auth-input-wrapper">
                                            <span className="auth-input-icon" style={{ fontSize: 16 }}>🐄</span>
                                            <input type="number" min="1" placeholder="e.g. 150" value={cattleCount} onChange={e => setCattleCount(e.target.value)} />
                                        </div>
                                        {errors.cattleCount && <span className="auth-field-error"><AlertCircle size={12} /> {errors.cattleCount}</span>}
                                    </div>

                                    {/* Farm Area */}
                                    <div className="auth-field">
                                        <label>Farm Area (Acres)</label>
                                        <div className="auth-input-wrapper">
                                            <Map size={18} className="auth-input-icon" />
                                            <input type="number" min="0" placeholder="e.g. 50" value={farmArea} onChange={e => setFarmArea(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Breeds */}
                                <div className={`auth-field ${errors.breeds ? 'error' : ''}`}>
                                    <label>Primary Breeds</label>
                                    <div className="register-breed-chips">
                                        {BREEDS.map(breed => (
                                            <button
                                                key={breed}
                                                type="button"
                                                className={`register-breed-chip ${breeds.includes(breed) ? 'selected' : ''}`}
                                                onClick={() => toggleBreed(breed)}
                                            >
                                                {breeds.includes(breed) && <Check size={14} />}
                                                {breed}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.breeds && <span className="auth-field-error"><AlertCircle size={12} /> {errors.breeds}</span>}
                                </div>

                                <div className="register-form-grid">
                                    {/* Country */}
                                    <div className={`auth-field ${errors.country ? 'error' : ''}`}>
                                        <label>Country</label>
                                        <div className="auth-input-wrapper auth-select-wrapper">
                                            <Globe size={18} className="auth-input-icon" />
                                            <select value={country} onChange={e => { setCountry(e.target.value); setState(''); }} className="auth-select">
                                                <option value="">Select country</option>
                                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        {errors.country && <span className="auth-field-error"><AlertCircle size={12} /> {errors.country}</span>}
                                    </div>

                                    {/* State */}
                                    <div className={`auth-field ${errors.state ? 'error' : ''}`}>
                                        <label>State / Province</label>
                                        <div className="auth-input-wrapper auth-select-wrapper">
                                            <MapPin size={18} className="auth-input-icon" />
                                            <select value={state} onChange={e => setState(e.target.value)} className="auth-select" disabled={!country}>
                                                <option value="">Select state</option>
                                                {(STATES_MAP[country] || []).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        {errors.state && <span className="auth-field-error"><AlertCircle size={12} /> {errors.state}</span>}
                                    </div>

                                    {/* District */}
                                    <div className="auth-field">
                                        <label>District / City</label>
                                        <div className="auth-input-wrapper">
                                            <MapPin size={18} className="auth-input-icon" />
                                            <input type="text" placeholder="Enter district or city" value={district} onChange={e => setDistrict(e.target.value)} />
                                        </div>
                                    </div>

                                    {/* Daily Milk */}
                                    <div className="auth-field">
                                        <label>Daily Milk Production (Litres)</label>
                                        <div className="auth-input-wrapper">
                                            <Milk size={18} className="auth-input-icon" />
                                            <input type="number" min="0" placeholder="e.g. 500" value={dailyMilk} onChange={e => setDailyMilk(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Cooperative toggle */}
                                <div className="auth-field">
                                    <label className="register-toggle-label">
                                        <span>Cooperative Member</span>
                                        <button type="button" className={`register-toggle ${isCoopMember ? 'active' : ''}`} onClick={() => setIsCoopMember(!isCoopMember)}>
                                            <div className="register-toggle-knob" />
                                        </button>
                                    </label>
                                    {isCoopMember && (
                                        <div className="register-form-grid" style={{ marginTop: 12 }}>
                                            <div className="auth-field">
                                                <label>Cooperative Name</label>
                                                <div className="auth-input-wrapper">
                                                    <Building2 size={18} className="auth-input-icon" />
                                                    <input type="text" placeholder="Enter cooperative name" value={coopName} onChange={e => setCoopName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="auth-field">
                                                <label>Member ID</label>
                                                <div className="auth-input-wrapper">
                                                    <Shield size={18} className="auth-input-icon" />
                                                    <input type="text" placeholder="Enter member ID" value={memberId} onChange={e => setMemberId(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="register-nav-buttons">
                                    <button type="button" className="auth-btn-ghost" onClick={goBack}>
                                        <ChevronLeft size={16} /> Back
                                    </button>
                                    <button type="button" className="auth-btn-primary" onClick={goNext}>
                                        Next <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <div className="register-step fade-in">
                                <h2>Choose Your Plan</h2>
                                <p className="register-step-desc">Select a plan that suits your farm size</p>

                                {/* Billing toggle */}
                                <div className="register-billing-toggle">
                                    <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
                                    <button type="button" className={`register-toggle ${billingCycle === 'annual' ? 'active' : ''}`} onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}>
                                        <div className="register-toggle-knob" />
                                    </button>
                                    <span className={billingCycle === 'annual' ? 'active' : ''}>
                                        Annual <span className="register-savings-badge">Save 10%</span>
                                    </span>
                                </div>

                                {/* Plans */}
                                <div className="register-plans">
                                    {/* Starter */}
                                    <div className={`register-plan-card ${selectedPlan === 'starter' ? 'selected' : ''}`} onClick={() => setSelectedPlan('starter')}>
                                        <div className="register-plan-icon starter-icon"><Star size={24} /></div>
                                        <h3>Starter</h3>
                                        <div className="register-plan-price">
                                            <span className="register-plan-amount">Free</span>
                                        </div>
                                        <ul className="register-plan-features">
                                            <li><Check size={14} /> Up to 50 cattle</li>
                                            <li><Check size={14} /> Basic health tracking</li>
                                            <li><Check size={14} /> Milk production logs</li>
                                            <li><Check size={14} /> 1 team member</li>
                                            <li><Check size={14} /> Community support</li>
                                        </ul>
                                        <button type="button" className={`register-plan-select ${selectedPlan === 'starter' ? 'selected' : ''}`}>
                                            {selectedPlan === 'starter' ? <><Check size={14} /> Selected</> : 'Select Plan'}
                                        </button>
                                    </div>

                                    {/* Growth */}
                                    <div className={`register-plan-card featured ${selectedPlan === 'growth' ? 'selected' : ''}`} onClick={() => setSelectedPlan('growth')}>
                                        <div className="register-plan-popular">Most Popular</div>
                                        <div className="register-plan-icon growth-icon"><Zap size={24} /></div>
                                        <h3>Growth</h3>
                                        <div className="register-plan-price">
                                            <span className="register-plan-amount">₹{billingCycle === 'annual' ? '2,699' : '2,999'}</span>
                                            <span className="register-plan-period">/month</span>
                                        </div>
                                        <ul className="register-plan-features">
                                            <li><Check size={14} /> Up to 500 cattle</li>
                                            <li><Check size={14} /> Full AI health monitoring</li>
                                            <li><Check size={14} /> Smart feeding plans</li>
                                            <li><Check size={14} /> Financial analytics</li>
                                            <li><Check size={14} /> 10 team members</li>
                                            <li><Check size={14} /> Priority support</li>
                                        </ul>
                                        <button type="button" className={`register-plan-select ${selectedPlan === 'growth' ? 'selected' : ''}`}>
                                            {selectedPlan === 'growth' ? <><Check size={14} /> Selected</> : 'Select Plan'}
                                        </button>
                                    </div>

                                    {/* Enterprise */}
                                    <div className={`register-plan-card ${selectedPlan === 'enterprise' ? 'selected' : ''}`} onClick={() => setSelectedPlan('enterprise')}>
                                        <div className="register-plan-icon enterprise-icon"><Crown size={24} /></div>
                                        <h3>Enterprise</h3>
                                        <div className="register-plan-price">
                                            <span className="register-plan-amount">Custom</span>
                                        </div>
                                        <ul className="register-plan-features">
                                            <li><Check size={14} /> Unlimited cattle</li>
                                            <li><Check size={14} /> Everything in Growth</li>
                                            <li><Check size={14} /> Dedicated support</li>
                                            <li><Check size={14} /> Custom integrations</li>
                                            <li><Check size={14} /> Unlimited team members</li>
                                            <li><Check size={14} /> SLA guarantee</li>
                                        </ul>
                                        <button type="button" className={`register-plan-select ${selectedPlan === 'enterprise' ? 'selected' : ''}`}>
                                            {selectedPlan === 'enterprise' ? <><Check size={14} /> Selected</> : 'Contact Sales'}
                                        </button>
                                    </div>
                                </div>

                                {/* Payment methods */}
                                <div className="register-payment-methods">
                                    <span>Accepted:</span>
                                    <div className="register-payment-icons">
                                        <div className="register-payment-icon" title="Credit Card"><CreditCard size={18} /></div>
                                        <div className="register-payment-icon" title="UPI">UPI</div>
                                        <div className="register-payment-icon" title="Net Banking">NB</div>
                                        <div className="register-payment-icon" title="Invoice">INV</div>
                                    </div>
                                </div>

                                {/* Terms */}
                                <div className="register-terms">
                                    <label className={`auth-checkbox ${errors.terms ? 'error' : ''}`}>
                                        <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
                                        <span className="auth-checkbox-mark" />
                                        <span>I agree to the <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a></span>
                                    </label>
                                    {errors.terms && <span className="auth-field-error"><AlertCircle size={12} /> {errors.terms}</span>}

                                    <label className={`auth-checkbox ${errors.privacy ? 'error' : ''}`}>
                                        <input type="checkbox" checked={privacyAccepted} onChange={e => setPrivacyAccepted(e.target.checked)} />
                                        <span className="auth-checkbox-mark" />
                                        <span>I agree to the <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a></span>
                                    </label>
                                    {errors.privacy && <span className="auth-field-error"><AlertCircle size={12} /> {errors.privacy}</span>}

                                    <label className="auth-checkbox">
                                        <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} />
                                        <span className="auth-checkbox-mark" />
                                        <span>Receive product updates and newsletters</span>
                                    </label>
                                </div>

                                <div className="register-nav-buttons">
                                    <button type="button" className="auth-btn-ghost" onClick={goBack}>
                                        <ChevronLeft size={16} /> Back
                                    </button>
                                    <button
                                        type="button"
                                        className="auth-btn-primary auth-btn-create"
                                        disabled={isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 size={18} className="spin" /> Creating Account...</>
                                        ) : (
                                            <>Create My Farm Account <ChevronRight size={18} /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="auth-footer-link">
                            Already have an account? <Link to="/login">Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
