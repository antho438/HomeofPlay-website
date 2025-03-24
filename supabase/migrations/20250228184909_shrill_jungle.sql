/*
  # Make anthonymayes1991@gmail.com a super admin

  1. Changes
     - Updates the user with email anthonymayes1991@gmail.com to have super_admin role
     - Sets the appropriate app_metadata for the user
*/

-- Update the user to have super_admin role
UPDATE auth.users
SET 
  raw_app_meta_data = 
    CASE 
      WHEN raw_app_meta_data IS NULL THEN 
        jsonb_build_object('role', 'super_admin')
      ELSE 
        raw_app_meta_data || jsonb_build_object('role', 'super_admin')
    END
WHERE email = 'anthonymayes1991@gmail.com';

-- Output confirmation message
DO $$
BEGIN
  RAISE NOTICE 'User anthonymayes1991@gmail.com has been granted super_admin role';
END
$$;
