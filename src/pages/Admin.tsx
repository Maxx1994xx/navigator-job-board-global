
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import JobsManager from '@/components/admin/JobsManager';
import UsersManager from '@/components/admin/UsersManager';
import Header from '@/components/Header';

const Admin = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jobs">Jobs Management</TabsTrigger>
            <TabsTrigger value="users">Users Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs">
            <JobsManager />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
