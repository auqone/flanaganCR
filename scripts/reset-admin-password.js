const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    const newPassword = "TestPassword123!";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const admin = await prisma.admin.update({
      where: { email: "admin@flanagancrafted.com" },
      data: {
        password: hashedPassword,
      },
    });

    console.log("Updated admin password");
    console.log("Email:", admin.email);
    console.log("New password: TestPassword123!");
    console.log("\nYou can now login with these credentials.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
