import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Plus, TrendingUp, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';

interface Stats {
  jobStats: {
    total_jobs: number;
    active_jobs: number;
    draft_jobs: number;
    inactive_jobs: number;
  };
  userStats: {
    total_users: number;
    active_users: number;
    inactive_users: number;
    suspended_users: number;
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [jobStatsResponse, userStatsResponse] = await Promise.all([
        supabase.rpc('get_job_stats'),
        supabase.rpc('get_user_stats')
      ]);

      if (jobStatsResponse.data && userStatsResponse.data) {
        setStats({
          jobStats: jobStatsResponse.data[0] || { total_jobs: 0, active_jobs: 0, draft_jobs: 0, inactive_jobs: 0 },
          userStats: userStatsResponse.data[0] || { total_users: 0, active_users: 0, inactive_users: 0, suspended_users: 0 }
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Dashboard">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.userStats.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.userStats.active_users || 0} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.jobStats.total_jobs || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.jobStats.active_jobs || 0} active jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Jobs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.jobStats.draft_jobs || 0}</div>
            <p className="text-xs text-muted-foreground">Pending publication</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNavigate('/admin/users')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">View and manage user accounts, roles, and permissions.</p>
            <div className="flex justify-between text-sm">
              <span>Active: {stats?.userStats.active_users || 0}</span>
              <span>Suspended: {stats?.userStats.suspended_users || 0}</span>
            </div>
            <Button className="mt-4 w-full" variant="outline">
              Go to Users
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNavigate('/admin/jobs')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Manage Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Create, edit, and manage job listings and applications.</p>
            <div className="flex justify-between text-sm">
              <span>Active: {stats?.jobStats.active_jobs || 0}</span>
              <span>Draft: {stats?.jobStats.draft_jobs || 0}</span>
            </div>
            <Button className="mt-4 w-full" variant="outline">
              Go to Jobs
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNavigate('/admin/blogs')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Manage Blogs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Create, edit, and manage blog posts with rich content.</p>
            <div className="flex justify-between text-sm">
              <span>SEO Optimized</span>
              <span>Rich Editor</span>
            </div>
            <Button className="mt-4 w-full" variant="outline">
              Go to Blogs
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                className="w-full" 
                size="sm" 
                onClick={() => handleNavigate('/admin/jobs')}
              >
                Create New Job
              </Button>
              <Button 
                className="w-full" 
                size="sm" 
                variant="outline"
                onClick={() => handleNavigate('/admin/blogs')}
              >
                Create New Blog
              </Button>
              <Button 
                className="w-full" 
                size="sm" 
                variant="outline"
                onClick={() => window.open('/', '_blank')}
              >
                View Website
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
