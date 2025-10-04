import axios from 'axios';
import { 
  Program, 
  CreateProgramDto, 
  CreateProgramSessionDto, 
  CreateProgramExerciseDto,
  ProgramSession,
  ProgramExercise
} from '../types/program.types';

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

export const programService = {
  // Program CRUD operations
  async getPrograms(): Promise<Program[]> {
    const response = await api.get('/programs');
    return response.data;
  },

  async getMyPrograms(): Promise<Program[]> {
    const response = await api.get('/programs/my-programs');
    return response.data;
  },

  async getProgram(id: number): Promise<Program> {
    const response = await api.get(`/programs/${id}`);
    return response.data;
  },

  async createProgram(programData: CreateProgramDto): Promise<Program> {
    const response = await api.post('/programs', programData);
    return response.data;
  },

  async updateProgram(id: number, programData: Partial<CreateProgramDto>): Promise<Program> {
    const response = await api.patch(`/programs/${id}`, programData);
    return response.data;
  },

  async deleteProgram(id: number): Promise<void> {
    await api.delete(`/programs/${id}`);
  },

  // Program Session operations
  async addSession(programId: number, sessionData: CreateProgramSessionDto): Promise<ProgramSession> {
    const response = await api.post(`/programs/${programId}/sessions`, sessionData);
    return response.data;
  },

  async updateSession(sessionId: number, sessionData: Partial<CreateProgramSessionDto>): Promise<ProgramSession> {
    const response = await api.patch(`/programs/sessions/${sessionId}`, sessionData);
    return response.data;
  },

  async deleteSession(sessionId: number): Promise<void> {
    await api.delete(`/programs/sessions/${sessionId}`);
  },

  // Program Exercise operations
  async addExerciseToSession(sessionId: number, exerciseData: CreateProgramExerciseDto): Promise<ProgramExercise> {
    const response = await api.post(`/programs/sessions/${sessionId}/exercises`, exerciseData);
    return response.data;
  },

  async updateExerciseInSession(exerciseId: number, exerciseData: Partial<CreateProgramExerciseDto>): Promise<ProgramExercise> {
    const response = await api.patch(`/programs/exercises/${exerciseId}`, exerciseData);
    return response.data;
  },

  async removeExerciseFromSession(exerciseId: number): Promise<void> {
    await api.delete(`/programs/exercises/${exerciseId}`);
  },

};