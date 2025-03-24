-- Add a simple constant function that doesn't require complex processing
-- with explicit search_path to avoid role mutable search_path
CREATE OR REPLACE FUNCTION public.get_security_recommendation()
RETURNS text AS $$
  SELECT 'Configure short-lived authentication tokens (30 minutes recommended)';
$$ LANGUAGE sql IMMUTABLE SET search_path = public;

-- Add comment to the function
COMMENT ON FUNCTION public.get_security_recommendation() IS 'Simple documentation for auth token security';
