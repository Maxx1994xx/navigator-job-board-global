
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_STORAGE_KEY = 'adminUser';

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Removed useEffect that triggers navigation based on localStorage

  // Helper: try username first, then email
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let usernameOrEmail = identifier.trim();
    if (!usernameOrEmail || !password) {
      setError('Please enter a username/email and password.');
      setIsLoading(false);
      return;
    }

    // Try username first
    let { data: creds, error: rpcError } = await supabase.rpc('verify_admin_credentials', {
      p_username: usernameOrEmail,
      p_password: password
    });

    // If nothing found and it looks like email, try lookup username from email, then try again
    if ((!creds || creds.length === 0) && usernameOrEmail.includes('@')) {
      // Look up username by email
      const { data: userRow, error: queryErr } = await supabase
        .from('admin_users')
        .select('username')
        .eq('email', usernameOrEmail)
        .maybeSingle();
      if (userRow?.username) {
        ({ data: creds, error: rpcError } = await supabase.rpc('verify_admin_credentials', {
          p_username: userRow.username,
          p_password: password
        }));
      }
    }

    if (rpcError) {
      setError("Unexpected error. Please try again.");
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
