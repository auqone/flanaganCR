import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create default admin user
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@sellery.com' },
    update: {},
    create: {
      email: 'admin@sellery.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`✓ Admin created: ${admin.email}`);

  // 2. Create sample products
  console.log('\nCreating products...');

  const products = [
    {
      name: "Self Heal By Design - The Role of Micro-Organisms for Health",
      price: 9.99,
      basePrice: 5.99,
      profitMargin: 40,
      image: "https://ae01.alicdn.com/kf/S1563f315a52b41c0b1268e90c9bdd973V.jpg",
      images: ["https://ae01.alicdn.com/kf/S1563f315a52b41c0b1268e90c9bdd973V.jpg"],
      category: "Health & Wellness",
      rating: 4.8,
      reviews: 25,
      description: "Discover the transformative power of micro-organisms in this groundbreaking health book by O'Neill. Learn how to harness natural healing processes and optimize your body's innate ability to repair and regenerate. Perfect for health-conscious readers interested in holistic wellness and natural healing approaches.",
      features: [
        "Comprehensive guide to micro-organism health benefits",
        "Written by health expert O'Neill",
        "English language edition",
        "Evidence-based natural healing approaches",
        "Practical wellness strategies",
      ],
      inStock: true,
      stockQuantity: 50,
      sku: "BOOK-HEAL-001",
      aliexpressUrl: "https://www.aliexpress.com/item/example1.html",
      keywords: ["health", "wellness", "micro-organisms", "natural healing", "book"],
      metaDescription: "Groundbreaking health book exploring the role of micro-organisms in natural healing and wellness.",
    },
    {
      name: "Wireless Bluetooth Earbuds with Charging Case",
      price: 24.99,
      basePrice: 14.99,
      profitMargin: 40,
      image: "https://ae01.alicdn.com/kf/S8d4e2e5e7f6c4b9da3c1e8f9d2a5b6c7D.jpg",
      images: ["https://ae01.alicdn.com/kf/S8d4e2e5e7f6c4b9da3c1e8f9d2a5b6c7D.jpg"],
      category: "Electronics",
      rating: 4.6,
      reviews: 342,
      description: "Experience premium sound quality with these wireless Bluetooth 5.0 earbuds. Features noise cancellation, touch controls, and up to 24 hours of playtime with the charging case. Perfect for workouts, commuting, or everyday use.",
      features: [
        "Bluetooth 5.0 for stable connection",
        "24-hour battery life with charging case",
        "IPX7 waterproof rating",
        "Touch control for music and calls",
        "Premium sound with deep bass",
      ],
      inStock: true,
      stockQuantity: 100,
      sku: "ELEC-EARB-001",
      aliexpressUrl: "https://www.aliexpress.com/item/example2.html",
      keywords: ["bluetooth", "earbuds", "wireless", "electronics", "audio"],
      metaDescription: "Premium wireless Bluetooth 5.0 earbuds with 24-hour battery and noise cancellation.",
    },
    {
      name: "Smart LED Desk Lamp with Wireless Charging",
      price: 34.99,
      basePrice: 20.99,
      profitMargin: 40,
      image: "https://ae01.alicdn.com/kf/H7a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7P.jpg",
      images: ["https://ae01.alicdn.com/kf/H7a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7P.jpg"],
      category: "Home & Garden",
      rating: 4.7,
      reviews: 156,
      description: "Upgrade your workspace with this modern LED desk lamp featuring wireless phone charging, adjustable brightness, color temperature control, and USB charging port. Eye-care technology reduces strain during long work sessions.",
      features: [
        "Wireless charging pad for smartphones",
        "Adjustable brightness and color temperature",
        "USB charging port for devices",
        "Eye-care LED technology",
        "Modern minimalist design",
      ],
      inStock: true,
      stockQuantity: 75,
      sku: "HOME-LAMP-001",
      aliexpressUrl: "https://www.aliexpress.com/item/example3.html",
      keywords: ["desk lamp", "LED", "wireless charging", "home office", "lighting"],
      metaDescription: "Modern LED desk lamp with wireless charging, adjustable brightness, and eye-care technology.",
    },
    {
      name: "Minimalist Leather Wallet with RFID Blocking",
      price: 16.99,
      basePrice: 9.99,
      profitMargin: 41,
      image: "https://ae01.alicdn.com/kf/A1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6Q.jpg",
      images: ["https://ae01.alicdn.com/kf/A1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6Q.jpg"],
      category: "Fashion",
      rating: 4.5,
      reviews: 89,
      description: "Slim, stylish leather wallet with RFID protection to keep your cards safe. Holds up to 12 cards plus cash with a sleek minimalist design that fits comfortably in your pocket. Made from genuine leather with precise stitching.",
      features: [
        "RFID blocking technology",
        "Genuine leather construction",
        "Holds 12 cards plus cash",
        "Slim minimalist design",
        "Multiple color options",
      ],
      inStock: true,
      stockQuantity: 120,
      sku: "FASH-WALL-001",
      aliexpressUrl: "https://www.aliexpress.com/item/example4.html",
      keywords: ["wallet", "leather", "RFID", "minimalist", "fashion"],
      metaDescription: "Slim minimalist leather wallet with RFID protection, holds 12 cards plus cash.",
    },
    {
      name: "Jade Roller and Gua Sha Facial Massage Set",
      price: 12.99,
      basePrice: 7.99,
      profitMargin: 38,
      image: "https://ae01.alicdn.com/kf/R9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4S.jpg",
      images: ["https://ae01.alicdn.com/kf/R9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4S.jpg"],
      category: "Beauty",
      rating: 4.9,
      reviews: 278,
      description: "Natural jade facial massage tools for reducing puffiness, promoting circulation, and enhancing your skincare routine. Includes jade roller and gua sha stone in a premium gift box. Cool to the touch and perfect for daily use.",
      features: [
        "100% natural jade stone",
        "Reduces facial puffiness and tension",
        "Promotes lymphatic drainage",
        "Enhances skincare product absorption",
        "Includes storage case",
      ],
      inStock: true,
      stockQuantity: 90,
      sku: "BEAU-JADE-001",
      aliexpressUrl: "https://www.aliexpress.com/item/example5.html",
      keywords: ["jade roller", "gua sha", "beauty", "facial massage", "skincare"],
      metaDescription: "Natural jade roller and gua sha set for facial massage, reduces puffiness and promotes circulation.",
    },
  ];

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
    console.log(`✓ Product created: ${created.name}`);
  }

  console.log('\n✅ Seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   - Admin email: admin@sellery.com`);
  console.log(`   - Admin password: admin123`);
  console.log(`   - Products created: ${products.length}`);
  console.log('\n⚠️  Remember to change the admin password after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
