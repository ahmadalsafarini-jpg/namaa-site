# Firebase Account Migration Guide

## Overview
This guide will help you migrate from your current Firebase account to a new one while preserving all your data and settings.

## ⚠️ Important: Data Migration Strategy

You have **two options**:

### Option 1: Export and Import Data (Recommended)
This method exports all data from the old Firebase project and imports it into the new one.

### Option 2: Keep Both Projects Running
This method keeps the old project as a backup while using the new one for future operations.

---

## Step-by-Step Migration Process

### Phase 1: Set Up New Firebase Project

1. **Create New Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" or "Add project"
   - Enter project name: `namaa-energy-new` (or your preferred name)
   - Enable Google Analytics (optional)
   - Click "Create project"

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication" in the left sidebar
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable "Email/Password" provider
   - Click "Save"

3. **Create Realtime Database**
   - In Firebase Console, go to "Realtime Database" in the left sidebar
   - Click "Create Database"
   - Choose "Start in test mode" (for development)
   - Select a location for your database (preferably same as old project)
   - Click "Done"
   - **Important**: Note down the database URL (format: `https://your-project-id-default-rtdb.region.firebasedatabase.app/`)

4. **Enable Storage**
   - In Firebase Console, go to "Storage" in the left sidebar
   - Click "Get started"
   - Choose "Start in test mode" (for development)
   - Select a location for your storage (preferably same as database)
   - Click "Done"

5. **Get Firebase Configuration**
   - In Firebase Console, go to "Project settings" (gear icon)
   - Scroll down to "Your apps" section
   - Click "Web" icon (`</>`) to add a web app
   - Enter app nickname: `namaa-web`
   - Click "Register app"
   - Copy the Firebase configuration object

---

### Phase 2: Export Data from Old Firebase Project

#### Export Realtime Database Data

1. **Using Firebase Console**:
   - Go to your old Firebase project
   - Navigate to "Realtime Database"
   - Click the three dots menu (⋮) at the top
   - Select "Export JSON"
   - Save the file as `old-database-export.json`

2. **Using Firebase CLI** (Alternative):
   ```bash
   # Install Firebase CLI if not already installed
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Export database
   firebase database:export old-database-export.json --project namaa-b268d
   ```

#### Export Storage Files

1. **Using Firebase Console**:
   - Go to your old Firebase project
   - Navigate to "Storage"
   - Download all files manually (or use gsutil)

2. **Using gsutil** (Recommended for large datasets):
   ```bash
   # Install gsutil (comes with Google Cloud SDK)
   # Download from: https://cloud.google.com/sdk/docs/install
   
   # Export storage files
   gsutil -m cp -r gs://namaa-b268d.appspot.com ./old-storage-backup/
   ```

#### Export Authentication Users

1. **Using Firebase Console**:
   - Go to your old Firebase project
   - Navigate to "Authentication" > "Users"
   - Click "Export users" (if available)
   - Save the file as `old-users-export.csv`

2. **Using Firebase Admin SDK** (Recommended):
   ```bash
   # Create a script to export users
   # Save this as export-users.js
   ```
   ```javascript
   const admin = require('firebase-admin');
   
   admin.initializeApp({
     credential: admin.credential.cert(require('./old-service-account.json'))
   });
   
   admin.auth().listUsers().then((result) => {
     const users = result.users.map(user => ({
       uid: user.uid,
       email: user.email,
       displayName: user.displayName,
       emailVerified: user.emailVerified,
       disabled: user.disabled,
       metadata: user.metadata
     }));
     console.log(JSON.stringify(users, null, 2));
   });
   ```

---

### Phase 3: Import Data to New Firebase Project

#### Import Realtime Database Data

1. **Using Firebase Console**:
   - Go to your new Firebase project
   - Navigate to "Realtime Database"
   - Click the three dots menu (⋮) at the top
   - Select "Import JSON"
   - Upload `old-database-export.json`

2. **Using Firebase CLI**:
   ```bash
   # Import database
   firebase database:set / --import-file old-database-export.json --project namaa-energy-new
   ```

#### Import Storage Files

1. **Using Firebase Console**:
   - Go to your new Firebase project
   - Navigate to "Storage"
   - Upload files manually

2. **Using gsutil**:
   ```bash
   # Import storage files
   gsutil -m cp -r ./old-storage-backup/* gs://namaa-energy-new.appspot.com/
   ```

#### Import Authentication Users

1. **Using Firebase Admin SDK**:
   ```bash
   # Create a script to import users
   # Save this as import-users.js
   ```
   ```javascript
   const admin = require('firebase-admin');
   
   admin.initializeApp({
     credential: admin.credential.cert(require('./new-service-account.json'))
   });
   
   const users = require('./old-users-export.json');
   
   users.forEach(user => {
     admin.auth().createUser({
       uid: user.uid,
       email: user.email,
       displayName: user.displayName,
       emailVerified: user.emailVerified,
       disabled: user.disabled
     }).then(() => {
       console.log(`Imported user: ${user.email}`);
     }).catch(error => {
       console.error(`Error importing user ${user.email}:`, error);
     });
   });
   ```

---

### Phase 4: Update Your Application

1. **Create `.env` file** (if not exists):
   ```bash
   # Copy the template
   cp env-template.txt .env
   ```

2. **Update `.env` file** with new Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your-new-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-new-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-new-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-new-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-new-sender-id
   VITE_FIREBASE_APP_ID=your-new-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-new-measurement-id
   VITE_FIREBASE_DATABASE_URL=https://your-new-project-id-default-rtdb.region.firebasedatabase.app/
   ```

3. **Update `.firebaserc`**:
   ```json
   {
     "projects": {
       "default": "namaa-energy-new"
     }
   }
   ```

4. **Update `src/firebase/config.js`**:
   - Replace the hardcoded config with environment variables
   - Or update the values directly

---

### Phase 5: Test the Migration

1. **Test Authentication**:
   - Try logging in with an existing user
   - Verify user data is accessible

2. **Test Database**:
   - Check if applications are loading
   - Verify real-time updates work

3. **Test Storage**:
   - Upload a test file
   - Verify files are accessible

4. **Test All Features**:
   - Create a new application
   - Update application status
   - Upload documents
   - Test admin portal

---

### Phase 6: Update Deployment

1. **Update Firebase Hosting** (if applicable):
   ```bash
   firebase deploy --only hosting --project namaa-energy-new
   ```

2. **Update GitHub Actions** (if using CI/CD):
   - Update `.github/workflows/*.yml` files with new project ID

3. **Update Environment Variables**:
   - Update production environment variables
   - Update staging environment variables

---

## Alternative: Keep Both Projects Running

If you want to keep both projects running simultaneously:

1. **Create a feature flag** to switch between projects:
   ```javascript
   // src/firebase/config.js
   const USE_NEW_PROJECT = true; // Toggle this
   
   const oldConfig = { /* old config */ };
   const newConfig = { /* new config */ };
   
   const firebaseConfig = USE_NEW_PROJECT ? newConfig : oldConfig;
   ```

2. **Gradually migrate users**:
   - Keep old project for existing users
   - Use new project for new registrations
   - Migrate users gradually

---

## Troubleshooting

### Issue: Users can't log in after migration
**Solution**: Make sure you imported all authentication users with their original UIDs.

### Issue: Data not showing
**Solution**: Check that the database URL in your config matches the new project.

### Issue: Storage files not accessible
**Solution**: Verify storage bucket name and security rules.

### Issue: Real-time updates not working
**Solution**: Check that Realtime Database is enabled and configured correctly.

---

## Quick Migration Checklist

- [ ] Create new Firebase project
- [ ] Enable Authentication
- [ ] Create Realtime Database
- [ ] Enable Storage
- [ ] Get Firebase configuration
- [ ] Export old database data
- [ ] Export old storage files
- [ ] Export old authentication users
- [ ] Import data to new project
- [ ] Update `.env` file
- [ ] Update `src/firebase/config.js`
- [ ] Update `.firebaserc`
- [ ] Test authentication
- [ ] Test database
- [ ] Test storage
- [ ] Test all features
- [ ] Update deployment
- [ ] Monitor for issues

---

## Need Help?

If you encounter any issues during migration:
1. Check Firebase Console for errors
2. Review browser console for client-side errors
3. Check Firebase logs in the console
4. Contact Firebase support if needed

