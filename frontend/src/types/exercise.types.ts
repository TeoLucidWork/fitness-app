export enum ExerciseCategory {
  CHEST = 'CHEST',
  BACK = 'BACK',
  LEGS = 'LEGS',
  SHOULDERS = 'SHOULDERS',
  ARMS = 'ARMS',
  CORE = 'CORE',
  CARDIO = 'CARDIO',
  FULL_BODY = 'FULL_BODY'
}

export enum ExerciseDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface Exercise {
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
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: number;
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface ExerciseFilters {
  category?: ExerciseCategory;
  difficulty?: ExerciseDifficulty;
  muscleGroup?: string;
  search?: string;
}

// Bulgarian category translations
export const CategoryTranslations: Record<ExerciseCategory, string> = {
  [ExerciseCategory.CHEST]: 'Гърди',
  [ExerciseCategory.BACK]: 'Гръб',
  [ExerciseCategory.LEGS]: 'Крака',
  [ExerciseCategory.SHOULDERS]: 'Рамене',
  [ExerciseCategory.ARMS]: 'Ръце',
  [ExerciseCategory.CORE]: 'Коремни',
  [ExerciseCategory.CARDIO]: 'Кардио',
  [ExerciseCategory.FULL_BODY]: 'Цяло тяло'
};

// Bulgarian difficulty translations
export const DifficultyTranslations: Record<ExerciseDifficulty, string> = {
  [ExerciseDifficulty.BEGINNER]: 'Начинаещ',
  [ExerciseDifficulty.INTERMEDIATE]: 'Среден',
  [ExerciseDifficulty.ADVANCED]: 'Напреднал'
};

// Difficulty colors
export const DifficultyColors: Record<ExerciseDifficulty, string> = {
  [ExerciseDifficulty.BEGINNER]: '#4CAF50', // Green
  [ExerciseDifficulty.INTERMEDIATE]: '#FF9800', // Orange  
  [ExerciseDifficulty.ADVANCED]: '#F44336' // Red
};