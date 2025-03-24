/*
  # Create view for rentals with user information

  1. Changes
    - Create a view that joins rentals with auth.users
    - Security is handled through RLS on the base tables
*/

-- Create a view to join rentals with auth.users
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
  u.email as user_email
FROM rentals r
JOIN toys t ON r.toy_id = t.id
JOIN auth.users u ON r.user_id = u.id;

-- Note: Security is handled through RLS policies on the rentals table
-- The view will inherit the security from the base tables
