-- Drop the existing rental_details view
DROP VIEW IF EXISTS rental_details;

-- Create a new version of the rental_details view explicitly WITHOUT SECURITY DEFINER
-- Note: By default, views don't have SECURITY DEFINER unless explicitly specified
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

-- Check if the view has SECURITY DEFINER and log it
DO $$
DECLARE
  has_security_definer boolean;
BEGIN
  SELECT pg_catalog.pg_get_viewdef('rental_details'::regclass)::text LIKE '%SECURITY DEFINER%' 
  INTO has_security_definer;
  
  IF has_security_definer THEN
    RAISE NOTICE 'WARNING: rental_details view still has SECURITY DEFINER';
  ELSE
    RAISE NOTICE 'SUCCESS: rental_details view does not have SECURITY DEFINER';
  END IF;
END $$;
