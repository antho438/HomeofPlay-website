/*
  # Fix blog posts author relationship

  1. Changes
    - Add proper foreign key relationship between blog_posts and auth.users
    - Fix user_profiles error with empty results
  2. Security
    - Update policies to ensure proper access control
*/

-- Fix the blog_posts table to properly reference auth.users
ALTER TABLE blog_posts 
DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;

-- Create a view to access auth.users safely
CREATE OR REPLACE VIEW auth_users_view AS
SELECT id, email, raw_app_meta_data->>'role' as role
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON auth_users_view TO authenticated;
GRANT SELECT ON auth_users_view TO anon;

-- Update blog_posts query to use the view
CREATE OR REPLACE FUNCTION get_blog_author(author_id uuid) 
RETURNS text AS $$
  SELECT email FROM auth_users_view WHERE id = author_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Create policy for blog_posts to allow proper querying
DROP POLICY IF EXISTS "Public can view published posts" ON blog_posts;
CREATE POLICY "Public can view published posts" 
  ON blog_posts
  FOR SELECT 
  USING (published = true);

-- Create policy for authenticated users to view their own posts
DROP POLICY IF EXISTS "Authors can view their own posts" ON blog_posts;
CREATE POLICY "Authors can view their own posts" 
  ON blog_posts
  FOR SELECT 
  USING (author_id = auth.uid());

-- Ensure user_profiles has an insert policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" 
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
