// Google OAuth Configuration
// Replace with your actual Google Client ID from Google Cloud Console
// Steps: 
// 1. Go to https://console.cloud.google.com/
// 2. Create or select a project
// 3. Go to APIs & Services → Credentials
// 4. Create Credentials → OAuth Client ID → Web Application
// 5. Add http://localhost:5173 to Authorized JavaScript Origins
// 6. Copy the Client ID below

export const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

// Set to true once you've configured your real Client ID above
export const GOOGLE_AUTH_ENABLED = GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
