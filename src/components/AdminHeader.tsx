
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  const { adminUser, signOut } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
    navigate('/admin/login', { replace: true });
  };

  const handleBack = () => {
    if (location.pathname === '/admin/dashboard') {
      // If on dashboard, go to main website
      navigate('/', { replace: true });
    } else {
      // Go back to dashboard from other admin pages
      navigate('/admin/dashboard');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {location.pathname === '/admin/dashboard' ? 'Website' : 'Dashboard'}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">Welcome back, {adminUser?.full_name}</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
