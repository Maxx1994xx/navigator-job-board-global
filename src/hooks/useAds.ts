import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Ad {
  id: string;
  ad_type: 'display' | 'in-feed' | 'in-article' | 'multiplex';
  ad_code: string;
  placement: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveAds();
  }, []);

  const fetchActiveAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ads:', error);
        return;
      }

      setAds((data as Ad[]) || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAdByPlacement = (placement: string): Ad | null => {
    return ads.find(ad => ad.placement === placement && ad.is_active) || null;
  };

  const getAdsByType = (adType: 'display' | 'in-feed' | 'in-article' | 'multiplex'): Ad[] => {
    return ads.filter(ad => ad.ad_type === adType && ad.is_active);
  };

  return {
    ads,
    loading,
    getAdByPlacement,
    getAdsByType,
    refetch: fetchActiveAds,
  };
};

export default useAds;