#!/usr/bin/env node

/**
 * Database Connection Test
 * Tests if your Supabase database connection is working
 */

const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL not found in .env file');
    process.exit(1);
  }

  console.log('🔍 Testing Database Connection...\n');
  console.log(`Connection String: ${databaseUrl.split('@')[1] || 'hidden'}`);

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('⏳ Connecting...');
    await client.connect();
    console.log('✅ Connected Successfully!\n');

    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database Query Successful!');
    console.log(`   Current Time: ${result.rows[0].now}\n`);

    // Check tables
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log(`📊 Found ${tables.rows.length} tables:\n`);
    if (tables.rows.length === 0) {
      console.log('   ⚠️  No tables found - you may need to run migrations');
      console.log('   Run: npx prisma migrate deploy\n');
    } else {
      tables.rows.forEach((row) => {
        console.log(`   - ${row.table_name}`);
      });
      console.log();
    }

    console.log('✅ Everything looks good!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed!\n');
    console.error(`Error: ${error.message}\n`);

    if (error.code === 'ENOTFOUND') {
      console.error('💡 Possible Fixes:');
      console.error('   1. Check the database hostname is correct');
      console.error('   2. Verify your internet connection');
      console.error('   3. Check firewall/network settings\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Possible Fixes:');
      console.error('   1. Make sure Supabase project is running');
      console.error('   2. Check if the database is paused in Supabase dashboard');
      console.error('   3. Verify correct port (5432)\n');
    } else if (error.code === '28P01') {
      console.error('💡 Possible Fixes:');
      console.error('   1. Check your password is correct');
      console.error('   2. Verify the username (usually "postgres")\n');
    }

    console.error('DEBUG INFO:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}\n`);

    process.exit(1);
  }
}

testConnection();
