import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAllUsers() {
  try {
    console.log('Starting database cleanup...');

    // Delete in order to handle foreign key constraints
    console.log('Deleting program exercises...');
    await prisma.programExercise.deleteMany();

    console.log('Deleting program sessions...');
    await prisma.programSession.deleteMany();

    console.log('Deleting programs...');
    await prisma.program.deleteMany();

    console.log('Deleting custom exercises...');
    await prisma.exercise.deleteMany({
      where: {
        createdBy: {
          not: null
        }
      }
    });

    console.log('Deleting registration tokens...');
    await prisma.registrationToken.deleteMany();

    console.log('Deleting all users...');
    await prisma.user.deleteMany();

    console.log('✅ All users and related data have been deleted successfully!');

    // Verify deletion
    const userCount = await prisma.user.count();
    const tokenCount = await prisma.registrationToken.count();
    const programCount = await prisma.program.count();

    console.log(`\n📊 Final counts:
    - Users: ${userCount}
    - Registration tokens: ${tokenCount}
    - Programs: ${programCount}`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the cleanup
clearAllUsers()
  .then(() => {
    console.log('\n🎉 Database cleanup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Cleanup failed:', error);
    process.exit(1);
  });