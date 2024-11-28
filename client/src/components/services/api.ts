import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Log requests and responses for debugging
api.interceptors.request.use((config: AxiosRequestConfig) => {
  console.log('Request made with config:', config);
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific HTTP status codes
      if (error.response.status === 401) {
        console.error('Unauthorized access - redirecting to login');
        window.location.href = '/login'; // Optional: Redirect user to login if unauthorized
      }
      console.error(`API Error (Status ${error.response.status}):`, error.response?.data);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error.response?.data || error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<{ token: string; user: User }> => {
    try {
      const response = await api.post('/login', data);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  register: async (data: RegisterData): Promise<{ token: string; user: User }> => {
    try {
      const response = await api.post('/register', data);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  verifyToken: async (): Promise<{ user: User }> => {
    try {
      const response = await api.get('/verify-token');
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  },
};

export default api;
