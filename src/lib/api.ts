import axios, { AxiosError } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Request Interceptor: Inject Sanctum Bearer Token
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

// Response Interceptor: Extract descriptive error messages and handle 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      console.warn('[API] 401 Unauthorized — clearing credentials');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    return Promise.reject(error);
  }
);

/**
 * Format any API or Network error into a clean user-facing message
 */
export function getApiErrorMessage(error: any, isArabic = false): string {
  if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
    return isArabic
      ? `تعذر الاتصال بخادم الباك إند على الرابط (${API_BASE_URL}). يرجى التأكد من تشغيل الخادم.`
      : `Cannot connect to backend server at (${API_BASE_URL}). Please verify that your Laravel backend server is running.`;
  }

  const responseData = error?.response?.data;
  if (responseData?.errors) {
    const firstKey = Object.keys(responseData.errors)[0];
    if (firstKey && responseData.errors[firstKey]?.length) {
      return responseData.errors[firstKey][0];
    }
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (error?.response?.status === 404) {
    return isArabic ? "نقطة النهاية المطلوبة غير موجودة (404)." : "Requested API endpoint not found (404).";
  }

  if (error?.response?.status === 500) {
    return isArabic ? "خطأ داخلي في خادم الباك إند (500)." : "Internal server error occurred (500).";
  }

  return error?.message || (isArabic ? "حدث خطأ غير متوقع." : "An unexpected error occurred.");
}
