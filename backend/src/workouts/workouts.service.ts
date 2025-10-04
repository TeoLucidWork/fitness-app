import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutLogDto, CreateExerciseLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto, UpdateExerciseLogDto } from './dto/update-workout-log.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  // Create a new workout log
  async createWorkoutLog(userId: number, createWorkoutLogDto: CreateWorkoutLogDto) {
    // Verify the user has access to this program session
    const programSession = await this.prisma.programSession.findUnique({
      where: { id: createWorkoutLogDto.programSessionId },
      include: {
        program: {
          include: { client: true }
        }
      }
    });

    if (!programSession) {
      throw new NotFoundException('Program session not found');
    }

    // Check if user is the assigned client
    if (programSession.program.clientId !== userId) {
      throw new ForbiddenException('You do not have access to this program session');
    }

    // Check if there's already an active workout log for this session
    const existingLog = await this.prisma.workoutLog.findFirst({
      where: {
        userId,
        programSessionId: createWorkoutLogDto.programSessionId,
        isCompleted: false
      }
    });

    if (existingLog) {
      throw new BadRequestException('There is already an active workout session for this program session');
    }

    // Create the workout log
    const workoutLog = await this.prisma.workoutLog.create({
      data: {
        userId,
        programSessionId: createWorkoutLogDto.programSessionId,
        notes: createWorkoutLogDto.notes,
        rating: createWorkoutLogDto.rating,
        isCompleted: createWorkoutLogDto.isCompleted || false,
        completedAt: createWorkoutLogDto.isCompleted ? new Date() : null,
      },
      include: {
        programSession: {
          include: {
            program: true,
            exercises: {
              include: {
                exercise: true
              }
            }
          }
        },
        exerciseLogs: {
          include: {
            programExercise: {
              include: {
                exercise: true
              }
            }
          }
        }
      }
    });

    // If exercise logs are provided, create them
    if (createWorkoutLogDto.exerciseLogs && createWorkoutLogDto.exerciseLogs.length > 0) {
      const exerciseLogs = await Promise.all(
        createWorkoutLogDto.exerciseLogs.map(exerciseLog =>
          this.createExerciseLog(workoutLog.id, exerciseLog)
        )
      );

      return {
        ...workoutLog,
        exerciseLogs
      };
    }

    return workoutLog;
  }

  // Create exercise log within a workout
  async createExerciseLog(workoutLogId: number, createExerciseLogDto: CreateExerciseLogDto) {
    // Verify the workout log exists and get program exercise info
    const workoutLog = await this.prisma.workoutLog.findUnique({
      where: { id: workoutLogId },
      include: {
        programSession: {
          include: {
            exercises: true
          }
        }
      }
    });

    if (!workoutLog) {
      throw new NotFoundException('Workout log not found');
    }

    // Verify the program exercise belongs to this session
    const programExercise = workoutLog.programSession.exercises.find(
      ex => ex.id === createExerciseLogDto.programExerciseId
    );

    if (!programExercise) {
      throw new BadRequestException('Exercise does not belong to this workout session');
    }

    return this.prisma.exerciseLog.create({
      data: {
        workoutLogId,
        programExerciseId: createExerciseLogDto.programExerciseId,
        actualSets: createExerciseLogDto.actualSets,
        actualReps: createExerciseLogDto.actualReps,
        actualWeight: createExerciseLogDto.actualWeight,
        actualRestPeriod: createExerciseLogDto.actualRestPeriod,
        actualRpe: createExerciseLogDto.actualRpe,
        notes: createExerciseLogDto.notes,
        isCompleted: createExerciseLogDto.isCompleted || false,
      },
      include: {
        programExercise: {
          include: {
            exercise: true
          }
        }
      }
    });
  }

  // Get workout logs for a user
  async getWorkoutLogs(userId: number, userRole: string) {
    let whereClause: any = {};

    if (userRole === UserRole.USER) {
      // Clients can only see their own logs
      whereClause.userId = userId;
    } else if (userRole === UserRole.TRAINER) {
      // Trainers can see logs of their clients
      whereClause = {
        user: {
          trainerId: userId
        }
      };
    }

    return this.prisma.workoutLog.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true
          }
        },
        programSession: {
          include: {
            program: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        },
        exerciseLogs: {
          include: {
            programExercise: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    nameEn: true,
                    category: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        startedAt: 'desc'
      }
    });
  }

  // Get specific workout log
  async getWorkoutLog(id: number, userId: number, userRole: string) {
    const workoutLog = await this.prisma.workoutLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            trainerId: true
          }
        },
        programSession: {
          include: {
            program: {
              select: {
                id: true,
                name: true,
                description: true,
                trainerId: true
              }
            },
            exercises: {
              include: {
                exercise: true
              },
              orderBy: {
                order: 'asc'
              }
            }
          }
        },
        exerciseLogs: {
          include: {
            programExercise: {
              include: {
                exercise: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!workoutLog) {
      throw new NotFoundException('Workout log not found');
    }

    // Check access permissions
    if (userRole === UserRole.USER && workoutLog.userId !== userId) {
      throw new ForbiddenException('You do not have access to this workout log');
    }

    if (userRole === UserRole.TRAINER && workoutLog.user.trainerId !== userId) {
      throw new ForbiddenException('You do not have access to this workout log');
    }

    return workoutLog;
  }

  // Update workout log
  async updateWorkoutLog(id: number, userId: number, userRole: string, updateWorkoutLogDto: UpdateWorkoutLogDto) {
    const existingWorkoutLog = await this.getWorkoutLog(id, userId, userRole);

    const updatedData: any = {
      notes: updateWorkoutLogDto.notes,
      rating: updateWorkoutLogDto.rating,
      isCompleted: updateWorkoutLogDto.isCompleted,
    };

    // Set completedAt when marking as completed
    if (updateWorkoutLogDto.isCompleted && !existingWorkoutLog.isCompleted) {
      updatedData.completedAt = new Date();
    }

    // Clear completedAt when marking as incomplete
    if (updateWorkoutLogDto.isCompleted === false && existingWorkoutLog.isCompleted) {
      updatedData.completedAt = null;
    }

    return this.prisma.workoutLog.update({
      where: { id },
      data: updatedData,
      include: {
        programSession: {
          include: {
            program: true,
            exercises: {
              include: {
                exercise: true
              }
            }
          }
        },
        exerciseLogs: {
          include: {
            programExercise: {
              include: {
                exercise: true
              }
            }
          }
        }
      }
    });
  }

  // Update exercise log
  async updateExerciseLog(id: number, userId: number, userRole: string, updateExerciseLogDto: UpdateExerciseLogDto) {
    // Find the exercise log and check permissions
    const exerciseLog = await this.prisma.exerciseLog.findUnique({
      where: { id },
      include: {
        workoutLog: {
          include: {
            user: true
          }
        }
      }
    });

    if (!exerciseLog) {
      throw new NotFoundException('Exercise log not found');
    }

    // Check access permissions
    if (userRole === UserRole.USER && exerciseLog.workoutLog.userId !== userId) {
      throw new ForbiddenException('You do not have access to this exercise log');
    }

    if (userRole === UserRole.TRAINER && exerciseLog.workoutLog.user.trainerId !== userId) {
      throw new ForbiddenException('You do not have access to this exercise log');
    }

    return this.prisma.exerciseLog.update({
      where: { id },
      data: updateExerciseLogDto,
      include: {
        programExercise: {
          include: {
            exercise: true
          }
        }
      }
    });
  }

  // Delete workout log
  async deleteWorkoutLog(id: number, userId: number, userRole: string) {
    const workoutLog = await this.getWorkoutLog(id, userId, userRole);

    // Only allow deletion if the workout is not completed or if user is the client
    if (workoutLog.isCompleted && userRole !== UserRole.USER) {
      throw new BadRequestException('Cannot delete completed workout logs');
    }

    await this.prisma.workoutLog.delete({
      where: { id }
    });

    return { message: 'Workout log deleted successfully' };
  }

  // Get workout history/statistics for a user
  async getWorkoutStats(userId: number, userRole: string, clientId?: number) {
    let targetUserId = userId;

    // If trainer is requesting stats for a specific client
    if (userRole === UserRole.TRAINER && clientId) {
      // Verify the client belongs to this trainer
      const client = await this.prisma.user.findUnique({
        where: { id: clientId }
      });

      if (!client || client.trainerId !== userId) {
        throw new ForbiddenException('You do not have access to this client\'s data');
      }

      targetUserId = clientId;
    } else if (userRole === UserRole.TRAINER && !clientId) {
      throw new BadRequestException('Trainer must specify clientId to get workout stats');
    }

    // Get total workouts completed
    const totalWorkouts = await this.prisma.workoutLog.count({
      where: {
        userId: targetUserId,
        isCompleted: true
      }
    });

    // Get workouts this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const workoutsThisWeek = await this.prisma.workoutLog.count({
      where: {
        userId: targetUserId,
        isCompleted: true,
        completedAt: {
          gte: startOfWeek
        }
      }
    });

    // Get most recent workout
    const recentWorkout = await this.prisma.workoutLog.findFirst({
      where: {
        userId: targetUserId,
        isCompleted: true
      },
      orderBy: {
        completedAt: 'desc'
      },
      include: {
        programSession: {
          include: {
            program: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Get average rating
    const avgRatingResult = await this.prisma.workoutLog.aggregate({
      where: {
        userId: targetUserId,
        isCompleted: true,
        rating: {
          not: null
        }
      },
      _avg: {
        rating: true
      }
    });

    return {
      totalWorkouts,
      workoutsThisWeek,
      averageRating: avgRatingResult._avg.rating || null,
      recentWorkout: recentWorkout ? {
        id: recentWorkout.id,
        completedAt: recentWorkout.completedAt,
        sessionName: recentWorkout.programSession.name,
        programName: recentWorkout.programSession.program.name,
        rating: recentWorkout.rating
      } : null
    };
  }
}