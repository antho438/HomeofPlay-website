/*
  # Fix Rental Management and User Email Storage

  1. Changes
    - Add user_email column to rentals table
    - Add indexes for better query performance
    - Update RLS policies for proper access control

  2. Security
    - Enable RLS on rentals table
    - Add policies for admin access
    - Create admin check function
*/

-- Add email column to rentals table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'rentals' AND column_name = 'user_email'
  ) THEN
    ALTER TABLE rentals ADD COLUMN user_email text;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rentals_user_id ON rentals(user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_toy_id ON rentals(toy_id);
CREATE INDEX IF NOT EXISTS idx_rentals_user_email ON rentals(user_email);
CREATE INDEX IF NOT EXISTS idx_rentals_returned ON rentals(returned);

-- Update RLS policies
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own rentals" ON rentals;
DROP POLICY IF EXISTS "Admins can view all rentals" ON rentals;

-- Create new policies
CREATE POLICY "Users can view their own rentals" 
ON rentals FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all rentals" 
ON rentals FOR ALL 
TO authenticated 
USING (is_admin());

-- Create helper function for admin check if it doesn't exist
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE id = auth.uid()
      AND (
        raw_app_meta_data->>'role' = 'admin'
        OR raw_app_meta_data->>'role' = 'super_admin'
        OR email = 'admin@toyrental.com'
        OR email = 'homeofplayadmin@homeofplay.com'
        OR email = 'anthonyblackburn1991@gmail.com'
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
