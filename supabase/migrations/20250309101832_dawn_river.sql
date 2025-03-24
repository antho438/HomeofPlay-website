/*
  # Add order_item_id to rentals table

  1. Changes
    - Add order_item_id column to rentals table
    - Add foreign key constraint to order_items table
    - Add index for faster queries

  2. Purpose
    - Link rentals to their corresponding order items
    - Enable proper return request tracking
    - Improve query performance
*/

-- Add order_item_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rentals' AND column_name = 'order_item_id'
  ) THEN
    ALTER TABLE rentals ADD COLUMN order_item_id uuid REFERENCES order_items(id);
    
    -- Create index for faster lookups
    CREATE INDEX IF NOT EXISTS idx_rentals_order_item_id ON rentals(order_item_id);
  END IF;
END $$;

-- Add return_requested column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rentals' AND column_name = 'return_requested'
  ) THEN
    ALTER TABLE rentals ADD COLUMN return_requested boolean DEFAULT false;
  END IF;
END $$;
