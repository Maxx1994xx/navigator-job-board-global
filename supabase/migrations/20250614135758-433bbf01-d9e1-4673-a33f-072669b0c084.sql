
-- Add a currency column to jobs table for manual currency selection
ALTER TABLE public.jobs
ADD COLUMN currency text;

-- If you want to require currency for every job, you could run:
-- ALTER TABLE public.jobs ALTER COLUMN currency SET NOT NULL;
