import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface InterstitialAdProps {
  onClose: () => void;
  show: boolean;
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ onClose, show }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        try {
          // Load AdSense script if not already loaded
          if (!window.adsbygoogle) {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1859700033861650';
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
          }
          
          // Initialize the ad
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
        } catch (error) {
          console.log('AdSense error:', error);
          setIsLoaded(true);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [show]);

  // Auto close after 8 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advertisement</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-center">
            {!isLoaded ? (
              <div className="py-16">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 mx-auto"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : (
              <ins 
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-1859700033861650"
                data-ad-slot="6876095926"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            )}
          </div>
          
          <div className="text-center mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClose}
              className="text-sm"
            >
              Skip Ad (Auto close in 8s)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterstitialAd;