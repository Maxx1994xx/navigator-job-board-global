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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/AdminLayout';

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

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  description: string;
  salary: string;
  requirements: string;
  benefits: string;
  status: string;
  is_featured: boolean;
}

interface JobFormProps {
  jobForm: JobFormData;
  setJobForm: React.Dispatch<React.SetStateAction<JobFormData>>;
  onSubmit: () => void;
  submitText: string;
  loading: boolean;
}

const JobForm: React.FC<JobFormProps> = ({ jobForm, setJobForm, onSubmit, submitText, loading }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="title">Job Title *</Label>
        <Input
          id="title"
          value={jobForm.title}
          onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
          placeholder="Senior Frontend Developer"
          required
        />
      </div>
      <div>
        <Label htmlFor="company">Company *</Label>
        <Input
          id="company"
          value={jobForm.company}
          onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
          placeholder="TechCorp Inc."
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={jobForm.location}
          onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
          placeholder="San Francisco, CA"
          required
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
      <Label htmlFor="description">Job Description *</Label>
      <Textarea
        id="description"
        value={jobForm.description}
        onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
        placeholder="Detailed job description..."
        rows={4}
        required
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

const AdminJobsManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [jobForm, setJobForm] = useState<JobFormData>({
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
    try {
      console.log('Fetching jobs...');
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch jobs error:', error);
        toast({ title: 'Error', description: 'Failed to fetch jobs: ' + error.message, variant: 'destructive' });
      } else {
        console.log('Jobs fetched successfully:', data?.length);
        setJobs(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' });
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

  const validateForm = () => {
    if (!jobForm.title.trim()) {
      toast({ title: 'Validation Error', description: 'Job title is required', variant: 'destructive' });
      return false;
    }
    if (!jobForm.company.trim()) {
      toast({ title: 'Validation Error', description: 'Company name is required', variant: 'destructive' });
      return false;
    }
    if (!jobForm.location.trim()) {
      toast({ title: 'Validation Error', description: 'Location is required', variant: 'destructive' });
      return false;
    }
    if (!jobForm.description.trim()) {
      toast({ title: 'Validation Error', description: 'Job description is required', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleCreateJob = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const jobData = {
        title: jobForm.title.trim(),
        company: jobForm.company.trim(),
        location: jobForm.location.trim(),
        type: jobForm.type,
        category: jobForm.category,
        description: jobForm.description.trim(),
        salary: jobForm.salary.trim() || null,
        requirements: jobForm.requirements ? jobForm.requirements.split(',').map(r => r.trim()).filter(r => r) : [],
        benefits: jobForm.benefits ? jobForm.benefits.split(',').map(b => b.trim()).filter(b => b) : [],
        status: jobForm.status,
        is_featured: jobForm.is_featured
      };

      console.log('Creating job with data:', jobData);

      const { data, error } = await supabase.from('jobs').insert([jobData]).select();

      if (error) {
        console.error('Create job error (full object):', error);
        toast({ title: 'Error', description: 'Failed to create job: ' + (error.message || JSON.stringify(error)), variant: 'destructive' });
      } else {
        console.log('Job created successfully:', data);
        toast({ title: 'Success', description: 'Job created successfully' });
        setIsCreateDialogOpen(false);
        resetForm();
        await fetchJobs();
        window.location.reload(); // Hard reload to force state if jobs still missing
      }
    } catch (err) {
      console.error('Unexpected error during job creation:', err);
      toast({ title: 'Error', description: 'An unexpected error occurred while creating the job', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleEditJob = async () => {
    if (!editingJob || !validateForm()) return;

    setLoading(true);
    try {
      const jobData = {
        title: jobForm.title.trim(),
        company: jobForm.company.trim(),
        location: jobForm.location.trim(),
        type: jobForm.type,
        category: jobForm.category,
        description: jobForm.description.trim(),
        salary: jobForm.salary.trim() || null,
        requirements: jobForm.requirements ? jobForm.requirements.split(',').map(r => r.trim()).filter(r => r) : [],
        benefits: jobForm.benefits ? jobForm.benefits.split(',').map(b => b.trim()).filter(b => b) : [],
        status: jobForm.status,
        is_featured: jobForm.is_featured
      };

      console.log('Updating job with data:', jobData);

      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', editingJob.id)
        .select();

      if (error) {
        console.error('Update job error (full object):', error);
        toast({ title: 'Error', description: 'Failed to update job: ' + (error.message || JSON.stringify(error)), variant: 'destructive' });
      } else {
        console.log('Job updated successfully:', data);
        toast({ title: 'Success', description: 'Job updated successfully' });
        setIsEditDialogOpen(false);
        setEditingJob(null);
        resetForm();
        await fetchJobs();
        window.location.reload();
      }
    } catch (err) {
      console.error('Unexpected error during job update:', err);
      toast({ title: 'Error', description: 'An unexpected error occurred while updating the job', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;

    setLoading(true);
    try {
      console.log('Deleting job with ID:', jobId);

      const { error } = await supabase.from('jobs').delete().eq('id', jobId);

      if (error) {
        console.error('Delete job error (full object):', error);
        toast({ title: 'Error', description: 'Failed to delete job: ' + (error.message || JSON.stringify(error)), variant: 'destructive' });
      } else {
        console.log('Job deleted successfully');
        toast({ title: 'Success', description: 'Job deleted successfully' });
        await fetchJobs();
        window.location.reload();
      }
    } catch (err) {
      console.error('Unexpected error during job deletion:', err);
      toast({ title: 'Error', description: 'An unexpected error occurred while deleting the job', variant: 'destructive' });
    }
    setLoading(false);
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

  return (
    <AdminLayout title="Jobs Management">
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
              <JobForm 
                jobForm={jobForm}
                setJobForm={setJobForm}
                onSubmit={handleCreateJob} 
                submitText="Create Job"
                loading={loading}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Jobs ({jobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && jobs.length === 0 ? (
              <div className="text-center py-8">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No jobs found. Create your first job!</div>
            ) : (
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
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(job)} disabled={loading}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteJob(job.id)} disabled={loading}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Job</DialogTitle>
            </DialogHeader>
            <JobForm 
              jobForm={jobForm}
              setJobForm={setJobForm}
              onSubmit={handleEditJob} 
              submitText="Update Job"
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminJobsManagement;
