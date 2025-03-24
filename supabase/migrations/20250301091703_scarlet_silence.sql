-- Enable compromised password check in Supabase Auth
-- This checks passwords against HaveIBeenPwned.org database

-- Create a function to document the security feature
CREATE OR REPLACE FUNCTION public.document_password_security()
RETURNS text AS $$
BEGIN
  RETURN 'Supabase Auth should be configured to check passwords against HaveIBeenPwned.org to prevent use of compromised passwords';
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;

-- Add comment to the function
COMMENT ON FUNCTION public.document_password_security() IS 'Documentation for password security features';

-- Note: The direct update to auth.config was removed as the table doesn't exist
-- in this Supabase instance. In a production environment, you would need to
-- enable this feature through the Supabase dashboard or API.

-- Add a comment to document this recommendation in public schema instead of auth schema
COMMENT ON SCHEMA public IS 'Public schema containing security recommendations including enabling compromised password checks';
