#!/usr/bin/env node
/**
 * Import Firebase Data Script
 * 
 * This script imports data to your new Firebase project
 * Run: node scripts/import-firebase-data.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Configuration
const NEW_PROJECT_CONFIG = {
  projectId: 'namaa-energy-new', // Update this
  // Add your service account key path here
  credential: admin.credential.cert(require('../new-service-account.json'))
};

async function importData() {
  console.log('🔥 Starting Firebase data import...\n');

  try {
    // Initialize new Firebase project
    const newApp = admin.initializeApp(NEW_PROJECT_CONFIG, 'new');
    
    // Import Realtime Database
    console.log('📦 Importing Realtime Database...');
    const db = admin.database(newApp);
    const databaseData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../exports/old-database-export.json'), 'utf8')
    );
    
    await db.ref('/').set(databaseData);
    console.log('✅ Realtime Database imported successfully\n');

    // Import Authentication Users
    console.log('👥 Importing Authentication Users...');
    const auth = admin.auth(newApp);
    const users = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../exports/old-users-export.json'), 'utf8')
    );
    
    let importedCount = 0;
    let errorCount = 0;
    
    for (const user of users) {
      try {
        await auth.createUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          disabled: user.disabled
        });
        importedCount++;
        console.log(`  ✓ Imported: ${user.email}`);
      } catch (error) {
        errorCount++;
        console.log(`  ✗ Failed to import: ${user.email} - ${error.message}`);
      }
    }
    
    console.log(`\n✅ Import completed: ${importedCount} users imported, ${errorCount} errors\n`);

    console.log('🎉 Import completed successfully!');
    
    // Cleanup
    await newApp.delete();
    
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
}

importData();

