import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // For Sanctum CSRF cookies
});

// Interceptor for auth tokens (if using JWT instead of Sanctum cookies)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g. redirect to login)
      console.warn("Unauthorized access - redirecting to login");
    }
    return Promise.reject(error);
  }
);
