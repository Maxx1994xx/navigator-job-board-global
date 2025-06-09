
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import JobForm from './JobForm';

interface Job {
  id: string;
  job_id?: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary?: string;
  is_active: boolean;
  is_featured?: boolean;
  created_at: string;
}

const JobsManager = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch jobs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;

      setJobs(jobs.filter(job => job.id !== id));
      toast({
        title: 'Success',
        description: 'Job deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete job',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingJob(null);
    fetchJobs();
  };

  const toggleFeatured = async (job: Job) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_featured: !job.is_featured })
        .eq('id', job.id);

      if (error) throw error;

      setJobs(jobs.map(j => j.id === job.id ? { ...j, is_featured: !j.is_featured } : j));
      toast({
        title: 'Success',
        description: `Job ${job.is_featured ? 'removed from' : 'added to'} featured`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update featured status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Jobs Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Job
        </Button>
      </div>

      {showForm && (
        <JobForm
          job={editingJob}
          onClose={handleFormClose}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Jobs ({jobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-mono text-sm">{job.job_id || 'N/A'}</TableCell>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>
                    <Badge variant={job.is_active ? 'default' : 'secondary'}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(job)}
                      className={job.is_featured ? 'text-yellow-600' : 'text-gray-400'}
                    >
                      <Star className={`w-4 h-4 ${job.is_featured ? 'fill-current' : ''}`} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    {new Date(job.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(job)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(job.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobsManager;
