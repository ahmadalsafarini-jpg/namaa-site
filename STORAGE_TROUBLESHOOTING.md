# Firebase Storage Test Guide

## Issue: File Upload Stuck on "Uploading"

The file upload is getting stuck because Firebase Storage might not be properly configured in your new Firebase project.

## Quick Fix Steps

### 1. Enable Firebase Storage in Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `namaa-fc163`
3. Click **"Storage"** in the left sidebar
4. If you see "Get started", click it
5. Choose **"Start in test mode"** (for development)
6. Select a location (same as your database)
7. Click **"Done"**

### 2. Set Storage Security Rules

1. In Storage, click the **"Rules"** tab
2. Replace the rules with:

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

3. Click **"Publish"**

### 3. Test Storage Connection

Open browser console (F12) and run this test:

```javascript
// Test Firebase Storage connection
import { storage } from './src/firebase/config.js';
import { ref, uploadBytes } from 'firebase/storage';

// Create a test file
const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

// Test upload
const testRef = ref(storage, 'test/test.txt');
uploadBytes(testRef, testFile)
  .then(() => console.log('✅ Storage working!'))
  .catch(error => console.error('❌ Storage error:', error));
```

### 4. Check Storage Bucket Name

Make sure your `.env` file has the correct storage bucket:

```env
VITE_FIREBASE_STORAGE_BUCKET=namaa-fc163.firebasestorage.app
```

### 5. Verify Storage in Firebase Console

1. Go to Storage → Files
2. Try uploading a test file manually
3. Check if files appear in the Storage bucket

## Common Issues

### Issue 1: Storage Not Enabled
**Solution**: Enable Storage in Firebase Console

### Issue 2: Wrong Storage Bucket
**Solution**: Check `.env` file has correct bucket name

### Issue 3: Security Rules Too Restrictive
**Solution**: Use test mode rules (see step 2 above)

### Issue 4: Authentication Required
**Solution**: Make sure user is logged in before uploading

## Debug Steps

1. **Check Browser Console**: Look for Firebase errors
2. **Check Network Tab**: See if upload requests are failing
3. **Check Firebase Console**: Verify Storage is enabled
4. **Test Manual Upload**: Try uploading via Firebase Console

## Quick Test

Run this in browser console to test:

```javascript
// Check if Firebase is working
console.log('Firebase app:', window.firebase);
console.log('Storage:', window.firebase?.storage());
```

## Expected Behavior

After fixing:
- Files should upload immediately when selected
- You should see "✓ X file(s) uploaded successfully"
- Files should appear in Firebase Storage console
- No more "Uploading..." stuck state

## Need Help?

If still not working:
1. Check browser console for specific errors
2. Verify Storage is enabled in Firebase Console
3. Test with a small file first
4. Check network connectivity

