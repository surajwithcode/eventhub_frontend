import axios from 'axios';
import { getItem, clearStorage } from '../services/storageService';

// Base Axios instance configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:9190',
});

// 1. Request Interceptor: Attach JWT Token to every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getItem('userToken');

    // Agar token valid aur present hai toh Bearer Header add karein
    if (token && token !== 'session-active-token') {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Handle Token Expiration or Auth Errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Session Expired or Unauthorized. Logging out...');
      clearStorage();
      
      // Prevent infinite reload loop if already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;