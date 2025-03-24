/*
  # Fix authentication policies

  1. Security Updates
    - Create secure function for admin role checking
    - Update admin role metadata
  2. Changes
    - Add proper role handling in auth schema
*/

-- Create a secure function to check if a user is an admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (
        role = 'admin' OR
        raw_app_meta_data->>'role' = 'admin'
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the admin role is properly set for existing admin users
DO $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = 
    CASE 
      WHEN raw_app_meta_data IS NULL THEN 
        jsonb_build_object('role', 'admin')
      ELSE 
        raw_app_meta_data || jsonb_build_object('role', 'admin')
    END
  WHERE role = 'admin';
END $$;

-- Create policy for admin users to view profiles (only if the table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'user_profiles'
  ) THEN
    DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
    
    EXECUTE 'CREATE POLICY "Admin can view all profiles" ON user_profiles FOR SELECT USING (auth.is_admin())';
  END IF;
END $$;
