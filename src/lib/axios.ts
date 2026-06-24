import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/redux/store';
import { setCredentials, logout } from '@/features/auth/slice';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1',
  withCredentials: true, // Send cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach access token ─────────────
api.interceptors.request.use(
  (config) => {
    // Read from Redux store first, fall back to localStorage
    const storeToken = store.getState().auth.accessToken;
    const token = storeToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Refresh token mutex ────────────
// When multiple requests fail with 401 simultaneously, only ONE refresh
// call is made. All others are queued and replayed after the refresh.

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only attempt refresh on 401 errors, not on the refresh endpoint itself
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/refresh-token') ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register')
    ) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }).catch((err) => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Attempt to refresh the token
      const refreshResponse = await axios.post(
        `${api.defaults.baseURL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = refreshResponse.data.data.accessToken;

      // Update Redux store and localStorage
      store.dispatch(setCredentials({ accessToken: newAccessToken }));

      // Process queued requests with the new token
      processQueue(null, newAccessToken);

      // Retry the original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed — clear auth state and redirect to login
      processQueue(refreshError, null);
      store.dispatch(logout());

      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;

