-- Fix the function security issue by setting search_path
CREATE OR REPLACE FUNCTION public.update_ads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;