/*
  # Fix order_items RLS policy

  1. Changes
     - Add insert policy for order_items table to allow users to insert their own order items
     - This fixes the 403 error when checking out
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;

-- Create policy for order_items to allow insertion
CREATE POLICY "Users can insert their own order items"
  ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
