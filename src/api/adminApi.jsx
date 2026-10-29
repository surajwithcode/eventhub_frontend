import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const getPendingEventsApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.APPROVE_EVENTS);
  return response.data;
};

export const approveEventApi = async (eventId, status) => {
  const response = await axiosInstance.patch(`${API_ENDPOINTS.ADMIN.APPROVE_EVENTS}/${eventId}`, { status });
  return response.data;
};

export const getAllUsersApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS);
  return response.data;
};