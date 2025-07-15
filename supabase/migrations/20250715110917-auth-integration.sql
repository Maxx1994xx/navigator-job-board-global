-- Drop the existing verify_admin_credentials function
DROP FUNCTION IF EXISTS public.verify_admin_credentials(text, text);

-- Drop existing RLS policy on admin_users
DROP POLICY IF EXISTS "Authenticated users can access admin_users" ON public.admin_users;

-- Alter admin_users table to link to auth.users
-- First, ensure the id column is of type uuid and can be updated
ALTER TABLE public.admin_users
ALTER COLUMN id SET DATA TYPE uuid USING (id::uuid);

-- Add a foreign key constraint to auth.users.id
-- This assumes that admin_users will now be created directly in auth.users
-- and their UUID will be used as the ID in admin_users table.
ALTER TABLE public.admin_users
ADD CONSTRAINT admin_users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create new RLS policy for admin_users
-- Admins can view and manage their own profile based on auth.uid()
CREATE POLICY "Admins can view and manage their own profile" 
ON public.admin_users 
FOR ALL 
USING (id = auth.uid());

-- Update the blogs table's created_by foreign key to reference auth.users(id)
-- First, drop the existing foreign key constraint if it exists
ALTER TABLE public.blogs DROP CONSTRAINT IF EXISTS blogs_created_by_fkey;

-- Then, add the new foreign key constraint referencing auth.users(id)
ALTER TABLE public.blogs
ADD CONSTRAINT blogs_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update the RLS policy for blogs to reflect the new authentication scheme
-- The existing policy "Admins can manage all blogs" already uses auth.uid()
-- but it needs to be re-evaluated in the context of auth.users being the source of admin IDs.
-- No change needed for this policy itself, as it correctly references auth.uid().
-- However, ensure that the admin_users table is populated with users from auth.users
-- who have the appropriate role or are otherwise designated as admins.

-- For now, we assume that any user in auth.users that also has an entry in admin_users
-- is considered an admin. The RLS policy on blogs will then correctly apply.

-- Note: Actual migration of existing admin_users to auth.users will need to be done manually
-- or via a separate script, as this SQL only sets up the schema for future use.
-- For example, you would create a user in Supabase Auth, then insert their UUID into admin_users.

-- Example of how to insert an admin user into auth.users and then link to admin_users table:
-- INSERT INTO auth.users (id, email, password) VALUES (gen_random_uuid(), 'new_admin@example.com', 'hashed_password');
-- INSERT INTO public.admin_users (id, username, email, full_name) VALUES ('<UUID_FROM_ABOVE>', 'new_admin_username', 'new_admin@example.com', 'New Admin User');


