
-- Enable RLS on jobs table if not already enabled
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admin users to view all jobs
CREATE POLICY "Admin users can view all jobs" 
ON public.jobs 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  )
);

-- Create policy to allow admin users to insert jobs
CREATE POLICY "Admin users can insert jobs" 
ON public.jobs 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  )
);

-- Create policy to allow admin users to update jobs
CREATE POLICY "Admin users can update jobs" 
ON public.jobs 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  )
);

-- Create policy to allow admin users to delete jobs
CREATE POLICY "Admin users can delete jobs" 
ON public.jobs 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()
  )
);

-- Also create a policy to allow public access to view active jobs (for the main website)
CREATE POLICY "Public can view active jobs" 
ON public.jobs 
FOR SELECT 
TO anon, authenticated 
USING (status = 'active' AND is_active = true);
