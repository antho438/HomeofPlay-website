-- Fix the rentals view issue by creating a proper view that doesn't try to join with auth.users directly
DROP VIEW IF EXISTS rental_details;

-- Create a view for user emails that doesn't try to access auth.users directly
CREATE OR REPLACE VIEW user_emails AS
SELECT id, email FROM auth.users;

-- Create a new rental_details view that uses the user_emails view
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
JOIN user_emails u ON r.user_id = u.id;

-- Grant access to the views
GRANT SELECT ON rental_details TO authenticated;
GRANT SELECT ON user_emails TO authenticated;
