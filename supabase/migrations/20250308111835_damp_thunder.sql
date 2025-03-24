/*
  # Admin Schema and Permissions Setup
  
  1. Changes
    - Create admin role and permissions
    - Set up necessary schema access
    - Configure authentication policies
    
  2. Security
    - Proper role-based access control
    - Secure authentication policies
    - Data access restrictions
*/

-- Enable RLS
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
DROP POLICY IF EXISTS admin_users_policy ON auth.users;
CREATE POLICY admin_users_policy ON auth.users 
FOR ALL 
TO authenticated 
USING (
  auth.jwt()->>'email' = 'homeofplayadmin@homeofplay.com' OR
  auth.jwt()->>'email' = 'admin@toyrental.com' OR
  auth.jwt()->'app_metadata'->>'role' = 'admin' OR
  auth.jwt()->'app_metadata'->>'role' = 'super_admin'
);

-- Ensure admin role has necessary permissions
DO $$
BEGIN
  -- Update app_metadata for admin user if exists
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || 
    jsonb_build_object(
      'role', 'admin',
      'is_admin', true
    )
  WHERE email = 'homeofplayadmin@homeofplay.com';

  -- Grant necessary schema permissions
  GRANT USAGE ON SCHEMA public TO authenticated;
  GRANT USAGE ON SCHEMA auth TO authenticated;
  
  -- Grant access to necessary sequences
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
  
  -- Grant table permissions
  GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
END $$;

-- Create or update admin-specific functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(
      current_setting('request.jwt.claims', true)::jsonb->>'email' = 'homeofplayadmin@homeofplay.com' OR
      current_setting('request.jwt.claims', true)::jsonb->>'email' = 'admin@toyrental.com' OR
      current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'role' = 'admin' OR
      current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'role' = 'super_admin',
      false
    );
$$;

-- Update existing RLS policies to use the new admin function
DO $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    -- Drop existing policy if it exists
    EXECUTE format('DROP POLICY IF EXISTS admin_all_access_policy ON public.%I', table_record.tablename);
    
    -- Create new policy
    EXECUTE format('
      CREATE POLICY admin_all_access_policy 
      ON public.%I 
      FOR ALL 
      TO authenticated 
      USING (is_admin())
      WITH CHECK (is_admin())', 
      table_record.tablename
    );
  END LOOP;
END $$;
