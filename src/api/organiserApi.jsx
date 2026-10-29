import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const createEventApi = async (eventData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ORGANISER.CREATE_EVENT, eventData);
  return response.data;
};

export const getOrganiserEventsApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.ORGANISER.MANAGE_EVENTS);
  return response.data;
};

export const scanTicketApi = async (ticketData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ORGANISER.SCAN_TICKET, ticketData);
  return response.data;
};