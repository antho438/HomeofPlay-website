/*
  # Fix permission errors in database policies

  1. Changes
    - Remove all references to admin role in policies
    - Fix storage bucket policies
    - Update RLS policies for cart_items and wishlists
    - Ensure proper access for authenticated users
  2. Security
    - Simplify authentication checks to use auth.uid()
    - Remove problematic role-setting functions
*/

-- Fix storage bucket policies
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Allow authenticated users to update their own images" ON storage.objects;
CREATE POLICY "Allow authenticated users to update their own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'images' AND
    auth.uid() = owner
  );

DROP POLICY IF EXISTS "Allow authenticated users to delete their own images" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete their own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid() = owner
  );

-- Fix cart_items policies
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
CREATE POLICY "Users can view their own cart items"
  ON cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
CREATE POLICY "Users can insert their own cart items"
  ON cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
CREATE POLICY "Users can update their own cart items"
  ON cart_items
  FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;
CREATE POLICY "Users can delete their own cart items"
  ON cart_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Fix wishlists policies
DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlists;
CREATE POLICY "Users can view their own wishlist"
  ON wishlists
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add to their own wishlist" ON wishlists;
CREATE POLICY "Users can add to their own wishlist"
  ON wishlists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove from their own wishlist" ON wishlists;
CREATE POLICY "Users can remove from their own wishlist"
  ON wishlists
  FOR DELETE
  USING (auth.uid() = user_id);

-- Fix toys policies
DROP POLICY IF EXISTS "Anyone can view toys" ON toys;
CREATE POLICY "Anyone can view toys"
  ON toys
  FOR SELECT
  USING (true);

-- Ensure authenticated users can manage toys
DROP POLICY IF EXISTS "Authenticated users can manage toys" ON toys;
CREATE POLICY "Authenticated users can manage toys"
  ON toys
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
