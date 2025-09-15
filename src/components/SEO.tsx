import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  structuredData?: object;
  noIndex?: boolean;
}

const SEO = ({ title, description, keywords, image, type = 'website', structuredData, noIndex = false }: SEOProps) => {
  const location = useLocation();
  
  // Update canonical URL based on current path
  const baseUrl = 'https://onlinecareernavigator.com';
  const canonicalUrl = `${baseUrl}${location.pathname}${location.search}`;

  // Fallback values to ensure meta tags are always present
  const defaultTitle = 'Online Career Navigator - Find Jobs in Gulf, USA & UK';
  const defaultDescription = 'Discover verified job opportunities across Gulf countries, USA, and UK. Connect with top employers and advance your career.';
  const defaultImage = `${baseUrl}/placeholder.svg`;
  
  const metaTitle = title || defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaImage = image || defaultImage;

  // Default structured data for the website
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Online Career Navigator",
    "url": baseUrl,
    "description": defaultDescription,
    "publisher": {
      "@type": "Organization",
      "name": "Online Career Navigator",
      "url": baseUrl
    }
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Online Career Navigator" />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:site" content="@OnlineCareerNav" />
      <meta name="twitter:creator" content="@OnlineCareerNav" />
      <meta name="twitter:image" content={metaImage} />
      
      {/* Additional meta tags for better SEO */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <meta name="author" content="Online Career Navigator" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="theme-color" content="#2563eb" />
      
      {/* Additional SEO meta tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;