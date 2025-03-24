/*
  # Authentication Schema Setup
  
  1. Changes
    - Set up proper schema permissions
    - Configure role-based access
    - Create admin helper functions
    - Set up authentication policies
    
  2. Security
    - Enable RLS
    - Configure secure policies
    - Set up proper role inheritance
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

-- Create helper functions
CREATE OR REPLACE FUNCTION auth.check_authenticated()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(current_setting('request.jwt.claims', true)::jsonb->>'role' = 'authenticated', false);
$$;

CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::jsonb->>'email' IN (
      'homeofplayadmin@homeofplay.com',
      'admin@toyrental.com'
    ) OR
    current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'role' IN (
      'admin',
      'super_admin'
    ),
    false
  );
$$;

-- Enable RLS
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Update auth users policy
DROP POLICY IF EXISTS auth_users_policy ON auth.users;
CREATE POLICY auth_users_policy ON auth.users
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR
  auth.is_admin()
);

-- Create function to update user metadata
CREATE OR REPLACE FUNCTION auth.ensure_admin_metadata()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.email IN ('homeofplayadmin@homeofplay.com', 'admin@toyrental.com') THEN
    NEW.raw_app_meta_data = jsonb_build_object(
      'provider', 'email',
      'providers', ARRAY['email'],
      'role', 'admin'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for metadata updates
DROP TRIGGER IF EXISTS ensure_admin_metadata ON auth.users;
CREATE TRIGGER ensure_admin_metadata
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auth.ensure_admin_metadata();

-- Insert admin users if they don't exist
DO $$
BEGIN
  -- Home of Play Admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'homeofplayadmin@homeofplay.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      role,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000'::uuid,
      'homeofplayadmin@homeofplay.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      'authenticated',
      now(),
      now(),
      '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
      '{}'::jsonb
    );
  END IF;

  -- Toy Rental Admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@toyrental.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      role,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000'::uuid,
      'admin@toyrental.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      'authenticated',
      now(),
      now(),
      '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
      '{}'::jsonb
    );
  END IF;
END;
$$;
