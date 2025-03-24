-- Create a super admin user with a secure password
DO $$
DECLARE
  super_admin_id uuid;
BEGIN
  -- Check if the super admin already exists
  SELECT id INTO super_admin_id FROM auth.users WHERE email = 'superadmin@homeofplay.com';
  
  -- If super admin doesn't exist, create it
  IF super_admin_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'superadmin@homeofplay.com',
      crypt('SuperAdmin123!', gen_salt('bf')),
      now(),
      now(),
      '{"provider":"email","providers":["email"],"role":"super_admin"}',
      '{"name":"Super Admin"}',
      now(),
      now()
    )
    RETURNING id INTO super_admin_id;
    
    -- Create a user profile for the super admin
    INSERT INTO public.user_profiles (
      id,
      email,
      full_name,
      created_at,
      updated_at
    )
    VALUES (
      super_admin_id,
      'superadmin@homeofplay.com',
      'Super Admin',
      now(),
      now()
    );
    
    RAISE NOTICE 'Super Admin created with ID: %', super_admin_id;
  ELSE
    -- Update existing super admin to ensure it has the correct role
    UPDATE auth.users
    SET 
      raw_app_meta_data = raw_app_meta_data || '{"role":"super_admin"}'::jsonb,
      updated_at = now()
    WHERE id = super_admin_id;
    
    RAISE NOTICE 'Existing Super Admin updated with ID: %', super_admin_id;
  END IF;
END
$$;

-- Create a function to check if a user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'super_admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies for super admin to access all tables
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    -- Check if policy already exists
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = table_name 
      AND policyname = 'Super admin has full access to ' || table_name
    ) THEN
      EXECUTE format('
        CREATE POLICY "Super admin has full access to %1$s" 
        ON %1$s FOR ALL 
        USING (public.is_super_admin()) 
        WITH CHECK (public.is_super_admin())', 
        table_name
      );
      RAISE NOTICE 'Created super admin policy for table: %', table_name;
    END IF;
  END LOOP;
END
$$;

-- Grant super admin access to storage
DO $$
BEGIN
  -- Check if policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Super admin has full access to storage'
  ) THEN
    CREATE POLICY "Super admin has full access to storage"
      ON storage.objects FOR ALL
      USING (public.is_super_admin())
      WITH CHECK (public.is_super_admin());
    RAISE NOTICE 'Created super admin policy for storage.objects';
  END IF;
END
$$;

-- Output the super admin credentials (for reference only)
DO $$
BEGIN
  RAISE NOTICE 'Super Admin credentials:';
  RAISE NOTICE 'Email: superadmin@homeofplay.com';
  RAISE NOTICE 'Password: SuperAdmin123!';
  RAISE NOTICE 'Please change this password after first login!';
END
$$;
