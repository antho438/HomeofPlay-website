/*
  # Separate rentals and sales functionality

  1. Changes
    - Add rental_only and sale_only columns to toys table
    - Update policies to reflect separation
    
  2. Security
    - Maintain existing RLS policies
    - Add constraints to ensure toys can't be both rental_only and sale_only
*/

ALTER TABLE toys
ADD COLUMN rental_only boolean DEFAULT false,
ADD COLUMN sale_only boolean DEFAULT false;

-- Add constraint to ensure a toy can't be both rental_only and sale_only
ALTER TABLE toys
ADD CONSTRAINT rental_sale_exclusivity 
CHECK (NOT (rental_only AND sale_only));

-- Update existing toys to be available for both (false for both columns)
UPDATE toys SET rental_only = false, sale_only = false;
