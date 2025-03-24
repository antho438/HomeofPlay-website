import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConnected } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabaseConnected = isSupabaseConnected();

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        setLoading(true);
        
        if (!supabaseConnected) {
          setUser(null);
          return;
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        setUser(session?.user || null);
        
        if (session?.user) {
          await checkUserRole(session.user);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        await checkUserRole(session.user);
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabaseConnected]);

  const checkUserRole = async (user: User | null | undefined) => {
    if (!user) {
      setIsAdmin(false);
      setIsSuperAdmin(false);
      return;
    }

    try {
      // Check if user has admin role in app_metadata
      const isUserAdmin = 
        user.app_metadata?.role === 'admin' || 
        user.email === 'admin@toyrental.com' ||
        user.email === 'homeofplayadmin@homeofplay.com' ||
        user.email === 'anthonyblackburn1991@gmail.com';
      
      // Check if user has super_admin role in app_metadata
      const isUserSuperAdmin = 
        user.app_metadata?.role === 'super_admin' || 
        user.email === 'superadmin@homeofplay.com';
      
      setIsAdmin(isUserAdmin || isUserSuperAdmin);
      setIsSuperAdmin(isUserSuperAdmin);
    } catch (error) {
      console.error('Error checking user role:', error);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabaseConnected) {
      throw new Error('Authentication is not available because Supabase is not connected');
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error.message, error);
        throw error;
      }
      
      return data;
    } catch (error: any) {
      const errorMessage = error?.message || 'An unknown error occurred during sign in';
      const errorObj = {
        message: errorMessage,
        code: error?.code || 'unknown_error',
        originalError: error
      };
      
      console.error('Auth error:', errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!supabaseConnected) {
      throw new Error('Authentication is not available because Supabase is not connected');
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            role: 'user'
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error.message, error);
        throw error;
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'An unknown error occurred during sign up';
      const errorObj = {
        message: errorMessage,
        code: error?.code || 'unknown_error',
        originalError: error
      };
      
      console.error('Auth error:', errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!supabaseConnected) {
      setUser(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error.message, error);
        throw error;
      }
      
      // Clear user state after sign out
      setUser(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    } catch (error: any) {
      const errorMessage = error?.message || 'An unknown error occurred during sign out';
      const errorObj = {
        message: errorMessage,
        code: error?.code || 'unknown_error',
        originalError: error
      };
      
      console.error('Auth error:', errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      isSuperAdmin,
      signIn, 
      signUp, 
      signOut,
      loading
    }}>
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
