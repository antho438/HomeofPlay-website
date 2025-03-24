-- Create a function to document security recommendations for OTP expiry
CREATE OR REPLACE FUNCTION public.auth_security_recommendations()
RETURNS text AS $$
BEGIN
  RETURN 'Security recommendation: OTP and password reset tokens should expire in less than 1 hour (recommended: 30 minutes)';
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add comment to the function
COMMENT ON FUNCTION public.auth_security_recommendations() IS 'Documentation function for auth security best practices';
