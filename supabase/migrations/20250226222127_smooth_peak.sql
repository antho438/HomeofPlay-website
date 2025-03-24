/*
  # Add MFA support

  1. Changes
    - Add a function to check if MFA is enabled for a user
    - Add a function to get MFA status for a user
    - Add a policy to allow users to manage their MFA settings
*/

-- Create a function to check if MFA is enabled for a user
CREATE OR REPLACE FUNCTION auth.is_mfa_enabled(user_id uuid DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.mfa_factors
    WHERE user_id = $1 AND status = 'verified'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get MFA status for a user
CREATE OR REPLACE FUNCTION auth.get_mfa_status(user_id uuid DEFAULT auth.uid())
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'enabled', EXISTS (
      SELECT 1 FROM auth.mfa_factors
      WHERE user_id = $1 AND status = 'verified'
    ),
    'factors', (
      SELECT jsonb_agg(jsonb_build_object(
        'id', id,
        'type', factor_type,
        'status', status,
        'created_at', created_at
      ))
      FROM auth.mfa_factors
      WHERE user_id = $1
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the functions
GRANT EXECUTE ON FUNCTION auth.is_mfa_enabled TO authenticated;
GRANT EXECUTE ON FUNCTION auth.get_mfa_status TO authenticated;
