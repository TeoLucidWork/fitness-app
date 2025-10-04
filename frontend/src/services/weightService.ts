import axios from 'axios';
import {
  WeightEntry,
  CreateWeightEntryDto,
  UpdateWeightEntryDto,
  WeightStats,
  WeightProgressEntry
} from '../types/weight.types';

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

export const weightService = {
  // Create a new weight entry
  async createWeightEntry(data: CreateWeightEntryDto): Promise<WeightEntry> {
    const response = await api.post('/weight', data);
    return response.data;
  },

  // Get weight entries (optionally for a specific client if trainer)
  async getWeightEntries(clientId?: number): Promise<WeightEntry[]> {
    const params = new URLSearchParams();
    if (clientId) {
      params.append('clientId', clientId.toString());
    }

    const response = await api.get(`/weight?${params.toString()}`);
    return response.data;
  },

  // Get specific weight entry
  async getWeightEntry(id: number): Promise<WeightEntry> {
    const response = await api.get(`/weight/${id}`);
    return response.data;
  },

  // Update weight entry
  async updateWeightEntry(id: number, data: UpdateWeightEntryDto): Promise<WeightEntry> {
    const response = await api.patch(`/weight/${id}`, data);
    return response.data;
  },

  // Delete weight entry
  async deleteWeightEntry(id: number): Promise<void> {
    await api.delete(`/weight/${id}`);
  },

  // Get weight statistics
  async getWeightStats(clientId?: number): Promise<WeightStats> {
    const params = new URLSearchParams();
    if (clientId) {
      params.append('clientId', clientId.toString());
    }

    const response = await api.get(`/weight/stats?${params.toString()}`);
    return response.data;
  },

  // Get weight progress data for charts
  async getWeightProgress(clientId?: number, days?: number): Promise<WeightProgressEntry[]> {
    const params = new URLSearchParams();
    if (clientId) {
      params.append('clientId', clientId.toString());
    }
    if (days) {
      params.append('days', days.toString());
    }

    const response = await api.get(`/weight/progress?${params.toString()}`);
    return response.data;
  },
};