/*
  # Delete superadmin user

  1. Changes
     - Removes the superadmin@homeofplay.com user from the auth.users table
     - Removes the corresponding user profile from user_profiles table
*/

-- Delete the superadmin user from user_profiles first (to maintain referential integrity)
DELETE FROM public.user_profiles 
WHERE email = 'superadmin@homeofplay.com';

-- Delete the superadmin user from auth.users
DELETE FROM auth.users 
WHERE email = 'superadmin@homeofplay.com';
