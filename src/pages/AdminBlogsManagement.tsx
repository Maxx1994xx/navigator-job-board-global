import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/ui/rich-text-editor';
import AdminLayout from '@/components/AdminLayout';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  html_content?: string;
  category: string;
  author: string;
  image_url?: string;
  seo_title?: string;
  seo_description?: string;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  reading_time: number;
  created_at: string;
  updated_at: string;
}

const categories = [
  'Career Tips',
  'Industry Trends',
  'Interview Preparation',
  'Resume Writing',
  'Job Search',
  'Professional Development',
  'Workplace Culture',
  'Technology',
  'Leadership',
  'Salary & Benefits'
];

const AdminBlogsManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    html_content: '',
    category: '',
    author: 'Admin',
    image_url: '',
    seo_title: '',
    seo_description: '',
    tags: [] as string[],
    is_featured: false,
    is_published: true,
    reading_time: 5
  });
  const [activeTab, setActiveTab] = useState('content');
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs;
    
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === filterCategory);
    }
    
    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, filterCategory]);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seo_title: title.length > 60 ? title.substring(0, 60) : title
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.excerpt.trim()) {
      toast({
        title: "Error",
        description: "Excerpt is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Error",
        description: "Content is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Error",
        description: "Category is required",
        variant: "destructive"
      });
      return;
    }

    // Ensure slug is generated
    const finalSlug = formData.slug || generateSlug(formData.title);
    if (!finalSlug) {
      toast({
        title: "Error",
        description: "Unable to generate URL slug from title",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const blogData = {
        ...formData,
        slug: finalSlug,
        tags: formData.tags.length > 0 ? formData.tags : [],
        html_content: formData.content // Store the rich text content as HTML
      };

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Blog updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([blogData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Blog created successfully"
        });
      }

      resetForm();
      setIsCreateModalOpen(false);
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save blog. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Blog deleted successfully"
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      html_content: blog.html_content || '',
      category: blog.category,
      author: blog.author,
      image_url: blog.image_url || '',
      seo_title: blog.seo_title || '',
      seo_description: blog.seo_description || '',
      tags: blog.tags || [],
      is_featured: blog.is_featured,
      is_published: blog.is_published,
      reading_time: blog.reading_time
    });
    setEditingBlog(blog);
    setIsCreateModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      html_content: '',
      category: '',
      author: 'Admin',
      image_url: '',
      seo_title: '',
      seo_description: '',
      tags: [],
      is_featured: false,
      is_published: true,
      reading_time: 5
    });
    setActiveTab('content');
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  if (loading) {
    return (
      <AdminLayout title="Blog Management">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading blogs...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Blog Management">
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="Blog title"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="blog-url-slug"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="excerpt">Excerpt *</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Brief description of the blog post"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Content *</Label>
                      <RichTextEditor
                        value={formData.content}
                        onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                        placeholder="Write your blog content here..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="html_content">HTML Content (Optional)</Label>
                      <Textarea
                        id="html_content"
                        value={formData.html_content}
                        onChange={(e) => setFormData(prev => ({ ...prev, html_content: e.target.value }))}
                        placeholder="Custom HTML content"
                        rows={10}
                        className="font-mono text-sm"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="seo" className="space-y-4">
                    <div>
                      <Label htmlFor="seo_title">SEO Title</Label>
                      <Input
                        id="seo_title"
                        value={formData.seo_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                        placeholder="SEO optimized title (60 chars max)"
                        maxLength={60}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.seo_title.length}/60 characters
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="seo_description">SEO Description</Label>
                      <Textarea
                        id="seo_description"
                        value={formData.seo_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                        placeholder="SEO meta description (160 chars max)"
                        rows={3}
                        maxLength={160}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.seo_description.length}/160 characters
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="image_url">Featured Image URL</Label>
                      <Input
                        id="image_url"
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags.join(', ')}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="author">Author</Label>
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                          placeholder="Author name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="reading_time">Reading Time (minutes)</Label>
                      <Input
                        id="reading_time"
                        type="number"
                        min="1"
                        value={formData.reading_time}
                        onChange={(e) => setFormData(prev => ({ ...prev, reading_time: parseInt(e.target.value) || 5 }))}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_published"
                          checked={formData.is_published}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                        />
                        <Label htmlFor="is_published">Published</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_featured"
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                        />
                        <Label htmlFor="is_featured">Featured</Label>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingBlog(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBlog ? 'Update' : 'Create'} Blog
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{blogs.length}</div>
              <p className="text-sm text-muted-foreground">Total Blogs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{blogs.filter(b => b.is_published).length}</div>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{blogs.filter(b => !b.is_published).length}</div>
              <p className="text-sm text-muted-foreground">Draft</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{blogs.filter(b => b.is_featured).length}</div>
              <p className="text-sm text-muted-foreground">Featured</p>
            </CardContent>
          </Card>
        </div>

        {/* Blogs List */}
        <div className="grid gap-4">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{blog.title}</h3>
                      <div className="flex gap-1">
                        {blog.is_featured && <Badge variant="secondary">Featured</Badge>}
                        <Badge variant={blog.is_published ? "default" : "outline"}>
                          {blog.is_published ? 'Published' : 'Draft'}
                        </Badge>
                        <Badge variant="outline">{blog.category}</Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">{blog.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {blog.author}</span>
                      <span>{blog.reading_time} min read</span>
                      <span>Created: {new Date(blog.created_at).toLocaleDateString()}</span>
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex gap-1">
                          {blog.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(blog)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No blogs found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlogsManagement;