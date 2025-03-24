/*
  # Add order_item_id to rentals table

  1. Changes
    - Add order_item_id column to rentals table
    - Add foreign key constraint to order_items table
    - Add return_requested column for tracking return status
    - Add index on order_item_id for better query performance

  2. Security
    - No changes to RLS policies needed
*/

-- Add order_item_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'rentals' AND column_name = 'order_item_id'
  ) THEN
    ALTER TABLE rentals ADD COLUMN order_item_id uuid REFERENCES order_items(id);
    CREATE INDEX idx_rentals_order_item_id ON rentals(order_item_id);
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
