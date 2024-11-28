import { create } from "zustand";
import { authApi } from "../services/api";
import {User } from "../types";

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

  login: async (email: any, password: any) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('token', response.token);
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name: any, email: any, password: any) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register({ name, email, password });
      localStorage.setItem('token', response.token);
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
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
        throw new Error('No token');
      }
      const response = await authApi.verifyToken();
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
