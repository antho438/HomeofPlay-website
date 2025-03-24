/*
  # Fix admin role permissions

  1. Changes
    - Removes policies that try to set the admin role
    - Updates policies to check for admin role in app_metadata instead
    - Fixes permission issues with cart_items and wishlists tables
*/

-- Drop problematic policies that try to set admin role
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin users can manage toys" ON toys;
DROP POLICY IF EXISTS "Admin can update rentals" ON rentals;
DROP POLICY IF EXISTS "Admins have full access" ON blog_posts;

-- Create new policies that check for admin role in app_metadata
CREATE POLICY "Admin can view all profiles" 
  ON user_profiles
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin users can manage toys"
  ON toys FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin can update rentals"
  ON rentals
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins have full access to blog posts"
  ON blog_posts
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Fix cart_items policies
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
CREATE POLICY "Users can view their own cart items"
  ON cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

-- Fix wishlists policies
DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlists;
CREATE POLICY "Users can view their own wishlist"
  ON wishlists
  FOR SELECT
  USING (auth.uid() = user_id);

-- Remove any functions that try to set admin role
DROP FUNCTION IF EXISTS auth.is_admin();

-- Create a safer function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'role' = 'admin' OR 
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
