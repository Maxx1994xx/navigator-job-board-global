import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = 'https://zmrfykssfejouiqrzbcj.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const rapidApiKey = Deno.env.get('RAPIDAPI_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface JobBoardJob {
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  category: string;
  listing_url: string;
  requirements?: string[];
  benefits?: string[];
}

async function fetchJSearchJobs(query: string, location: string, limit: number = 10): Promise<JobBoardJob[]> {
  console.log(`Fetching JSearch jobs for query: ${query}, location: ${location}`);
  
  const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&date_posted=all&remote_jobs_only=false&employment_types=FULLTIME%2CPARTTIME%2CCONTRACTOR%2CINTERN&job_requirements=under_3_years_experience%2Cmore_than_3_years_experience%2Cno_experience%2Cno_degree`, {
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  });

  if (!response.ok) {
    console.error('JSearch API error:', response.status, response.statusText);
    return [];
  }

  const data = await response.json();
  console.log(`JSearch returned ${data.data?.length || 0} jobs`);
  
  return (data.data || []).slice(0, limit).map((job: any) => ({
    title: job.job_title || 'No Title',
    company: job.employer_name || 'Unknown Company',
    location: job.job_city && job.job_country ? `${job.job_city}, ${job.job_country}` : location || 'Remote',
    type: job.job_employment_type === 'FULLTIME' ? 'Full-time' : 
          job.job_employment_type === 'PARTTIME' ? 'Part-time' : 
          job.job_employment_type === 'CONTRACTOR' ? 'Contract' : 'Full-time',
    salary: job.job_salary_period && job.job_min_salary ? 
            `$${job.job_min_salary}${job.job_max_salary ? ` - $${job.job_max_salary}` : ''} ${job.job_salary_period}` : 
            undefined,
    description: job.job_description || 'No description available',
    category: categorizeJob(job.job_title || ''),
    listing_url: job.job_apply_link || job.job_google_link || '#',
    requirements: job.job_highlights?.Qualifications ? [job.job_highlights.Qualifications] : undefined,
    benefits: job.job_highlights?.Benefits ? [job.job_highlights.Benefits] : undefined
  }));
}

async function fetchAdzunaJobs(query: string, location: string, limit: number = 10): Promise<JobBoardJob[]> {
  console.log(`Fetching Adzuna jobs for query: ${query}, location: ${location}`);
  
  const response = await fetch(`https://adzuna.p.rapidapi.com/v1/api/jobs/us/search/1?app_id=test&app_key=test&results_per_page=${limit}&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`, {
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': 'adzuna.p.rapidapi.com'
    }
  });

  if (!response.ok) {
    console.error('Adzuna API error:', response.status, response.statusText);
    return [];
  }

  const data = await response.json();
  console.log(`Adzuna returned ${data.results?.length || 0} jobs`);
  
  return (data.results || []).map((job: any) => ({
    title: job.title || 'No Title',
    company: job.company?.display_name || 'Unknown Company',
    location: job.location?.display_name || location || 'Remote',
    type: 'Full-time', // Adzuna doesn't always specify job type
    salary: job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : undefined,
    description: job.description || 'No description available',
    category: job.category?.label || categorizeJob(job.title || ''),
    listing_url: job.redirect_url || '#',
    requirements: undefined,
    benefits: undefined
  }));
}

function categorizeJob(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('software') || titleLower.includes('developer') || titleLower.includes('engineer')) {
    return 'Software Engineering';
  } else if (titleLower.includes('marketing') || titleLower.includes('growth') || titleLower.includes('social media')) {
    return 'Marketing';
  } else if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) {
    return 'Design';
  } else if (titleLower.includes('sales') || titleLower.includes('business development')) {
    return 'Sales';
  } else if (titleLower.includes('hr') || titleLower.includes('human resources') || titleLower.includes('recruiting')) {
    return 'Human Resources';
  } else if (titleLower.includes('finance') || titleLower.includes('accounting') || titleLower.includes('financial')) {
    return 'Finance';
  } else if (titleLower.includes('data') || titleLower.includes('analytics') || titleLower.includes('scientist')) {
    return 'Data Science';
  } else if (titleLower.includes('customer') || titleLower.includes('support') || titleLower.includes('success')) {
    return 'Customer Support';
  }
  
  return 'Other';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, location, sources, limit } = await req.json();
    
    console.log('Fetch job boards request:', { query, location, sources, limit });

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const allJobs: JobBoardJob[] = [];
    const selectedSources = sources || ['jsearch', 'adzuna'];
    const jobLimit = limit || 10;

    // Fetch from multiple sources
    const fetchPromises = [];
    
    if (selectedSources.includes('jsearch')) {
      fetchPromises.push(fetchJSearchJobs(query, location || '', Math.ceil(jobLimit / selectedSources.length)));
    }
    
    if (selectedSources.includes('adzuna')) {
      fetchPromises.push(fetchAdzunaJobs(query, location || '', Math.ceil(jobLimit / selectedSources.length)));
    }

    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allJobs.push(...result.value);
      } else {
        console.error(`Failed to fetch from source ${selectedSources[index]}:`, result.reason);
      }
    });

    console.log(`Total jobs fetched: ${allJobs.length}`);

    // Insert jobs into database
    const insertData = allJobs.map(job => ({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      category: job.category,
      listing_url: job.listing_url,
      requirements: job.requirements,
      benefits: job.benefits,
      is_active: true,
      is_featured: false,
      status: 'active'
    }));

    let insertedCount = 0;
    if (insertData.length > 0) {
      const { data, error } = await supabase
        .from('jobs')
        .insert(insertData)
        .select();

      if (error) {
        console.error('Database insert error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to save jobs to database', details: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      insertedCount = data?.length || 0;
      console.log(`Successfully inserted ${insertedCount} jobs`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        jobsFetched: allJobs.length,
        jobsInserted: insertedCount,
        sources: selectedSources 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-job-boards function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});