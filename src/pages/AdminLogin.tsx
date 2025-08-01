import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ADMIN_STORAGE_KEY = 'adminUser';

// Utility: Clean out all admin/auth state before login
function cleanupAuthState() {
  // Remove adminUser info
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  // Remove all Supabase auth keys from localStorage/sessionStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
}

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Clean out all old admin/auth state before login
    cleanupAuthState();

    const usernameOrEmail = identifier.trim();
    if (!usernameOrEmail || !password) {
      setError('Please enter a username/email and password.');
      setIsLoading(false);
      return;
    }

    // Check for hardcoded admin credentials first
    if (usernameOrEmail === 'admin' && password === 'Pimple1234@') {
      const admin = {
        id: 'hardcoded-id-admin',
        username: 'admin',
        email: 'abdul@onlinecareernavigator.com',
        full_name: 'Abdul Moeed',
      };
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
      setIsLoading(false);
      window.location.replace('/admin/dashboard');
      return;
    }

    try {
      // Try username first
      let { data: creds, error: rpcError } = await supabase.rpc('verify_admin_credentials', {
        p_username: usernameOrEmail,
        p_password: password,
      });

      // If nothing found and it looks like email, try by email->username lookup
      if ((!creds || creds.length === 0) && usernameOrEmail.includes('@')) {
        const { data: userRow } = await supabase
          .from('admin_users')
          .select('username')
          .eq('email', usernameOrEmail)
          .maybeSingle();
        if (userRow?.username) {
          ({ data: creds, error: rpcError } = await supabase.rpc('verify_admin_credentials', {
            p_username: userRow.username,
            p_password: password,
          }));
        }
      }

      if (rpcError) {
        console.error('RPC Error:', rpcError);
        setError('Server error. Please try again.');
        setIsLoading(false);
        return;
      }

      if (!creds || creds.length === 0) {
        setError('Invalid username/email or password.');
        setIsLoading(false);
        return;
      }

      // Login success: store admin info locally
      const admin = {
        id: creds[0].admin_id,
        username: creds[0].username,
        email: creds[0].email,
        full_name: creds[0].full_name,
      };
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
      setIsLoading(false);
      window.location.replace('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div>
              <Label htmlFor="identifier">Username or Email</Label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter username or email"
                required
                autoComplete="username"
                spellCheck={false}
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-8 p-1 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
