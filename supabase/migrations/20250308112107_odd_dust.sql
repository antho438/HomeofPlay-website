/*
  # Authentication Schema Permissions Fix
  
  1. Changes
    - Grant proper schema permissions
    - Set up authentication access
    - Configure necessary roles
    
  2. Security
    - Maintain secure access control
    - Proper permission scoping
*/

-- Grant schema permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant table permissions in auth schema
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO anon, authenticated;

-- Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, anon, authenticated;

-- Ensure proper role inheritance
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, authenticated;

-- Create helper function for checking authenticated status
CREATE OR REPLACE FUNCTION auth.check_authenticated()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(current_setting('request.jwt.claims', true)::jsonb->>'role' = 'authenticated', false);
$$;

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Update auth users policy
DROP POLICY IF EXISTS auth_users_policy ON auth.users;
CREATE POLICY auth_users_policy ON auth.users
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR
  auth.jwt()->>'email' = 'homeofplayadmin@homeofplay.com' OR
  auth.jwt()->>'email' = 'admin@toyrental.com' OR
  auth.jwt()->'app_metadata'->>'role' = 'admin' OR
  auth.jwt()->'app_metadata'->>'role' = 'super_admin'
);
