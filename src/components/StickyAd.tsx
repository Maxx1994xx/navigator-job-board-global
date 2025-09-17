import React, { useEffect, useState } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface StickyAdProps {
  position?: 'bottom' | 'right';
  format?: 'horizontal' | 'vertical' | 'square';
}

const StickyAd: React.FC<StickyAdProps> = ({ position = 'bottom', format = 'horizontal' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Delay showing the sticky ad for better UX
    const timer = setTimeout(() => {
      try {
        if (!window.adsbygoogle) {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1859700033861650';
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }
        
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setIsLoaded(true);
      } catch (error) {
        console.log('AdSense error:', error);
        setIsLoaded(true);
      }
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const getSlotId = () => {
    switch (format) {
      case 'vertical':
        return '5563014259';
      case 'square':
        return '8694737768';
      case 'horizontal':
      default:
        return '6876095926';
    }
  };

  if (!isVisible) return null;

  const positionClasses = {
    bottom: 'fixed bottom-0 left-0 right-0 z-50',
    right: 'fixed right-4 top-1/2 transform -translate-y-1/2 z-50'
  };

  const sizeClasses = {
    bottom: isMinimized ? 'h-12' : 'h-32',
    right: 'w-48'
  };

  return (
    <div className={`${positionClasses[position]} ${sizeClasses[position]} bg-white border-t border-gray-200 shadow-lg transition-all duration-300`}>
      <div className="max-w-6xl mx-auto px-4 py-2 relative">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Advertisement</span>
          <div className="flex items-center space-x-2">
            {position === 'bottom' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-500 hover:text-gray-700 h-6 w-6 p-0"
              >
                {isMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {!isMinimized && (
          <div className="mt-2">
            {!isLoaded ? (
              <div className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <ins 
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-1859700033861650"
                data-ad-slot={getSlotId()}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyAd;