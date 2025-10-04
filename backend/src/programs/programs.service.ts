import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { CreateProgramSessionDto } from './dto/create-program-session.dto';
import { CreateProgramExerciseDto } from './dto/create-program-exercise.dto';
import { ProgramResponse, ProgramSessionResponse, ProgramExerciseResponse } from './interfaces/program.interface';
import { ExerciseDifficulty, UserRole } from '@prisma/client';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async create(createProgramDto: CreateProgramDto, trainerId: number): Promise<ProgramResponse> {
    // Verify trainer role
    const trainer = await this.prisma.user.findUnique({
      where: { id: trainerId },
    });

    if (!trainer || trainer.role !== UserRole.TRAINER) {
      throw new ForbiddenException('Only trainers can create programs');
    }

    // If clientId is provided, verify the client exists
    if (createProgramDto.clientId) {
      const client = await this.prisma.user.findUnique({
        where: { id: createProgramDto.clientId },
      });

      if (!client) {
        throw new NotFoundException(`Client with ID ${createProgramDto.clientId} not found`);
      }
    }

    const programData = {
      ...createProgramDto,
      goals: JSON.stringify(createProgramDto.goals),
      trainerId,
    };

    const program = await this.prisma.program.create({
      data: programData,
      include: {
        trainer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        sessions: {
          orderBy: [
            { weekNumber: 'asc' },
            { order: 'asc' },
          ],
          include: {
            exercises: {
              orderBy: { order: 'asc' },
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    return this.formatProgramResponse(program);
  }

  async findAll(filters?: {
    trainerId?: number;
    clientId?: number;
    isTemplate?: boolean;
    difficulty?: ExerciseDifficulty;
    search?: string;
  }): Promise<ProgramResponse[]> {
    const where = {
      isActive: true,
      ...(filters?.trainerId && { trainerId: filters.trainerId }),
      ...(filters?.clientId && { clientId: filters.clientId }),
      ...(typeof filters?.isTemplate === 'boolean' && { isTemplate: filters.isTemplate }),
      ...(filters?.difficulty && { difficulty: filters.difficulty }),
      ...(filters?.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' as const } },
          { description: { contains: filters.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const programs = await this.prisma.program.findMany({
      where,
      include: {
        trainer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        sessions: {
          orderBy: [
            { weekNumber: 'asc' },
            { order: 'asc' },
          ],
        },
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
    });

    return programs.map(program => this.formatProgramResponse(program));
  }

  async findOne(id: number, userId?: number): Promise<ProgramResponse> {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: {
        trainer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        sessions: {
          orderBy: [
            { weekNumber: 'asc' },
            { order: 'asc' },
          ],
          include: {
            exercises: {
              orderBy: { order: 'asc' },
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }

    // Check permissions: trainer, assigned client, or template programs
    if (userId) {
      const canAccess = 
        program.trainerId === userId ||
        program.clientId === userId ||
        program.isTemplate;

      if (!canAccess) {
        throw new ForbiddenException('You do not have permission to view this program');
      }
    }

    return this.formatProgramResponse(program);
  }

  async update(id: number, updateProgramDto: UpdateProgramDto, trainerId: number): Promise<ProgramResponse> {
    const program = await this.findOne(id);

    // Only the trainer who created the program can update it
    if (program.trainerId !== trainerId) {
      throw new ForbiddenException('You can only update programs you created');
    }

    const updateData = {
      ...updateProgramDto,
      ...(updateProgramDto.goals && { goals: JSON.stringify(updateProgramDto.goals) }),
    };

    const updatedProgram = await this.prisma.program.update({
      where: { id },
      data: updateData,
      include: {
        trainer: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        client: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        sessions: {
          orderBy: [
            { weekNumber: 'asc' },
            { order: 'asc' },
          ],
          include: {
            exercises: {
              orderBy: { order: 'asc' },
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    return this.formatProgramResponse(updatedProgram);
  }

  async remove(id: number, trainerId: number): Promise<void> {
    const program = await this.findOne(id);

    // Only the trainer who created the program can delete it
    if (program.trainerId !== trainerId) {
      throw new ForbiddenException('You can only delete programs you created');
    }

    // Soft delete - mark as inactive
    await this.prisma.program.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Program Session Management
  async addSession(programId: number, createSessionDto: CreateProgramSessionDto, trainerId: number): Promise<ProgramSessionResponse> {
    const program = await this.findOne(programId);

    if (program.trainerId !== trainerId) {
      throw new ForbiddenException('You can only modify programs you created');
    }

    const session = await this.prisma.programSession.create({
      data: {
        ...createSessionDto,
        programId,
      },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: true,
          },
        },
      },
    });

    return this.formatSessionResponse(session);
  }

  async updateSession(sessionId: number, updateSessionDto: CreateProgramSessionDto, trainerId: number): Promise<ProgramSessionResponse> {
    const session = await this.prisma.programSession.findUnique({
      where: { id: sessionId },
      include: { program: true },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (session.program.trainerId !== trainerId) {
      throw new ForbiddenException('You can only modify programs you created');
    }

    const updatedSession = await this.prisma.programSession.update({
      where: { id: sessionId },
      data: updateSessionDto,
      include: {
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            exercise: true,
          },
        },
      },
    });

    return this.formatSessionResponse(updatedSession);
  }

  async removeSession(sessionId: number, trainerId: number): Promise<void> {
    const session = await this.prisma.programSession.findUnique({
      where: { id: sessionId },
      include: { program: true },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (session.program.trainerId !== trainerId) {
      throw new ForbiddenException('You can only modify programs you created');
    }

    await this.prisma.programSession.delete({
      where: { id: sessionId },
    });
  }

  // Program Exercise Management
  async addExerciseToSession(sessionId: number, createExerciseDto: CreateProgramExerciseDto, trainerId: number): Promise<ProgramExerciseResponse> {
    const session = await this.prisma.programSession.findUnique({
      where: { id: sessionId },
      include: { program: true },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (session.program.trainerId !== trainerId) {
      throw new ForbiddenException('You can only modify programs you created');
    }

    // Verify the exercise exists
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: createExerciseDto.exerciseId },
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${createExerciseDto.exerciseId} not found`);
    }

    const programExercise = await this.prisma.programExercise.create({
      data: {
        ...createExerciseDto,
        sessionId,
      },
      include: {
        exercise: true,
      },
    });

    return this.formatExerciseResponse(programExercise);
  }

  async updateExerciseInSession(exerciseId: number, updateExerciseDto: CreateProgramExerciseDto, trainerId: number): Promise<ProgramExerciseResponse> {
    const programExercise = await this.prisma.programExercise.findUnique({
      where: { id: exerciseId },
      include: {
        session: {
          include: { program: true },
        },
      },
    });

    if (!programExercise) {
      throw new NotFoundException(`Program exercise with ID ${exerciseId} not found`);
    }

    if (programExercise.session.program.trainerId !== trainerId) {
      throw new ForbiddenException('You can only modify programs you created');
    }

    const updatedExercise = await this.prisma.programExercise.update({
      where: { id: exerciseId },
      data: updateExerciseDto,
      include: {
        exercise: true,
      },
    });

    return this.formatExerciseResponse(updatedExercise);
  }

  async removeExerciseFromSession(exerciseId: number, trainerId: number): Promise<void> {
    const programExercise = await this.prisma.programExercise.findUnique({
      where: { id: exerciseId },
      include: {
        session: {
          include: { program: true },
        },
      },
    });

    if (!programExercise) {
      throw new NotFoundException(`Program exercise with ID ${exerciseId} not found`);
    }

    if (programExercise.session.program.trainerId !== trainerId) {
      throw new ForbiddenException('You can only modify programs you created');
    }

    await this.prisma.programExercise.delete({
      where: { id: exerciseId },
    });
  }

  // Copy template to create new program for client
  async copyTemplate(templateId: number, clientId: number, trainerId: number): Promise<ProgramResponse> {
    const template = await this.findOne(templateId);

    if (!template.isTemplate) {
      throw new BadRequestException('Can only copy template programs');
    }

    // Verify client exists
    const client = await this.prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    // Create new program from template
    const newProgram = await this.prisma.program.create({
      data: {
        name: `${template.name} - ${client.firstName || client.username}`,
        description: template.description,
        trainerId,
        clientId,
        isTemplate: false,
        duration: template.duration,
        sessionsPerWeek: template.sessionsPerWeek,
        difficulty: template.difficulty,
        goals: JSON.stringify(template.goals),
      },
    });

    // Copy sessions and exercises
    for (const session of template.sessions || []) {
      const newSession = await this.prisma.programSession.create({
        data: {
          programId: newProgram.id,
          name: session.name,
          dayOfWeek: session.dayOfWeek,
          weekNumber: session.weekNumber,
          order: session.order,
          restDay: session.restDay,
        },
      });

      // Copy exercises
      for (const exercise of session.exercises || []) {
        await this.prisma.programExercise.create({
          data: {
            sessionId: newSession.id,
            exerciseId: exercise.exerciseId,
            order: exercise.order,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            restPeriod: exercise.restPeriod,
            tempo: exercise.tempo,
            rpe: exercise.rpe,
            notes: exercise.notes,
            isSuperset: exercise.isSuperset,
            supersetGroup: exercise.supersetGroup,
          },
        });
      }
    }

    return this.findOne(newProgram.id);
  }

  async getUserPrograms(userId: number, userRole: string): Promise<ProgramResponse[]> {
    if (userRole === UserRole.TRAINER) {
      // For trainers, return programs they created
      return this.findAll({ trainerId: userId });
    } else if (userRole === UserRole.USER) {
      // For clients, return programs assigned to them
      return this.findAll({ clientId: userId });
    } else {
      throw new ForbiddenException('Invalid user role');
    }
  }

  private formatProgramResponse(program: any): ProgramResponse {
    return {
      ...program,
      goals: JSON.parse(program.goals || '[]'),
      sessions: program.sessions?.map((session: any) => this.formatSessionResponse(session)),
    };
  }

  private formatSessionResponse(session: any): ProgramSessionResponse {
    return {
      ...session,
      exercises: session.exercises?.map((exercise: any) => this.formatExerciseResponse(exercise)),
    };
  }

  private formatExerciseResponse(exercise: any): ProgramExerciseResponse {
    return {
      ...exercise,
      exercise: {
        ...exercise.exercise,
        muscleGroups: JSON.parse(exercise.exercise.muscleGroups || '[]'),
        equipment: JSON.parse(exercise.exercise.equipment || '[]'),
        instructions: JSON.parse(exercise.exercise.instructions || '[]'),
        tips: exercise.exercise.tips ? JSON.parse(exercise.exercise.tips) : undefined,
      },
    };
  }
}