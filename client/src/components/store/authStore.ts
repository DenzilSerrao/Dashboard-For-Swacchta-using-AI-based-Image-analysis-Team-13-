import { create } from "zustand";
import { authApi } from "../services/api";
import { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('token', response.token);
      console.log(response.token)
      console.log(response.token)
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register({ name, email, password });
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      console.error('Register error:', error);
      throw new Error('Registration failed. Please try again later.');
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in localStorage');
      }
      const response = await authApi.verifyToken();
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear token in case of any error
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
