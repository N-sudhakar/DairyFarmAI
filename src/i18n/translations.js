import { nav } from './nav';
import { common } from './common';
import { header } from './header';
import { dashboard } from './dashboard';
import { pages } from './pages';
import { financials, alerts, insights, labour } from './more';
import { auth } from './auth';
import { vaccination } from './vaccination';
import { prediction } from './prediction';
import { cowManagement } from './cowManagement';

export const translations = {
    ...nav,
    ...common,
    ...header,
    ...dashboard,
    ...pages,
    ...financials,
    ...alerts,
    ...insights,
    ...labour,
    ...auth,
    ...vaccination,
    ...prediction,
    ...cowManagement,
};

