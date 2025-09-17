import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface LazyLoadAdProps {
  className?: string;
  style?: React.CSSProperties;
  format?: 'horizontal' | 'vertical' | 'square';
  threshold?: number;
}

const LazyLoadAd: React.FC<LazyLoadAdProps> = ({ 
  className = "", 
  style, 
  format = 'horizontal', 
  threshold = 0.1 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
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
  }, [threshold, isVisible]);

  useEffect(() => {
    if (isVisible && !isLoaded) {
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
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isVisible, isLoaded]);

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

  return (
    <div ref={adRef} className={`my-6 ${className}`} style={style}>
      {isVisible && (
        <>
          {!isLoaded ? (
            <div className="animate-pulse bg-gray-200 rounded h-32 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Loading Ad...</span>
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
        </>
      )}
    </div>
  );
};

export default LazyLoadAd;