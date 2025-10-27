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
  USERS: 'users',
  ENERGY_COMPANIES: 'energyCompanies'
};

// Backend API URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Send email notification for new application
const sendEmailNotification = async (applicationData) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/notify/application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Email notification sent successfully');
    } else {
      console.warn('⚠️ Failed to send email notification:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error sending email notification:', error);
    // Don't throw error - email notification should not block application creation
    return { success: false, error: error.message };
  }
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
      status: applicationData.status || "Under Review",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('🔥 Application with metadata:', applicationWithMetadata);
    
    await set(newApplicationRef, applicationWithMetadata);
    console.log('✅ Application saved to Realtime Database successfully!');
    
    // Send email notification (non-blocking)
    sendEmailNotification(applicationWithMetadata).catch(err => {
      console.error('Email notification error (non-blocking):', err);
    });
    
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
export const uploadFile = async (file, userId, applicationId, category = 'general') => {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
    
    // Organize files by user and category
    const fileName = `users/${userId}/applications/${applicationId}/${category}/${timestamp}_${sanitizedFileName}`;
    
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
      type: file.type,
      category: category,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: error.message };
  }
};

export const uploadMultipleFiles = async (files, userId, applicationId, category = 'general') => {
  try {
    const uploadPromises = Array.from(files).map(file => 
      uploadFile(file, userId, applicationId, category)
    );
    
    const results = await Promise.all(uploadPromises);
    
    // Check if all uploads were successful
    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);
    
    return {
      success: failedUploads.length === 0,
      files: successfulUploads,
      errors: failedUploads.map(result => result.error),
      category: category
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

// ==================== Energy Company Operations ====================

// Create energy company account
export const createEnergyCompany = async (companyData) => {
  try {
    const companiesRef = ref(database, COLLECTIONS.ENERGY_COMPANIES);
    const newCompanyRef = push(companiesRef);
    
    const companyWithMetadata = {
      ...companyData,
      id: newCompanyRef.key,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedClients: [] // Array of application IDs
    };
    
    await set(newCompanyRef, companyWithMetadata);
    
    return { 
      success: true, 
      id: newCompanyRef.key,
      data: companyWithMetadata
    };
  } catch (error) {
    console.error('Error creating energy company:', error);
    return { success: false, error: error.message };
  }
};

// Get all energy companies
export const getAllEnergyCompanies = async () => {
  try {
    const companiesRef = ref(database, COLLECTIONS.ENERGY_COMPANIES);
    const snapshot = await get(companiesRef);
    
    if (snapshot.exists()) {
      const companies = [];
      snapshot.forEach((childSnapshot) => {
        companies.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      return { success: true, data: companies };
    } else {
      return { success: true, data: [] };
    }
  } catch (error) {
    console.error('Error getting energy companies:', error);
    return { success: false, error: error.message };
  }
};

// Get energy company by ID
export const getEnergyCompany = async (companyId) => {
  try {
    const companyRef = ref(database, `${COLLECTIONS.ENERGY_COMPANIES}/${companyId}`);
    const snapshot = await get(companyRef);
    
    if (snapshot.exists()) {
      return { 
        success: true, 
        data: { id: companyId, ...snapshot.val() }
      };
    } else {
      return { 
        success: false, 
        error: 'Energy company not found' 
      };
    }
  } catch (error) {
    console.error('Error getting energy company:', error);
    return { success: false, error: error.message };
  }
};

// Login energy company (simple password check)
export const loginEnergyCompany = async (username, password) => {
  try {
    const companiesRef = ref(database, COLLECTIONS.ENERGY_COMPANIES);
    const snapshot = await get(companiesRef);
    
    if (snapshot.exists()) {
      let foundCompany = null;
      snapshot.forEach((childSnapshot) => {
        const company = { id: childSnapshot.key, ...childSnapshot.val() };
        if (company.username === username && company.password === password) {
          foundCompany = company;
        }
      });
      
      if (foundCompany) {
        // Remove password from returned data for security
        const { password, ...companyWithoutPassword } = foundCompany;
        return { success: true, data: companyWithoutPassword };
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
    } else {
      return { success: false, error: 'No energy companies found' };
    }
  } catch (error) {
    console.error('Error logging in energy company:', error);
    return { success: false, error: error.message };
  }
};

// Update energy company
export const updateEnergyCompany = async (companyId, updates) => {
  try {
    const companyRef = ref(database, `${COLLECTIONS.ENERGY_COMPANIES}/${companyId}`);
    await update(companyRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating energy company:', error);
    return { success: false, error: error.message };
  }
};

// Delete energy company
export const deleteEnergyCompany = async (companyId) => {
  try {
    const companyRef = ref(database, `${COLLECTIONS.ENERGY_COMPANIES}/${companyId}`);
    await remove(companyRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting energy company:', error);
    return { success: false, error: error.message };
  }
};

// Assign client to energy company
export const assignClientToCompany = async (companyId, applicationId) => {
  try {
    const companyRef = ref(database, `${COLLECTIONS.ENERGY_COMPANIES}/${companyId}`);
    const snapshot = await get(companyRef);
    
    if (snapshot.exists()) {
      const company = snapshot.val();
      const assignedClients = company.assignedClients || [];
      
      // Add applicationId if not already assigned
      if (!assignedClients.includes(applicationId)) {
        assignedClients.push(applicationId);
        
        await update(companyRef, {
          assignedClients,
          updatedAt: new Date().toISOString()
        });
        
        // Also update the application with the assigned company
        const appRef = ref(database, `${COLLECTIONS.APPLICATIONS}/${applicationId}`);
        await update(appRef, {
          assignedCompanyId: companyId,
          updatedAt: new Date().toISOString()
        });
      }
      
      return { success: true };
    } else {
      return { success: false, error: 'Energy company not found' };
    }
  } catch (error) {
    console.error('Error assigning client to company:', error);
    return { success: false, error: error.message };
  }
};

// Unassign client from energy company
export const unassignClientFromCompany = async (companyId, applicationId) => {
  try {
    const companyRef = ref(database, `${COLLECTIONS.ENERGY_COMPANIES}/${companyId}`);
    const snapshot = await get(companyRef);
    
    if (snapshot.exists()) {
      const company = snapshot.val();
      const assignedClients = company.assignedClients || [];
      
      // Remove applicationId
      const updatedClients = assignedClients.filter(id => id !== applicationId);
      
      await update(companyRef, {
        assignedClients: updatedClients,
        updatedAt: new Date().toISOString()
      });
      
      // Also remove from application
      const appRef = ref(database, `${COLLECTIONS.APPLICATIONS}/${applicationId}`);
      await update(appRef, {
        assignedCompanyId: null,
        updatedAt: new Date().toISOString()
      });
      
      return { success: true };
    } else {
      return { success: false, error: 'Energy company not found' };
    }
  } catch (error) {
    console.error('Error unassigning client from company:', error);
    return { success: false, error: error.message };
  }
};

// Get assigned clients for energy company
export const getCompanyAssignedClients = async (companyId) => {
  try {
    const companyRef = ref(database, `${COLLECTIONS.ENERGY_COMPANIES}/${companyId}`);
    const snapshot = await get(companyRef);
    
    if (snapshot.exists()) {
      const company = snapshot.val();
      const assignedClientIds = company.assignedClients || [];
      
      // Fetch all assigned applications
      const applications = [];
      for (const appId of assignedClientIds) {
        const appRef = ref(database, `${COLLECTIONS.APPLICATIONS}/${appId}`);
        const appSnapshot = await get(appRef);
        if (appSnapshot.exists()) {
          applications.push({
            id: appId,
            ...appSnapshot.val()
          });
        }
      }
      
      return { success: true, data: applications };
    } else {
      return { success: false, error: 'Energy company not found' };
    }
  } catch (error) {
    console.error('Error getting company assigned clients:', error);
    return { success: false, error: error.message };
  }
};

// Subscribe to company assigned clients (real-time)
export const subscribeToCompanyClients = (companyId, callback) => {
  const companyRef = ref(database, `${COLLECTIONS.ENERGY_COMPANIES}/${companyId}`);
  
  const listener = onValue(companyRef, async (snapshot) => {
    if (snapshot.exists()) {
      const company = snapshot.val();
      const assignedClientIds = company.assignedClients || [];
      
      // Fetch all assigned applications
      const applications = [];
      for (const appId of assignedClientIds) {
        const appRef = ref(database, `${COLLECTIONS.APPLICATIONS}/${appId}`);
        const appSnapshot = await get(appRef);
        if (appSnapshot.exists()) {
          applications.push({
            id: appId,
            ...appSnapshot.val()
          });
        }
      }
      
      callback(applications);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('Error subscribing to company clients:', error);
    callback([]);
  });
  
  // Return unsubscribe function
  return () => off(companyRef, 'value', listener);
};

