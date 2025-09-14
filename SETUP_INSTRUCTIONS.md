# Quick Setup Instructions

## 1. Create .env file

1. Copy the content from `env-template.txt`
2. Create a new file named `.env` in your project root
3. Paste the content and replace the placeholder values with your Firebase credentials

## 2. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings (gear icon) > General tab
4. Scroll down to "Your apps" section
5. Click "Web" icon (`</>`) to add a web app
6. Copy the configuration values

## 3. Enable Authentication

1. In Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable "Email/Password" provider
3. Click "Save"

## 4. Test the App

1. Run: `npm run dev`
2. Open browser console to see Firebase test results
3. Try registering a new account
4. Check if data persists in Firebase Console > Authentication

## Current Status

✅ **Working**: Registration and login (with localStorage fallback)
⚠️ **Needs Setup**: Firebase configuration for persistent data storage

The app will work with localStorage even without Firebase, but for production you'll want Firebase configured.
