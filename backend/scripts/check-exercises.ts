import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkExercises() {
  try {
    const exerciseCount = await prisma.exercise.count();
    console.log(`Current number of exercises in database: ${exerciseCount}`);

    if (exerciseCount > 0) {
      console.log('\nFirst few exercises:');
      const exercises = await prisma.exercise.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          category: true,
          difficulty: true
        }
      });
      exercises.forEach(ex => {
        console.log(`- ${ex.name} (${ex.category}, ${ex.difficulty})`);
      });
    }
  } catch (error) {
    console.error('Error checking exercises:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkExercises();