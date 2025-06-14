import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (session?.user) {
        navigate('/admin/dashboard', { replace: true });
      }
    });
    return () => { isMounted = false; };
  }, [navigate]);

  // Helper function to resolve identifier to email (if username used)
  const resolveEmail = async (identifier: string) => {
    // If it's likely an email, just return it
    if (identifier.includes('@')) return identifier;

    // Otherwise, resolve as username
    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .eq('username', identifier)
      .maybeSingle();

    if (error || !data?.email) return null;
    return data.email;
  };

  // Only allow logins for users in admin_users and validate password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 1. Resolve identifier to email
    const email = await resolveEmail(identifier.trim());
    if (!email) {
      setError('No admin user found with provided email or username.');
      setIsLoading(false);
      return;
    }

    // 2. Sign in using Supabase Auth with email/password
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError('Invalid username/email or password.');
      setIsLoading(false);
      return;
    }

    // 3. Check that user is a valid admin (from admin_users)
    const { data: adminUser, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (userError || !adminUser) {
      setError('Your account is not authorized as admin.');
      setIsLoading(false);
      // sign out just in case
      await supabase.auth.signOut();
      return;
    }

    // On success
    navigate('/admin/dashboard', { replace: true });
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
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-8 p-1 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="mt-4 text-xs text-muted-foreground">
              <b>Note:</b> Admins may login using their <b>username</b> or <b>email</b>.<br />
              <span className="block pt-2">
                <b>Credentials:</b>
                <ul className="list-disc ml-4 mt-1 text-muted-foreground">
                  <li><b>Username:</b> <span className="select-all">admin</span> | <b>Email:</b> <span className="select-all">abdul@onlinecareernavigator.com</span> | <b>Password:</b> <span className="select-all">Pimple1234@</span></li>
                  <li><b>Username:</b> <span className="select-all">sohaib</span> | <b>Email:</b> <span className="select-all">sohaib@onlinecareernavigator.com</span> | <b>Password:</b> <span className="select-all">Pakistan1234@</span></li>
                  <li><b>Username:</b> <span className="select-all">tassawar</span> | <b>Email:</b> <span className="select-all">tassawar@onlinecareernavigator.com</span> | <b>Password:</b> <span className="select-all">Pakistan1234@</span></li>
                </ul>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
