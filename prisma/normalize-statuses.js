const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting order status normalization...");
  try {
    // 1. Map logistics states to PAID
    const r1 = await prisma.$executeRawUnsafe(`
      UPDATE "OrderShadow" 
      SET "status" = 'PAID' 
      WHERE LOWER("status") IN ('delivered', 'shipped', 'in_transit', 'preparing', 'paid')
    `);
    
    // 2. Map pending to PENDING
    const r2 = await prisma.$executeRawUnsafe(`
      UPDATE "OrderShadow" 
      SET "status" = 'PENDING' 
      WHERE LOWER("status") = 'pending'
    `);
    
    // 3. Map canceled to REJECTED
    const r3 = await prisma.$executeRawUnsafe(`
      UPDATE "OrderShadow" 
      SET "status" = 'REJECTED' 
      WHERE LOWER("status") IN ('canceled', 'cancelled', 'rejected')
    `);

    console.log("Normalization complete!");
    console.log(`PAID (delivered/shipped/preparing) updated: ${r1} rows`);
    console.log(`PENDING updated: ${r2} rows`);
    console.log(`REJECTED (canceled/rejected) updated: ${r3} rows`);

  } catch (e) {
    console.error("Prisma error during normalization:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
