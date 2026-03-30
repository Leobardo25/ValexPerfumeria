import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logout function
  const logout = () => signOut(auth);

  // Fetch role and personal data from Firestore
  const fetchAndSetUserData = useCallback(async (userAuth) => {
    if (!userAuth) {
      setUserData(null);
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', userAuth.uid);
      let userDocSnap = await getDoc(userDocRef);

      // Short delay retry pattern from original code
      if (!userDocSnap.exists()) {
        await new Promise(resolve => setTimeout(resolve, 800));
        userDocSnap = await getDoc(userDocRef);
      }

      if (userDocSnap.exists()) {
        setUserData({ uid: userAuth.uid, ...userDocSnap.data() });
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("AuthContext: Error fetching user data:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Google Sign In & Auto-register
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      let dataForContextSync;
      if (!userDocSnap.exists()) {
        // Create base user document for E-commerce
        dataForContextSync = { 
          uid: user.uid,
          nombre: user.displayName || user.email.split('@')[0],
          email: user.email,
          role: 'user', // Default is normal user; can be elevated to 'admin' in Firestore manually
          photoURL: user.photoURL || null,
        };
        await setDoc(userDocRef, { ...dataForContextSync, createdAt: serverTimestamp() });
        setUserData(dataForContextSync); 
      } else {
        dataForContextSync = { uid: user.uid, ...userDocSnap.data() };
        setUserData(dataForContextSync);
      }
      return result; 
    } catch (error) {
      console.error("AuthContext: Error during popup signIn:", error);
      throw error; 
    }
  };

  // Listen to auth state changes actively
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(true); 
      fetchAndSetUserData(user);
    });

    return () => unsubscribe();
  }, [fetchAndSetUserData]);

  const value = {
    currentUser,
    userData,
    loading,
    logout,
    signInWithGoogle,
    setUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
