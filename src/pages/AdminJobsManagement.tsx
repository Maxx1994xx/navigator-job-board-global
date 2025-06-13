import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
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
import RichTextEditor from '@/components/RichTextEditor';
import LocationSelect from '@/components/LocationSelect';

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
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={jobForm.title}
            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
            placeholder="Senior Software Engineer"
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={jobForm.company}
            onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
            placeholder="Tech Company Inc."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <LocationSelect
            value={jobForm.location}
            onChange={(value) => setJobForm({ ...jobForm, location: value })}
            placeholder="Select location"
          />
        </div>
        <div>
          <Label htmlFor="salary">Salary (Optional)</Label>
          <Input
            id="salary"
            value={jobForm.salary}
            onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
            placeholder="$80,000 - $120,000"
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
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
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
        <RichTextEditor
          value={jobForm.description}
          onChange={(value) => setJobForm({ ...jobForm, description: value })}
          placeholder="Describe the job role, responsibilities, and what makes this position exciting..."
        />
      </div>

      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <RichTextEditor
          value={jobForm.requirements}
          onChange={(value) => setJobForm({ ...jobForm, requirements: value })}
          placeholder="List the required skills, experience, and qualifications..."
        />
      </div>

      <div>
        <Label htmlFor="benefits">Benefits & Perks</Label>
        <RichTextEditor
          value={jobForm.benefits}
          onChange={(value) => setJobForm({ ...jobForm, benefits: value })}
          placeholder="Describe the benefits, perks, and what makes working here great..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_featured"
          checked={jobForm.is_featured}
          onChange={(e) => setJobForm({ ...jobForm, is_featured: e.target.checked })}
          className="rounded border-gray-300"
        />
        <Label htmlFor="is_featured">Featured Job</Label>
      </div>

      <Button onClick={onSubmit} disabled={loading} className="w-full">
        {loading ? 'Processing...' : submitText}
      </Button>
    </div>
  );

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
    </AdminLayout>
  );
};

export default AdminJobsManagement;
