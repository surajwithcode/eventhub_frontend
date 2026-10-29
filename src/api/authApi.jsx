import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const loginApi = async (credentials) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  return response.data;
};

export const forgotPasswordApi = async (email) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  return response.data;
};