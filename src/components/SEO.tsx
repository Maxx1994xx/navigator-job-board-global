import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
}

const SEO = ({ title, description }: SEOProps) => {
  const location = useLocation();

  useEffect(() => {
    // Update canonical URL based on current path
    const baseUrl = 'https://onlinecareernavigator.com';
    const canonicalUrl = `${baseUrl}${location.pathname}${location.search}`;
    
    const canonicalLink = document.getElementById('canonical-url') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = canonicalUrl;
    }

    // Update title if provided
    if (title) {
      document.title = title;
    }

    // Update meta description if provided
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (metaDescription) {
        metaDescription.content = description;
      }
    }
  }, [location.pathname, location.search, title, description]);

  return null;
};

export default SEO;