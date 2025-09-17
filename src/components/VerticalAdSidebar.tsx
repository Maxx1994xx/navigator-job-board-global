import React, { useEffect, useState } from 'react';
import AdBanner from './AdBanner';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VerticalAdSidebarProps {
  position?: 'left' | 'right';
  className?: string;
}

const VerticalAdSidebar: React.FC<VerticalAdSidebarProps> = ({ 
  position = 'right',
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Show sidebar ad after page loads and user scrolls a bit
    const timer = setTimeout(() => {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 300 && !isClosed) {
          setIsVisible(true);
          window.removeEventListener('scroll', handleScroll);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Also show after 5 seconds if no scroll
      const fallbackTimer = setTimeout(() => {
        if (!isClosed) setIsVisible(true);
      }, 5000);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(fallbackTimer);
      };
    }, 2000);

    return () => clearTimeout(timer);
  }, [isClosed]);

  if (isClosed || !isVisible) return null;

  const positionClasses = {
    left: 'fixed left-4 top-1/2 transform -translate-y-1/2 z-40',
    right: 'fixed right-4 top-1/2 transform -translate-y-1/2 z-40'
  };

  return (
    <div className={`${positionClasses[position]} ${className} hidden lg:block`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-[200px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Advertisement</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsClosed(true)}
            className="text-gray-400 hover:text-gray-600 h-5 w-5 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        <AdBanner 
          format="vertical" 
          className="w-full" 
          lazy={true}
          threshold={0.3}
        />
      </div>
    </div>
  );
};

export default VerticalAdSidebar;