import React, { useEffect, useState } from 'react';
import LazyLoadAd from './LazyLoadAd';

interface ScrollTriggeredAdProps {
  triggerPercentage?: number;
  format?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

const ScrollTriggeredAd: React.FC<ScrollTriggeredAdProps> = ({ 
  triggerPercentage = 50, 
  format = 'horizontal',
  className = ""
}) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let hasShown = false;
    
    const handleScroll = () => {
      if (hasShown) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      
      if (scrollPercentage >= triggerPercentage) {
        setShouldShow(true);
        hasShown = true;
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [triggerPercentage]);

  if (!shouldShow) return null;

  return (
    <div className={`fixed top-20 right-4 w-64 z-40 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-2 border">
        <div className="text-xs text-gray-500 mb-2 text-center">Advertisement</div>
        <LazyLoadAd format={format} className="my-0" />
      </div>
    </div>
  );
};

export default ScrollTriggeredAd;