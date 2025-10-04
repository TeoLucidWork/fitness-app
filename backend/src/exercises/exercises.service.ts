import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseResponse } from './interfaces/exercise.interface';
import { ExerciseCategory, ExerciseDifficulty } from '@prisma/client';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async create(createExerciseDto: CreateExerciseDto, userId?: number): Promise<ExerciseResponse> {
    const exerciseData = {
      ...createExerciseDto,
      muscleGroups: JSON.stringify(createExerciseDto.muscleGroups),
      equipment: JSON.stringify(createExerciseDto.equipment),
      instructions: JSON.stringify(createExerciseDto.instructions),
      tips: createExerciseDto.tips ? JSON.stringify(createExerciseDto.tips) : null,
      createdBy: userId,
    };

    const exercise = await this.prisma.exercise.create({
      data: exerciseData,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.formatExerciseResponse(exercise);
  }

  async findAll(filters?: {
    category?: ExerciseCategory;
    difficulty?: ExerciseDifficulty;
    muscleGroup?: string;
    search?: string;
  }): Promise<ExerciseResponse[]> {
    const where = {
      isActive: true,
      ...(filters?.category && { category: filters.category }),
      ...(filters?.difficulty && { difficulty: filters.difficulty }),
      ...(filters?.muscleGroup && { 
        muscleGroups: { contains: filters.muscleGroup }
      }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' as const } },
          { nameEn: { contains: filters.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const exercises = await this.prisma.exercise.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    return exercises.map(exercise => this.formatExerciseResponse(exercise));
  }

  async findOne(id: number): Promise<ExerciseResponse> {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }

    return this.formatExerciseResponse(exercise);
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto, userId: number): Promise<ExerciseResponse> {
    const exercise = await this.findOne(id);

    // Only allow the creator or admin to update custom exercises
    if (exercise.createdBy && exercise.createdBy !== userId) {
      throw new ForbiddenException('You can only update exercises you created');
    }

    const updateData = {
      ...updateExerciseDto,
      ...(updateExerciseDto.muscleGroups && { 
        muscleGroups: JSON.stringify(updateExerciseDto.muscleGroups) 
      }),
      ...(updateExerciseDto.equipment && { 
        equipment: JSON.stringify(updateExerciseDto.equipment) 
      }),
      ...(updateExerciseDto.instructions && { 
        instructions: JSON.stringify(updateExerciseDto.instructions) 
      }),
      ...(updateExerciseDto.tips && { 
        tips: JSON.stringify(updateExerciseDto.tips) 
      }),
    };

    const updatedExercise = await this.prisma.exercise.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.formatExerciseResponse(updatedExercise);
  }

  async remove(id: number, userId: number): Promise<void> {
    const exercise = await this.findOne(id);

    // Only allow the creator to delete custom exercises
    if (exercise.createdBy && exercise.createdBy !== userId) {
      throw new ForbiddenException('You can only delete exercises you created');
    }

    // Soft delete - mark as inactive instead of actual deletion
    await this.prisma.exercise.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private formatExerciseResponse(exercise: any): ExerciseResponse {
    return {
      ...exercise,
      muscleGroups: JSON.parse(exercise.muscleGroups || '[]'),
      equipment: JSON.parse(exercise.equipment || '[]'),
      instructions: JSON.parse(exercise.instructions || '[]'),
      tips: exercise.tips ? JSON.parse(exercise.tips) : undefined,
    };
  }
}