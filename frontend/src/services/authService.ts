import API from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  role: 'INDIVIDUAL' | 'ISSUER' | 'EMPLOYER';
  password: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'INDIVIDUAL' | 'ISSUER' | 'EMPLOYER' | 'ADMIN';
  avatar?: string;
  bio?: string;
  skills?: string[];
  organization?: string;
  location?: string;
  experience?: string;
  profileVisibility?: 'public' | 'private';
}

interface AuthResponse {
  user: User;
  token: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await API.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await API.post<ApiResponse<AuthResponse>>('/auth/register', data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async verifyToken(): Promise<User> {
    try {
      // The token is already attached by the interceptor in api.ts
      const response = await API.get<ApiResponse<User>>('/auth/verify');
      return response.data.data;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  logout() {
    // Context handles token removal
  }
}

export const authService = new AuthService();