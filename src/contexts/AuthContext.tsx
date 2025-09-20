import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockAuth } from '../lib/mockAuth';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const currentUser = await mockAuth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setSession({ user: currentUser, access_token: 'mock-token' });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await mockAuth.signUp(email, password);
      
      if (result.error) {
        return { error: result.error };
      }

      if (result.user) {
        setUser(result.user);
        setSession({ user: result.user, access_token: 'mock-token' });
      }

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await mockAuth.signIn(email, password);
      
      if (result.error) {
        return { error: result.error };
      }

      if (result.user) {
        setUser(result.user);
        setSession({ user: result.user, access_token: 'mock-token' });
      }

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await mockAuth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}