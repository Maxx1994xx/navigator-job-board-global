import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/AdminLayout';

interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  phone?: string;
  role: string;
  status: string;
  created_at: string;
}

interface UserFormProps {
  userForm: {
    email: string;
    username: string;
    full_name: string;
    phone: string;
    role: string;
    status: string;
    password?: string;
  };
  setUserForm: React.Dispatch<React.SetStateAction<{
    email: string;
    username: string;
    full_name: string;
    phone: string;
    role: string;
    status: string;
    password?: string;
  }>>;
  onSubmit: () => void;
  submitText: string;
  loading: boolean;
  isCreate?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  userForm,
  setUserForm,
  onSubmit,
  submitText,
  loading,
  isCreate = false
}) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={userForm.email}
        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
        placeholder="user@example.com"
      />
    </div>
    <div>
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        type="text"
        value={userForm.username}
        onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
        placeholder="username"
      />
    </div>
    <div>
      <Label htmlFor="full_name">Full Name</Label>
      <Input
        id="full_name"
        value={userForm.full_name}
        onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
        placeholder="John Doe"
      />
    </div>
    <div>
      <Label htmlFor="phone">Phone (Optional)</Label>
      <Input
        id="phone"
        value={userForm.phone}
        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
        placeholder="+1-555-0123"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="employer">Employer</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={userForm.status} onValueChange={(value) => setUserForm({ ...userForm, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    {/* Only show password on create */}
    {isCreate && (
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={userForm.password || ''}
          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
          placeholder="Password"
        />
      </div>
    )}
    <Button onClick={onSubmit} disabled={loading} className="w-full">
      {loading ? 'Processing...' : submitText}
    </Button>
  </div>
);

const SUPER_ADMIN_USERNAME = "admin";
const SUPER_ADMIN_EMAIL = "abdul@onlinecareernavigator.com";

const AdminUsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [userForm, setUserForm] = useState({
    email: '',
    username: '',
    full_name: '',
    phone: '',
    role: 'user',
    status: 'active',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch users', variant: 'destructive' });
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setUserForm({
      email: '',
      username: '',
      full_name: '',
      phone: '',
      role: 'user',
      status: 'active',
      password: ''
    });
  };

  // User creation will now use Supabase Auth and then insert into app_users
  const handleCreateUser = async () => {
    setLoading(true);

    // Basic validation
    if (!userForm.email || !userForm.username || !userForm.full_name || !userForm.password) {
      toast({ title: 'Error', description: 'Email, Username, Full Name, and Password are required', variant: 'destructive' });
      setLoading(false);
      return;
    }

    try {
      // 1. Create the user with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: userForm.email,
        password: userForm.password,
        options: { 
          data: { full_name: userForm.full_name, role: userForm.role, username: userForm.username }
        }
      });

      if (signUpError || !signUpData.user) {
        toast({
          title: 'Error',
          description: signUpError?.message || 'Failed to sign up user (Auth).',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // 2. Create app_users profile
      const { error: dbError } = await supabase
        .from('app_users')
        .insert([{
          email: userForm.email,
          username: userForm.username,
          full_name: userForm.full_name,
          phone: userForm.phone,
          role: userForm.role,
          status: userForm.status
        }]);

      if (dbError) {
        toast({
          title: 'Error',
          description: dbError.message || 'Failed to create user profile.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      toast({ title: 'Success', description: 'User created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Unexpected error', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleEditUser = async () => {
    if (!editingUser) return;
    
    setLoading(true);

    const { error } = await supabase
      .from('app_users')
      .update({
        email: userForm.email,
        username: userForm.username,
        full_name: userForm.full_name,
        phone: userForm.phone,
        role: userForm.role,
        status: userForm.status
      })
      .eq('id', editingUser.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update user', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'User updated successfully' });
      setIsEditDialogOpen(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const { error } = await supabase.from('app_users').delete().eq('id', userId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'User deleted successfully' });
      fetchUsers();
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      username: user.username || '',
      full_name: user.full_name,
      phone: user.phone || '',
      role: user.role,
      status: user.status,
      password: '',
    });
    setIsEditDialogOpen(true);
  };

  return (
    <AdminLayout title="Users Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Users Management</h1>
          {/* Only show Create User button for super admin */}
          {userForm.email === SUPER_ADMIN_EMAIL && userForm.username === SUPER_ADMIN_USERNAME ? (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <UserForm 
                  userForm={userForm}
                  setUserForm={setUserForm}
                  onSubmit={handleCreateUser} 
                  submitText="Create User"
                  loading={loading}
                  isCreate
                />
              </DialogContent>
            </Dialog>
          ) : null}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isSuperAdmin =
                    user.username === "admin" &&
                    user.email === "abdul@onlinecareernavigator.com";
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {user.full_name}
                        {isSuperAdmin && (
                          <Badge variant="default" className="ml-2 bg-yellow-400 text-black">
                            Super Admin
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : user.status === 'inactive' ? 'secondary' : 'destructive'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {isSuperAdmin ? (
                            <>
                              <Button variant="outline" size="sm" disabled className="opacity-50 cursor-not-allowed">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" disabled className="opacity-50 cursor-not-allowed">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <UserForm 
              userForm={userForm}
              setUserForm={setUserForm}
              onSubmit={handleEditUser} 
              submitText="Update User"
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersManagement;
