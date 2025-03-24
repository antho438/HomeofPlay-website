/*
  # Create Gallery System Tables

  1. New Tables
    - `gallery_images`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `image_url` (text, required)
      - `order` (integer, required)
      - `comments` (text, optional)
      - `tags` (text[], optional)
      - `file_size` (integer, required)
      - `file_type` (text, required)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `gallery_images` table
    - Add policies for admin access
    - Add function to update updated_at timestamp

  3. Changes
    - Drop existing gallery_images table if exists
    - Create new gallery_images table with enhanced schema
    - Add necessary indexes and triggers
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS gallery_images;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
$BODY$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

-- Create new gallery_images table
CREATE TABLE gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  "order" integer NOT NULL,
  comments text,
  tags text[],
  file_size integer NOT NULL,
  file_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images ("order");
CREATE INDEX IF NOT EXISTS idx_gallery_images_tags ON gallery_images USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON gallery_images (created_at);

-- Create updated_at trigger
CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Only admins can insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Only admins can update gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Only admins can delete gallery images" ON gallery_images;

-- Create new policies
CREATE POLICY "Admins can view all gallery images"
  ON gallery_images
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Only admins can insert gallery images"
  ON gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update gallery images"
  ON gallery_images
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete gallery images"
  ON gallery_images
  FOR DELETE
  TO authenticated
  USING (is_admin());
