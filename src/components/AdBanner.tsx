import React, { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdBannerProps {
  className?: string;
  style?: React.CSSProperties;
  format?: 'horizontal' | 'vertical' | 'square' | 'auto';
  dataAdSlot?: string;
  lazy?: boolean;
  threshold?: number;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  className = "", 
  style, 
  format = 'horizontal',
  dataAdSlot,
  lazy = true,
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(!lazy);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);

  // Get slot ID based on format
  const getSlotId = useCallback(() => {
    if (dataAdSlot) return dataAdSlot;
    
    switch (format) {
      case 'vertical':
        return '5563014259';
      case 'square':
        return '8694737768';
      case 'horizontal':
      case 'auto':
      default:
        return '6876095926';
    }
  }, [format, dataAdSlot]);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazy || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, threshold, isVisible]);

  // Initialize AdSense ad when visible
  useEffect(() => {
    if (!isVisible || isLoaded || hasError) return;

    const initializeAd = async () => {
      try {
        // Ensure AdSense script is loaded
        if (typeof window.adsbygoogle === 'undefined') {
          // Wait for AdSense script to load
          let attempts = 0;
          const maxAttempts = 50; // 5 seconds max wait
          
          while (typeof window.adsbygoogle === 'undefined' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
          }
          
          if (typeof window.adsbygoogle === 'undefined') {
            throw new Error('AdSense script not loaded');
          }
        }

        // Initialize the ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setIsLoaded(true);
        
        // Add error handling for failed ad loads
        setTimeout(() => {
          if (insRef.current && insRef.current.innerHTML.trim() === '') {
            console.warn('Ad failed to load content');
          }
        }, 3000);
        
      } catch (error) {
        console.error('AdSense initialization error:', error);
        setHasError(true);
      }
    };

    const timer = setTimeout(initializeAd, 200);
    return () => clearTimeout(timer);
  }, [isVisible, isLoaded, hasError]);

  // Get responsive format classes
  const getFormatClasses = () => {
    switch (format) {
      case 'vertical':
        return 'min-h-[280px] w-full max-w-[160px]';
      case 'square':
        return 'min-h-[250px] w-full max-w-[300px]';
      case 'horizontal':
        return 'min-h-[90px] w-full max-w-[728px]';
      case 'auto':
      default:
        return 'min-h-[100px] w-full';
    }
  };

  if (hasError) {
    return null; // Hide failed ads gracefully
  }

  return (
    <div 
      ref={adRef} 
      className={`flex justify-center items-center ${getFormatClasses()} ${className}`} 
      style={style}
    >
      {isVisible ? (
        <>
          {!isLoaded && (
            <div className="animate-pulse bg-gray-200 rounded flex items-center justify-center w-full h-full min-h-[90px]">
              <span className="text-gray-500 text-xs">Loading Ad...</span>
            </div>
          )}
          <ins 
            ref={insRef}
            className="adsbygoogle"
            style={{ 
              display: 'block',
              width: '100%',
              height: 'auto'
            }}
            data-ad-client="ca-pub-1859700033861650"
            data-ad-slot={getSlotId()}
            data-ad-format={format === 'auto' ? 'auto' : undefined}
            data-full-width-responsive="true"
          />
        </>
      ) : (
        <div className="bg-gray-100 rounded flex items-center justify-center w-full h-full min-h-[90px]">
          <span className="text-gray-400 text-xs">Ad Space</span>
        </div>
      )}
    </div>
  );
};

export default AdBanner;