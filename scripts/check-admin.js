const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    const admins = await prisma.admin.findMany();
    console.log("Existing admins:", admins);

    if (admins.length === 0) {
      console.log("\nNo admins found. Creating test admin...");
      const hashedPassword = await bcrypt.hash("AdminPassword123!", 10);
      const admin = await prisma.admin.create({
        data: {
          email: "admin@flanagancrafted.com",
          password: hashedPassword,
          name: "Admin User",
          role: "ADMIN",
        },
      });
      console.log("Created admin:", admin);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
