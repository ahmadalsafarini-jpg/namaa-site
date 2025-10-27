# Firebase Storage File Organization

## 📁 New File Structure

Your Firebase Storage is now organized with proper user separation and category organization:

```
Firebase Storage Root
├── users/
│   ├── {userId1}/
│   │   ├── applications/
│   │   │   ├── {applicationId1}/
│   │   │   │   ├── bills/
│   │   │   │   │   ├── 1703123456789_energy_bill_jan.pdf
│   │   │   │   │   └── 1703123456790_electricity_bill_feb.pdf
│   │   │   │   ├── photos/
│   │   │   │   │   ├── 1703123456791_rooftop_view.jpg
│   │   │   │   │   └── 1703123456792_solar_panels.jpg
│   │   │   │   └── load/
│   │   │   │       ├── 1703123456793_consumption_data.xlsx
│   │   │   │       └── 1703123456794_usage_pattern.csv
│   │   │   └── {applicationId2}/
│   │   │       ├── bills/
│   │   │       ├── photos/
│   │   │       └── load/
│   │   └── profile/
│   │       └── profile_picture.jpg
│   └── {userId2}/
│       └── applications/
│           └── {applicationId3}/
│               ├── bills/
│               ├── photos/
│               └── load/
```

## 🎯 Benefits

### 1. **User Separation**
- Each user's files are completely isolated
- No risk of file conflicts between users
- Easy to manage user data and privacy

### 2. **Category Organization**
- **`bills/`** - Energy bills and electricity statements
- **`photos/`** - Site photos and solar panel images
- **`load/`** - Load data and consumption patterns

### 3. **Application Grouping**
- Files are grouped by application ID
- Easy to track which files belong to which project
- Clean organization for admin management

### 4. **Timestamped Files**
- Each file has a timestamp prefix
- Prevents filename conflicts
- Easy to sort by upload time

## 🔧 Technical Implementation

### File Path Structure
```
users/{userId}/applications/{applicationId}/{category}/{timestamp}_{filename}
```

### Example Paths
```
users/abc123/applications/app456/bills/1703123456789_energy_bill.pdf
users/abc123/applications/app456/photos/1703123456790_rooftop.jpg
users/abc123/applications/app456/load/1703123456791_consumption.xlsx
```

### Updated Functions

#### `uploadFile(file, userId, applicationId, category)`
- **file**: The file to upload
- **userId**: User's unique ID
- **applicationId**: Application's unique ID
- **category**: 'bills', 'photos', or 'load'

#### `uploadMultipleFiles(files, userId, applicationId, category)`
- Uploads multiple files in the same category
- Maintains the same organization structure

## 📊 File Metadata

Each uploaded file now includes:
```javascript
{
  success: true,
  downloadURL: "https://...",
  fileName: "original_filename.pdf",
  filePath: "users/abc123/applications/app456/bills/1703123456789_energy_bill.pdf",
  size: 1024000,
  type: "application/pdf",
  category: "bills",
  uploadedAt: "2023-12-21T10:30:00.000Z"
}
```

## 🛡️ Security Benefits

### 1. **User Isolation**
- Users can only access their own files
- No cross-user file access possible

### 2. **Category Separation**
- Clear separation between file types
- Easy to apply different security rules per category

### 3. **Application Scoping**
- Files are scoped to specific applications
- Easy to manage application-specific permissions

## 🔍 Admin Benefits

### 1. **Easy File Management**
- Browse files by user
- Browse files by application
- Browse files by category

### 2. **Clear Organization**
- No confusion about file ownership
- Easy to find specific files
- Clean storage structure

### 3. **Scalable Structure**
- Supports unlimited users
- Supports unlimited applications per user
- Supports unlimited files per category

## 🚀 Usage Examples

### Upload Energy Bills
```javascript
const bills = [bill1, bill2, bill3];
await uploadMultipleFiles(bills, userId, applicationId, 'bills');
```

### Upload Site Photos
```javascript
const photos = [photo1, photo2];
await uploadMultipleFiles(photos, userId, applicationId, 'photos');
```

### Upload Load Data
```javascript
const loadData = [data1, data2];
await uploadMultipleFiles(loadData, userId, applicationId, 'load');
```

## 📈 Storage Rules

The Firebase Storage rules now support this structure:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/applications/{applicationId}/{category}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

This ensures:
- Only authenticated users can upload
- Users can only access their own files
- Files are properly organized by category

## ✅ What's Changed

1. **File paths** now include user ID and application ID
2. **Categories** are properly separated (bills, photos, load)
3. **Metadata** includes category and upload timestamp
4. **Security** is improved with user isolation
5. **Organization** is much cleaner and scalable

Your file uploads will now be perfectly organized! 🎉
