export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  CUSTOMER: {
    EVENTS: '/events',
    BOOKINGS: '/bookings',
  },
  ORGANISER: {
    CREATE_EVENT: '/organiser/events',
    MANAGE_EVENTS: '/organiser/events/manage',
    SCAN_TICKET: '/organiser/tickets/scan',
  },
  ADMIN: {
    APPROVE_EVENTS: '/admin/events/approve',
    USERS: '/admin/users',
  },
};