#!/usr/bin/env node

/**
 * Database Connection Test using Prisma
 * Tests if your Supabase database connection is working
 */

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 Testing Database Connection with Prisma...\n');

  const prisma = new PrismaClient();

  try {
    console.log('⏳ Connecting to database...');

    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;

    console.log('✅ Connected Successfully!\n');
    console.log(`Database Time: ${result[0].current_time}\n`);

    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log(`📊 Found ${tables.length} tables:\n`);

    if (tables.length === 0) {
      console.log('⚠️  No tables found!\n');
      console.log('You need to run migrations to create the database schema:\n');
      console.log('  npx prisma migrate deploy\n');
      console.log('Then seed sample data:\n');
      console.log('  npx prisma db seed\n');
    } else {
      tables.forEach((row) => {
        console.log(`   ✓ ${row.table_name}`);
      });
      console.log();
    }

    console.log('✅ Connection test passed!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed!\n');
    console.error(`Error: ${error.message}\n`);

    console.log('🔧 Troubleshooting Steps:\n');
    console.log('1. Verify your .env file has DATABASE_URL set:');
    console.log('   cat .env\n');
    console.log('2. Check your Supabase project:');
    console.log('   - Go to https://supabase.com');
    console.log('   - Sign in and check your project status');
    console.log('   - Make sure the database is running (not paused)\n');
    console.log('3. Verify the connection string:');
    console.log('   - Database URL format: postgresql://user:password@host:5432/database\n');
    console.log('4. Check network connectivity:');
    console.log('   - Test if you can reach the database host\n');

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
