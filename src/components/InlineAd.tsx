import React from 'react';
import AdBanner from './AdBanner';

interface InlineAdProps {
  index: number;
  frequency?: number;
  format?: 'horizontal' | 'vertical' | 'square' | 'auto';
  className?: string;
  showEvery?: number[];
}

const InlineAd: React.FC<InlineAdProps> = ({ 
  index, 
  frequency = 5, 
  format = 'horizontal',
  className = "my-6",
  showEvery = []
}) => {
  // Check if we should show an ad at this index
  const shouldShowAd = () => {
    // If specific indices are provided, use those
    if (showEvery.length > 0) {
      return showEvery.includes(index);
    }
    
    // Otherwise use frequency-based display
    return (index + 1) % frequency === 0;
  };

  if (!shouldShowAd()) {
    return null;
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="w-full max-w-4xl">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2 opacity-75">Advertisement</div>
          <AdBanner 
            format={format}
            className="mx-auto"
            lazy={true}
            threshold={0.3}
          />
        </div>
      </div>
    </div>
  );
};

export default InlineAd;
