import axios from 'axios';
import { User } from '../types/auth.types';

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

export const userService = {
  // Get all users with role USER (clients) for the current trainer
  async getClients(): Promise<User[]> {
    try {
      const response = await api.get('/auth/clients');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      throw error;
    }
  },

  // Search clients by name or email
  async searchClients(query: string): Promise<User[]> {
    const clients = await this.getClients();
    const lowerQuery = query.toLowerCase();
    
    return clients.filter(client => 
      (client.firstName?.toLowerCase().includes(lowerQuery)) ||
      (client.lastName?.toLowerCase().includes(lowerQuery)) ||
      (client.username.toLowerCase().includes(lowerQuery)) ||
      (client.email.toLowerCase().includes(lowerQuery))
    );
  },

  // Get a specific user by ID
  async getUser(id: number): Promise<User> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      // Fallback to mock data
      const clients = await this.getClients();
      const client = clients.find(c => c.id === id);
      if (!client) {
        throw new Error('Client not found');
      }
      return client;
    }
  },

  // Get client details including weight, progress, and workouts
  async getClientDetails(clientId: number): Promise<any> {
    try {
      const response = await api.get(`/auth/clients/${clientId}/details`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch client details:', error);
      throw error;
    }
  }
};