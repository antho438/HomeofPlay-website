/*
  # Fix toy management policies

  1. Changes
    - Update policies for toys table to allow admin users to manage toys
    - Add explicit policy for admin users to have full access
    
  2. Security
    - Maintain RLS
    - Ensure only admin users can modify toys
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for toys" ON toys;
DROP POLICY IF EXISTS "Admin full access for toys" ON toys;

-- Create new policies
CREATE POLICY "Anyone can view toys"
  ON toys FOR SELECT
  USING (true);

CREATE POLICY "Admin users can manage toys"
  ON toys FOR ALL
  USING ((SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin');
