const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const profile = await prisma.profile.findFirst();
  console.log('Profile fetched successfully:', profile?.id || 'No profiles yet');
}
main().catch(console.error).finally(() => prisma.$disconnect());
