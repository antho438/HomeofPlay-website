/*
  # Fix admin role permissions

  1. Changes
    - Create admin role with proper inheritance
    - Grant necessary permissions to admin role
    - Create admin user with correct role assignment
*/

-- Create admin role if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'admin'
  ) THEN
    CREATE ROLE admin INHERIT;
  END IF;
END $$;

-- Grant necessary permissions to admin role
GRANT USAGE ON SCHEMA public TO admin;
GRANT ALL ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin;
GRANT ALL ON SCHEMA public TO admin;

-- Ensure admin role can access auth schema
GRANT USAGE ON SCHEMA auth TO admin;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO admin;

-- Create admin user if it doesn't exist and set role
DO $$
DECLARE
  user_id uuid;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@toyrental.com'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'admin',
      'admin@toyrental.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now()
    )
    RETURNING id INTO user_id;

    -- Set admin role in auth.users
    UPDATE auth.users
    SET role = 'admin'
    WHERE id = user_id;
  END IF;
END $$;

-- Grant admin role to postgres (superuser)
GRANT admin TO postgres;
