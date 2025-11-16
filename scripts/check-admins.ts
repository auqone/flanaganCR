import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking admin accounts in database...\n');

  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (admins.length === 0) {
      console.log('❌ No admin accounts found in the database.');
      console.log('\n💡 You need to either:');
      console.log('   1. Run the seed script: npm run seed');
      console.log('   2. Create an admin manually: npm run create-admin\n');
    } else {
      console.log(`✅ Found ${admins.length} admin account(s):\n`);
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.email}`);
        console.log(`   Name: ${admin.name}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Created: ${admin.createdAt.toLocaleString()}`);
        console.log('');
      });

      console.log('📝 Default credentials from seed script:');
      console.log('   Email: admin@sellery.com');
      console.log('   Password: admin123');
      console.log('\n⚠️  If these don\'t work, use the reset-password script.\n');
    }

    // Check total products
    const productCount = await prisma.product.count();
    console.log(`📦 Total products in database: ${productCount}`);

    // Check total orders
    const orderCount = await prisma.order.count();
    console.log(`🛒 Total orders in database: ${orderCount}`);

    // Check total customers
    const customerCount = await prisma.customer.count();
    console.log(`👥 Total customers in database: ${customerCount}\n`);

  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
