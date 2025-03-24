/*
  Add RLS policies for rentals and toys tables
*/

-- Allow admins to access rentals
CREATE POLICY "Allow admins to access rentals" ON rentals
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Allow admins to access toys
CREATE POLICY "Allow admins to access toys" ON toys
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
