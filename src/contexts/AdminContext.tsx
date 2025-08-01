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
    // Check if admin info exists in localStorage
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        setAdminUser(JSON.parse(storedAdmin));
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    console.log('Admin attempting to sign in with username:', username);
    setLoading(true);

    try {
      // Only allow login with username "admin" and password "Pimple1234@"
      if (username === "admin" && password === "Pimple1234@") {
        const adminUser: AdminUser = {
          id: "hardcoded-id-admin",
          username: "admin",
          email: "abdul@onlinecareernavigator.com",
          full_name: "Abdul Moeed",
        };
        setAdminUser(adminUser);
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
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
    localStorage.removeItem('adminUser');
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
