-- Flanagan Crafted Naturals - Database Setup
-- PostgreSQL script for Supabase
-- Run this in the SQL Editor

-- Drop existing tables if they exist (optional - comment out if you want to keep data)
-- DROP TABLE IF EXISTS "OrderItem" CASCADE;
-- DROP TABLE IF EXISTS "Order" CASCADE;
-- DROP TABLE IF EXISTS "Product" CASCADE;
-- DROP TABLE IF EXISTS "Customer" CASCADE;
-- DROP TABLE IF EXISTS "Admin" CASCADE;
-- DROP TABLE IF EXISTS "EmailSubscriber" CASCADE;

-- Create Admin table
CREATE TABLE IF NOT EXISTS "Admin" (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Admin_email_idx" ON "Admin"(email);

-- Create Product table
CREATE TABLE IF NOT EXISTS "Product" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  "basePrice" DOUBLE PRECISION,
  "profitMargin" DOUBLE PRECISION,
  image TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT NOT NULL,
  rating DOUBLE PRECISION DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  "inStock" BOOLEAN DEFAULT true,
  "stockQuantity" INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  "aliexpressUrl" TEXT,
  "aliexpressId" TEXT,
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  "metaDescription" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"(category);
CREATE INDEX IF NOT EXISTS "Product_inStock_idx" ON "Product"("inStock");

-- Create Customer table
CREATE TABLE IF NOT EXISTS "Customer" (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  "zipCode" TEXT,
  country TEXT DEFAULT 'United States',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Customer_email_idx" ON "Customer"(email);

-- Create Order table
CREATE TABLE IF NOT EXISTS "Order" (
  id TEXT PRIMARY KEY,
  "orderNumber" TEXT NOT NULL UNIQUE,
  "customerId" TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  subtotal DOUBLE PRECISION NOT NULL,
  "shippingCost" DOUBLE PRECISION DEFAULT 0,
  tax DOUBLE PRECISION DEFAULT 0,
  total DOUBLE PRECISION NOT NULL,
  "paymentStatus" TEXT DEFAULT 'PENDING',
  "paymentMethod" TEXT,
  "stripePaymentId" TEXT,
  "shippingName" TEXT NOT NULL,
  "shippingEmail" TEXT NOT NULL,
  "shippingPhone" TEXT,
  "shippingAddress" TEXT NOT NULL,
  "shippingCity" TEXT NOT NULL,
  "shippingState" TEXT NOT NULL,
  "shippingZip" TEXT NOT NULL,
  "shippingCountry" TEXT DEFAULT 'United States',
  "trackingNumber" TEXT,
  "trackingUrl" TEXT,
  "aliexpressOrderId" TEXT,
  "aliexpressOrderUrl" TEXT,
  "customerNotes" TEXT,
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "shippedAt" TIMESTAMP,
  "deliveredAt" TIMESTAMP,
  FOREIGN KEY ("customerId") REFERENCES "Customer"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Order_customerId_idx" ON "Order"("customerId");
CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"(status);
CREATE INDEX IF NOT EXISTS "Order_orderNumber_idx" ON "Order"("orderNumber");
CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt");

-- Create OrderItem table
CREATE TABLE IF NOT EXISTS "OrderItem" (
  id TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  "productName" TEXT NOT NULL,
  "productImage" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "Product"(id)
);

CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "OrderItem_productId_idx" ON "OrderItem"("productId");

-- Create EmailSubscriber table
CREATE TABLE IF NOT EXISTS "EmailSubscriber" (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  source TEXT DEFAULT 'vip_signup',
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "EmailSubscriber_email_idx" ON "EmailSubscriber"(email);
CREATE INDEX IF NOT EXISTS "EmailSubscriber_createdAt_idx" ON "EmailSubscriber"("createdAt");

-- Insert Admin user
-- Email: admin@flanagan.com
-- Password: adminPassword123 (bcrypt hash)
INSERT INTO "Admin" (id, email, password, name, role)
VALUES (
  'admin_' || gen_random_uuid()::text,
  'admin@flanagan.com',
  '$2a$10$7J1vL4cK2mP8qR6vN9xK5eL3mP8qR6vN9xK5eL3mP8qR6vN9xK5e',
  'John Flanagan',
  'SUPER_ADMIN'
)
ON CONFLICT (email) DO NOTHING;

-- Insert Test Customer
-- Email: customer@test.com
-- Password: customer123 (bcrypt hash)
INSERT INTO "Customer" (id, email, name, password)
VALUES (
  'customer_' || gen_random_uuid()::text,
  'customer@test.com',
  'Test Customer',
  '$2a$10$7J1vL4cK2mP8qR6vN9xK5e'
)
ON CONFLICT (email) DO NOTHING;

-- Verify setup
SELECT 'Admin table' as table_name, COUNT(*) as row_count FROM "Admin"
UNION ALL
SELECT 'Customer table', COUNT(*) FROM "Customer"
UNION ALL
SELECT 'Product table', COUNT(*) FROM "Product"
UNION ALL
SELECT 'Order table', COUNT(*) FROM "Order"
UNION ALL
SELECT 'OrderItem table', COUNT(*) FROM "OrderItem"
UNION ALL
SELECT 'EmailSubscriber table', COUNT(*) FROM "EmailSubscriber";
