
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

interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  status: string;
  created_at: string;
}

const AdminUsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [userForm, setUserForm] = useState({
    email: '',
    full_name: '',
    phone: '',
    role: 'user',
    status: 'active'
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
      full_name: '',
      phone: '',
      role: 'user',
      status: 'active'
    });
  };

  const handleCreateUser = async () => {
    setLoading(true);

    const { error } = await supabase.from('app_users').insert([userForm]);

    if (error) {
      toast({ title: 'Error', description: 'Failed to create user', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'User created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
      fetchUsers();
    }
    setLoading(false);
  };

  const handleEditUser = async () => {
    if (!editingUser) return;
    
    setLoading(true);

    const { error } = await supabase
      .from('app_users')
      .update(userForm)
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
      full_name: user.full_name,
      phone: user.phone || '',
      role: user.role,
      status: user.status
    });
    setIsEditDialogOpen(true);
  };

  const UserForm = ({ onSubmit, submitText }: { onSubmit: () => void; submitText: string }) => (
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

      <Button onClick={onSubmit} disabled={loading} className="w-full">
        {loading ? 'Processing...' : submitText}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users Management</h1>
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
            <UserForm onSubmit={handleCreateUser} submitText="Create User" />
          </DialogContent>
        </Dialog>
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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
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
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <UserForm onSubmit={handleEditUser} submitText="Update User" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersManagement;
