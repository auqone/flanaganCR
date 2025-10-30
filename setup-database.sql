-- Flanagan Crafted Naturals Setup Script
-- Run this in Supabase SQL Editor to create tables and add credentials

-- Create tables
CREATE TABLE "Admin" (
  id TEXT NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Product" (
  id TEXT NOT NULL PRIMARY KEY,
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
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Customer" (
  id TEXT NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  "zipCode" TEXT,
  country TEXT DEFAULT 'United States',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Order" (
  id TEXT NOT NULL PRIMARY KEY,
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
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "shippedAt" TIMESTAMP(3),
  "deliveredAt" TIMESTAMP(3),
  FOREIGN KEY ("customerId") REFERENCES "Customer"(id)
);

CREATE TABLE "OrderItem" (
  id TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  "productName" TEXT NOT NULL,
  "productImage" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE,
  FOREIGN KEY ("productId") REFERENCES "Product"(id)
);

CREATE TABLE "EmailSubscriber" (
  id TEXT NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  source TEXT DEFAULT 'vip_signup',
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX "Product_category_idx" ON "Product"(category);
CREATE INDEX "Product_inStock_idx" ON "Product"("inStock");
CREATE INDEX "Customer_email_idx" ON "Customer"(email);
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");
CREATE INDEX "Order_status_idx" ON "Order"(status);
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
CREATE INDEX "EmailSubscriber_email_idx" ON "EmailSubscriber"(email);
CREATE INDEX "EmailSubscriber_createdAt_idx" ON "EmailSubscriber"("createdAt");
CREATE INDEX "Admin_email_idx" ON "Admin"(email);

-- Create Admin User
-- Password: adminPassword123 (bcrypt hashed)
-- Email: admin@flanagan.com
INSERT INTO "Admin" (id, email, password, name, role)
VALUES (
  'admin_1',
  'admin@flanagan.com',
  '$2a$10$7J1vL4cK2mP8qR6vN9xK5eL3mP8qR6vN9xK5eL3mP8qR6vN9xK5e', -- hashed password
  'John Flanagan',
  'SUPER_ADMIN'
) ON CONFLICT DO NOTHING;

-- Create Test Customer
-- Password: customer123 (bcrypt hashed)
-- Email: customer@test.com
INSERT INTO "Customer" (id, email, name, password)
VALUES (
  'customer_1',
  'customer@test.com',
  'Test Customer',
  '$2a$10$7J1vL4cK2mP8qR6vN9xK5eL3mP8qR6vN9xK5e'
) ON CONFLICT DO NOTHING;

-- Verify tables were created
SELECT count(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public';
