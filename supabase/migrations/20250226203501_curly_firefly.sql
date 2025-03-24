/*
  # Fix user profile permissions

  1. Security Updates
    - Fix policies for user_profiles table
    - Ensure authenticated users can create their own profiles
    - Remove admin role references from policies
  2. Changes
    - Update existing policies to use simpler auth checks
    - Add insert policy for user_profiles
*/

-- Drop existing policies that reference admin role
DROP POLICY IF EXISTS "Admin users can view all profiles" ON user_profiles;

-- Update existing policies to use simpler auth checks
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Add insert policy for user_profiles
CREATE POLICY "Users can create their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
