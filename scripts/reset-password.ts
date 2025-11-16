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
  console.log('🔐 Reset Admin Password\n');

  try {
    // Show all admins
    const admins = await prisma.admin.findMany({
      select: {
        email: true,
        name: true,
        role: true,
      },
      orderBy: {
        email: 'asc',
      },
    });

    if (admins.length === 0) {
      console.log('❌ No admin accounts found in database.');
      console.log('💡 Use the create-admin script to create one.\n');
      process.exit(1);
    }

    console.log('Available admin accounts:');
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email} (${admin.name}) - ${admin.role}`);
    });
    console.log('');

    // Get email
    const email = await question('Enter admin email to reset password: ');
    if (!email) {
      console.log('❌ Email is required');
      process.exit(1);
    }

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      console.log(`❌ No admin found with email: ${email}`);
      process.exit(1);
    }

    // Get new password
    const newPassword = await question('Enter new password (min 6 characters): ');
    if (!newPassword || newPassword.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    const confirmPassword = await question('Confirm new password: ');
    if (newPassword !== confirmPassword) {
      console.log('❌ Passwords do not match');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.admin.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    console.log('\n✅ Password reset successfully!\n');
    console.log('📋 Login Details:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   New Password: ${newPassword}`);
    console.log('\n🔗 Login at: https://flanagancraftednaturals.com/admin/login\n');
    console.log('⚠️  Make sure to save these credentials securely!\n');

  } catch (error) {
    console.error('❌ Error resetting password:', error);
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
