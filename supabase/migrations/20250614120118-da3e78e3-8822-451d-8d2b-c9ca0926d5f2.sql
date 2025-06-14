
-- Delete all existing admin users
DELETE FROM public.admin_users;

-- Create Super Admin: Abdul Moeed
INSERT INTO public.admin_users (username, full_name, email, password_hash)
VALUES (
  'admin',
  'Abdul Moeed',
  'abdul@onlinecareernavigator.com',
  crypt('Pimple1234@', gen_salt('bf'))
);

-- Create Super Admin: Sohaib
INSERT INTO public.admin_users (username, full_name, email, password_hash)
VALUES (
  'sohaib',
  'Sohaib',
  'sohaib@onlinecareernavigator.com',
  crypt('Pakistan1234@', gen_salt('bf'))
);

-- Create Super Admin: Tassawar
INSERT INTO public.admin_users (username, full_name, email, password_hash)
VALUES (
  'tassawar',
  'Tassawar',
  'tassawar@onlinecareernavigator.com',
  crypt('Pakistan1234@', gen_salt('bf'))
);
