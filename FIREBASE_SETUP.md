# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `namaa-energy` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 3. Create Firestore Database

1. In Firebase Console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## 4. Get Firebase Configuration

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (`</>`) to add a web app
4. Enter app nickname: `namaa-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the Firebase configuration object

## 5. Update Firebase Configuration

Replace the placeholder values in `src/firebase/config.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
  measurementId: "your-actual-measurement-id"
};
```

## 6. Install Dependencies

Run these commands in your terminal:

```bash
npm install firebase
```

## 7. Firestore Security Rules (Optional)

For production, update your Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own tickets
    match /tickets/{ticketId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Users can only access their own projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 8. Test the Integration

1. Start your development server: `npm run dev`
2. Try registering a new account
3. Check Firebase Console to see if the user was created
4. Check Firestore to see if user profile and tickets are being saved

## Features Implemented

✅ **Authentication**
- User registration with email/password
- Automatic login state management
- User profile creation in Firestore

✅ **Data Storage**
- User profiles stored in Firestore
- Application tickets saved to Firestore
- Real-time data synchronization
- Project tracking data

✅ **Real-time Updates**
- Dashboard automatically updates when new tickets are created
- No need to refresh the page to see new data

## Troubleshooting

- **White screen**: Check browser console for errors
- **Authentication errors**: Verify Firebase configuration
- **Database errors**: Check Firestore security rules
- **Import errors**: Make sure Firebase is installed (`npm install firebase`)
