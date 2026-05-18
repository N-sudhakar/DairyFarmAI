import React from 'react';
import { Plus, Database } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * EmptyState component — shown when a page has no data
 * Provides a professional empty state with illustration, message, and optional CTA
 */
export default function EmptyState({ icon, title, message, actionLabel, onAction }) {
    const Icon = icon || Database;

    return (
        <div className="empty-state-container">
            <div className="empty-state-icon-wrap">
                <Icon size={48} strokeWidth={1.2} />
            </div>
            <h3 className="empty-state-title">{title || 'No Data Yet'}</h3>
            <p className="empty-state-message">
                {message || 'Start by adding your first entry to see data here.'}
            </p>
            {actionLabel && onAction && (
                <button className="empty-state-action" onClick={onAction}>
                    <Plus size={16} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
