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

## 4. Create Realtime Database

1. In Firebase Console, go to "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database (preferably same as Firestore)
5. Click "Done"

## 5. Get Firebase Configuration

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon (`</>`) to add a web app
4. Enter app nickname: `namaa-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the Firebase configuration object

## 6. Set Up Environment Variables

Create a `.env` file in your project root and add your Firebase configuration:

```bash
# Create .env file
touch .env
```

Add your Firebase credentials to the `.env` file:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
VITE_FIREBASE_APP_ID=your-actual-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-actual-measurement-id
```

**Important**: Add `.env` to your `.gitignore` file to keep your credentials secure!

The Firebase configuration in `src/firebase/config.js` will automatically use these environment variables.

## 7. Install Dependencies

Run these commands in your terminal:

```bash
npm install firebase
```

## 8. Firestore Security Rules (Optional)

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

## 9. Test the Integration

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
- Application data saved to Realtime Database
- Application tickets saved to Realtime Database
- Real-time data synchronization
- Project tracking data

✅ **Real-time Updates**
- Dashboard automatically updates when new applications are submitted
- Real-time synchronization across all connected devices
- No need to refresh the page to see new data

## Troubleshooting

- **White screen**: Check browser console for errors
- **Authentication errors**: Verify Firebase configuration
- **Database errors**: Check Firestore security rules
- **Import errors**: Make sure Firebase is installed (`npm install firebase`)
