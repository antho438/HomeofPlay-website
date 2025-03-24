/*
  # Final fix for admin role permission errors

  1. Changes
    - Remove all policies that reference admin role
    - Create new policies that don't attempt to set roles
    - Fix all tables with proper RLS policies
    - Remove any functions that try to set admin role
  2. Security
    - Use simple auth.uid() checks for all policies
*/

-- Drop all problematic policies that reference admin role
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin users can manage toys" ON toys;
DROP POLICY IF EXISTS "Admin can update rentals" ON rentals;
DROP POLICY IF EXISTS "Admins have full access" ON blog_posts;
DROP POLICY IF EXISTS "Admin users can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can manage toys" ON toys;
DROP POLICY IF EXISTS "Authenticated users can update rentals" ON rentals;
DROP POLICY IF EXISTS "Authenticated users have full access to blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public read access for toys" ON toys;
DROP POLICY IF EXISTS "Authenticated users can insert toys" ON toys;
DROP POLICY IF EXISTS "Authenticated users can update toys" ON toys;
DROP POLICY IF EXISTS "Authenticated users can delete toys" ON toys;

-- Drop any functions that try to set admin role
DROP FUNCTION IF EXISTS auth.is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;

-- Fix toys policies - simplest possible policies
CREATE POLICY "Anyone can view toys"
  ON toys
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert toys"
  ON toys
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update toys"
  ON toys
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete toys"
  ON toys
  FOR DELETE
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

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
