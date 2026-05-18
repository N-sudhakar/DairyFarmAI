import React from 'react';
import { HelpCircle, Mail, Phone, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SupportPage() {
    const { t } = useLanguage();

    return (
        <div className="page-transition">
            <div className="page-header">
                <h1>{t('helpSupport')}</h1>
                <p>{t('supportSubtitle') || 'Need help? Contact our support team for fast assistance.'}</p>
            </div>

            <div className="support-grid">
                <div className="support-card">
                    <div className="support-card-icon support-icon-primary">
                        <HelpCircle size={22} />
                    </div>
                    <h2>{t('supportCenter') || 'Support Center'}</h2>
                    <p>{t('supportDescription') || 'Our team is available to help with account access, setup, and product questions.'}</p>
                </div>

                <div className="support-card">
                    <div className="support-card-icon support-icon-secondary">
                        <Mail size={22} />
                    </div>
                    <h2>{t('emailUs') || 'Email Us'}</h2>
                    <p><a href="mailto:support@dairyai.com">support@dairyai.com</a></p>
                </div>

                <div className="support-card">
                    <div className="support-card-icon support-icon-tertiary">
                        <Phone size={22} />
                    </div>
                    <h2>{t('callUs') || 'Call Us'}</h2>
                    <p>{t('phoneNumber') || '+91 98765 43210'}</p>
                </div>

                <div className="support-card">
                    <div className="support-card-icon support-icon-quaternary">
                        <Globe size={22} />
                    </div>
                    <h2>{t('visitHelpCenter') || 'Visit Help Center'}</h2>
                    <p>{t('helpCenterLink') || 'Explore guides, videos, and FAQs on our support portal.'}</p>
                </div>
            </div>
        </div>
    );
}
