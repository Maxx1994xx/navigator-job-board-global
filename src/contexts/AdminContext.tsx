import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  signIn: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session and verify if user is admin
    const checkAdminSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Verify if this user exists in admin_users table
          const { data: adminData, error } = await supabase
            .from('admin_users')
            .select('id, username, email, full_name')
            .eq('id', session.user.id)
            .single();

          if (adminData && !error) {
            setAdminUser(adminData);
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setAdminUser(null);
      } else if (event === 'SIGNED_IN' && session?.user) {
        // Verify admin status when signing in
        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('id, username, email, full_name')
          .eq('id', session.user.id)
          .single();

        if (adminData && !error) {
          setAdminUser(adminData);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username: string, password: string) => {
    console.log('Admin attempting to sign in with username:', username);
    setLoading(true);

    try {
      // Only allow login with username "admin" and password "admin123"
      if (username === "admin" && password === "admin123") {
        const adminUser: AdminUser = {
          id: "hardcoded-id-admin",
          username: "admin",
          email: "admin@example.com",
          full_name: "Admin User",
        };
        setAdminUser(adminUser);
        console.log("Admin sign in successful for:", username);
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: "Invalid username or password" };
      }
    } catch (err) {
      console.error('Unexpected admin sign in error:', err);
      setLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    setAdminUser(null);
    // Also sign out from Supabase if signed in
    await supabase.auth.signOut();
    console.log('Admin signed out');
  };

  const value = {
    adminUser,
    signIn,
    signOut,
    loading,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
