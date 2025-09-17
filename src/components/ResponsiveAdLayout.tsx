import React from 'react';
import AdBanner from './AdBanner';
import VerticalAdSidebar from './VerticalAdSidebar';

interface ResponsiveAdLayoutProps {
  children: React.ReactNode;
  showVerticalAds?: boolean;
  showTopAd?: boolean;
  showBottomAd?: boolean;
  className?: string;
}

const ResponsiveAdLayout: React.FC<ResponsiveAdLayoutProps> = ({
  children,
  showVerticalAds = true,
  showTopAd = false,
  showBottomAd = false,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Top Ad */}
      {showTopAd && (
        <div className="w-full mb-6">
          <div className="text-xs text-gray-500 text-center mb-2">Advertisement</div>
          <AdBanner format="horizontal" className="mx-auto" />
        </div>
      )}

      {/* Main Content with Sidebars */}
      <div className="relative">
        {/* Left Vertical Ad - Hidden on mobile */}
        {showVerticalAds && (
          <div className="hidden xl:block fixed left-2 top-1/2 transform -translate-y-1/2 z-30">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 max-w-[160px]">
              <div className="text-xs text-gray-500 text-center mb-2">Ad</div>
              <AdBanner format="vertical" className="w-full" lazy={true} threshold={0.3} />
            </div>
          </div>
        )}

        {/* Right Vertical Ad - Handled by VerticalAdSidebar in App.tsx */}
        
        {/* Main Content */}
        <div className="xl:px-48">
          {children}
        </div>
      </div>

      {/* Bottom Ad */}
      {showBottomAd && (
        <div className="w-full mt-6">
          <div className="text-xs text-gray-500 text-center mb-2">Advertisement</div>
          <AdBanner format="horizontal" className="mx-auto" />
        </div>
      )}
    </div>
  );
};

export default ResponsiveAdLayout;