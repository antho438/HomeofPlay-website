-- Sample data migration

-- Sample toys
INSERT INTO toys (name, description, price, rental_price, stock, rental_stock, image_url, category, age_range, rental_only, sale_only)
VALUES
  ('Wooden Building Blocks', 'Set of 50 natural wooden blocks in various shapes', 35.99, 5.99, 15, 10, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', 'building blocks', '3-5 years', false, false),
  
  ('Magnetic Tiles', 'Colorful magnetic building tiles for creative construction', 45.99, 7.99, 8, 12, 'https://images.unsplash.com/photo-1596460107916-430662021049?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', 'educational', '3-5 years', false, false),
  
  ('Balance Board', 'Wooden balance board for developing coordination and core strength', 29.99, 4.99, 5, 8, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', 'outdoor', '6-8 years', false, false),
  
  ('Wooden Train Set', 'Expandable wooden train set with tracks and accessories', 49.99, 8.99, 10, 6, 'https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', 'vehicles', '3-5 years', false, false),
  
  ('Sensory Play Kit', 'Collection of tactile toys for sensory development', 25.99, 4.99, 12, 15, 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', 'educational', '0-2 years', false, false),
  
  ('Wooden Puzzle Set', 'Set of 5 wooden puzzles with increasing difficulty', 32.99, 5.99, 8, 10, 'https://images.unsplash.com/photo-1551124054-0324d6279118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', 'puzzles', '3-5 years', false, false),
  
  ('Outdoor Adventure Kit', 'Kit includes binoculars, compass, and nature guide', 39.99, 6.99, 6, 8, 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', 'outdoor', '6-8 years', false, false),
  
  ('Musical Instrument Set', 'Collection of child-sized percussion instruments', 34.99, 5.99, 7, 9, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80', 'educational', '3-5 years', false, false);

-- Sample blog posts (using a DO block to handle the case where we don't have a user yet)
DO $$
DECLARE
  default_author_id uuid;
BEGIN
  -- Try to get a user ID, or use a placeholder
  SELECT id INTO default_author_id FROM auth.users LIMIT 1;
  
  IF default_author_id IS NULL THEN
    default_author_id := '00000000-0000-0000-0000-000000000000'::uuid;
  END IF;

  -- Insert blog posts
  INSERT INTO blog_posts (title, content, author_id, published, is_educational, published_at)
  VALUES
    (
      'The Benefits of Wooden Toys',
      'Wooden toys have been cherished for generations, and for good reason. Unlike their plastic counterparts, wooden toys offer numerous benefits for child development.\n\nFirst, wooden toys are incredibly durable. They can withstand rough play and are likely to last for years, making them perfect for passing down to younger siblings or even the next generation. This durability also makes them excellent candidates for our rental program.\n\nSecond, wooden toys engage children''s imagination in ways that electronic toys often don''t. Without lights, sounds, and predetermined functions, children must use their creativity to bring wooden toys to life. This open-ended play is crucial for cognitive development.\n\nFinally, wooden toys are typically more environmentally friendly. Made from renewable resources and biodegradable, they align perfectly with our commitment to sustainability.\n\nAt The Home of Play, we carefully select wooden toys that are safe, engaging, and developmentally appropriate for various age groups. Browse our collection today!',
      default_author_id,
      true,
      false,
      NOW()
    ),
    (
      'How to Choose Age-Appropriate Toys',
      'Selecting the right toys for your child''s age and developmental stage can be challenging. Here are some guidelines to help you make informed choices.\n\nFor infants (0-12 months), focus on toys that stimulate their senses. Soft toys with different textures, high-contrast patterns, and gentle sounds are perfect. Remember that babies explore with their mouths, so ensure toys are free from small parts and made from non-toxic materials.\n\nToddlers (1-3 years) are developing motor skills and independence. Push-pull toys, simple puzzles, stacking blocks, and toys that encourage movement are excellent choices. This is also a great age to introduce pretend play items like play kitchens or tool sets.\n\nPreschoolers (3-5 years) benefit from toys that foster creativity and social skills. Building blocks, art supplies, dress-up clothes, and simple board games can all support their development. This age group also enjoys more complex pretend play scenarios.\n\nSchool-age children (6+ years) are ready for more challenging activities. Construction sets, science kits, more complex games, and craft supplies can help them develop specific interests and skills.',
      default_author_id,
      true,
      true,
      NOW()
    );
END $$;
