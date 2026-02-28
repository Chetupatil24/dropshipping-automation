-- SUPABASE SCHEMA FOR FOREVER-FREE DROPSHIPPING ECOMMERCE PLATFORM

-- 1. Customers Table
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cj_sku VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    cloudinary_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    cj_order_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    tracking VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS (Row Level Security) Policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);

-- Allow authenticated users to view only their own orders and details
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING ((select auth.uid()) = customer_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK ((select auth.uid()) = customer_id);

CREATE POLICY "Users can view own customer profile" ON customers FOR SELECT USING ((select auth.uid()) = id);
CREATE POLICY "Users can update own customer profile" ON customers FOR UPDATE USING ((select auth.uid()) = id);
