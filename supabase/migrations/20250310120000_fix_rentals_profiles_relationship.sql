/*
  # Fix relationship between rentals and profiles tables

  1. Add foreign key constraint from rentals to profiles
  2. Ensure proper relationship naming for Supabase
*/

-- Add user_id column if it doesn't exist
ALTER TABLE rentals
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES profiles(id) ON DELETE CASCADE;

-- Update the schema cache
NOTIFY pgrst, 'reload schema';

-- Add comment
COMMENT ON COLUMN rentals.user_id IS 'References the user who created this rental';
