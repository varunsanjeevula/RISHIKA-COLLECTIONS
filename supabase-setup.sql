-- ============================================
-- RISHIKA COLLECTIONS - Database Setup
-- Run this in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query
-- ============================================

-- 1. Create the products table
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL,
  image_url text,
  category text NOT NULL CHECK (category IN ('clothes', 'jewellery')),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Allow public read access (anyone can browse products)
CREATE POLICY "Allow public read access"
  ON products
  FOR SELECT
  USING (true);

-- 4. Allow authenticated insert/update/delete (for admin panel)
-- Using anon key with service role for admin operations
CREATE POLICY "Allow all operations for anon"
  ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- SEED DATA - Demo Products
-- ============================================

-- Clothes
INSERT INTO products (name, description, price, image_url, category) VALUES
(
  'Royal Silk Saree',
  'Elegant royal blue silk saree with exquisite golden border embroidery. Perfect for weddings and festive occasions.',
  2499,
  '/products/royal-silk-saree.png',
  'clothes'
),
(
  'Embroidered Anarkali Kurta',
  'Beautiful deep maroon Anarkali kurta with intricate gold threadwork. A timeless piece for special celebrations.',
  1899,
  '/products/anarkali-kurta.png',
  'clothes'
),
(
  'Banarasi Wedding Lehenga',
  'Stunning red and gold Banarasi wedding lehenga with heavy embroidery and luxurious dupatta. The perfect bridal ensemble.',
  8999,
  '/products/wedding-lehenga.png',
  'clothes'
),
(
  'Designer Palazzo Set',
  'Trendy teal green palazzo kurta set with gold embroidery and matching dupatta. Indo-western elegance at its finest.',
  1499,
  '/products/palazzo-set.png',
  'clothes'
),
(
  'Cotton Printed Kurti',
  'Vibrant yellow cotton kurti with beautiful blue floral block print. Comfortable and stylish for everyday wear.',
  799,
  '/products/cotton-kurti.png',
  'clothes'
);

-- Jewellery
INSERT INTO products (name, description, price, image_url, category) VALUES
(
  'Kundan Necklace Set',
  'Gorgeous Kundan necklace set with matching earrings. Traditional bridal jewellery with red and green stones set in gold.',
  3499,
  '/products/kundan-necklace.png',
  'jewellery'
),
(
  'Gold Plated Jhumka Earrings',
  'Beautiful gold-plated traditional jhumka earrings with delicate pearl drops and intricate filigree work.',
  899,
  '/products/jhumka-earrings.png',
  'jewellery'
),
(
  'Pearl Choker Set',
  'Elegant multi-strand pearl choker necklace set with matching earrings. Timeless sophistication with gold accents.',
  2199,
  '/products/pearl-choker.png',
  'jewellery'
);
