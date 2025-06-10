
-- First, delete all existing profiles (this will cascade and remove auth users due to foreign key constraints)
DELETE FROM public.profiles;

-- Create a new admin user directly in the auth.users table with a known password
-- Note: This requires admin privileges and the password will be hashed automatically
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@company.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
);

-- The profile will be automatically created by the existing trigger with role 'user'
-- So we need to update it to 'admin' after creation
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@company.com';
