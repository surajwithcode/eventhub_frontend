import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const getEventsApi = async (params) => {
  const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER.EVENTS, { params });
  return response.data;
};

export const bookTicketApi = async (bookingData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.CUSTOMER.BOOKINGS, bookingData);
  return response.data;
};

export const getMyBookingsApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER.BOOKINGS);
  return response.data;
};