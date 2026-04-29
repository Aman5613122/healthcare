import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase';

export const loginWithEmail = async (email: string, password: string) => {
  // Demo mode: allow test credentials without Firebase
  if (email === 'demo@raga.ai' && password === 'demo123') {
    return {
      user: {
        uid: 'demo-uid',
        email: 'demo@raga.ai',
        displayName: 'Demo Admin',
        photoURL: null,
      }
    };
  }
  
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    // Handle logout
  }
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};