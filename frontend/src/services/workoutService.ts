import axios from 'axios';
import {
  WorkoutLog,
  CreateWorkoutLogDto,
  UpdateWorkoutLogDto,
  CreateExerciseLogDto,
  UpdateExerciseLogDto,
  WorkoutStats,
  ExerciseLog
} from '../types/workout.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const workoutService = {
  // Create a new workout log
  async createWorkoutLog(workoutData: CreateWorkoutLogDto): Promise<WorkoutLog> {
    const response = await api.post('/workouts/logs', workoutData);
    return response.data;
  },

  // Get all workout logs for the current user
  async getWorkoutLogs(): Promise<WorkoutLog[]> {
    const response = await api.get('/workouts/logs');
    return response.data;
  },

  // Get a specific workout log
  async getWorkoutLog(id: number): Promise<WorkoutLog> {
    const response = await api.get(`/workouts/logs/${id}`);
    return response.data;
  },

  // Update a workout log
  async updateWorkoutLog(id: number, workoutData: UpdateWorkoutLogDto): Promise<WorkoutLog> {
    const response = await api.patch(`/workouts/logs/${id}`, workoutData);
    return response.data;
  },

  // Delete a workout log
  async deleteWorkoutLog(id: number): Promise<void> {
    await api.delete(`/workouts/logs/${id}`);
  },

  // Add exercise log to existing workout
  async addExerciseLog(workoutLogId: number, exerciseData: CreateExerciseLogDto): Promise<ExerciseLog> {
    const response = await api.post(`/workouts/logs/${workoutLogId}/exercises`, exerciseData);
    return response.data;
  },

  // Update exercise log
  async updateExerciseLog(exerciseLogId: number, exerciseData: UpdateExerciseLogDto): Promise<ExerciseLog> {
    const response = await api.patch(`/workouts/exercise-logs/${exerciseLogId}`, exerciseData);
    return response.data;
  },

  // Get workout statistics
  async getWorkoutStats(clientId?: number): Promise<WorkoutStats> {
    const params = clientId ? { clientId } : {};
    const response = await api.get('/workouts/stats', { params });
    return response.data;
  },

  // Start a workout session (creates a workout log with isCompleted: false)
  async startWorkout(programSessionId: number, notes?: string): Promise<WorkoutLog> {
    return this.createWorkoutLog({
      programSessionId,
      notes,
      isCompleted: false
    });
  },

  // Complete a workout session
  async completeWorkout(workoutLogId: number, rating?: number, notes?: string): Promise<WorkoutLog> {
    return this.updateWorkoutLog(workoutLogId, {
      isCompleted: true,
      rating,
      notes
    });
  }
};