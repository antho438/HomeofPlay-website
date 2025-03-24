/*
  # Make User Admin

  1. Changes
    - Updates user anthonyblackburn1991@gmail.com to have admin role
    - Sets appropriate app_metadata for admin access

  2. Security
    - Grants admin privileges to specified user
*/

-- Update the user's app_metadata to include admin role
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', 'admin')
WHERE email = 'anthonyblackburn1991@gmail.com';
