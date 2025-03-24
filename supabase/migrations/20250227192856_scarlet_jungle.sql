/*
  # Fix permission issues with cart and wishlist

  1. Changes
    - Simplifies RLS policies to avoid role-based checks
    - Ensures all authenticated users can access their own data
*/

-- Drop any problematic policies
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlists;

-- Create simpler policies for cart_items
CREATE POLICY "Users can view their own cart items"
  ON cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create simpler policies for wishlists
CREATE POLICY "Users can view their own wishlist"
  ON wishlists
  FOR SELECT
  USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure RLS is enabled
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Add policies for other operations if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cart_items' AND policyname = 'Users can insert their own cart items'
  ) THEN
    CREATE POLICY "Users can insert their own cart items"
      ON cart_items
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cart_items' AND policyname = 'Users can update their own cart items'
  ) THEN
    CREATE POLICY "Users can update their own cart items"
      ON cart_items
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cart_items' AND policyname = 'Users can delete their own cart items'
  ) THEN
    CREATE POLICY "Users can delete their own cart items"
      ON cart_items
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'wishlists' AND policyname = 'Users can add to their own wishlist'
  ) THEN
    CREATE POLICY "Users can add to their own wishlist"
      ON wishlists
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'wishlists' AND policyname = 'Users can remove from their own wishlist'
  ) THEN
    CREATE POLICY "Users can remove from their own wishlist"
      ON wishlists
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;
