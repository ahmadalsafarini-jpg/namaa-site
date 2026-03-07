# Fix PERMISSION_DENIED Error

## Problem
When submitting an application, you see: **"PERMISSION_DENIED: Permission denied"**

This happens because Firebase Realtime Database security rules are blocking write operations.

## Solution: Update Firebase Security Rules

### Step 1: Open Firebase Console
1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Select your project: **namaa-fc163**
3. In the left sidebar, click **"Realtime Database"**

### Step 2: Go to Rules Tab
1. Click on the **"Rules"** tab at the top
2. You'll see the current security rules

### Step 3: Update the Rules
Replace the existing rules with the following:

```json
{
  "rules": {
    "applications": {
      "$applicationId": {
        ".read": "auth != null && (data.child('userId').val() == auth.uid || root.child('users').child(auth.uid).child('role').val() == 'admin')",
        ".write": "auth != null && (data.child('userId').val() == auth.uid || root.child('users').child(auth.uid).child('role').val() == 'admin' || !data.exists())",
        ".validate": "newData.hasChildren(['userId', 'projectName', 'facilityType']) && newData.child('userId').val() == auth.uid"
      },
      ".read": "auth != null",
      ".write": "auth != null && (!data.exists() || data.child('userId').val() == auth.uid)"
    },
    "tickets": {
      "$ticketId": {
        ".read": "auth != null && (data.child('userId').val() == auth.uid || root.child('users').child(auth.uid).child('role').val() == 'admin')",
        ".write": "auth != null && (data.child('userId').val() == auth.uid || root.child('users').child(auth.uid).child('role').val() == 'admin' || !data.exists())"
      }
    },
    "users": {
      "$userId": {
        ".read": "auth != null && (auth.uid == $userId || root.child('users').child(auth.uid).child('role').val() == 'admin')",
        ".write": "auth != null && (auth.uid == $userId || root.child('users').child(auth.uid).child('role').val() == 'admin')"
      }
    },
    "energyCompanies": {
      ".read": true,
      ".write": true
    }
  }
}
```

### Step 4: Publish the Rules
1. Click the **"Publish"** button
2. Wait for confirmation that rules have been published

**OR deploy via Firebase CLI:**
```bash
firebase deploy --only database
```
(This uses the `database.rules.json` file in the project root.)

### Step 5: Test
1. Go back to your application
2. Try submitting an application again
3. It should work now!

## What These Rules Do

- **Authenticated users** can create new applications (when `!data.exists()`)
- **Users can only read/write their own applications** (where `userId == auth.uid`)
- **Admins** can read/write all applications
- **All authenticated users** can read the applications list (to query by userId)
- **energyCompanies**: Allows unauthenticated read/write so the admin portal (which uses in-app login, not Firebase Auth) can create and manage energy companies

## Alternative: Test Mode (Development Only)

If you're still in development and want to allow all reads/writes temporarily:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

**⚠️ WARNING**: Only use this for development! Never use this in production.

## Troubleshooting

If you still get errors:
1. Make sure you're logged in (check the browser console)
2. Verify your Firebase project is correct (namaa-fc163)
3. Check that Realtime Database is enabled
4. Make sure the database location matches your `.env` file


