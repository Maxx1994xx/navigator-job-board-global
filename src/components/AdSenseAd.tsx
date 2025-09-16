import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface AdSenseAdProps {
  className?: string;
  style?: React.CSSProperties;
  format?: 'horizontal' | 'vertical' | 'square';
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({ className = "", style, format = 'horizontal' }) => {
  useEffect(() => {
    try {
      // Load AdSense script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1859700033861650';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
      
      // Push ad after component mounts
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.log('AdSense error:', error);
    }
  }, []);

  // Get slot ID based on format
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
    <div className={`my-6 ${className}`} style={style}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1859700033861650"
        data-ad-slot={getSlotId()}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseAd;