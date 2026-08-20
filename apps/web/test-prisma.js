const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const items = await prisma.vaultItem.findMany({
      where: { profile_id: "12345678-1234-1234-1234-123456789012" },
      select: { type: true, encrypted_data: true }
    });
    console.log("Success:", items.length);
  } catch (e) {
    console.error("Error name:", e.name);
    console.error("Error message:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
