
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Job {
  id: string;
  updated_at: string;
}

const SitemapGenerator = () => {
  const [sitemap, setSitemap] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateSitemap();
  }, []);

  const generateSitemap = async () => {
    try {
      // Fetch all active jobs
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('id, updated_at')
        .eq('status', 'active')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching jobs for sitemap:', error);
        return;
      }

      const baseUrl = 'https://onlinecareernavigator.com';
      const currentDate = new Date().toISOString().split('T')[0];

      // Static pages with their priorities and last modified dates
      const staticPages = [
        { url: '/', lastmod: currentDate, priority: '1.00' },
        { url: '/jobs', lastmod: currentDate, priority: '0.90' },
        { url: '/about', lastmod: currentDate, priority: '0.80' },
        { url: '/contact', lastmod: currentDate, priority: '0.75' },
        { url: '/privacy', lastmod: currentDate, priority: '0.50' },
        { url: '/terms', lastmod: currentDate, priority: '0.50' },
        { url: '/cookie-policy', lastmod: currentDate, priority: '0.50' },
      ];

      // Start building the XML sitemap with proper Google format
      let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

      // Add static pages
      staticPages.forEach(page => {
        sitemapXml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <priority>${page.priority}</priority>
  </url>
`;
      });

      // Add job pages
      if (jobs && jobs.length > 0) {
        jobs.forEach(job => {
          const lastmod = new Date(job.updated_at).toISOString().split('T')[0];
          sitemapXml += `
  <url>
    <loc>${baseUrl}/job/${job.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.80</priority>
  </url>
`;
        });
      }

      // Close the XML sitemap
      sitemapXml += `
</urlset>`;

      setSitemap(sitemapXml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
    } finally {
      setLoading(false);
    }
  };

  // Replace page content with XML sitemap
  useEffect(() => {
    if (sitemap) {
      // Replace the entire page content with the XML sitemap
      document.open();
      document.write(sitemap);
      document.close();
    }
  }, [sitemap]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Generating sitemap...</div>
        </div>
      </div>
    );
  }

  return null; // Component returns null as XML is written directly
};

export default SitemapGenerator;
