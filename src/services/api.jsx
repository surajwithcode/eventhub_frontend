import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export async function setToken(token) {
  if (Capacitor.isNativePlatform()) {
    await Preferences.set({ key: 'token', value: token });
  } else {
    localStorage.setItem('token', token);
  }
}

export const EventService = {
  getAllEvents: async () => {
    return [
      { id: 1, title: 'Tech Conference 2026', description: 'AI, Web3, and Mobile App Expo.', date: 'Nov 15, 2026', price: '₹499' },
      { id: 2, title: 'Music Concert Live', description: 'Live concert event featuring top performers.', date: 'Dec 01, 2026', price: '₹999' }
    ];
  },
  createEvent: async (eventData) => {
    return { success: true, ...eventData };
  },
  registerEvent: async (eventId) => {
    return { success: true };
  }
};

export const AuthService = {
  login: async (credentials) => {
    await setToken('mock-token-12345');
    return { token: 'mock-token-12345' };
  }
};
