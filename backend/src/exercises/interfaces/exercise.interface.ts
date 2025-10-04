import { ExerciseCategory, ExerciseDifficulty } from '@prisma/client';

export interface ExerciseResponse {
  id: number;
  name: string;
  nameEn?: string;
  description?: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  muscleGroups: string[];
  equipment: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  instructions: string[];
  tips?: string[];
  isActive: boolean;
  createdBy?: number;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
  };
}