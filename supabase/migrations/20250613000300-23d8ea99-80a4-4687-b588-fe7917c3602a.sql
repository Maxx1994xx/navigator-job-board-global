
-- First, let's ensure we have proper database structure for job management
-- Update jobs table to include admin management fields if not already present
DO $$ 
BEGIN
    -- Add created_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'created_by') THEN
        ALTER TABLE public.jobs ADD COLUMN created_by UUID REFERENCES public.admin_users(id);
    END IF;
    
    -- Add status column for better job management
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'status') THEN
        ALTER TABLE public.jobs ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft'));
    END IF;
END $$;

-- Create a comprehensive users table for admin management
CREATE TABLE IF NOT EXISTS public.app_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'employer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES public.admin_users(id)
);

-- Enable RLS for app_users
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access to app_users
CREATE POLICY "Admins can manage app_users" 
    ON public.app_users 
    FOR ALL 
    USING (true);

-- Create function to get job statistics
CREATE OR REPLACE FUNCTION public.get_job_stats()
RETURNS TABLE(
    total_jobs BIGINT,
    active_jobs BIGINT,
    draft_jobs BIGINT,
    inactive_jobs BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_jobs,
        COUNT(*) FILTER (WHERE status = 'active') as active_jobs,
        COUNT(*) FILTER (WHERE status = 'draft') as draft_jobs,
        COUNT(*) FILTER (WHERE status = 'inactive') as inactive_jobs
    FROM public.jobs;
END;
$$;

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_stats()
RETURNS TABLE(
    total_users BIGINT,
    active_users BIGINT,
    inactive_users BIGINT,
    suspended_users BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE status = 'active') as active_users,
        COUNT(*) FILTER (WHERE status = 'inactive') as inactive_users,
        COUNT(*) FILTER (WHERE status = 'suspended') as suspended_users
    FROM public.app_users;
END;
$$;

-- Insert some sample data for testing
INSERT INTO public.jobs (title, company, location, type, category, description, salary, requirements, benefits, status, is_featured)
VALUES 
    ('Senior Frontend Developer', 'TechCorp', 'San Francisco, CA', 'Full-time', 'Technology', 'We are looking for a senior frontend developer...', '$120,000 - $150,000', ARRAY['React', 'TypeScript', '5+ years experience'], ARRAY['Health insurance', 'Remote work', '401k'], 'active', true),
    ('Marketing Manager', 'StartupXYZ', 'New York, NY', 'Full-time', 'Marketing', 'Join our marketing team...', '$80,000 - $100,000', ARRAY['Marketing experience', 'MBA preferred'], ARRAY['Health insurance', 'Flexible hours'], 'active', false),
    ('Data Scientist', 'DataCorp', 'Remote', 'Full-time', 'Technology', 'Seeking a data scientist...', '$100,000 - $130,000', ARRAY['Python', 'Machine Learning', 'PhD preferred'], ARRAY['Remote work', 'Learning budget'], 'draft', false)
ON CONFLICT DO NOTHING;

INSERT INTO public.app_users (email, full_name, phone, role, status)
VALUES 
    ('john.doe@example.com', 'John Doe', '+1-555-0123', 'user', 'active'),
    ('jane.smith@example.com', 'Jane Smith', '+1-555-0124', 'employer', 'active'),
    ('bob.wilson@example.com', 'Bob Wilson', '+1-555-0125', 'user', 'inactive')
ON CONFLICT DO NOTHING;
