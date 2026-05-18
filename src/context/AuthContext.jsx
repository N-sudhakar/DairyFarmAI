import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

// Default demo users for mock auth
const DEFAULT_USERS = [
    {
        id: '1',
        email: 'owner@dairyai.com',
        password: 'Owner@123',
        fullName: 'Rajesh Kumar',
        phone: '+91-9876543210',
        role: 'farm_owner',
        farmName: 'Green Valley Dairy Farm',
        profilePhoto: null,
        isFirstLogin: false,
    },
    {
        id: '2',
        email: 'vet@dairyai.com',
        password: 'Vet@1234',
        fullName: 'Dr. Priya Sharma',
        phone: '+91-9876543211',
        role: 'veterinarian',
        farmName: 'Green Valley Dairy Farm',
        profilePhoto: null,
        isFirstLogin: false,
    },
    {
        id: '3',
        email: 'coop@dairyai.com',
        password: 'Coop@123',
        fullName: 'Anil Deshmukh',
        phone: '+91-9876543212',
        role: 'cooperative_officer',
        farmName: 'Karnataka Milk Cooperative',
        profilePhoto: null,
        isFirstLogin: false,
    },
    {
        id: '4',
        email: 'admin@dairyai.com',
        password: 'Admin@123',
        fullName: 'Suresh Patel',
        phone: '+91-9876543213',
        role: 'super_admin',
        farmName: 'DairyAI Platform',
        profilePhoto: null,
        isFirstLogin: false,
    },
];

// Role → redirect path mapping
const ROLE_REDIRECTS = {
    farm_owner: '/',
    farm_manager: '/',
    veterinarian: '/health',
    feed_manager: '/feed',
    data_analyst: '/insights',
    cooperative_officer: '/production',
    super_admin: '/',
    field_worker: '/',
};

function getStoredUsers() {
    try {
        const data = localStorage.getItem('dairyai_users');
        return data ? JSON.parse(data) : [...DEFAULT_USERS];
    } catch {
        return [...DEFAULT_USERS];
    }
}

function storeUsers(users) {
    localStorage.setItem('dairyai_users', JSON.stringify(users));
}

function getStoredSession() {
    try {
        const data = localStorage.getItem('dairyai_session');
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function storeSession(session) {
    if (session) {
        localStorage.setItem('dairyai_session', JSON.stringify(session));
    } else {
        localStorage.removeItem('dairyai_session');
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(null);

    // Restore session on mount
    useEffect(() => {
        const session = getStoredSession();
        if (session) {
            const users = getStoredUsers();
            const found = users.find(u => u.id === session.userId);
            if (found) {
                setUser(found);
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback((email, password, remember = false) => {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Check lockout
                if (lockoutUntil && Date.now() < lockoutUntil) {
                    const minutesLeft = Math.ceil((lockoutUntil - Date.now()) / 60000);
                    reject({
                        type: 'lockout',
                        message: `Account locked. Try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`,
                    });
                    return;
                }

                const users = getStoredUsers();
                const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

                if (!found || found.password !== password) {
                    const newAttempts = failedAttempts + 1;
                    setFailedAttempts(newAttempts);

                    if (newAttempts >= 5) {
                        const lockTime = Date.now() + 30 * 60 * 1000; // 30 min
                        setLockoutUntil(lockTime);
                        setFailedAttempts(0);
                        reject({
                            type: 'lockout',
                            message: 'Too many failed attempts. Account locked for 30 minutes.',
                        });
                    } else {
                        reject({
                            type: 'invalid',
                            message: 'Invalid email or password. Please try again.',
                            attempts: newAttempts,
                            showCaptcha: newAttempts >= 3,
                        });
                    }
                    return;
                }

                // Success
                setFailedAttempts(0);
                setLockoutUntil(null);
                setUser(found);
                storeSession({ userId: found.id, remember });

                resolve({
                    user: found,
                    redirectTo: ROLE_REDIRECTS[found.role] || '/',
                });
            }, 800);
        });
    }, [failedAttempts, lockoutUntil]);

    const register = useCallback((accountData, farmData, planData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getStoredUsers();

                // Check duplicate email
                if (users.find(u => u.email.toLowerCase() === accountData.email.toLowerCase())) {
                    reject({ message: 'This email is already registered.' });
                    return;
                }

                const newUser = {
                    id: String(Date.now()),
                    email: accountData.email,
                    password: accountData.password,
                    fullName: accountData.fullName,
                    phone: accountData.phone || '',
                    role: 'farm_owner',
                    farmName: farmData.farmName,
                    farmType: farmData.farmType,
                    cattleCount: farmData.cattleCount,
                    breeds: farmData.breeds,
                    country: farmData.country,
                    state: farmData.state,
                    district: farmData.district,
                    plan: planData.plan,
                    billingCycle: planData.billingCycle,
                    profilePhoto: accountData.profilePhoto || null,
                    isFirstLogin: true,
                    createdAt: new Date().toISOString(),
                };

                users.push(newUser);
                storeUsers(users);
                setUser(newUser);
                storeSession({ userId: newUser.id, remember: false });

                resolve({
                    user: newUser,
                    redirectTo: '/',
                });
            }, 1500);
        });
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        storeSession(null);
    }, []);

    const resetPassword = useCallback((email) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Always resolve (don't reveal if email exists)
                resolve({ success: true });
            }, 800);
        });
    }, []);

    const updatePassword = useCallback((token, newPassword) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock: just resolve success
                resolve({ success: true });
            }, 800);
        });
    }, []);

    const loginWithGoogle = useCallback((credential, profile) => {
        return new Promise((resolve, reject) => {
            try {
                let email, name, picture, googleId;

                if (credential) {
                    // Decode the Google JWT credential (One Tap flow)
                    const decoded = jwtDecode(credential);
                    email = decoded.email;
                    name = decoded.name;
                    picture = decoded.picture;
                    googleId = decoded.sub;
                } else if (profile) {
                    // Use profile from Google userinfo API (implicit flow)
                    email = profile.email;
                    name = profile.name;
                    picture = profile.picture;
                    googleId = profile.sub;
                } else {
                    reject({ message: 'No Google credentials provided.' });
                    return;
                }

                const users = getStoredUsers();
                let existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

                if (existingUser) {
                    existingUser.profilePhoto = existingUser.profilePhoto || picture;
                    existingUser.authProvider = 'google';
                    existingUser.googleId = googleId;
                    storeUsers(users);
                    setUser(existingUser);
                    storeSession({ userId: existingUser.id, remember: true });
                    resolve({
                        user: existingUser,
                        redirectTo: ROLE_REDIRECTS[existingUser.role] || '/',
                    });
                } else {
                    const newUser = {
                        id: 'google_' + googleId,
                        email: email,
                        password: null,
                        fullName: name,
                        phone: '',
                        role: 'farm_owner',
                        farmName: `${name.split(' ')[0]}'s Farm`,
                        profilePhoto: picture || null,
                        isFirstLogin: true,
                        authProvider: 'google',
                        googleId: googleId,
                        createdAt: new Date().toISOString(),
                    };
                    users.push(newUser);
                    storeUsers(users);
                    setUser(newUser);
                    storeSession({ userId: newUser.id, remember: true });
                    resolve({
                        user: newUser,
                        redirectTo: '/',
                    });
                }
            } catch (err) {
                reject({ message: 'Failed to process Google sign-in. Please try again.' });
            }
        });
    }, []);

    const checkEmailAvailability = useCallback((email) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = getStoredUsers();
                const taken = users.some(u => u.email.toLowerCase() === email.toLowerCase());
                resolve({ available: !taken });
            }, 500);
        });
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        failedAttempts,
        login,
        loginWithGoogle,
        logout,
        register,
        resetPassword,
        updatePassword,
        checkEmailAvailability,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export default AuthContext;
