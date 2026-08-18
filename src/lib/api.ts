import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true' || import.meta.env.DEV;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Request Interceptor: Attach JWT / Bearer Token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API] 401 Unauthorized — clearing credentials');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    return Promise.reject(error);
  }
);

/**
 * Utility wrapper to execute API calls with graceful mock fallback
 */
export async function fetchWithFallback<T>(
  apiCall: () => Promise<{ data: T }>,
  mockData: T,
  label: string = 'Endpoint'
): Promise<T> {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    if (ENABLE_MOCK_FALLBACK) {
      console.info(`[API Fallback] ${label} backend offline, serving local mock state.`);
      return mockData;
    }
    throw error;
  }
}
