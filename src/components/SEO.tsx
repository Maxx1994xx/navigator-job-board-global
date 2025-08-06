import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

const SEO = ({ title, description, keywords, image, type = 'website' }: SEOProps) => {
  const location = useLocation();
  
  // Update canonical URL based on current path
  const baseUrl = 'https://onlinecareernavigator.com';
  const canonicalUrl = `${baseUrl}${location.pathname}${location.search}`;

  // Fallback values to ensure meta tags are always present
  const defaultTitle = 'Online Career Navigator - Find Jobs in Gulf, USA & UK';
  const defaultDescription = 'Discover verified job opportunities across Gulf countries, USA, and UK. Connect with top employers and advance your career.';
  
  const metaTitle = title || defaultTitle;
  const metaDescription = description || defaultDescription;

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
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:site" content="@OnlineCareerNav" />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Additional meta tags for better SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Online Career Navigator" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
};

export default SEO;