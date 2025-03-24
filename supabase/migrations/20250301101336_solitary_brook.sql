-- First, delete any orders associated with the user
DELETE FROM public.order_items
WHERE order_id IN (
  SELECT id FROM public.orders
  WHERE user_id = (
    SELECT id FROM auth.users
    WHERE email = 'anthonymayes1991@gmail.com'
  )
);

-- Then delete the orders themselves
DELETE FROM public.orders
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'anthonymayes1991@gmail.com'
);

-- Delete any rentals associated with the user
DELETE FROM public.rentals
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'anthonymayes1991@gmail.com'
);

-- Delete any cart items associated with the user
DELETE FROM public.cart_items
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'anthonymayes1991@gmail.com'
);

-- Delete any wishlist items associated with the user
DELETE FROM public.wishlists
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'anthonymayes1991@gmail.com'
);

-- Delete user from user_profiles (to maintain referential integrity)
DELETE FROM public.user_profiles 
WHERE email = 'anthonymayes1991@gmail.com';

-- Finally, delete the user from auth.users
DELETE FROM auth.users 
WHERE email = 'anthonymayes1991@gmail.com';

-- Output confirmation message
DO $$
BEGIN
  RAISE NOTICE 'User anthonymayes1991@gmail.com has been deleted';
END
$$;
