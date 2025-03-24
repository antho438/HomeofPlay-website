/*
  # Create wishlist functionality

  1. New Tables
    - `wishlists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `toy_id` (uuid, references toys)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `wishlists` table
    - Add policies for users to manage their own wishlist items
*/

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  toy_id uuid REFERENCES toys(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, toy_id)
);

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own wishlist"
  ON wishlists
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist"
  ON wishlists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist"
  ON wishlists
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add toy metadata columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'toys' AND column_name = 'category'
  ) THEN
    ALTER TABLE toys ADD COLUMN category text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'toys' AND column_name = 'age_range'
  ) THEN
    ALTER TABLE toys ADD COLUMN age_range text;
  END IF;
END $$;
