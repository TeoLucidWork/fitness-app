import axios from 'axios';
import { Exercise, ExerciseFilters } from '../types/exercise.types';

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

export const exerciseService = {
  async getExercises(filters?: ExerciseFilters): Promise<Exercise[]> {
    const params = new URLSearchParams();
    
    if (filters?.category) {
      params.append('category', filters.category);
    }
    if (filters?.difficulty) {
      params.append('difficulty', filters.difficulty);
    }
    if (filters?.muscleGroup) {
      params.append('muscleGroup', filters.muscleGroup);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const response = await api.get(`/exercises?${params.toString()}`);
    return response.data;
  },

  async getExercise(id: number): Promise<Exercise> {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  },

  async createExercise(exerciseData: Partial<Exercise>): Promise<Exercise> {
    const response = await api.post('/exercises', exerciseData);
    return response.data;
  },

  async updateExercise(id: number, exerciseData: Partial<Exercise>): Promise<Exercise> {
    const response = await api.patch(`/exercises/${id}`, exerciseData);
    return response.data;
  },

  async deleteExercise(id: number): Promise<void> {
    await api.delete(`/exercises/${id}`);
  },

  // Helper function to get YouTube thumbnail
  getYouTubeThumbnail(videoUrl: string, quality: 'default' | 'hqdefault' | 'maxresdefault' = 'hqdefault'): string {
    // Extract video ID from different YouTube URL formats
    const videoId = this.extractYouTubeId(videoUrl);
    if (!videoId) return '';
    
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  },

  // Helper function to get YouTube embed URL
  getYouTubeEmbedUrl(videoUrl: string): string {
    const videoId = this.extractYouTubeId(videoUrl);
    if (!videoId) return '';
    
    return `https://www.youtube.com/embed/${videoId}`;
  },

  // Extract YouTube video ID from various URL formats
  extractYouTubeId(url: string): string {
    if (!url) return '';
    
    // If it's already just an ID
    if (url.length === 11 && !url.includes('/')) {
      return url;
    }
    
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : '';
  }
};