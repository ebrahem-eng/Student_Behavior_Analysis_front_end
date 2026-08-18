import { api } from '@/lib/api';
import type { AuthResponse, User, UserRole } from '@/types/api';

/**
 * Robust helper to extract and normalize User object from any Laravel / Sanctum JSON response
 */
export function normalizeUserResponse(payload: any, fallbackRole?: UserRole | null): User {
  // Unwrap nested Laravel JsonResource envelopes (payload.data.user, payload.user.data, payload.data, payload.user, or payload)
  const raw = payload?.data?.user || payload?.user?.data || payload?.data || payload?.user || payload || {};

  // Extract roles array
  let roles: string[] = [];
  if (Array.isArray(raw.roles)) {
    roles = raw.roles.map((r: any) => (typeof r === 'string' ? r : r?.name || '')).filter(Boolean);
  } else if (typeof raw.role === 'string') {
    roles = [raw.role];
  }

  // Determine normalized primary role
  let determinedRole: UserRole | null = null;
  if (roles.length > 0) {
    const firstRole = roles[0].toLowerCase();
    if (['admin', 'teacher', 'advisor', 'student', 'parent'].includes(firstRole)) {
      determinedRole = firstRole as UserRole;
    }
  } else if (raw.role) {
    const roleStr = String(raw.role).toLowerCase();
    if (['admin', 'teacher', 'advisor', 'student', 'parent'].includes(roleStr)) {
      determinedRole = roleStr as UserRole;
    }
  }

  // If role is still not found, use provided fallback or cached role from localStorage
  if (!determinedRole) {
    if (fallbackRole) {
      determinedRole = fallbackRole;
    } else {
      try {
        const cached = localStorage.getItem('auth_user');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.role) determinedRole = parsed.role;
        }
      } catch (e) {
        // ignore
      }
    }
  }

  const finalRole: UserRole = determinedRole || 'admin';

  return {
    id: raw.id,
    name: raw.name || '',
    email: raw.email || '',
    role: finalRole,
    roles: roles.length > 0 ? roles : [finalRole],
    institution_id: raw.institution_id,
    institution_name: raw.institution?.name || raw.institution_name,
    avatar_url: raw.avatar_url,
    phone: raw.phone,
    created_at: raw.created_at,
  };
}

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
    const res = await api.post<any>('/auth/login', {
      email,
      password,
      device_name: 'sba-web-client',
    });

    const data = res.data;
    const token = data.access_token || data.token || '';
    const normalizedUser = normalizeUserResponse(data);

    return {
      ...data,
      token,
      access_token: token,
      user: normalizedUser,
    };
  },

  /**
   * Get current authenticated user profile from Laravel /auth/me
   */
  async getMe(): Promise<User> {
    const res = await api.get<any>('/auth/me');
    return normalizeUserResponse(res.data);
  },

  /**
   * Update user profile information via PUT /auth/profile
   */
  async updateProfile(data: { name: string; email: string; phone?: string; avatar_url?: string }): Promise<User> {
    const res = await api.put<any>('/auth/profile', data);
    const normalized = normalizeUserResponse(res.data);
    localStorage.setItem('auth_user', JSON.stringify(normalized));
    return normalized;
  },

  /**
   * Update user password via PUT /auth/password
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
