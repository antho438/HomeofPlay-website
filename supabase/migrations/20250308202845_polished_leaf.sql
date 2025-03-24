/*
  # Add File Metadata to Gallery Images

  1. Changes
    - Add file_size column for tracking image sizes
    - Add file_type column for tracking image MIME types
    - Add indexes for better query performance
    - Add comments column for image metadata

  2. Security
    - Update RLS policies for gallery access
*/

-- Add new columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'gallery_images' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE gallery_images ADD COLUMN file_size integer NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'gallery_images' AND column_name = 'file_type'
  ) THEN
    ALTER TABLE gallery_images ADD COLUMN file_type text NOT NULL DEFAULT 'image/jpeg';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'gallery_images' AND column_name = 'comments'
  ) THEN
    ALTER TABLE gallery_images ADD COLUMN comments text;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON gallery_images(created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images("order");

-- Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Only admins can delete gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Only admins can insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Only admins can update gallery images" ON gallery_images;

-- Create new policies
CREATE POLICY "Admins can view all gallery images" 
ON gallery_images FOR SELECT 
TO authenticated 
USING (is_admin());

CREATE POLICY "Only admins can delete gallery images" 
ON gallery_images FOR DELETE 
TO authenticated 
USING (is_admin());

CREATE POLICY "Only admins can insert gallery images" 
ON gallery_images FOR INSERT 
TO authenticated 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update gallery images" 
ON gallery_images FOR UPDATE 
TO authenticated 
USING (is_admin());
