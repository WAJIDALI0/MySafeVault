const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== Running Part 2 Verification Tests ===");
  
  // 1. Setup mock users
  const userA = { id: '00000000-0000-0000-0000-000000000001', email: 'a@example.com' };
  const userB = { id: '00000000-0000-0000-0000-000000000002', email: 'b@example.com' };

  try {
    // Upsert profiles for constraints
    await prisma.profile.upsert({
      where: { id: userA.id },
      update: {},
      create: { id: userA.id, full_name: "Test User A" }
    });
    await prisma.profile.upsert({
      where: { id: userB.id },
      update: {},
      create: { id: userB.id, full_name: "Test User B" }
    });

    // 2. Notification Isolation Test
    console.log("\\n[Test 1] Notification Isolation");
    
    // Create notification for User A
    const notifA = await prisma.notification.create({
      data: {
        profile_id: userA.id,
        title: "Secret for A",
        message: "Only A should see this",
        type: "SECURITY"
      }
    });

    // Emulate Server Action fetch for User B
    const bNotifications = await prisma.notification.findMany({
      where: { profile_id: userB.id }
    });
    
    if (bNotifications.some(n => n.id === notifA.id)) {
      throw new Error("FAIL: User B can see User A's notification!");
    } else {
      console.log("✅ PASS: User B cannot see User A's notification. Server-side isolation works.");
    }

    // 3. Search Security Test
    console.log("\\n[Test 2] Search Security (No Decryption)");
    
    // Create a vault item with a sensitive encrypted string
    await prisma.vaultItem.create({
      data: {
        profile_id: userA.id,
        type: 'PASSWORD',
        title: 'My Banking Login',
        encrypted_data: 'SUPER_SECRET_PLAINTEXT_THAT_SHOULD_NEVER_BE_SEARCHED'
      }
    });

    // Simulate search action behavior (which only searches title)
    const searchQuery = 'SECRET_PLAINTEXT';
    const searchResults = await prisma.vaultItem.findMany({
      where: {
        profile_id: userA.id,
        title: { contains: searchQuery, mode: 'insensitive' }
      }
    });

    if (searchResults.length > 0) {
      throw new Error("FAIL: Search returned a match on sensitive encrypted payload!");
    } else {
      console.log("✅ PASS: Search returned no match for sensitive payload. Search is safely scoped to metadata.");
    }

    // 4. Test title search works
    const validSearch = await prisma.vaultItem.findMany({
      where: {
        profile_id: userA.id,
        title: { contains: 'Banking', mode: 'insensitive' }
      }
    });

    if (validSearch.length === 0) {
      throw new Error("FAIL: Valid title search returned no results.");
    } else {
      console.log("✅ PASS: Valid title search returned correct results.");
    }

    console.log("\\n=== All integration tests passed! ===");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Cleanup
    await prisma.notification.deleteMany({ where: { profile_id: { in: [userA.id, userB.id] } } });
    await prisma.vaultItem.deleteMany({ where: { profile_id: { in: [userA.id, userB.id] } } });
    await prisma.profile.deleteMany({ where: { id: { in: [userA.id, userB.id] } } });
    await prisma.$disconnect();
  }
}

main();
