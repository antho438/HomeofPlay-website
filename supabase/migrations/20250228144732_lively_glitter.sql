/*
  # Add storage bucket for toy images

  1. New Storage
    - Create a new storage bucket for toy images
  2. Security
    - Enable RLS on the bucket
    - Add policies for authenticated users to upload and view images
*/

-- Create a new storage bucket for toy images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for the bucket
CREATE POLICY "Allow public access to images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated users to update their own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'images' AND
    auth.uid() = owner
  );

CREATE POLICY "Allow authenticated users to delete their own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid() = owner
  );
