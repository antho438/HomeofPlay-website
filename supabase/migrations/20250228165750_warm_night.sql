-- Fix the permission denied to set role "admin" errors by creating simpler policies
-- that don't try to check for admin roles

-- Drop any problematic policies that try to set admin role
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin users can manage toys" ON toys;
DROP POLICY IF EXISTS "Admin can update rentals" ON rentals;
DROP POLICY IF EXISTS "Admins have full access" ON blog_posts;
DROP POLICY IF EXISTS "Admin users can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can manage toys" ON toys;
DROP POLICY IF EXISTS "Authenticated users can update rentals" ON rentals;
DROP POLICY IF EXISTS "Authenticated users have full access to blog posts" ON blog_posts;

-- Drop any functions that try to set admin role
DROP FUNCTION IF EXISTS auth.is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;

-- Fix the rentals view issue by creating a proper view that doesn't try to join with auth.users directly
DROP VIEW IF EXISTS rental_details;

-- Create a view for user emails that doesn't try to access auth.users directly
CREATE OR REPLACE VIEW user_emails AS
SELECT id, email FROM auth.users;

-- Create a new rental_details view that uses the user_emails view
CREATE OR REPLACE VIEW rental_details AS
SELECT 
  r.id,
  r.toy_id,
  r.user_id,
  r.start_date,
  r.end_date,
  r.returned,
  r.created_at,
  r.updated_at,
  t.name as toy_name,
  u.email as user_email
FROM rentals r
JOIN toys t ON r.toy_id = t.id
JOIN user_emails u ON r.user_id = u.id;

-- Grant access to the views
GRANT SELECT ON rental_details TO authenticated;
GRANT SELECT ON user_emails TO authenticated;

-- Fix toys policies - simplest possible policies
DROP POLICY IF EXISTS "Anyone can view toys" ON toys;
CREATE POLICY "Anyone can view toys"
  ON toys
  FOR SELECT
  USING (true);

-- Fix rentals policies
DROP POLICY IF EXISTS "Users can view their own rentals" ON rentals;
DROP POLICY IF EXISTS "Users can create their own rentals" ON rentals;
DROP POLICY IF EXISTS "Users can update their own rentals" ON rentals;

CREATE POLICY "Users can view their own rentals"
  ON rentals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rentals"
  ON rentals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rentals"
  ON rentals
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Fix blog_posts policies
DROP POLICY IF EXISTS "Public can view published posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can view their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can insert their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can update their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can delete their own posts" ON blog_posts;

CREATE POLICY "Public can view published posts"
  ON blog_posts
  FOR SELECT
  USING (published = true);

CREATE POLICY "Authors can view their own posts"
  ON blog_posts
  FOR SELECT
  USING (author_id = auth.uid());

CREATE POLICY "Authors can insert their own posts"
  ON blog_posts
  FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their own posts"
  ON blog_posts
  FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their own posts"
  ON blog_posts
  FOR DELETE
  USING (author_id = auth.uid());

-- Fix user_profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Fix cart_items policies
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;

CREATE POLICY "Users can view their own cart items"
  ON cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
  ON cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON cart_items
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON cart_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Fix wishlists policies
DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can add to their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can remove from their own wishlist" ON wishlists;

CREATE POLICY "Users can view their own wishlist"
  ON wishlists
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist"
  ON wishlists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist"
  ON wishlists
  FOR DELETE
  USING (auth.uid() = user_id);

-- Fix storage bucket policies
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can insert images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Public storage access" ON storage.objects;
DROP POLICY IF EXISTS "Public storage insert" ON storage.objects;
DROP POLICY IF EXISTS "Public storage update" ON storage.objects;
DROP POLICY IF EXISTS "Public storage delete" ON storage.objects;

-- Create simpler policies for storage
CREATE POLICY "Public storage access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Public storage insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public storage update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'images');

CREATE POLICY "Public storage delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images');

-- Make sure the images bucket exists
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('images', 'images', true);
  END IF;
END $$;

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant necessary permissions for storage
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO authenticated;
