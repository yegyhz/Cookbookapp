import { useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

export function useAuth() {
  const [error, setError] = useState<string | null>(null);

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return {
    error,
    signUp,
    signIn,
    logOut,
  };
}
