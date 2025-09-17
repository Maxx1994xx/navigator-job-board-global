import React, { useEffect, useState } from 'react';
import AdBanner from './AdBanner';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingAdSpacesProps {
  className?: string;
}

const FloatingAdSpaces: React.FC<FloatingAdSpacesProps> = ({ className = "" }) => {
  const [showTopFloater, setShowTopFloater] = useState(false);
  const [showLeftFloater, setShowLeftFloater] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      // Show different ads based on scroll position
      if (scrollTop > 200) {
        setIsScrolled(true);
      }
      
      if (scrollPercentage > 25 && !showTopFloater) {
        setShowTopFloater(true);
      }
      
      if (scrollPercentage > 50 && !showLeftFloater) {
        setShowLeftFloater(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Also show after time delay
    const timer = setTimeout(() => {
      setShowTopFloater(true);
    }, 8000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [showTopFloater, showLeftFloater]);

  return (
    <div className={className}>
      {/* Top Floating Banner - Only on larger screens */}
      {showTopFloater && isScrolled && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 hidden lg:block">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-[728px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Advertisement</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTopFloater(false)}
                className="text-gray-400 hover:text-gray-600 h-5 w-5 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <AdBanner format="horizontal" className="w-full" lazy={true} threshold={0.5} />
          </div>
        </div>
      )}

      {/* Left Corner Ad - Only on very large screens */}
      {showLeftFloater && (
        <div className="fixed left-2 bottom-20 z-40 hidden 2xl:block">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 max-w-[160px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Ad</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLeftFloater(false)}
                className="text-gray-400 hover:text-gray-600 h-4 w-4 p-0"
              >
                <X className="w-2 h-2" />
              </Button>
            </div>
            <AdBanner format="vertical" className="w-full" lazy={true} threshold={0.5} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingAdSpaces;