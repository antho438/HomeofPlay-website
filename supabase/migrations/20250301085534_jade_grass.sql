/*
  # Fix auth_users_view security issue

  1. Security
    - Drop the potentially insecure auth_users_view
    - Create a more secure function to get user email by ID
    - Update rental_details view to use the secure function
    - Revoke unnecessary permissions
*/

-- Drop the potentially insecure view
DROP VIEW IF EXISTS auth_users_view;

-- Create a secure function to get user email by ID
CREATE OR REPLACE FUNCTION get_user_email_by_id(user_id uuid)
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT email FROM auth.users WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION get_user_email_by_id TO authenticated;

-- Update the rental_details view to use the secure function
DROP VIEW IF EXISTS rental_details;
CREATE OR REPLACE VIEW rental_details AS
SELECT 
  r.id,
  r.toy_id,
  r.user_id,
  r.start_date,
  r.end_date,
  r.returned,
  r.created_at,
  r.updated_at,
  t.name as toy_name,
  get_user_email_by_id(r.user_id) as user_email
FROM rentals r
JOIN toys t ON r.toy_id = t.id;

-- Grant access to the view
GRANT SELECT ON rental_details TO authenticated;

-- Revoke any unnecessary permissions
REVOKE ALL ON SCHEMA auth FROM public;
REVOKE ALL ON SCHEMA auth FROM anon;
REVOKE ALL ON auth.users FROM public;
REVOKE ALL ON auth.users FROM anon;
REVOKE ALL ON auth.users FROM authenticated;
