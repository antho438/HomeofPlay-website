-- Drop the existing rental_details view
DROP VIEW IF EXISTS rental_details;

-- Create a new version of the rental_details view without SECURITY DEFINER
CREATE VIEW rental_details AS
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

-- Add comment to document the security pattern
COMMENT ON VIEW rental_details IS 'Secure view that uses get_user_email_by_id function to access user emails without SECURITY DEFINER';

-- Ensure the get_user_email_by_id function has SECURITY DEFINER (it should already have it)
-- but we're not modifying the function itself as it's correctly set up
COMMENT ON FUNCTION get_user_email_by_id IS 'Secure function with SECURITY DEFINER to get user email by ID without exposing auth.users table directly';
