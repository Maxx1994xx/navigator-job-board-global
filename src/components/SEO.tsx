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
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      // Update canonical URL based on current path
      const baseUrl = 'https://onlinecareernavigator.com';
      const canonicalUrl = `${baseUrl}${location.pathname}${location.search}`;
      
      const canonicalLink = document.getElementById('canonical-url') as HTMLLinkElement;
      if (canonicalLink) {
        canonicalLink.href = canonicalUrl;
      }

      // Update title if provided
      if (title) {
        console.log('SEO: Updating title to:', title);
        document.title = title;
        console.log('SEO: Document title is now:', document.title);
      }

      // Update meta description if provided
      if (description) {
        console.log('SEO: Updating description to:', description);
        let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
        if (metaDescription) {
          metaDescription.content = description;
          console.log('SEO: Updated existing meta description:', metaDescription.content);
        } else {
          metaDescription = document.createElement('meta');
          metaDescription.name = 'description';
          metaDescription.content = description;
          document.head.appendChild(metaDescription);
          console.log('SEO: Created new meta description:', metaDescription.content);
        }
      }

      // Update meta keywords if provided
      if (keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
        if (metaKeywords) {
          metaKeywords.content = keywords;
        } else {
          metaKeywords = document.createElement('meta');
          metaKeywords.name = 'keywords';
          metaKeywords.content = keywords;
          document.head.appendChild(metaKeywords);
        }
      }

      // Update Open Graph and Twitter tags
      const updateOrCreateMeta = (property: string, content: string, isProperty = true) => {
        const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
        let meta = document.querySelector(selector) as HTMLMetaElement;
        if (meta) {
          meta.content = content;
        } else {
          meta = document.createElement('meta');
          if (isProperty) {
            meta.setAttribute('property', property);
          } else {
            meta.setAttribute('name', property);
          }
          meta.content = content;
          document.head.appendChild(meta);
        }
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
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search, title, description, keywords, image, type]);

  return null;
};

export default SEO;