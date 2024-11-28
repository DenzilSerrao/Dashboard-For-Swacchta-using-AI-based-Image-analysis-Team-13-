import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
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
    const response = await api.post('/login', data);
    return response.data;
  },
  register: async (data: RegisterData): Promise<{ token: string; user: User }> => {
    const response = await api.post('/register', data);
    return response.data;
  },
  verifyToken: async (): Promise<{ user: User }> => {
    const response = await api.get('/verify-token');
    return response.data;
  },
};

export default api;
