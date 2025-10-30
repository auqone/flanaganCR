#!/usr/bin/env node

/**
 * Setup Credentials Script
 * Creates admin and customer accounts in your database
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('\n========================================');
  console.log('  Flanagan Crafted Naturals - Setup');
  console.log('========================================\n');

  try {
    // Test connection
    console.log('Testing database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Connected to database!\n');

    // Get admin credentials
    console.log('--- ADMIN ACCOUNT SETUP ---\n');
    const adminEmail = await question('Admin Email: ');
    const adminPassword = await question('Admin Password: ');
    const adminName = await question('Admin Name (e.g., "John Flanagan"): ');

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'SUPER_ADMIN',
      },
    });

    console.log(`\n✅ Admin Created!`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}\n`);

    // Get customer credentials
    console.log('--- CUSTOMER ACCOUNT SETUP (Optional) ---\n');
    const createCustomer = await question('Create a test customer account? (yes/no): ');

    if (createCustomer.toLowerCase() === 'yes' || createCustomer.toLowerCase() === 'y') {
      const customerEmail = await question('Customer Email: ');
      const customerPassword = await question('Customer Password: ');
      const customerName = await question('Customer Name: ');

      const hashedCustomerPassword = await bcrypt.hash(customerPassword, 10);

      const customer = await prisma.customer.create({
        data: {
          email: customerEmail,
          name: customerName,
          password: hashedCustomerPassword,
        },
      });

      console.log(`\n✅ Customer Created!`);
      console.log(`   Email: ${customer.email}`);
      console.log(`   Name: ${customer.name}\n`);
    }

    // Summary
    console.log('========================================');
    console.log('  Setup Complete! 🎉');
    console.log('========================================\n');
    console.log('Admin Login:');
    console.log(`  URL: http://localhost:3000/admin/login`);
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}\n`);

    if (createCustomer.toLowerCase() === 'yes' || createCustomer.toLowerCase() === 'y') {
      console.log('Customer Login:');
      console.log(`  URL: http://localhost:3000/account`);
      console.log(`  Email: ${customerEmail}`);
      console.log(`  Password: ${customerPassword}\n`);
    }

    console.log('Next steps:');
    console.log('1. Start the dev server: npm run dev');
    console.log('2. Go to http://localhost:3000/admin/login');
    console.log('3. Log in with your admin credentials\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);

    if (error.message.includes('Can\'t reach database')) {
      console.error('\n⚠️  Database Connection Error:');
      console.error('Make sure:');
      console.error('  1. Your Supabase database is running (not paused)');
      console.error('  2. The DATABASE_URL in .env is correct');
      console.error('  3. You have internet connection');
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

main();
