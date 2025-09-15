import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Ad {
  id: string;
  ad_type: 'display' | 'in-feed' | 'in-article' | 'multiplex';
  ad_code: string;
  placement: string;
  is_active: boolean;
}

interface AdSenseAdProps {
  placement: string;
  className?: string;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({ placement, className = '' }) => {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAd();
  }, [placement]);

  const fetchAd = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('placement', placement)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching ad:', error);
        return;
      }

      setAd(data as Ad);
    } catch (error) {
      console.error('Error fetching ad:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ad && ad.ad_code) {
      // Load Google AdSense script if not already loaded
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Push ads after a small delay to ensure script is loaded
      const timer = setTimeout(() => {
        try {
          if (window.adsbygoogle) {
            window.adsbygoogle.push({});
          }
        } catch (error) {
          console.error('Error loading AdSense ad:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [ad]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 bg-muted rounded-md ${className}`}>
        <div className="text-sm text-muted-foreground">Loading ad...</div>
      </div>
    );
  }

  if (!ad) {
    return null; // Don't render anything if no ad is configured for this placement
  }

  return (
    <div className={`ad-container ${className}`} data-placement={placement}>
      <div 
        dangerouslySetInnerHTML={{ __html: ad.ad_code }}
        className="adsense-ad"
      />
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default AdSenseAd;