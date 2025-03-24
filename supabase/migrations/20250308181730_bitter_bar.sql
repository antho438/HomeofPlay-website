/*
  # Create Gallery Images Table

  1. New Tables
    - `gallery_images`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `order` (integer)
      - `comments` (text, nullable)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `gallery_images` table
    - Add policies for admin access
*/

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  "order" integer NOT NULL,
  comments text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images ("order");
