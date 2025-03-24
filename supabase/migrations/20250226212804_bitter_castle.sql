/*
  # Change admin password

  1. Changes
    - Updates the password for the admin user (admin@toyrental.com)
    - Sets the new password to a more secure value
  2. Security
    - Uses proper password hashing with bcrypt
*/

-- Update admin user password
UPDATE auth.users
SET encrypted_password = crypt('El!b13/2017', gen_salt('bf'))
WHERE email = 'admin@toyrental.com';
