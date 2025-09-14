# Firebase Realtime Database Setup Guide

## 1. Enable Realtime Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`namaa-b268d`)
3. In the left sidebar, click "Realtime Database"
4. Click "Create Database"
5. Choose "Start in test mode" (for development)
6. Select a location for your database (preferably same as your Firestore)
7. Click "Done"

## 2. Database Structure

The Realtime Database will store data in the following structure:

```
{
  "applications": {
    "applicationId1": {
      "projectName": "Solar Farm Project",
      "facilityType": "Commercial",
      "location": "United States",
      "loadProfile": "120000",
      "systemType": "On-grid",
      "notes": "Project details...",
      "files": {
        "bills": [...],
        "photos": [...],
        "load": [...]
      },
      "userId": "user123",
      "userEmail": "user@example.com",
      "userName": "John Doe",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "tickets": {
    "ticketId1": {
      "name": "Solar Farm Project",
      "systemType": "On-grid",
      "status": "Pending",
      "submittedAt": "Jan 15, 2024",
      "files": {...},
      "details": {...},
      "userId": "user123",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## 3. Security Rules (Optional)

For production, update your Realtime Database security rules:

```json
{
  "rules": {
    "applications": {
      "$applicationId": {
        ".read": "auth != null && (data.child('userId').val() == auth.uid || root.child('users').child(auth.uid).child('role').val() == 'admin')",
        ".write": "auth != null && (data.child('userId').val() == auth.uid || root.child('users').child(auth.uid).child('role').val() == 'admin')"
      }
    },
    "tickets": {
      "$ticketId": {
        ".read": "auth != null && (data.child('userId').val() == auth.uid || root.child('users').child(auth.uid).child('role').val() == 'admin')",
        ".write": "auth != null && (data.child('userId').val() == auth.uid || root.child('users').child(auth.uid).child('role').val() == 'admin')"
      }
    }
  }
}
```

## 4. Features Implemented

✅ **Application Storage**
- Save application form data to Realtime Database
- Real-time synchronization across devices
- Automatic timestamps and metadata

✅ **Ticket Management**
- Create tickets for application tracking
- Real-time status updates
- User-specific ticket filtering

✅ **Real-time Updates**
- Dashboard automatically updates when new applications are submitted
- No need to refresh the page to see new data
- Cross-device synchronization

✅ **Data Structure**
- Organized by collections (applications, tickets)
- User-based access control
- Automatic ID generation

## 5. Testing the Integration

1. **Submit an Application**:
   - Fill out the application form
   - Submit the form
   - Check Firebase Console → Realtime Database to see the data

2. **View Real-time Updates**:
   - Open the app in multiple browser tabs
   - Submit an application in one tab
   - Watch it appear in real-time in other tabs

3. **Check Dashboard**:
   - Applications should appear on the dashboard immediately
   - No page refresh needed

## 6. Data Access

You can access the data programmatically:

```javascript
import { getUserApplications, subscribeToUserApplications } from './firebase/realtime-db';

// Get user's applications
const applications = await getUserApplications(userId);

// Subscribe to real-time updates
const unsubscribe = subscribeToUserApplications(userId, (applications) => {
  console.log('Applications updated:', applications);
});
```

## 7. Benefits of Realtime Database

- **Real-time Sync**: Changes appear instantly across all connected clients
- **Offline Support**: Works offline and syncs when connection is restored
- **Simple Structure**: JSON-like data structure is easy to work with
- **Scalable**: Handles concurrent users and large datasets
- **Cost Effective**: Pay only for data transfer and storage used
