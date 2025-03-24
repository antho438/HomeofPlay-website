/*
  # Fix rental policies

  1. Security Updates
    - Update policies for rentals table
    - Remove admin role references from policies
    - Ensure authenticated users can view their own rentals
  2. Changes
    - Update existing policies to use simpler auth checks
*/

-- Drop existing policies that reference admin role
DROP POLICY IF EXISTS "Admin can update rentals" ON rentals;
DROP POLICY IF EXISTS "Users can view own rentals" ON rentals;

-- Create new policies with simpler auth checks
CREATE POLICY "Users can view their own rentals"
  ON rentals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update rentals"
  ON rentals
  FOR UPDATE
  USING (auth.uid() = user_id);
