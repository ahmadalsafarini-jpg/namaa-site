# Firebase: Enable Services - Step-by-Step Guide

## 🎯 Goal
Enable Authentication, Realtime Database, and Storage in your Firebase project.

---

## Step 1: Access Firebase Console

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Sign in with your Google account
3. Select your project (or create a new one)

---

## Step 2: Enable Authentication

### 2.1 Navigate to Authentication
- In the left sidebar, click **"Authentication"**
- If you see "Get started" button, click it
- If you already have Authentication enabled, you'll see the dashboard

### 2.2 Enable Email/Password Provider
1. Click on the **"Sign-in method"** tab (at the top)
2. You'll see a list of sign-in providers
3. Find **"Email/Password"** in the list
4. Click on it
5. Toggle the **"Enable"** switch to ON
6. Click **"Save"** button

**✅ You should see**: Email/Password provider is now enabled (green checkmark)

### 2.3 (Optional) Add Other Providers
If you want to add Google, Facebook, etc.:
- Click on the provider you want to enable
- Toggle "Enable" switch
- Follow the setup instructions
- Click "Save"

---

## Step 3: Create Realtime Database

### 3.1 Navigate to Realtime Database
- In the left sidebar, click **"Realtime Database"**
- Click **"Create Database"** button

### 3.2 Choose Database Location
- A popup will appear asking for database location
- **Important**: Choose the same location as your old project (if migrating)
- Common locations:
  - `europe-west1` (Belgium)
  - `us-central1` (Iowa)
  - `asia-southeast1` (Singapore)
- Click **"Next"**

### 3.3 Set Security Rules
You'll see two options:

**Option A: Start in test mode (Recommended for development)**
- Choose **"Start in test mode"**
- This allows read/write access for 30 days
- Click **"Done"**

**Option B: Start in production mode**
- Choose **"Start in production mode"**
- You'll need to set up security rules manually
- Click **"Done"**

### 3.4 Copy Database URL
After creation, you'll see your database URL:
```
https://your-project-id-default-rtdb.region.firebasedatabase.app/
```

**📝 IMPORTANT**: Copy this URL - you'll need it for your `.env` file!

### 3.5 (Optional) Set Security Rules
If you chose test mode, you can update rules later:
1. Click on **"Rules"** tab
2. Update the rules as needed
3. Click **"Publish"**

**Example rules for your app:**
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

---

## Step 4: Enable Storage

### 4.1 Navigate to Storage
- In the left sidebar, click **"Storage"**
- Click **"Get started"** button

### 4.2 Choose Storage Location
- A popup will appear asking for storage location
- **Important**: Choose the same location as your database
- Click **"Next"**

### 4.3 Set Security Rules
You'll see two options:

**Option A: Start in test mode (Recommended for development)**
- Choose **"Start in test mode"**
- This allows read/write access for 30 days
- Click **"Done"**

**Option B: Start in production mode**
- Choose **"Start in production mode"**
- You'll need to set up security rules manually
- Click **"Done"**

### 4.4 (Optional) Set Security Rules
If you chose test mode, you can update rules later:
1. Click on **"Rules"** tab
2. Update the rules as needed
3. Click **"Publish"**

**Example rules for your app:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Step 5: Get Firebase Configuration

### 5.1 Navigate to Project Settings
- Click the **gear icon** (⚙️) next to "Project Overview" in the left sidebar
- Click **"Project settings"**

### 5.2 Scroll to "Your apps" Section
- Scroll down to find **"Your apps"** section
- You'll see a list of apps (Web, iOS, Android, etc.)

### 5.3 Add Web App (if not exists)
If you don't have a web app yet:
1. Click the **"Web"** icon (`</>`)
2. Enter app nickname: `namaa-web`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**

### 5.4 Copy Configuration
You'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**📝 IMPORTANT**: Copy these values - you'll need them for your `.env` file!

### 5.5 Get Database URL
- Scroll down to **"Your apps"** section
- Find your web app
- Look for **"Realtime Database URL"**
- Copy the URL (should look like: `https://your-project-default-rtdb.region.firebasedatabase.app/`)

---

## Step 6: Verify Everything is Enabled

### Check Authentication
- Go to **Authentication** → **Users**
- You should see "No users yet" (or your users if imported)
- ✅ Authentication is working if you can access this page

### Check Realtime Database
- Go to **Realtime Database** → **Data**
- You should see an empty database
- ✅ Database is working if you can access this page

### Check Storage
- Go to **Storage** → **Files**
- You should see "No files yet"
- ✅ Storage is working if you can access this page

---

## Step 7: Update Your Application

### 7.1 Create `.env` File
In your project root, create a file named `.env`:

```bash
# Windows PowerShell
New-Item -Path .env -ItemType File

# Or use your code editor to create the file
```

### 7.2 Add Firebase Configuration
Open `.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.region.firebasedatabase.app/
```

**Replace the values** with the ones you copied from Firebase Console!

### 7.3 Update `.firebaserc`
Open `.firebaserc` and update the project ID:

```json
{
  "projects": {
    "default": "your-new-project-id"
  }
}
```

---

## Step 8: Test Your Setup

### 8.1 Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 8.2 Test Authentication
1. Go to your app
2. Try to register a new user
3. Check Firebase Console → Authentication → Users
4. You should see the new user

### 8.3 Test Database
1. Create a new application in your app
2. Check Firebase Console → Realtime Database → Data
3. You should see the application data

### 8.4 Test Storage
1. Upload a document in your app
2. Check Firebase Console → Storage → Files
3. You should see the uploaded file

---

## ✅ Checklist

- [ ] Authentication enabled
- [ ] Email/Password provider enabled
- [ ] Realtime Database created
- [ ] Database URL copied
- [ ] Storage enabled
- [ ] Firebase configuration copied
- [ ] `.env` file created
- [ ] `.env` file updated with credentials
- [ ] `.firebaserc` updated
- [ ] Development server restarted
- [ ] Authentication tested
- [ ] Database tested
- [ ] Storage tested

---

## 🎯 What You Should Have Now

### From Firebase Console:
1. ✅ Authentication enabled
2. ✅ Realtime Database URL
3. ✅ Storage bucket name
4. ✅ Firebase configuration object

### In Your Project:
1. ✅ `.env` file with all credentials
2. ✅ `.firebaserc` updated with new project ID
3. ✅ Application working with new Firebase project

---

## 🆘 Troubleshooting

### Issue: "Authentication not enabled"
**Solution**: Go to Authentication → Sign-in method → Enable Email/Password

### Issue: "Database not found"
**Solution**: Make sure you created the Realtime Database and copied the correct URL

### Issue: "Storage not accessible"
**Solution**: Make sure you enabled Storage and set proper security rules

### Issue: "Configuration error"
**Solution**: Double-check your `.env` file - make sure all values are correct and there are no extra spaces

### Issue: "Can't connect to Firebase"
**Solution**: 
1. Check your internet connection
2. Verify your Firebase project is active
3. Check browser console for specific error messages

---

## 📞 Need Help?

If you're stuck:
1. Check the error message in browser console
2. Verify all credentials in `.env` file
3. Make sure all services are enabled in Firebase Console
4. Try restarting your development server

---

## 🎉 Next Steps

Once everything is working:
1. Test all features thoroughly
2. Export data from old project (if migrating)
3. Import data to new project
4. Deploy to production

Good luck! 🚀

