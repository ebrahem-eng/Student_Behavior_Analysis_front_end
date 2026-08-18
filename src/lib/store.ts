import { create } from 'zustand';
import type { User, UserRole } from '@/types/api';

interface AppState {
  user: User | null;
  userRole: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setUserRole: (role: string | null) => void;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

// Initial state from localStorage if present
const initialToken = localStorage.getItem('auth_token');
const initialUserJson = localStorage.getItem('auth_user');
let parsedUser: User | null = null;
if (initialUserJson) {
  try {
    parsedUser = JSON.parse(initialUserJson);
  } catch (e) {
    console.error('Failed to parse cached user:', e);
  }
}

export const useAppStore = create<AppState>()((set) => ({
  user: parsedUser,
  userRole: (parsedUser?.role as UserRole) || null,
  token: initialToken,
  isAuthenticated: !!initialToken,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user, userRole: user.role, isAuthenticated: true });
    } else {
      localStorage.removeItem('auth_user');
      set({ user: null, userRole: null, isAuthenticated: false });
    }
  },

  setUserRole: (role) => {
    const validRole = role as UserRole | null;
    set((state) => {
      const updatedUser = state.user ? { ...state.user, role: validRole || 'student' } : null;
      if (updatedUser) {
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      }
      return { userRole: validRole, user: updatedUser };
    });
  },

  setAuth: (user, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user, token, userRole: user.role, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, userRole: null, isAuthenticated: false });
  },
}));
