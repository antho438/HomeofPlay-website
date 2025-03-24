/*
  Update toy deletion constraints and add cleanup procedures
*/

-- Remove the existing foreign key constraint
ALTER TABLE rentals DROP CONSTRAINT IF EXISTS fk_rentals_toys;

-- Add new foreign key with ON DELETE CASCADE
ALTER TABLE rentals
ADD CONSTRAINT fk_rentals_toys
FOREIGN KEY (toy_id) 
REFERENCES toys(id)
ON DELETE CASCADE;

-- Drop existing function with explicit signature
DROP FUNCTION IF EXISTS delete_toy_with_cleanup(uuid);

-- Create a function to handle toy deletion with cleanup
CREATE OR REPLACE FUNCTION delete_toy_with_cleanup(p_toy_id uuid) RETURNS void AS $$
DECLARE
  v_toy_name text;
BEGIN
  -- Get toy name for logging
  SELECT name INTO v_toy_name FROM toys WHERE id = p_toy_id;

  -- Mark all active rentals as returned
  UPDATE rentals
  SET returned = true
  WHERE toy_id = p_toy_id AND returned = false;

  -- Delete wishlist items
  DELETE FROM wishlists WHERE toy_id = p_toy_id;

  -- Delete cart items
  DELETE FROM cart_items WHERE toy_id = p_toy_id;

  -- Create deletion log
  INSERT INTO toy_deletion_logs (toy_id, toy_name, admin_id, deleted_at)
  SELECT p_toy_id, v_toy_name, auth.uid(), now()
  FROM auth.users
  WHERE id = auth.uid();

  -- Finally delete the toy
  DELETE FROM toys WHERE id = p_toy_id;
END;
$$ LANGUAGE plpgsql;

-- Update RLS policy for deletion function
ALTER FUNCTION delete_toy_with_cleanup(uuid) SECURITY DEFINER;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow admins to delete toys" ON toys;

-- Create policy to allow admins to delete toys
CREATE POLICY "Allow admins to delete toys" ON toys
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin'
  );
