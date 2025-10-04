import { ExerciseDifficulty } from '@prisma/client';
import { ExerciseResponse } from '../../exercises/interfaces/exercise.interface';

export interface ProgramResponse {
  id: number;
  name: string;
  description?: string;
  trainerId: number;
  clientId?: number;
  isTemplate: boolean;
  duration: number;
  sessionsPerWeek: number;
  difficulty: ExerciseDifficulty;
  goals: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  trainer: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  client?: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  sessions?: ProgramSessionResponse[];
}

export interface ProgramSessionResponse {
  id: number;
  programId: number;
  name: string;
  dayOfWeek?: number;
  weekNumber: number;
  order: number;
  restDay: boolean;
  createdAt: Date;
  exercises?: ProgramExerciseResponse[];
}

export interface ProgramExerciseResponse {
  id: number;
  sessionId: number;
  exerciseId: number;
  order: number;
  sets: number;
  reps: string;
  weight?: number;
  restPeriod: number;
  tempo?: string;
  rpe?: number;
  notes?: string;
  isSuperset: boolean;
  supersetGroup?: number;
  createdAt: Date;
  exercise: ExerciseResponse;
}