import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './config';

// Collections
const COLLECTIONS = {
  USERS: 'users',
  TICKETS: 'tickets',
  PROJECTS: 'projects',
  COMPANIES: 'companies'
};

// User operations
export const createUserProfile = async (userId, userData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const q = query(collection(db, COLLECTIONS.USERS), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { success: true, data: { id: doc.id, ...doc.data() } };
    }
    return { success: false, error: 'User profile not found' };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

// Ticket operations
export const createTicket = async (ticketData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.TICKETS), {
      ...ticketData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating ticket:', error);
    return { success: false, error: error.message };
  }
};

export const getUserTickets = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.TICKETS), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const tickets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: tickets };
  } catch (error) {
    console.error('Error getting user tickets:', error);
    return { success: false, error: error.message };
  }
};

export const updateTicket = async (ticketId, updateData) => {
  try {
    const ticketRef = doc(db, COLLECTIONS.TICKETS, ticketId);
    await updateDoc(ticketRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating ticket:', error);
    return { success: false, error: error.message };
  }
};

// Project operations
export const createProject = async (projectData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: error.message };
  }
};

export const getUserProjects = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.PROJECTS), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: projects };
  } catch (error) {
    console.error('Error getting user projects:', error);
    return { success: false, error: error.message };
  }
};

// Real-time listeners
export const subscribeToUserTickets = (userId, callback) => {
  const q = query(
    collection(db, COLLECTIONS.TICKETS), 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const tickets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(tickets);
  });
};

export const subscribeToUserProjects = (userId, callback) => {
  const q = query(
    collection(db, COLLECTIONS.PROJECTS), 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(projects);
  });
};
