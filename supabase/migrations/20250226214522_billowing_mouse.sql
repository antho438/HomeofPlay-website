/*
  # Add cart and orders tables

  1. New Tables
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `toy_id` (uuid, references toys)
      - `quantity` (integer)
      - `is_rental` (boolean)
      - `rental_start_date` (date, nullable)
      - `rental_end_date` (date, nullable)
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `total_amount` (decimal)
      - `status` (text)
      - `billing_name` (text)
      - `billing_email` (text)
      - `billing_phone` (text)
      - `billing_address` (text)
      - `payment_intent_id` (text, nullable)
      - `created_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `toy_id` (uuid, references toys)
      - `quantity` (integer)
      - `price` (decimal)
      - `is_rental` (boolean)
      - `rental_start_date` (date, nullable)
      - `rental_end_date` (date, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  toy_id uuid REFERENCES toys(id) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  is_rental boolean NOT NULL DEFAULT false,
  rental_start_date date,
  rental_end_date date,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_rental_dates CHECK (
    (is_rental = false) OR 
    (is_rental = true AND rental_start_date IS NOT NULL AND rental_end_date IS NOT NULL AND rental_end_date >= rental_start_date)
  )
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  status text NOT NULL,
  billing_name text NOT NULL,
  billing_email text NOT NULL,
  billing_phone text,
  billing_address text,
  payment_intent_id text,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  toy_id uuid REFERENCES toys(id) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price decimal(10,2) NOT NULL,
  is_rental boolean NOT NULL DEFAULT false,
  rental_start_date date,
  rental_end_date date,
  CONSTRAINT valid_rental_dates CHECK (
    (is_rental = false) OR 
    (is_rental = true AND rental_start_date IS NOT NULL AND rental_end_date IS NOT NULL AND rental_end_date >= rental_start_date)
  )
);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for cart_items
CREATE POLICY "Users can view their own cart items"
  ON cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
  ON cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON cart_items
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON cart_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for order_items
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Add indexes for performance
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
