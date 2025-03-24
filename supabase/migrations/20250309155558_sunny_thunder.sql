/*
  # Add delete_toy_with_cleanup function

  1. New Function
    - Adds a secure RPC function for deleting toys with proper cleanup
    - Handles all related records (rentals, cart items, wishlist items)
    - Creates deletion log
    - Requires admin authentication

  2. Security
    - Function can only be executed by authenticated users with admin role
    - Handles all dependencies in a transaction
    - Uses SECURITY DEFINER for elevated privileges
*/

-- Drop existing function if it exists (with all possible parameter combinations)
DROP FUNCTION IF EXISTS public.delete_toy(uuid, uuid);
DROP FUNCTION IF EXISTS public.delete_toy(toy_id uuid, admin_id uuid);

-- Create the new function with a more specific name
CREATE OR REPLACE FUNCTION public.delete_toy_with_cleanup(
  p_toy_id uuid,
  p_admin_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_toy_name text;
BEGIN
  -- Verify admin status
  IF NOT (
    EXISTS (
      SELECT 1 
      FROM auth.users u 
      WHERE u.id = p_admin_id 
      AND (
        u.raw_app_meta_data->>'role' = 'admin' 
        OR u.raw_app_meta_data->>'role' = 'super_admin'
      )
    )
  ) THEN
    RAISE EXCEPTION 'Only administrators can delete toys';
  END IF;

  -- Get toy name for logging
  SELECT name INTO v_toy_name
  FROM toys
  WHERE id = p_toy_id;

  IF v_toy_name IS NULL THEN
    RAISE EXCEPTION 'Toy not found';
  END IF;

  -- Perform all operations in a transaction
  BEGIN
    -- Mark all rentals as returned
    UPDATE rentals
    SET 
      returned = true,
      returned_by = p_admin_id,
      return_date = CURRENT_TIMESTAMP
    WHERE toy_id = p_toy_id;

    -- Delete wishlist items
    DELETE FROM wishlists 
    WHERE toy_id = p_toy_id;

    -- Delete cart items
    DELETE FROM cart_items 
    WHERE toy_id = p_toy_id;

    -- Create deletion log
    INSERT INTO toy_deletion_logs (
      toy_id,
      toy_name,
      admin_id,
      metadata
    ) VALUES (
      p_toy_id,
      v_toy_name,
      p_admin_id,
      jsonb_build_object(
        'deleted_at', CURRENT_TIMESTAMP,
        'deleted_by', p_admin_id,
        'had_active_rentals', EXISTS (
          SELECT 1 
          FROM rentals 
          WHERE toy_id = p_toy_id 
          AND returned = false
        )
      )
    );

    -- Delete the toy
    DELETE FROM toys 
    WHERE id = p_toy_id;

    RETURN true;
  EXCEPTION 
    WHEN others THEN
      -- Log the error in the deletion logs
      INSERT INTO toy_deletion_logs (
        toy_id,
        toy_name,
        admin_id,
        metadata
      ) VALUES (
        p_toy_id,
        v_toy_name,
        p_admin_id,
        jsonb_build_object(
          'error', SQLERRM,
          'error_detail', SQLSTATE,
          'attempted_at', CURRENT_TIMESTAMP
        )
      );
      RAISE;
  END;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_toy_with_cleanup(uuid, uuid) TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.delete_toy_with_cleanup IS 'Securely delete a toy and handle all related records with proper cleanup and logging';
