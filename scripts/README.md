# Firebase Migration Scripts

This directory contains helper scripts for migrating Firebase projects.

## Prerequisites

1. Install Firebase Admin SDK:
   ```bash
   npm install firebase-admin
   ```

2. Download service account keys:
   - Old project: Download from Firebase Console > Project Settings > Service Accounts
   - New project: Download from Firebase Console > Project Settings > Service Accounts
   - Save as `old-service-account.json` and `new-service-account.json` in project root

## Usage

### 1. Export Data from Old Project

```bash
node scripts/export-firebase-data.js
```

This will:
- Export Realtime Database data to `exports/old-database-export.json`
- Export Authentication users to `exports/old-users-export.json`

### 2. Import Data to New Project

```bash
node scripts/import-firebase-data.js
```

This will:
- Import Realtime Database data from `exports/old-database-export.json`
- Import Authentication users from `exports/old-users-export.json`

## Important Notes

- **Backup First**: Always backup your data before running these scripts
- **Test Environment**: Test the migration on a test project first
- **Service Account**: Make sure service account keys have proper permissions
- **Storage Files**: Storage files need to be migrated manually using gsutil

## Manual Steps Required

1. Export Storage files using gsutil:
   ```bash
   gsutil -m cp -r gs://old-project.appspot.com ./exports/storage-backup/
   ```

2. Import Storage files to new project:
   ```bash
   gsutil -m cp -r ./exports/storage-backup/* gs://new-project.appspot.com/
   ```

3. Update application configuration files

