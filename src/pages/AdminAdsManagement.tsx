import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Ad {
  id: string;
  ad_type: 'display' | 'in-feed' | 'in-article' | 'multiplex';
  ad_code: string;
  placement: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminAdsManagement = () => {
  const { adminUser } = useAdmin();
  const { toast } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [formData, setFormData] = useState<{
    ad_type: 'display' | 'in-feed' | 'in-article' | 'multiplex';
    ad_code: string;
    placement: string;
  }>({
    ad_type: 'display',
    ad_code: '',
    placement: ''
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds((data as Ad[]) || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ad_code.trim() || !formData.placement.trim()) {
      toast({
        title: "Error", 
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingAd) {
        const { error } = await supabase
          .from('ads')
          .update({
            ad_type: formData.ad_type,
            ad_code: formData.ad_code,
            placement: formData.placement,
          })
          .eq('id', editingAd.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Ad updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('ads')
          .insert({
            ad_type: formData.ad_type,
            ad_code: formData.ad_code,
            placement: formData.placement,
            created_by: adminUser?.id,
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Ad created successfully",
        });
      }

      resetForm();
      fetchAds();
    } catch (error) {
      console.error('Error saving ad:', error);
      toast({
        title: "Error",
        description: "Failed to save ad",
        variant: "destructive",
      });
    }
  };

  const toggleAdStatus = async (ad: Ad) => {
    try {
      const { error } = await supabase
        .from('ads')
        .update({ is_active: !ad.is_active })
        .eq('id', ad.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Ad ${!ad.is_active ? 'activated' : 'deactivated'} successfully`,
      });
      
      fetchAds();
    } catch (error) {
      console.error('Error toggling ad status:', error);
      toast({
        title: "Error",
        description: "Failed to update ad status",
        variant: "destructive",
      });
    }
  };

  const deleteAd = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', adId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Ad deleted successfully",
      });
      
      fetchAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast({
        title: "Error",
        description: "Failed to delete ad",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      ad_type: 'display' as 'display' | 'in-feed' | 'in-article' | 'multiplex',
      ad_code: '',
      placement: ''
    });
    setEditingAd(null);
    setIsDialogOpen(false);
  };

  const startEdit = (ad: Ad) => {
    setFormData({
      ad_type: ad.ad_type,
      ad_code: ad.ad_code,
      placement: ad.placement
    });
    setEditingAd(ad);
    setIsDialogOpen(true);
  };

  const getAdTypeColor = (type: string) => {
    switch (type) {
      case 'display': return 'bg-blue-100 text-blue-800';
      case 'in-feed': return 'bg-green-100 text-green-800';
      case 'in-article': return 'bg-purple-100 text-purple-800';
      case 'multiplex': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Ads Management">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading ads...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="AdSense Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AdSense Ads Management</h1>
            <p className="text-muted-foreground">Manage your Google AdSense ad codes and placements</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Ad
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingAd ? 'Edit Ad' : 'Add New Ad'}</DialogTitle>
                <DialogDescription>
                  {editingAd ? 'Update the ad configuration' : 'Create a new AdSense ad placement'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ad_type">Ad Type</Label>
                  <Select value={formData.ad_type} onValueChange={(value: any) => setFormData({...formData, ad_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ad type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="display">Display Ad</SelectItem>
                      <SelectItem value="in-feed">In-Feed Ad</SelectItem>
                      <SelectItem value="in-article">In-Article Ad</SelectItem>
                      <SelectItem value="multiplex">Multiplex Ad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placement">Placement Name</Label>
                  <Input
                    id="placement"
                    placeholder="e.g., Homepage Header, Blog Sidebar"
                    value={formData.placement}
                    onChange={(e) => setFormData({...formData, placement: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ad_code">AdSense Code</Label>
                  <Textarea
                    id="ad_code"
                    placeholder="Paste your Google AdSense code here..."
                    value={formData.ad_code}
                    onChange={(e) => setFormData({...formData, ad_code: e.target.value})}
                    rows={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingAd ? 'Update Ad' : 'Create Ad'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {ads.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No ads configured yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Ad
                </Button>
              </CardContent>
            </Card>
          ) : (
            ads.map((ad) => (
              <Card key={ad.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{ad.placement}</CardTitle>
                      <Badge className={getAdTypeColor(ad.ad_type)}>
                        {ad.ad_type.replace('-', ' ')}
                      </Badge>
                      <Badge variant={ad.is_active ? "default" : "secondary"}>
                        {ad.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={ad.is_active}
                        onCheckedChange={() => toggleAdStatus(ad)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(ad)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAd(ad.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Created: {new Date(ad.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-mono break-all">
                      {ad.ad_code.length > 100 
                        ? `${ad.ad_code.substring(0, 100)}...` 
                        : ad.ad_code
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAdsManagement;