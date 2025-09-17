import React from 'react';
import AdBanner from './AdBanner';

interface InContentAdProps {
  className?: string;
  format?: 'horizontal' | 'square' | 'auto';
  style?: React.CSSProperties;
}

const InContentAd: React.FC<InContentAdProps> = ({ 
  className = "my-8", 
  format = 'horizontal',
  style
}) => {
  return (
    <div className={`flex justify-center ${className}`} style={style}>
      <div className="w-full max-w-4xl px-4">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-2">Advertisement</div>
          <AdBanner 
            format={format}
            className="mx-auto"
            lazy={true}
            threshold={0.2}
          />
        </div>
      </div>
    </div>
  );
};

export default InContentAd;