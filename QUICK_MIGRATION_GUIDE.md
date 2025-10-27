# Quick Firebase Migration Guide

## 🚀 Fast Migration Steps

### Step 1: Create New Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name: `namaa-energy-new`
4. Enable Analytics (optional)
5. Click "Create project"

### Step 2: Set Up Services in New Project

#### Enable Authentication
- Go to **Authentication** → **Get started**
- Enable **Email/Password**
- Click **Save**

#### Create Realtime Database
- Go to **Realtime Database** → **Create Database**
- Choose **Test mode**
- Select location (same as old project if possible)
- Click **Done**
- **Copy the database URL** (you'll need this)

#### Enable Storage
- Go to **Storage** → **Get started**
- Choose **Test mode**
- Select location
- Click **Done**

### Step 3: Get New Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps**
3. Click **Web** icon (`</>`)
4. App nickname: `namaa-web`
5. Click **Register app**
6. **Copy the config object**

### Step 4: Export Data from Old Project

#### Option A: Using Firebase Console (Easiest)

**Export Realtime Database:**
1. Go to old project → **Realtime Database**
2. Click **⋮** menu → **Export JSON**
3. Save as `old-database-export.json`

**Export Storage:**
1. Go to old project → **Storage**
2. Download files manually (or use gsutil)

**Export Users:**
1. Go to old project → **Authentication** → **Users**
2. Note down user emails (you'll need to recreate them)

#### Option B: Using Scripts (Automated)

```bash
# Install dependencies
npm install firebase-admin

# Download service account keys from both projects
# Save as: old-service-account.json and new-service-account.json

# Export data
node scripts/export-firebase-data.js

# Import data
node scripts/import-firebase-data.js
```

### Step 5: Import Data to New Project

#### Import Realtime Database
1. Go to new project → **Realtime Database**
2. Click **⋮** menu → **Import JSON**
3. Upload `old-database-export.json`

#### Import Storage
1. Go to new project → **Storage**
2. Upload files manually

#### Import Users
- Users will need to register again with the same email
- Or use Firebase Admin SDK to import users programmatically

### Step 6: Update Your Application

#### Create `.env` file

```bash
# Create .env file in project root
cp env-template.txt .env
```

#### Update `.env` with new credentials:

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

#### Update `.firebaserc`:

```json
{
  "projects": {
    "default": "namaa-energy-new"
  }
}
```

### Step 7: Test the Migration

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Test features:
   - ✅ Login with existing user
   - ✅ View applications
   - ✅ Create new application
   - ✅ Upload documents
   - ✅ Test admin portal

### Step 8: Deploy

```bash
# Commit changes
git add .
git commit -m "Migrate to new Firebase project"
git push

# Deploy to Firebase Hosting (if applicable)
firebase deploy --project namaa-energy-new
```

---

## ⚠️ Important Notes

1. **Backup First**: Always backup your data before migration
2. **Test Environment**: Test on a staging environment first
3. **User Authentication**: Users may need to re-register
4. **Storage Files**: Large files need to be migrated using gsutil
5. **Security Rules**: Copy security rules from old project to new project

---

## 🔧 Troubleshooting

### Issue: Can't login after migration
- Check that users were imported correctly
- Verify authentication is enabled in new project

### Issue: Data not showing
- Check database URL in `.env` file
- Verify data was imported successfully

### Issue: Storage files missing
- Re-upload files manually
- Or use gsutil to migrate files

### Issue: Real-time updates not working
- Check Realtime Database is enabled
- Verify database URL is correct

---

## 📋 Migration Checklist

- [ ] Create new Firebase project
- [ ] Enable Authentication
- [ ] Create Realtime Database
- [ ] Enable Storage
- [ ] Get Firebase configuration
- [ ] Export old database data
- [ ] Export old storage files
- [ ] Export old users
- [ ] Import data to new project
- [ ] Create `.env` file
- [ ] Update `.env` with new credentials
- [ ] Update `.firebaserc`
- [ ] Test authentication
- [ ] Test database
- [ ] Test storage
- [ ] Test all features
- [ ] Deploy to production

---

## 📞 Need Help?

If you encounter issues:
1. Check Firebase Console for errors
2. Review browser console
3. Check Firebase logs
4. Contact Firebase support

