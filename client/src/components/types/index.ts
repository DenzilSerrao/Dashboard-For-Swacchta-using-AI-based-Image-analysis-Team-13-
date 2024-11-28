export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AlertData {
  id: string;
  type: 'cleanliness' | 'green' | 'waste';
  severity: 'low' | 'medium' | 'high';
  location: string;
  timestamp: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}