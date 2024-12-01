import { create } from "zustand";
import { authApi } from "../services/api";
import { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  uploadStatus: "Success" | "Failed" | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUploadStatus: (status: "Success" | "Failed" | null) => void;
  ping : () => Promise<void>;
  uploadFile: (file: File) => Promise<any>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isUploading: false,
  uploadStatus: null,
  setUploadStatus: (status) => set({ uploadStatus: status }),

  uploadFile: async (file: File) => {
    try {
      const response = await authApi.uploadFile(file); // Call the function from `api.ts`
      if(response){
        set({uploadStatus : "Success"})
      } else {
        set({uploadStatus : "Failed"})
      }
      return response; // Return the response to the caller
    } catch (error) {
      console.error("Error uploading file:", error);
      set({uploadStatus : "Failed"})
      throw error;
    }
  },

  ping: async () => {
    const retryInterval = 5000; // Retry every 5 seconds
    const checkServerReady = async () => {
      try {
        const response = await authApi.ping();
        if (response.status === "ok" && response.message === "Server is ready") {
          set({ isLoading: false });
          console.log("Server is ready!");
        } else {
          console.log("Server not ready, retrying...");
          setTimeout(checkServerReady, retryInterval); // Retry after interval
        }
      } catch (error) {
        console.error("Ping error, retrying:", error);
        setTimeout(checkServerReady, retryInterval); // Retry after interval
      }
    };
  
    checkServerReady();
  },
  
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('token', response.token);
      set({ user: response.user, isAuthenticated: true });
      console.log(response.user)
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
    const retryInterval = 5000;
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
