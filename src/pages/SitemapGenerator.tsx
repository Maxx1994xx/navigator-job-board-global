
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

      // Static pages
      const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/jobs', priority: '0.9', changefreq: 'daily' },
        { url: '/about', priority: '0.7', changefreq: 'monthly' },
        { url: '/contact', priority: '0.7', changefreq: 'monthly' },
        { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
        { url: '/terms', priority: '0.5', changefreq: 'yearly' },
        { url: '/cookie-policy', priority: '0.5', changefreq: 'yearly' },
      ];

      let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Add static pages
      staticPages.forEach(page => {
        sitemapXml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
      });

      // Add job pages
      if (jobs && jobs.length > 0) {
        jobs.forEach(job => {
          const lastmod = new Date(job.updated_at).toISOString().split('T')[0];
          sitemapXml += `
  <url>
    <loc>${baseUrl}/job/${job.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });
      }

      sitemapXml += `
</urlset>`;

      setSitemap(sitemapXml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set content type for XML response
  useEffect(() => {
    if (sitemap) {
      // For proper XML response
      const response = new Response(sitemap, {
        headers: {
          'Content-Type': 'application/xml',
        },
      });
      
      // Replace the page content with raw XML
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
