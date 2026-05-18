import React from 'react';
import { User, Settings, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProfilePage() {
    const { user } = useAuth();
    const { t } = useLanguage();

    return (
        <div className="page-transition">
            <div className="page-header">
                <h1>{t('myProfile')}</h1>
                <p>{t('profileSubtitle') || 'View and update your personal account details.'}</p>
            </div>

            <div className="profile-page-grid">
                <div className="profile-card">
                    <div className="profile-card-icon">
                        <User size={20} />
                    </div>
                    <h2>{user?.fullName || 'Farm Owner'}</h2>
                    <p>{user?.email || 'owner@dairyai.com'}</p>
                    <p>{user?.phone || '+91 98765 43210'}</p>
                </div>

                <div className="profile-card profile-card-alt">
                    <div className="profile-card-icon">
                        <Settings size={20} />
                    </div>
                    <h2>{t('accountSettings')}</h2>
                    <p>{t('accountSettingsDesc') || 'Change password, update contact info, and manage preferences.'}</p>
                    <button type="button" className="profile-card-link">
                        {t('manageSettings') || 'Manage settings'} <ChevronRight size={14} />
                    </button>
                </div>

                <div className="profile-card profile-card-alt">
                    <div className="profile-card-icon">
                        <ShieldCheck size={20} />
                    </div>
                    <h2>{t('securityDevices')}</h2>
                    <p>{t('securityDevicesDesc') || 'View recent devices and manage active sessions.'}</p>
                    <button type="button" className="profile-card-link">
                        {t('reviewSecurity') || 'Review security'} <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
