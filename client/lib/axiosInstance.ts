// lib/axiosInstance.ts
import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. https://api.yoursite.com
  withCredentials: true, // send & receive cookies
});

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage or other storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response?.status === 401) {
      const responseData = error.response.data;

      console.log('🚨 401 Unauthorized detected:', responseData);

      // Check for the specific error format first
      const isSpecificSessionError =
        responseData?.message === 'Invalid or expired session cookie' &&
        responseData?.error === 'Unauthorized' &&
        responseData?.statusCode === 401;

      // Handle any 401 error, but log differently for the specific case
      if (isSpecificSessionError) {
        console.log(
          '🔐 Specific session expired error detected, redirecting to login...'
        );
      } else {
        console.log('🔐 General 401 error detected, redirecting to login...');
      }

      // Clear any stored auth tokens
      localStorage.removeItem('authToken');

      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
