/*
  # Delete Specified User Accounts

  1. Overview
    Safely removes specified user accounts while preserving data integrity
    by handling all related records first.

  2. Changes
    - Delete user accounts and associated data for:
      - anthonyblackburn1991@gmail.com
      - admin@toyrental.com
      - homeofplayadmin@homeofplay.com
      - anthonymayes1991@gmail.com
      - emmabaggus2002@yahoo.co.uk

  3. Data Preservation
    - Marks rentals as returned before deletion
    - Removes all associated records in correct order to maintain referential integrity
*/

-- Get the user IDs we want to delete
CREATE TEMP TABLE users_to_delete AS
SELECT id FROM auth.users 
WHERE email IN (
  'anthonyblackburn1991@gmail.com',
  'admin@toyrental.com',
  'homeofplayadmin@homeofplay.com',
  'anthonymayes1991@gmail.com',
  'emmabaggus2002@yahoo.co.uk'
);

-- Mark all rentals as returned for these users
UPDATE rentals
SET returned = true
WHERE user_id IN (SELECT id FROM users_to_delete);

-- Delete order items first (they reference orders)
DELETE FROM order_items
WHERE order_id IN (
  SELECT id FROM orders WHERE user_id IN (SELECT id FROM users_to_delete)
);

-- Now we can delete orders
DELETE FROM orders
WHERE user_id IN (SELECT id FROM users_to_delete);

-- Delete cart items
DELETE FROM cart_items
WHERE user_id IN (SELECT id FROM users_to_delete);

-- Delete wishlist items
DELETE FROM wishlists
WHERE user_id IN (SELECT id FROM users_to_delete);

-- Delete user profiles
DELETE FROM user_profiles
WHERE id IN (SELECT id FROM users_to_delete);

-- Finally, delete the auth.users entries
DELETE FROM auth.users
WHERE id IN (SELECT id FROM users_to_delete);

-- Clean up our temporary table
DROP TABLE users_to_delete;
