
-- Add a username field to the app_users table (must be unique, not null for all new users)
ALTER TABLE public.app_users
  ADD COLUMN username TEXT UNIQUE;

-- Optionally, fill existing users with placeholder usernames
UPDATE public.app_users SET username = CONCAT('user_', id) WHERE username IS NULL;
