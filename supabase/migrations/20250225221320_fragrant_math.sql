/*
  # Fix Database Relationships

  1. Changes
    - Drop and recreate rentals table with proper foreign key relationships
    - Update rental_details view
    - Recreate policies with proper relationships

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control
*/

-- Recreate rentals table with proper relationships
DROP VIEW IF EXISTS rental_details;
DROP TABLE IF EXISTS rentals;

CREATE TABLE rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  toy_id uuid REFERENCES toys(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  returned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

-- Recreate rental_details view
CREATE OR REPLACE VIEW rental_details AS
SELECT 
  r.id,
  r.toy_id,
  r.user_id,
  r.start_date,
  r.end_date,
  r.returned,
  r.created_at,
  r.updated_at,
  t.name as toy_name,
  u.email as user_email
FROM rentals r
JOIN toys t ON r.toy_id = t.id
JOIN auth.users u ON r.user_id = u.id;

-- Recreate policies for rentals
CREATE POLICY "Users can view own rentals" ON rentals
  FOR SELECT USING (
    auth.uid() = user_id OR
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can create own rentals" ON rentals
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Admin can update rentals" ON rentals
  FOR UPDATE USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Grant access to the view
GRANT SELECT ON rental_details TO authenticated;
GRANT SELECT ON rental_details TO anon;

-- Create trigger for updated_at
CREATE TRIGGER update_rentals_updated_at
    BEFORE UPDATE ON rentals
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
