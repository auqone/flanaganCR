#!/usr/bin/env node

/**
 * Database Diagnostic Script
 * Checks what tables exist and their contents
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('\n========================================');
  console.log('  Database Diagnostic');
  console.log('========================================\n');

  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected!\n');

    // List all tables
    console.log('📊 Checking tables...\n');

    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    if (tables.length === 0) {
      console.log('❌ No tables found! Database is empty.\n');
      console.log('You need to run the setup SQL script first.\n');
      return;
    }

    console.log(`Found ${tables.length} tables:\n`);
    tables.forEach((t) => console.log(`  ✓ ${t.table_name}`));

    // Check Admin table
    console.log('\n--- Admin Table ---');
    const adminCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Admin"`;
    console.log(`Admins in database: ${adminCount[0].count}`);

    if (adminCount[0].count > 0) {
      const admins = await prisma.$queryRaw`SELECT id, email, name, role FROM "Admin"`;
      console.log('\nAdmin accounts:');
      admins.forEach((admin) => {
        console.log(`  - ${admin.email} (${admin.name}) - Role: ${admin.role}`);
      });
    } else {
      console.log('❌ No admin accounts found!');
    }

    // Check Customer table
    console.log('\n--- Customer Table ---');
    const customerCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Customer"`;
    console.log(`Customers in database: ${customerCount[0].count}`);

    // Check other tables
    console.log('\n--- Summary ---');
    const counts = await prisma.$queryRaw`
      SELECT
        (SELECT COUNT(*) FROM "Product") as products,
        (SELECT COUNT(*) FROM "Order") as orders,
        (SELECT COUNT(*) FROM "OrderItem") as order_items,
        (SELECT COUNT(*) FROM "EmailSubscriber") as subscribers
    `;

    console.log(`Products: ${counts[0].products}`);
    console.log(`Orders: ${counts[0].orders}`);
    console.log(`Order Items: ${counts[0].order_items}`);
    console.log(`Email Subscribers: ${counts[0].subscribers}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPossible causes:');
    console.error('1. Database not accessible');
    console.error('2. Tables not created yet');
    console.error('3. Wrong DATABASE_URL in .env\n');
  } finally {
    await prisma.$disconnect();
  }
}

main();
