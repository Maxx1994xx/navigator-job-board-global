import { useEffect } from 'react';
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

    // Update meta keywords if provided
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = keywords;
    }

    // Update Open Graph tags
    const updateOrCreateMeta = (property: string, content: string, isProperty = true) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    if (title) {
      updateOrCreateMeta('og:title', title);
      updateOrCreateMeta('twitter:title', title, false);
    }

    if (description) {
      updateOrCreateMeta('og:description', description);
      updateOrCreateMeta('twitter:description', description, false);
    }

    updateOrCreateMeta('og:url', canonicalUrl);
    updateOrCreateMeta('og:type', type);
    updateOrCreateMeta('twitter:card', 'summary_large_image', false);

    if (image) {
      updateOrCreateMeta('og:image', image);
      updateOrCreateMeta('twitter:image', image, false);
    }
  }, [location.pathname, location.search, title, description, keywords, image, type]);

  return null;
};

export default SEO;