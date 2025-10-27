#!/usr/bin/env node
/**
 * Export Firebase Data Script
 * 
 * This script exports data from your old Firebase project
 * Run: node scripts/export-firebase-data.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Configuration
const OLD_PROJECT_CONFIG = {
  projectId: 'namaa-b268d',
  // Add your service account key path here
  credential: admin.credential.cert(require('../old-service-account.json'))
};

async function exportData() {
  console.log('🔥 Starting Firebase data export...\n');

  try {
    // Initialize old Firebase project
    const oldApp = admin.initializeApp(OLD_PROJECT_CONFIG, 'old');
    
    // Export Realtime Database
    console.log('📦 Exporting Realtime Database...');
    const db = admin.database(oldApp);
    const snapshot = await db.ref('/').once('value');
    const data = snapshot.val();
    
    fs.writeFileSync(
      path.join(__dirname, '../exports/old-database-export.json'),
      JSON.stringify(data, null, 2)
    );
    console.log('✅ Realtime Database exported successfully\n');

    // Export Authentication Users
    console.log('👥 Exporting Authentication Users...');
    const auth = admin.auth(oldApp);
    const listUsersResult = await auth.listUsers();
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      disabled: user.disabled,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      }
    }));
    
    fs.writeFileSync(
      path.join(__dirname, '../exports/old-users-export.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`✅ ${users.length} users exported successfully\n`);

    console.log('🎉 Export completed successfully!');
    console.log('📁 Files saved to: ./exports/');
    
    // Cleanup
    await oldApp.delete();
    
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    process.exit(1);
  }
}

// Create exports directory if it doesn't exist
const exportsDir = path.join(__dirname, '../exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir);
}

exportData();

