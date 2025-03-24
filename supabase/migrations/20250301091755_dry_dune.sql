-- Create a simple function to document security recommendations
-- Using a minimal approach with proper search_path setting
CREATE OR REPLACE FUNCTION public.security_best_practices()
RETURNS text AS $$
  SELECT 'Configure short-lived authentication tokens (30 minutes recommended)';
$$ LANGUAGE sql IMMUTABLE SET search_path = public;

-- Add comment to the function
COMMENT ON FUNCTION public.security_best_practices() IS 'Documentation for auth token security';

-- Create a function to document password security recommendations
CREATE OR REPLACE FUNCTION public.password_security_recommendations()
RETURNS text AS $$
  SELECT 'Enable compromised password checks against HaveIBeenPwned.org database';
$$ LANGUAGE sql IMMUTABLE SET search_path = public;

-- Add comment to the function
COMMENT ON FUNCTION public.password_security_recommendations() IS 'Documentation for password security features';
