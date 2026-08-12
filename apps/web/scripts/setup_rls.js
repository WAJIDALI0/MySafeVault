const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Enabling RLS on notifications table...");
  
  try {
    // 1. Enable RLS
    await prisma.$executeRawUnsafe(`ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;`);
    console.log("RLS enabled on notifications.");
    
    // 2. Create Policy for Select
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can only see their own notifications" 
      ON notifications FOR SELECT 
      USING (auth.uid() = profile_id);
    `);
    console.log("Select policy created.");

    // 3. Create Policy for Update (Mark as read)
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can only update their own notifications" 
      ON notifications FOR UPDATE 
      USING (auth.uid() = profile_id);
    `);
    console.log("Update policy created.");

    // 4. Create Policy for Delete
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can only delete their own notifications" 
      ON notifications FOR DELETE 
      USING (auth.uid() = profile_id);
    `);
    console.log("Delete policy created.");

  } catch (error) {
    console.error("Error setting up RLS (it may already exist):", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
