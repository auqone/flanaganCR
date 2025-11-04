#!/usr/bin/env node

/**
 * Verify and create admin account
 * This generates the correct bcrypt password hash
 */

const bcrypt = require('bcryptjs');

async function generatePasswordHash(password) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

async function main() {
  console.log('\n========================================');
  console.log('  Password Hash Generator');
  console.log('========================================\n');

  const password = 'adminPassword123';
  const hash = await generatePasswordHash(password);

  console.log('Password:', password);
  console.log('Bcrypt Hash:', hash);
  console.log('\n========================================\n');

  console.log('Use this SQL command to create/update admin:\n');
  console.log(`INSERT INTO "Admin" (id, email, password, name, role)`);
  console.log(`VALUES ('admin_1', 'admin@flanagan.com', '${hash}', 'John Flanagan', 'SUPER_ADMIN')`);
  console.log(`ON CONFLICT (email) DO UPDATE SET password = '${hash}';\n`);

  console.log('Copy the INSERT command above and run it in Supabase SQL Editor.\n');
}

main().catch(console.error);
