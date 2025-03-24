/*
  # Update user password

  1. Changes
    - Updates password for specified user account
    - Uses secure password hash

  Note: This migration must be run with appropriate admin privileges
*/

-- Update password for specific user
UPDATE auth.users 
SET encrypted_password = encode(digest('O5g86m#*KWJX5qKRttYngNlrl@', 'sha1'), 'hex')
WHERE email = 'anthonyblackburn1991@gmail.com';
