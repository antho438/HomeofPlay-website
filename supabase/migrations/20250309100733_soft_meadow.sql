/*
  # Add Return Requests System

  1. New Tables
    - `return_requests`
      - `id` (uuid, primary key)
      - `order_item_id` (uuid, references order_items)
      - `user_id` (uuid, references users)
      - `reason` (text)
      - `condition` (text)
      - `status` (text)
      - `admin_id` (uuid, references users, nullable)
      - `processed_at` (timestamptz, nullable)
      - `created_at` (timestamptz)

  2. Changes
    - Add `return_requested` column to order_items table
    - Add `return_reason` column to order_items table
    - Add `return_condition` column to order_items table
    - Add `return_approved_by` column to order_items table
    - Add `return_approved_at` column to order_items table

  3. Security
    - Enable RLS on return_requests table
    - Add policies for users to create and view their own return requests
    - Add policies for admins to manage all return requests
*/

-- Create return_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS return_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES order_items(id),
  user_id uuid NOT NULL REFERENCES users(id),
  reason text NOT NULL,
  condition text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_id uuid REFERENCES users(id),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Add return-related columns to order_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'order_items' AND column_name = 'return_requested'
  ) THEN
    ALTER TABLE order_items ADD COLUMN return_requested boolean DEFAULT false;
    ALTER TABLE order_items ADD COLUMN return_reason text;
    ALTER TABLE order_items ADD COLUMN return_condition text;
    ALTER TABLE order_items ADD COLUMN return_approved_by uuid REFERENCES users(id);
    ALTER TABLE order_items ADD COLUMN return_approved_at timestamptz;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can create return requests" ON return_requests;
  DROP POLICY IF EXISTS "Users can view their own return requests" ON return_requests;
  DROP POLICY IF EXISTS "Admins can view all return requests" ON return_requests;
  DROP POLICY IF EXISTS "Admins can update return requests" ON return_requests;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies
CREATE POLICY "Users can create return requests"
  ON return_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own return requests"
  ON return_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all return requests"
  ON return_requests
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update return requests"
  ON return_requests
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Add foreign key constraint for admin_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'return_requests_admin_id_fkey'
  ) THEN
    ALTER TABLE return_requests
      ADD CONSTRAINT return_requests_admin_id_fkey
      FOREIGN KEY (admin_id) REFERENCES users(id);
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_return_requests_user_id'
  ) THEN
    CREATE INDEX idx_return_requests_user_id ON return_requests(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_return_requests_order_item_id'
  ) THEN
    CREATE INDEX idx_return_requests_order_item_id ON return_requests(order_item_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_return_requests_status'
  ) THEN
    CREATE INDEX idx_return_requests_status ON return_requests(status);
  END IF;
END $$;
