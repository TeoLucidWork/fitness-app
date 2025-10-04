import { Exercise, ExerciseDifficulty } from './exercise.types';

export interface Program {
  id: number;
  name: string;
  description?: string;
  trainerId: number;
  clientId?: number;
  isTemplate: boolean;
  duration: number; // weeks
  sessionsPerWeek: number;
  difficulty: ExerciseDifficulty;
  goals: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  sessions?: ProgramSession[];
}

export interface ProgramSession {
  id: number;
  programId: number;
  name: string;
  dayOfWeek?: number;
  weekNumber: number;
  order: number;
  restDay: boolean;
  createdAt: string;
  exercises?: ProgramExercise[];
}

export interface ProgramExercise {
  id: number;
  sessionId: number;
  exerciseId: number;
  order: number;
  sets: number;
  reps: string; // "8-12", "10", "AMRAP", "30 seconds", etc.
  weight?: number; // suggested weight in kg
  restPeriod: number; // seconds
  tempo?: string; // "3-1-2-1" (eccentric-pause-concentric-pause)
  rpe?: number; // Rate of Perceived Exertion 1-10
  notes?: string; // trainer comments
  isSuperset: boolean;
  supersetGroup?: number;
  createdAt: string;
  exercise: Exercise;
}

// DTOs for creating/updating
export interface CreateProgramDto {
  name: string;
  description?: string;
  clientId?: number;
  isTemplate?: boolean;
  duration: number; // weeks
  sessionsPerWeek: number;
  difficulty: ExerciseDifficulty;
  goals: string[];
  isActive?: boolean;
}

export interface CreateProgramSessionDto {
  name: string;
  dayOfWeek?: number;
  weekNumber: number;
  order: number;
  restDay: boolean;
}

export interface CreateProgramExerciseDto {
  exerciseId: number;
  order: number;
  sets: number;
  reps: string;
  weight?: number;
  restPeriod: number;
  tempo?: string;
  rpe?: number;
  notes?: string;
  isSuperset?: boolean;
  supersetGroup?: number;
}

// For the program builder component
export interface ProgramExerciseConfig {
  exercise: Exercise;
  sets: number;
  reps: string;
  weight?: number;
  rpe?: number;
  tempo?: string;
  notes?: string;
  order: number;
}

// Program goals options
export const PROGRAM_GOALS = [
  'strength',
  'hypertrophy', 
  'endurance',
  'weight_loss',
  'mobility',
  'conditioning'
] as const;

export type ProgramGoal = typeof PROGRAM_GOALS[number];

// Bulgarian translations for goals
export const GoalTranslations: Record<ProgramGoal, string> = {
  strength: 'Сила',
  hypertrophy: 'Мускулна маса',
  endurance: 'Издръжливост',
  weight_loss: 'Отслабване',
  mobility: 'Подвижност',
  conditioning: 'Кондиция'
};