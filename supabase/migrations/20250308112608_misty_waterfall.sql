/*
  # Add New Admin User
  
  1. Changes
    - Add anthonyblackburn1991@gmail.com as an admin user
    - Update admin helper function to include new admin email
    
  2. Security
    - Maintain existing security policies
    - Update admin check function
*/

-- Update the is_admin function to include the new admin email
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::jsonb->>'email' IN (
      'homeofplayadmin@homeofplay.com',
      'admin@toyrental.com',
      'anthonyblackburn1991@gmail.com'
    ) OR
    current_setting('request.jwt.claims', true)::jsonb->'app_metadata'->>'role' IN (
      'admin',
      'super_admin'
    ),
    false
  );
$$;

-- Update the ensure_admin_metadata function to include the new admin email
CREATE OR REPLACE FUNCTION auth.ensure_admin_metadata()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.email IN ('homeofplayadmin@homeofplay.com', 'admin@toyrental.com', 'anthonyblackburn1991@gmail.com') THEN
    NEW.raw_app_meta_data = jsonb_build_object(
      'provider', 'email',
      'providers', jsonb_build_array('email'),
      'role', 'admin'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Update existing user if they exist
DO $$
BEGIN
  -- Update existing user's metadata if they exist
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_build_object(
    'provider', COALESCE(raw_app_meta_data->>'provider', 'email'),
    'providers', jsonb_build_array('email'),
    'role', 'admin'
  )
  WHERE email = 'anthonyblackburn1991@gmail.com';
END;
$$;
