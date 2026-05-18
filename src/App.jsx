import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CowProvider } from './context/CowContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CowHealth from './pages/CowHealth';
import MilkProduction from './pages/MilkProduction';
import FeedManagement from './pages/FeedManagement';
import Reproduction from './pages/Reproduction';
import Financials from './pages/Financials';
import Alerts from './pages/Alerts';
import Insights from './pages/Insights';
import LabourSalary from './pages/LabourSalary';
import VaccinationTimeline from './pages/VaccinationTimeline';
import MilkPrediction from './pages/MilkPrediction';
import CowManagement from './pages/CowManagement';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import FarmCosts from './pages/FarmCosts';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}

function AuthRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    if (isAuthenticated) return <Navigate to="/" replace />;
    return children;
}

function AppLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    // Auth pages don't show sidebar/header
    const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
    const isAuthPage = authPaths.includes(location.pathname);

    if (isAuthPage) {
        return (
            <Routes location={location}>
                <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
                <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
                <Route path="/forgot-password" element={<AuthRoute><ForgotPasswordPage /></AuthRoute>} />
                <Route path="/reset-password" element={<AuthRoute><ResetPasswordPage /></AuthRoute>} />
            </Routes>
        );
    }

    return (
        <>
            {/* Animated background orbs */}
            <div className="bg-orbs">
                <div className="bg-orb" />
                <div className="bg-orb" />
                <div className="bg-orb" />
            </div>

            <div className="app-layout">
                <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
                <div className={`main-wrapper ${collapsed ? 'collapsed' : ''}`}>
                    <Header collapsed={collapsed} />
                    <main className="main-content">
                        <div key={location.pathname} className="page-transition">
                            <Routes location={location}>
                                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                                <Route path="/health" element={<ProtectedRoute><CowHealth /></ProtectedRoute>} />
                                <Route path="/production" element={<ProtectedRoute><MilkProduction /></ProtectedRoute>} />
                                <Route path="/feed" element={<ProtectedRoute><FeedManagement /></ProtectedRoute>} />
                                <Route path="/reproduction" element={<ProtectedRoute><Reproduction /></ProtectedRoute>} />
                                <Route path="/financials" element={<ProtectedRoute><Financials /></ProtectedRoute>} />
                                <Route path="/labour" element={<ProtectedRoute><LabourSalary /></ProtectedRoute>} />
                                <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
                                <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
                                <Route path="/vaccination" element={<ProtectedRoute><VaccinationTimeline /></ProtectedRoute>} />
                                <Route path="/prediction" element={<ProtectedRoute><MilkPrediction /></ProtectedRoute>} />
                                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                                <Route path="/settings" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                                <Route path="/security" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                                <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
                                <Route path="/cows" element={<ProtectedRoute><CowManagement /></ProtectedRoute>} />
                                <Route path="/farm-costs" element={<ProtectedRoute><FarmCosts /></ProtectedRoute>} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

export default function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <ThemeProvider>
                    <LanguageProvider>
                        <AuthProvider>
                            <CowProvider>
                                <AppLayout />
                            </CowProvider>
                        </AuthProvider>
                    </LanguageProvider>
                </ThemeProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

