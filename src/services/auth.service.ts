import { api, fetchWithFallback } from '@/lib/api';
import type { AuthResponse, User, UserRole } from '@/types/api';

export const authService = {
  /**
   * Fetch CSRF cookie for Laravel Sanctum SPA authentication
   */
  async getCsrfCookie(): Promise<void> {
    try {
      await api.get('/sanctum/csrf-cookie', { baseURL: 'http://localhost:8000' });
    } catch (e) {
      // Ignore if running token-only
    }
  },

  /**
   * Login user with email & password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    let role: UserRole = "student";
    let name = "Alex Johnson";
    if (email.includes("admin")) {
      role = "admin";
      name = "Ebrahem Admin";
    } else if (email.includes("teacher") || email.includes("faculty")) {
      role = "teacher";
      name = "Dr. Sarah Adams";
    } else if (email.includes("advisor") || email.includes("counselor")) {
      role = "advisor";
      name = "Marcus Vance (Advisor)";
    } else if (email.includes("parent") || email.includes("guardian")) {
      role = "parent";
      name = "Robert & Elena Johnson";
    }

    const mockResponse: AuthResponse = {
      token: `mock-jwt-token-${Date.now()}`,
      token_type: "Bearer",
      user: {
        id: 1,
        name,
        email,
        role,
        institution_name: "King Fahd University / Global Academy",
        created_at: new Date().toISOString(),
      },
    };

    return fetchWithFallback(
      () => api.post<AuthResponse>('/auth/login', { email, password }),
      mockResponse,
      'Auth Login'
    );
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(): Promise<User> {
    return fetchWithFallback(
      () => api.get<User>('/auth/me'),
      {
        id: 1,
        name: "Authenticated User",
        email: "user@sba-platform.edu",
        role: "admin",
      },
      'Auth Me'
    );
  },

  /**
   * Logout user and invalidate token
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Backend logout offline:', e);
    }
  },
};
