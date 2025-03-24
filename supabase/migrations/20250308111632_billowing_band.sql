/*
  # Create Admin User Migration
  
  1. Changes
    - Create admin user with proper role and permissions
    - Set up admin metadata and role
    - Ensure proper authentication setup
    
  2. Security
    - Uses secure password hashing
    - Sets appropriate role and permissions
    - Maintains data integrity
*/

-- Create the admin user with proper role
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Create the user in auth.users if it doesn't exist
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
        updated_at,
        confirmation_token,
        email_change_token_new,
        recovery_token
    )
    SELECT
        '00000000-0000-0000-0000-000000000000'::uuid,
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'homeofplayadmin@homeofplay.com',
        crypt('X#grpgWH&S6Fun', gen_salt('bf')),
        NOW(),
        '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
        '{}'::jsonb,
        NOW(),
        NOW(),
        '',
        '',
        ''
    WHERE NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'homeofplayadmin@homeofplay.com'
    )
    RETURNING id INTO admin_user_id;

    -- Create the user profile if the user was created
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.user_profiles (
            id,
            email,
            full_name,
            created_at,
            updated_at
        )
        VALUES (
            admin_user_id,
            'homeofplayadmin@homeofplay.com',
            'Home of Play Admin',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;
END;
$$;

-- Execute the function
SELECT create_admin_user();

-- Clean up
DROP FUNCTION create_admin_user();
