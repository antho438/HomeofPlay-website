/*
  # Make anthonyblackburn1991@gmail.com an admin user

  1. Changes
    - Updates the user with email anthonyblackburn1991@gmail.com to have admin role
    - Sets the appropriate app_metadata for admin privileges
*/

-- Update the user to have admin role
UPDATE auth.users
SET 
  role = 'admin',
  raw_app_meta_data = 
    CASE 
      WHEN raw_app_meta_data IS NULL THEN 
        jsonb_build_object('role', 'admin')
      ELSE 
        raw_app_meta_data || jsonb_build_object('role', 'admin')
    END
WHERE email = 'anthonyblackburn1991@gmail.com';

-- If the user doesn't exist yet, this will have no effect
-- The user needs to sign up first through the application
