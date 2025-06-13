
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  description: string;
  salary?: string;
  requirements?: string[];
  benefits?: string[];
  status: string;
  is_featured: boolean;
  created_at: string;
}

const AdminJobsManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    category: 'Technology',
    description: '',
    salary: '',
    requirements: '',
    benefits: '',
    status: 'active',
    is_featured: false
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch jobs', variant: 'destructive' });
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setJobForm({
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      category: 'Technology',
      description: '',
      salary: '',
      requirements: '',
      benefits: '',
      status: 'active',
      is_featured: false
    });
  };

  const handleCreateJob = async () => {
    setLoading(true);
    const jobData = {
      ...jobForm,
      requirements: jobForm.requirements ? jobForm.requirements.split(',').map(r => r.trim()) : [],
      benefits: jobForm.benefits ? jobForm.benefits.split(',').map(b => b.trim()) : []
    };

    const { error } = await supabase.from('jobs').insert([jobData]);

    if (error) {
      toast({ title: 'Error', description: 'Failed to create job', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Job created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
      fetchJobs();
    }
    setLoading(false);
  };

  const handleEditJob = async () => {
    if (!editingJob) return;
    
    setLoading(true);
    const jobData = {
      ...jobForm,
      requirements: jobForm.requirements ? jobForm.requirements.split(',').map(r => r.trim()) : [],
      benefits: jobForm.benefits ? jobForm.benefits.split(',').map(b => b.trim()) : []
    };

    const { error } = await supabase
      .from('jobs')
      .update(jobData)
      .eq('id', editingJob.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update job', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Job updated successfully' });
      setIsEditDialogOpen(false);
      setEditingJob(null);
      resetForm();
      fetchJobs();
    }
    setLoading(false);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    const { error } = await supabase.from('jobs').delete().eq('id', jobId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete job', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Job deleted successfully' });
      fetchJobs();
    }
  };

  const openEditDialog = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      category: job.category,
      description: job.description,
      salary: job.salary || '',
      requirements: job.requirements?.join(', ') || '',
      benefits: job.benefits?.join(', ') || '',
      status: job.status,
      is_featured: job.is_featured
    });
    setIsEditDialogOpen(true);
  };

  const JobForm = ({ onSubmit, submitText }: { onSubmit: () => void; submitText: string }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={jobForm.title}
            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
            placeholder="Senior Frontend Developer"
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={jobForm.company}
            onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
            placeholder="TechCorp Inc."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={jobForm.location}
            onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
            placeholder="San Francisco, CA"
          />
        </div>
        <div>
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            value={jobForm.salary}
            onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
            placeholder="$120,000 - $150,000"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="type">Job Type</Label>
          <Select value={jobForm.type} onValueChange={(value) => setJobForm({ ...jobForm, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={jobForm.category} onValueChange={(value) => setJobForm({ ...jobForm, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={jobForm.status} onValueChange={(value) => setJobForm({ ...jobForm, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          value={jobForm.description}
          onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
          placeholder="Detailed job description..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="requirements">Requirements (comma-separated)</Label>
        <Textarea
          id="requirements"
          value={jobForm.requirements}
          onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
          placeholder="React, TypeScript, 5+ years experience"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="benefits">Benefits (comma-separated)</Label>
        <Textarea
          id="benefits"
          value={jobForm.benefits}
          onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
          placeholder="Health insurance, Remote work, 401k"
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_featured"
          checked={jobForm.is_featured}
          onChange={(e) => setJobForm({ ...jobForm, is_featured: e.target.checked })}
        />
        <Label htmlFor="is_featured">Featured Job</Label>
      </div>

      <Button onClick={onSubmit} disabled={loading} className="w-full">
        {loading ? 'Processing...' : submitText}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Jobs Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <JobForm onSubmit={handleCreateJob} submitText="Create Job" />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>{job.category}</TableCell>
                  <TableCell>
                    <Badge variant={job.status === 'active' ? 'default' : job.status === 'draft' ? 'secondary' : 'destructive'}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {job.is_featured && <Badge variant="outline">Featured</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(job)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteJob(job.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          <JobForm onSubmit={handleEditJob} submitText="Update Job" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminJobsManagement;
