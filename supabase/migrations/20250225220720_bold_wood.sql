/*
  # Fix admin role and RLS policies

  1. Changes
    - Drop existing policies
    - Create new RLS policies with proper admin access
    - Update admin role permissions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view toys" ON toys;
DROP POLICY IF EXISTS "Only admins can modify toys" ON toys;
DROP POLICY IF EXISTS "Users can view their own rentals" ON rentals;
DROP POLICY IF EXISTS "Users can create their own rentals" ON rentals;
DROP POLICY IF EXISTS "Only admins can update rentals" ON rentals;

-- Create new policies for toys
CREATE POLICY "Public read access for toys" ON toys
  FOR SELECT USING (true);

CREATE POLICY "Admin full access for toys" ON toys
  FOR ALL USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Create new policies for rentals
CREATE POLICY "Users can view own rentals" ON rentals
  FOR SELECT USING (
    auth.uid() = user_id OR
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can create own rentals" ON rentals
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Admin can update rentals" ON rentals
  FOR UPDATE USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Grant access to the view
GRANT SELECT ON rental_details TO authenticated;
GRANT SELECT ON rental_details TO anon;

-- Ensure admin role has proper permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;

-- Update admin role permissions
DO $$
BEGIN
  -- Ensure admin role exists
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated;
  END IF;

  -- Grant necessary permissions
  GRANT USAGE ON SCHEMA public TO authenticated;
  GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
END $$;
