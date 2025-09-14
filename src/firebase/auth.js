import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';

/******************** Auth persistence (localStorage) ********************/
const USERS_KEY = "namaa_users";   // array of {id,name,email,phone,password}
const SESSION_KEY = "namaa_session"; // {email}

function lsSave(key, val) { 
  try { 
    localStorage.setItem(key, JSON.stringify(val)); 
  } catch(e) { 
    console.warn('ls save', e);
  } 
}

function lsLoad(key, fallback) { 
  try { 
    const v = localStorage.getItem(key); 
    return v ? JSON.parse(v) : fallback; 
  } catch(e) { 
    console.warn('ls load', e); 
    return fallback; 
  } 
}

function registerUserLocal(user) {
  const users = lsLoad(USERS_KEY, []);
  if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
    throw new Error('Email already registered');
  }
  const u = { 
    id: (crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`), 
    ...user 
  };
  lsSave(USERS_KEY, [u, ...users]);
  lsSave(SESSION_KEY, { email: u.email });
  return u;
}

function loginUserLocal({ email, password }) {
  const users = lsLoad(USERS_KEY, []);
  const u = users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
  if (!u) throw new Error('Invalid email or password');
  lsSave(SESSION_KEY, { email: u.email });
  return u;
}

function currentUserLocal() {
  const s = lsLoad(SESSION_KEY, null);
  if (!s?.email) return null;
  const users = lsLoad(USERS_KEY, []);
  return users.find(x => x.email === s.email) || null;
}

function logoutUserLocal() { 
  try { 
    localStorage.removeItem(SESSION_KEY); 
  } catch(e) {
    console.warn('logout error', e);
  } 
}

// Create user account (with Firebase fallback to localStorage)
export const createUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with additional data
    await updateProfile(user, {
      displayName: userData.name,
      // You can add more profile fields here
    });
    
    return { success: true, user };
  } catch (error) {
    console.warn('Firebase registration failed, falling back to localStorage:', error.message);
    try {
      const localUser = registerUserLocal({ ...userData, email, password });
      return { success: true, user: localUser };
    } catch (localError) {
      console.error('Local registration also failed:', localError);
      return { success: false, error: localError.message };
    }
  }
};

// Sign in user (with Firebase fallback to localStorage)
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.warn('Firebase login failed, falling back to localStorage:', error.message);
    try {
      const localUser = loginUserLocal({ email, password });
      return { success: true, user: localUser };
    } catch (localError) {
      console.error('Local login also failed:', localError);
      return { success: false, error: localError.message };
    }
  }
};

// Sign out user (with localStorage cleanup)
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn('Firebase logout failed:', error.message);
  }
  // Always clear localStorage session
  logoutUserLocal();
  return { success: true };
};

// Listen to auth state changes (with localStorage fallback)
export const onAuthStateChange = (callback) => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(firebaseUser);
    } else {
      // Check localStorage if Firebase user is null
      const localUser = currentUserLocal();
      if (localUser) {
        callback(localUser);
      } else {
        callback(null);
      }
    }
  });
  
  return unsubscribe;
};

// Get current user (with localStorage fallback)
export const getCurrentUser = () => {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) return firebaseUser;
  
  // Fallback to localStorage
  return currentUserLocal();
};

// New functions for direct localStorage auth (used by SignIn component)
export const registerUser = registerUserLocal;
export const loginUser = loginUserLocal;
export const currentUser = currentUserLocal;
export const logoutUser = logoutUserLocal;
