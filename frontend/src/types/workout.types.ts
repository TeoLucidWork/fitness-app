export interface WorkoutLog {
  id: number;
  userId: number;
  programSessionId: number;
  startedAt: string;
  completedAt: string | null;
  notes: string | null;
  rating: number | null; // 1-5 stars
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    username: string;
    email: string;
    trainerId?: number | null;
  };
  programSession?: {
    id: number;
    name: string;
    program: {
      id: number;
      name: string;
      description: string | null;
      trainerId?: number;
    };
    exercises?: Array<{
      id: number;
      order: number;
      sets: number;
      reps: string;
      weight: number | null;
      restPeriod: number;
      rpe: number | null;
      notes: string | null;
      isSuperset: boolean;
      exercise: {
        id: number;
        name: string;
        nameEn: string | null;
        category: string;
      };
    }>;
  };
  exerciseLogs?: ExerciseLog[];
}

export interface ExerciseLog {
  id: number;
  workoutLogId: number;
  programExerciseId: number;
  actualSets: number;
  actualReps: string; // "8,10,12" - comma separated reps per set
  actualWeight: string | null; // "50,52.5,55" - comma separated weights per set
  actualRestPeriod: number | null; // actual rest taken in seconds
  actualRpe: number | null; // actual RPE 1-10
  notes: string | null;
  isCompleted: boolean;
  createdAt: string;
  programExercise?: {
    id: number;
    sets: number;
    reps: string;
    weight: number | null;
    restPeriod: number;
    rpe: number | null;
    notes: string | null;
    isSuperset: boolean;
    exercise: {
      id: number;
      name: string;
      nameEn: string | null;
      category: string;
    };
  };
}

export interface CreateWorkoutLogDto {
  programSessionId: number;
  notes?: string;
  rating?: number; // 1-5 stars
  isCompleted?: boolean;
  exerciseLogs?: CreateExerciseLogDto[];
}

export interface CreateExerciseLogDto {
  programExerciseId: number;
  actualSets: number;
  actualReps: string; // "8,10,12" - comma separated reps per set
  actualWeight?: string; // "50,52.5,55" - comma separated weights per set
  actualRestPeriod?: number; // actual rest taken in seconds
  actualRpe?: number; // actual RPE 1-10
  notes?: string;
  isCompleted?: boolean;
}

export interface UpdateWorkoutLogDto {
  notes?: string;
  rating?: number; // 1-5 stars
  isCompleted?: boolean;
}

export interface UpdateExerciseLogDto {
  actualSets?: number;
  actualReps?: string;
  actualWeight?: string;
  actualRestPeriod?: number;
  actualRpe?: number;
  notes?: string;
  isCompleted?: boolean;
}

export interface WorkoutStats {
  totalWorkouts: number;
  workoutsThisWeek: number;
  averageRating: number | null;
  recentWorkout: {
    id: number;
    completedAt: string;
    sessionName: string;
    programName: string;
    rating: number | null;
  } | null;
}