import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import InterstitialAd from './InterstitialAd';

const NavigationInterceptor: React.FC = () => {
  const location = useLocation();
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [lastInterstitialTime, setLastInterstitialTime] = useState(0);

  useEffect(() => {
    const currentTime = Date.now();
    const timeSinceLastAd = currentTime - lastInterstitialTime;
    const minTimeBetweenAds = 5 * 60 * 1000; // 5 minutes
    
    // Show interstitial every 3-4 page views, but not more than once every 5 minutes
    if (visitCount > 0 && visitCount % 3 === 0 && timeSinceLastAd > minTimeBetweenAds) {
      // Avoid showing on admin pages, apply pages, or initial load
      const isAdminPage = location.pathname.includes('/admin');
      const isApplyPage = location.pathname.includes('/apply');
      const isInitialLoad = visitCount === 0;
      
      if (!isAdminPage && !isApplyPage && !isInitialLoad) {
        setShowInterstitial(true);
        setLastInterstitialTime(currentTime);
      }
    }
    
    setVisitCount(prev => prev + 1);
  }, [location.pathname]);

  const handleCloseInterstitial = () => {
    setShowInterstitial(false);
  };

  return (
    <InterstitialAd 
      show={showInterstitial} 
      onClose={handleCloseInterstitial} 
    />
  );
};

export default NavigationInterceptor;