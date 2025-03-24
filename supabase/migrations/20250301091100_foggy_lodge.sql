-- Create a function to document security recommendations for authentication
CREATE OR REPLACE FUNCTION public.check_auth_token_expiry()
RETURNS text AS $$
BEGIN
  RETURN 'This function exists to document that token expiry should be set to 30 minutes or less';
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add comment to the function
COMMENT ON FUNCTION public.check_auth_token_expiry() IS 'Reminder function: OTP and password reset tokens should expire in less than 1 hour (recommended: 30 minutes)';
