/*
  # Inventory Management System Updates
  
  1. New Tables
    - `inventory_logs`: Track all inventory changes
    - `return_requests`: Track sales returns
    - `toy_deletion_logs`: Track toy deletions
  
  2. Changes
    - Add return_date and admin_id to rentals table
    - Add return tracking columns to order_items
  
  3. Security
    - Enable RLS on new tables
    - Add admin-only policies
*/

-- Add return tracking columns to rentals table
ALTER TABLE rentals 
ADD COLUMN IF NOT EXISTS return_date timestamptz,
ADD COLUMN IF NOT EXISTS returned_by uuid REFERENCES auth.users(id);

-- Add return tracking columns to order_items
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS return_requested boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS return_reason text,
ADD COLUMN IF NOT EXISTS return_condition text,
ADD COLUMN IF NOT EXISTS return_approved_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS return_approved_at timestamptz;

-- Create inventory logs table
CREATE TABLE IF NOT EXISTS inventory_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  toy_id uuid REFERENCES toys(id) NOT NULL,
  admin_id uuid REFERENCES auth.users(id) NOT NULL,
  action text NOT NULL,
  quantity integer NOT NULL,
  previous_quantity integer NOT NULL,
  new_quantity integer NOT NULL,
  is_rental boolean NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create return requests table
CREATE TABLE IF NOT EXISTS return_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid REFERENCES order_items(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  reason text NOT NULL,
  condition text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_id uuid REFERENCES auth.users(id),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create toy deletion logs table
CREATE TABLE IF NOT EXISTS toy_deletion_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  toy_id uuid NOT NULL,
  toy_name text NOT NULL,
  admin_id uuid REFERENCES auth.users(id) NOT NULL,
  reason text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE toy_deletion_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for inventory_logs
CREATE POLICY "Admins can view all inventory logs"
  ON inventory_logs
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Only admins can insert inventory logs"
  ON inventory_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Create policies for return_requests
CREATE POLICY "Users can view their own return requests"
  ON return_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can create return requests"
  ON return_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update return requests"
  ON return_requests
  FOR UPDATE
  TO authenticated
  USING (is_admin());

-- Create policies for toy_deletion_logs
CREATE POLICY "Only admins can view deletion logs"
  ON toy_deletion_logs
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Only admins can insert deletion logs"
  ON toy_deletion_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Create function to check if rental can be returned
CREATE OR REPLACE FUNCTION can_return_rental(rental_id uuid, admin_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if rental exists and is not already returned
  RETURN EXISTS (
    SELECT 1 
    FROM rentals r
    JOIN auth.users u ON u.id = admin_id
    WHERE r.id = rental_id 
    AND r.returned = false
    AND (
      u.raw_app_meta_data->>'role' = 'admin'
      OR u.raw_app_meta_data->>'role' = 'super_admin'
    )
  );
END;
$$;

-- Create function to process rental return
CREATE OR REPLACE FUNCTION process_rental_return(
  rental_id uuid,
  admin_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_toy_id uuid;
  v_current_stock integer;
BEGIN
  -- Get toy_id and verify rental can be returned
  SELECT toy_id INTO v_toy_id
  FROM rentals
  WHERE id = rental_id AND returned = false;
  
  IF v_toy_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Start transaction
  BEGIN
    -- Mark rental as returned
    UPDATE rentals
    SET returned = true,
        return_date = now(),
        returned_by = admin_id
    WHERE id = rental_id;
    
    -- Update toy rental stock
    UPDATE toys
    SET rental_stock = rental_stock + 1
    WHERE id = v_toy_id
    RETURNING rental_stock INTO v_current_stock;
    
    -- Log inventory change
    INSERT INTO inventory_logs (
      toy_id,
      admin_id,
      action,
      quantity,
      previous_quantity,
      new_quantity,
      is_rental,
      notes
    )
    VALUES (
      v_toy_id,
      admin_id,
      'rental_return',
      1,
      v_current_stock - 1,
      v_current_stock,
      true,
      'Rental item returned'
    );
    
    RETURN true;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN false;
  END;
END;
$$;

-- Create function to process sale return
CREATE OR REPLACE FUNCTION process_sale_return(
  order_item_id uuid,
  admin_id uuid,
  return_reason text,
  item_condition text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_toy_id uuid;
  v_current_stock integer;
BEGIN
  -- Get toy_id and verify order item exists
  SELECT toy_id INTO v_toy_id
  FROM order_items
  WHERE id = order_item_id AND return_requested = true;
  
  IF v_toy_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Start transaction
  BEGIN
    -- Update order item
    UPDATE order_items
    SET return_approved_by = admin_id,
        return_approved_at = now(),
        return_reason = return_reason,
        return_condition = item_condition
    WHERE id = order_item_id;
    
    -- Update toy stock
    UPDATE toys
    SET stock = stock + 1
    WHERE id = v_toy_id
    RETURNING stock INTO v_current_stock;
    
    -- Log inventory change
    INSERT INTO inventory_logs (
      toy_id,
      admin_id,
      action,
      quantity,
      previous_quantity,
      new_quantity,
      is_rental,
      notes
    )
    VALUES (
      v_toy_id,
      admin_id,
      'sale_return',
      1,
      v_current_stock - 1,
      v_current_stock,
      false,
      'Sale item returned: ' || return_reason
    );
    
    RETURN true;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN false;
  END;
END;
$$;

-- Create function to delete toy
CREATE OR REPLACE FUNCTION delete_toy(
  toy_id uuid,
  admin_id uuid,
  reason text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_toy_name text;
  v_toy_data jsonb;
BEGIN
  -- Get toy data before deletion
  SELECT 
    name,
    jsonb_build_object(
      'name', name,
      'description', description,
      'price', price,
      'rental_price', rental_price,
      'stock', stock,
      'rental_stock', rental_stock,
      'category', category,
      'age_range', age_range
    ) INTO v_toy_name, v_toy_data
  FROM toys
  WHERE id = toy_id;
  
  IF v_toy_name IS NULL THEN
    RETURN false;
  END IF;
  
  -- Start transaction
  BEGIN
    -- Mark all rentals as returned
    UPDATE rentals
    SET returned = true,
        return_date = now(),
        returned_by = admin_id
    WHERE toy_id = toy_id AND returned = false;
    
    -- Delete cart items
    DELETE FROM cart_items
    WHERE toy_id = toy_id;
    
    -- Delete wishlist items
    DELETE FROM wishlists
    WHERE toy_id = toy_id;
    
    -- Log deletion
    INSERT INTO toy_deletion_logs (
      toy_id,
      toy_name,
      admin_id,
      reason,
      metadata
    )
    VALUES (
      toy_id,
      v_toy_name,
      admin_id,
      reason,
      v_toy_data
    );
    
    -- Delete toy
    DELETE FROM toys
    WHERE id = toy_id;
    
    RETURN true;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN false;
  END;
END;
$$;
