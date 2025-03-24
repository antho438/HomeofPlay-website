-- Create a function to document MFA requirements for admin accounts
CREATE OR REPLACE FUNCTION public.admin_mfa_requirement()
RETURNS text AS $$
BEGIN
  RETURN 'All admin and superadmin accounts must use Multi-Factor Authentication (MFA)';
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;

-- Add comment to the function
COMMENT ON FUNCTION public.admin_mfa_requirement() IS 'Documentation for MFA requirements for privileged accounts';

-- Create a function to check if a user has admin or superadmin role
CREATE OR REPLACE FUNCTION public.is_privileged_user(user_id uuid)
RETURNS boolean AS $$
DECLARE
  user_role text;
BEGIN
  SELECT 
    COALESCE(
      raw_app_meta_data->>'role', 
      role
    ) INTO user_role 
  FROM auth.users 
  WHERE id = user_id;
  
  RETURN user_role IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add comment to the function
COMMENT ON FUNCTION public.is_privileged_user(uuid) IS 'Checks if a user has admin or superadmin role';

-- Create a function to check if a user has MFA enabled
CREATE OR REPLACE FUNCTION public.has_mfa_enabled(user_id uuid)
RETURNS boolean AS $$
DECLARE
  mfa_enabled boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.mfa_factors
    WHERE user_id = $1 AND status = 'verified'
  ) INTO mfa_enabled;
  
  RETURN mfa_enabled;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add comment to the function
COMMENT ON FUNCTION public.has_mfa_enabled(uuid) IS 'Checks if a user has MFA enabled';

-- Create a function to check admin MFA compliance
CREATE OR REPLACE FUNCTION public.check_admin_mfa_compliance()
RETURNS TABLE(user_id uuid, email text, is_admin boolean, has_mfa boolean, compliant boolean) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    public.is_privileged_user(u.id) AS is_admin,
    public.has_mfa_enabled(u.id) AS has_mfa,
    (NOT public.is_privileged_user(u.id) OR public.has_mfa_enabled(u.id)) AS compliant
  FROM auth.users u
  WHERE u.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add comment to the function
COMMENT ON FUNCTION public.check_admin_mfa_compliance() IS 'Reports on admin/superadmin MFA compliance status';

-- Grant execute permission on the functions to authenticated users
GRANT EXECUTE ON FUNCTION public.admin_mfa_requirement TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_privileged_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_mfa_enabled TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_admin_mfa_compliance TO authenticated;

-- Create a view to easily check admin MFA compliance
CREATE OR REPLACE VIEW public.admin_mfa_compliance AS
SELECT * FROM public.check_admin_mfa_compliance();

-- Grant access to the view
GRANT SELECT ON public.admin_mfa_compliance TO authenticated;

-- Add comment to the view
COMMENT ON VIEW public.admin_mfa_compliance IS 'View showing MFA compliance status for admin and superadmin accounts';

-- Create a trigger function to enforce MFA for admin accounts
-- Note: This is a notification trigger only, as we can't directly force MFA enrollment
CREATE OR REPLACE FUNCTION public.notify_admin_mfa_requirement()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_app_meta_data->>'role' IN ('admin', 'super_admin') OR NEW.role IN ('admin', 'super_admin') THEN
    RAISE NOTICE 'SECURITY ALERT: User % has been granted admin privileges. MFA enrollment is required.', NEW.email;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create a trigger to notify when a user is granted admin privileges
CREATE TRIGGER admin_role_granted_trigger
AFTER UPDATE OF raw_app_meta_data, role ON auth.users
FOR EACH ROW
WHEN (
  (NEW.raw_app_meta_data->>'role' IN ('admin', 'super_admin') AND 
   (OLD.raw_app_meta_data->>'role' IS NULL OR OLD.raw_app_meta_data->>'role' NOT IN ('admin', 'super_admin')))
  OR
  (NEW.role IN ('admin', 'super_admin') AND OLD.role NOT IN ('admin', 'super_admin'))
)
EXECUTE FUNCTION public.notify_admin_mfa_requirement();

-- Add comment to the trigger
COMMENT ON TRIGGER admin_role_granted_trigger ON auth.users IS 'Trigger to notify when a user is granted admin privileges and requires MFA';
