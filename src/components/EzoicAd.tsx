import React, { useEffect } from 'react';

declare global {
  interface Window {
    ezstandalone?: {
      cmd: { push: (callback: () => void) => void };
      showAds: (placementId: number) => void;
    };
  }
}

interface EzoicAdProps {
  placementId: number;
  className?: string;
  style?: React.CSSProperties;
}

const EzoicAd: React.FC<EzoicAdProps> = ({ placementId, className = "", style }) => {
  useEffect(() => {
    try {
      // Load Ezoic script if not already loaded
      if (!window.ezstandalone) {
        const script = document.createElement('script');
        script.src = '//g.ezoic.net/ezoic/sa.min.js';
        script.async = true;
        document.head.appendChild(script);
        
        // Wait for script to load before showing ads
        script.onload = () => {
          if (window.ezstandalone?.cmd) {
            window.ezstandalone.cmd.push(() => {
              window.ezstandalone?.showAds(placementId);
            });
          }
        };
      } else {
        // Script already loaded, show ads immediately
        window.ezstandalone.cmd.push(() => {
          window.ezstandalone?.showAds(placementId);
        });
      }
    } catch (error) {
      console.log('Ezoic ad error:', error);
    }
  }, [placementId]);

  return (
    <div className={`my-6 ${className}`} style={style}>
      <div id={`ezoic-pub-ad-placeholder-${placementId}`}></div>
    </div>
  );
};

export default EzoicAd;
