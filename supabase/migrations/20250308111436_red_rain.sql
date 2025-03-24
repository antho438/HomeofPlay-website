/*
  # Create Admin Account Migration

  1. Changes
    - Create function to safely create admin user profile
    - Add admin user profile if auth user exists
    - Add appropriate error handling
    
  2. Security
    - Checks for existing user before creating profile
    - Uses proper foreign key constraints
    - Maintains data integrity
*/

-- Create a function to safely create the admin profile
CREATE OR REPLACE FUNCTION create_admin_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Check if the admin user exists in auth.users
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'homeofplayadmin@homeofplay.com'
    LIMIT 1;

    -- Only create profile if user exists and profile doesn't
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.user_profiles (id, email, full_name)
        VALUES (
            admin_user_id,
            'homeofplayadmin@homeofplay.com',
            'Home of Play Admin'
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;
END;
$$;

-- Execute the function
SELECT create_admin_profile();

-- Clean up
DROP FUNCTION create_admin_profile();

-- Note: The actual user account must be created through the Auth UI first,
-- then this migration will safely create the corresponding profile
