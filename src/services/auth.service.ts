import { api } from '@/lib/api';
import type { AuthResponse, User, UserRole } from '@/types/api';

export const authService = {
  /**
   * Fetch CSRF cookie for Laravel Sanctum SPA authentication
   */
  async getCsrfCookie(): Promise<void> {
    try {
      await api.get('/sanctum/csrf-cookie', { baseURL: 'http://localhost:8000' });
    } catch (e) {
      // Sanctum cookie optional if using Bearer token authentication
    }
  },

  /**
   * Login user with real email & password via Laravel Sanctum API
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
      device_name: 'sba-web-client',
    });

    const data = res.data;
    const token = data.access_token || data.token || '';
    
    // Normalize role from Spatie roles array or direct role field
    let determinedRole: UserRole = "student";
    if (data.user?.roles && data.user.roles.length > 0) {
      determinedRole = data.user.roles[0].toLowerCase() as UserRole;
    } else if (data.user?.role) {
      determinedRole = data.user.role.toLowerCase() as UserRole;
    }

    const normalizedUser: User = {
      ...data.user,
      role: determinedRole,
    };

    return {
      ...data,
      token,
      access_token: token,
      user: normalizedUser,
    };
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(): Promise<User> {
    const res = await api.get<User>('/auth/me');
    let determinedRole: UserRole = "student";
    if (res.data?.roles && res.data.roles.length > 0) {
      determinedRole = res.data.roles[0].toLowerCase() as UserRole;
    } else if (res.data?.role) {
      determinedRole = res.data.role.toLowerCase() as UserRole;
    }

    return {
      ...res.data,
      role: determinedRole,
    };
  },

  /**
   * Update user profile information
   */
  async updateProfile(data: { name: string; email: string; phone?: string; avatar_url?: string }): Promise<User> {
    const res = await api.put<{ message: string; user: User }>('/auth/profile', data);
    const updatedUser = res.data.user;
    
    let determinedRole: UserRole = "student";
    if (updatedUser?.roles && updatedUser.roles.length > 0) {
      determinedRole = updatedUser.roles[0].toLowerCase() as UserRole;
    } else if (updatedUser?.role) {
      determinedRole = updatedUser.role.toLowerCase() as UserRole;
    }

    const normalized: User = {
      ...updatedUser,
      role: determinedRole,
    };

    localStorage.setItem('auth_user', JSON.stringify(normalized));
    return normalized;
  },

  /**
   * Update user password
   */
  async updatePassword(data: { current_password: string; password: string; password_confirmation: string }): Promise<{ message: string }> {
    const res = await api.put<{ message: string }>('/auth/password', data);
    return res.data;
  },

  /**
   * Logout user and invalidate token on Laravel server
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
