import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log(`\nTotal products: ${products.length}\n`);
  products.forEach((p) => {
    console.log(`ID: ${p.id}`);
    console.log(`Name: ${p.name}`);
    console.log(`Price: $${p.price}`);
    console.log(`---`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
