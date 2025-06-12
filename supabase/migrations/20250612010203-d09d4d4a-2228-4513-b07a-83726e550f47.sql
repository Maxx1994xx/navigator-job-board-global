
-- Create a table for admin users
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert a default admin user (password will be hashed version of 'admin123')
-- Using bcrypt hash for password 'admin123'
INSERT INTO public.admin_users (username, password_hash, email, full_name) 
VALUES ('admin', '$2b$10$rQZ9j/8mYV.BqU4OzGDjdOK9lK.1yV8qhK5hF6aWFdmqwE2K8GJyC', 'admin@company.com', 'System Administrator');

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access (only authenticated users can access)
CREATE POLICY "Authenticated users can access admin_users" 
  ON public.admin_users 
  FOR ALL 
  USING (true);

-- Create a function to verify admin credentials
CREATE OR REPLACE FUNCTION public.verify_admin_credentials(p_username TEXT, p_password TEXT)
RETURNS TABLE(admin_id UUID, username TEXT, email TEXT, full_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.username, a.email, a.full_name
  FROM public.admin_users a
  WHERE a.username = p_username 
    AND a.password_hash = crypt(p_password, a.password_hash);
END;
$$;
