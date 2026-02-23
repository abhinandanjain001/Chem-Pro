import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  Auth
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface FirebaseUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  createdAt: number;
}

// Sign up with email and password
export const firebaseSignUp = async (
  email: string,
  password: string,
  name: string,
  role: 'student' | 'admin'
): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user data in Firestore
    const userData: FirebaseUser = {
      id: user.uid,
      email: user.email || email,
      name,
      role,
      createdAt: Date.now(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    return userData;
  } catch (error) {
    throw new Error((error as any).message || 'Signup failed');
  }
};

// Sign in with email and password
export const firebaseSignIn = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error('User data not found');
    }

    return userDocSnap.data() as FirebaseUser;
  } catch (error) {
    throw new Error((error as any).message || 'Login failed');
  }
};

// Sign out
export const firebaseSignOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error((error as any).message || 'Sign out failed');
  }
};

// Get current user
export const getCurrentUser = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        callback(userDocSnap.data() as FirebaseUser);
      }
    } else {
      callback(null);
    }
  });
};

// Verify admin key during signup
export const verifyAdminKey = (key: string): boolean => {
  // Replace with your actual admin key
  return key === 'ChemGenius@2026Admin';
};

// Get user by ID
export const getUserById = async (userId: string): Promise<FirebaseUser | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.exists() ? (userDocSnap.data() as FirebaseUser) : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
