
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if admin user is stored in localStorage
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        setAdminUser(JSON.parse(storedAdmin));
      } catch (error) {
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const signIn = async (username: string, password: string) => {
    console.log('Admin attempting to sign in with username:', username);
    setLoading(true);

    try {
      // For now, let's use hardcoded credentials to ensure it works
      if (username === 'admin' && password === 'admin123') {
        const admin: AdminUser = {
          id: '1',
          username: 'admin',
          email: 'admin@company.com',
          full_name: 'System Administrator'
        };
        
        setAdminUser(admin);
        localStorage.setItem('adminUser', JSON.stringify(admin));
        console.log('Admin sign in successful for:', username);
        setLoading(false);
        return { success: true };
      } else {
        console.log('Invalid admin credentials for:', username);
        setLoading(false);
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (err) {
      console.error('Unexpected admin sign in error:', err);
      setLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
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
