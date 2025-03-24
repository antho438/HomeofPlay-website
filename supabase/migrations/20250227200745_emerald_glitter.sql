/*
  # Add educational flag to blog posts

  1. New Columns
    - `is_educational` (boolean) - Flag to identify educational blog posts
  
  2. Changes
    - Adds a new column to the blog_posts table
    - Sets default value to false
*/

-- Add is_educational flag to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_educational BOOLEAN DEFAULT false;

-- Since we can't reference the category column (it doesn't exist),
-- we'll just set all existing posts to non-educational by default.
-- Admins can manually update the flag for educational posts later.
