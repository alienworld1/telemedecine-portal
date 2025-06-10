import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending' | 'rejected';
  firstName?: string;
  lastName?: string;
  createdAt: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  applyForDoctor: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Create user profile in Firestore
  const createUserProfile = async (
    user: User,
    firstName: string,
    lastName: string,
    role: UserRole = 'patient',
  ) => {
    const userDoc = {
      uid: user.uid,
      email: user.email!,
      role,
      status: 'active' as const,
      firstName,
      lastName,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);
    return userDoc;
  };

  // Get user profile from Firestore
  const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
      } as UserProfile;
    }
    return null;
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const profile = await createUserProfile(result.user, firstName, lastName);
    setUserProfile(profile);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Check if user profile exists, if not create one
    let profile = await getUserProfile(result.user.uid);
    if (!profile) {
      const [firstName = '', lastName = ''] = (
        result.user.displayName || ''
      ).split(' ');
      profile = await createUserProfile(result.user, firstName, lastName);
    }
    setUserProfile(profile);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const applyForDoctor = async () => {
    if (!currentUser) throw new Error('No user logged in');

    const updatedProfile = {
      ...userProfile!,
      role: 'doctor' as UserRole,
      status: 'pending' as const,
    };

    await setDoc(doc(db, 'users', currentUser.uid), updatedProfile);
    setUserProfile(updatedProfile);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    applyForDoctor,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
