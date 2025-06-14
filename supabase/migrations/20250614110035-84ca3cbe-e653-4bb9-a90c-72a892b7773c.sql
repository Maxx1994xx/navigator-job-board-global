
-- Warning: This policy lets ANYONE insert, update, and delete jobs. For production, restrict further!
-- Allow anyone (anon, authenticated) to do anything with jobs.
CREATE POLICY "Anyone can insert jobs"
  ON public.jobs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update jobs"
  ON public.jobs
  FOR UPDATE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can delete jobs"
  ON public.jobs
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- (Optional) If you wish to later tighten this, we can help you configure proper authentication and secure your panel.
