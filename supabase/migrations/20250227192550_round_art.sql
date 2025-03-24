/*
  # Remove admin@toyrental.com user

  1. Changes
    - Removes the admin@toyrental.com user from the auth.users table
*/

-- Delete the admin user
DELETE FROM auth.users 
WHERE email = 'admin@toyrental.com';
