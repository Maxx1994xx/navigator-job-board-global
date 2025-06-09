
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserFormProps {
  user?: any;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '',
        full_name: user.full_name || '',
        role: user.role || 'user',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // Update existing user
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            role: formData.role,
          })
          .eq('id', user.id);

        if (profileError) throw profileError;

        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
      } else {
        // Create new user
        const { data, error } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.password,
          user_metadata: {
            full_name: formData.full_name,
          },
        });

        if (error) throw error;

        // Update role in profiles table
        if (data.user) {
          const { error: roleError } = await supabase
            .from('profiles')
            .update({ role: formData.role })
            .eq('id', data.user.id);

          if (roleError) throw roleError;
        }

        toast({
          title: 'Success',
          description: 'User created successfully',
        });
      }

      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${user ? 'update' : 'create'} user`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{user ? 'Edit User' : 'Create New User'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={!!user}
            />
            {user && (
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed after creation</p>
            )}
          </div>

          {!user && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
          )}

          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="job_poster">Job Poster</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? (user ? 'Updating...' : 'Creating...') : (user ? 'Update User' : 'Create User')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
