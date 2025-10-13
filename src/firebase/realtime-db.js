import { 
  ref, 
  push, 
  set, 
  get, 
  update, 
  remove, 
  onValue, 
  off,
  query,
  orderByChild,
  equalTo,
  orderByKey,
  limitToLast
} from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { database, storage } from './config';

// Collections/Paths
const COLLECTIONS = {
  APPLICATIONS: 'applications',
  TICKETS: 'tickets',
  USERS: 'users'
};

// Application operations
export const createApplication = async (applicationData) => {
  try {
    console.log('🔥 createApplication called with:', applicationData);
    console.log('🔥 Database instance:', database);
    
    const applicationsRef = ref(database, COLLECTIONS.APPLICATIONS);
    console.log('🔥 Applications ref:', applicationsRef);
    
    const newApplicationRef = push(applicationsRef);
    console.log('🔥 New application ref:', newApplicationRef);
    
    const applicationWithMetadata = {
      ...applicationData,
      id: newApplicationRef.key,
      status: applicationData.status || "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('🔥 Application with metadata:', applicationWithMetadata);
    
    await set(newApplicationRef, applicationWithMetadata);
    console.log('✅ Application saved to Realtime Database successfully!');
    
    return { 
      success: true, 
      id: newApplicationRef.key,
      data: applicationWithMetadata
    };
  } catch (error) {
    console.error('❌ Error creating application:', error);
    console.error('❌ Error details:', error.message, error.code);
    return { success: false, error: error.message };
  }
};

export const getApplication = async (applicationId) => {
  try {
    const applicationRef = ref(database, `${COLLECTIONS.APPLICATIONS}/${applicationId}`);
    const snapshot = await get(applicationRef);
    
    if (snapshot.exists()) {
      return { 
        success: true, 
        data: { id: applicationId, ...snapshot.val() }
      };
    } else {
      return { 
        success: false, 
        error: 'Application not found' 
      };
    }
  } catch (error) {
    console.error('Error getting application:', error);
    return { success: false, error: error.message };
  }
};

export const getUserApplications = async (userId) => {
  try {
    const applicationsRef = ref(database, COLLECTIONS.APPLICATIONS);
    const userApplicationsQuery = query(
      applicationsRef,
      orderByChild('userId'),
      equalTo(userId)
    );
    
    const snapshot = await get(userApplicationsQuery);
    
    if (snapshot.exists()) {
      const applications = [];
      snapshot.forEach((childSnapshot) => {
        applications.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // Sort by creation date (newest first)
      applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return { success: true, applications };
    } else {
      return { success: true, applications: [] };
    }
  } catch (error) {
    console.error('Error getting user applications:', error);
    return { success: false, error: error.message };
  }
};

export const updateApplication = async (applicationId, updateData) => {
  try {
    const applicationRef = ref(database, `${COLLECTIONS.APPLICATIONS}/${applicationId}`);
    
    const updateWithMetadata = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await update(applicationRef, updateWithMetadata);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating application:', error);
    return { success: false, error: error.message };
  }
};

export const deleteApplication = async (applicationId) => {
  try {
    const applicationRef = ref(database, `${COLLECTIONS.APPLICATIONS}/${applicationId}`);
    await remove(applicationRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting application:', error);
    return { success: false, error: error.message };
  }
};

// Real-time listeners
export const subscribeToUserApplications = (userId, callback) => {
  const applicationsRef = ref(database, COLLECTIONS.APPLICATIONS);
  const userApplicationsQuery = query(
    applicationsRef,
    orderByChild('userId'),
    equalTo(userId)
  );
  
  const unsubscribe = onValue(userApplicationsQuery, (snapshot) => {
    if (snapshot.exists()) {
      const applications = [];
      snapshot.forEach((childSnapshot) => {
        applications.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // Sort by creation date (newest first)
      applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      callback(applications);
    } else {
      callback([]);
    }
  });
  
  return () => off(userApplicationsQuery, 'value', unsubscribe);
};

export const subscribeToAllApplications = (callback) => {
  const applicationsRef = ref(database, COLLECTIONS.APPLICATIONS);
  const recentApplicationsQuery = query(
    applicationsRef,
    orderByKey(),
    limitToLast(50)
  );
  
  const unsubscribe = onValue(recentApplicationsQuery, (snapshot) => {
    if (snapshot.exists()) {
      const applications = [];
      snapshot.forEach((childSnapshot) => {
        applications.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // Sort by creation date (newest first)
      applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      callback(applications);
    } else {
      callback([]);
    }
  });
  
  return () => off(recentApplicationsQuery, 'value', unsubscribe);
};

// File upload functions
export const uploadFile = async (file, userId, applicationId) => {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
    const fileName = `uploads/${userId}/${timestamp}_${sanitizedFileName}`;
    
    // Create a reference to the file in Firebase Storage
    const fileRef = storageRef(storage, fileName);
    
    // Upload the file
    const snapshot = await uploadBytes(fileRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      downloadURL,
      fileName: file.name,
      filePath: fileName,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: error.message };
  }
};

export const uploadMultipleFiles = async (files, userId, applicationId) => {
  try {
    const uploadPromises = Array.from(files).map(file => 
      uploadFile(file, userId, applicationId)
    );
    
    const results = await Promise.all(uploadPromises);
    
    // Check if all uploads were successful
    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);
    
    return {
      success: failedUploads.length === 0,
      files: successfulUploads,
      errors: failedUploads.map(result => result.error)
    };
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    return { success: false, error: error.message };
  }
};

export const deleteFile = async (filePath) => {
  try {
    const fileRef = storageRef(storage, `applications/${filePath}`);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
};

