import { io } from 'socket.io-client';

let socket = null;

export const initiateSocketConnection = (token) => {
  const SOCKET_URL = process.env.SOCKET_URL || 'https://api.eventhub.com';
  socket = io(SOCKET_URL, {
    auth: { token },
  });
};

export const subscribeToEventUpdates = (eventId, callback) => {
  if (!socket) return;
  socket.emit('joinEventRoom', { eventId });
  socket.on('eventUpdated', (data) => callback(null, data));
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};