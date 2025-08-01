
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Fetch all active jobs
    const { data: jobs, error: jobsError } = await supabaseClient
      .from('jobs')
      .select('id, updated_at')
      .eq('status', 'active')
      .eq('is_active', true)

    if (jobsError) {
      console.error('Error fetching jobs:', jobsError)
      throw jobsError
    }

    // Fetch all published blogs
    const { data: blogs, error: blogsError } = await supabaseClient
      .from('blogs')
      .select('id, slug, updated_at, category')
      .eq('is_published', true)

    if (blogsError) {
      console.error('Error fetching blogs:', blogsError)
      throw blogsError
    }

    const baseUrl = 'https://www.onlinecareernavigator.com'
    const currentDate = new Date().toISOString().split('T')[0]

    // Homepage - Highest Priority
    const homePage = {
      url: '/',
      priority: '1.0',
      changefreq: 'daily',
      lastmod: currentDate
    }

    // Main Section Pages - High Priority
    const mainPages = [
      { url: '/jobs', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
      { url: '/blog', priority: '0.8', changefreq: 'daily', lastmod: currentDate },
      { url: '/about', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
      { url: '/contact', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
    ]

    // Legal Pages - Low Priority
    const legalPages = [
      { url: '/privacy', priority: '0.3', changefreq: 'yearly', lastmod: currentDate },
      { url: '/terms', priority: '0.3', changefreq: 'yearly', lastmod: currentDate },
      { url: '/cookie-policy', priority: '0.3', changefreq: 'yearly', lastmod: currentDate },
    ]

    // Blog Category Pages - Medium Priority
    const blogCategories = blogs && blogs.length > 0
      ? [...new Set(blogs.map(blog => blog.category))]
          .filter(Boolean)
          .map(category => ({
            url: `/blog/category/${encodeURIComponent(category.toLowerCase())}`,
            priority: '0.6',
            changefreq: 'weekly',
            lastmod: currentDate
          }))
      : []

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

    // Helper function to add URL to sitemap
    const addUrl = (page) => {
      sitemapXml += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
    }

    // 1. HOMEPAGE - Highest Priority
    addUrl(homePage)

    // 2. MAIN SECTION PAGES - High Priority
    mainPages.forEach(addUrl)

    // 3. BLOG CATEGORY PAGES - Medium-High Priority
    blogCategories.forEach(addUrl)

    // 4. INDIVIDUAL JOB PAGES - Medium Priority
    if (jobs && jobs.length > 0) {
      jobs.forEach(job => {
        const lastmod = new Date(job.updated_at).toISOString().split('T')[0]
        addUrl({
          url: `/job/${job.id}`,
          lastmod: lastmod,
          changefreq: 'weekly',
          priority: '0.6'
        })
      })
    }

    // 5. INDIVIDUAL BLOG POSTS - Medium Priority
    if (blogs && blogs.length > 0) {
      blogs.forEach(blog => {
        const lastmod = new Date(blog.updated_at).toISOString().split('T')[0]
        addUrl({
          url: `/blog/${blog.slug}`,
          lastmod: lastmod,
          changefreq: 'weekly',
          priority: '0.5'
        })
      })
    }

    // 6. LEGAL PAGES - Lowest Priority
    legalPages.forEach(addUrl)

    sitemapXml += `
</urlset>`

    return new Response(sitemapXml, {
      headers: corsHeaders,
      status: 200,
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
