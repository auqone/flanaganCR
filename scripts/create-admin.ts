import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('👤 Create New Admin Account\n');

  try {
    // Get user input
    const email = await question('Email address: ');
    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email address');
      process.exit(1);
    }

    // Check if email already exists
    const existing = await prisma.admin.findUnique({
      where: { email },
    });

    if (existing) {
      console.log(`❌ Admin with email ${email} already exists!`);
      console.log('💡 Use the reset-password script to change the password.\n');
      process.exit(1);
    }

    const name = await question('Full name: ');
    if (!name) {
      console.log('❌ Name is required');
      process.exit(1);
    }

    const password = await question('Password: ');
    if (!password || password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    console.log('\nSelect role:');
    console.log('1. STAFF (can view products, orders)');
    console.log('2. ADMIN (can manage products, orders, customers)');
    console.log('3. SUPER_ADMIN (full access including analytics)');
    const roleChoice = await question('Enter choice (1-3): ');

    let role: 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';
    switch (roleChoice) {
      case '1':
        role = 'STAFF';
        break;
      case '2':
        role = 'ADMIN';
        break;
      case '3':
        role = 'SUPER_ADMIN';
        break;
      default:
        console.log('❌ Invalid choice, defaulting to ADMIN');
        role = 'ADMIN';
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    });

    console.log('\n✅ Admin account created successfully!\n');
    console.log('📋 Account Details:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   ID: ${admin.id}\n`);
    console.log('🔗 Login at: https://flanagancraftednaturals.com/admin/login\n');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
