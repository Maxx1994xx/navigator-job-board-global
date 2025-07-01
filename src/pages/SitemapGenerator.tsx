
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

      const baseUrl = 'http://onlinecareernavigator.com';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Generating sitemap...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">XML Sitemap</h1>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {sitemap}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SitemapGenerator;
