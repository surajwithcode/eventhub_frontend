import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              padding: '10px 16px',
              marginBottom: 10,
              borderRadius: 6,
              color: '#fff',
              background: n.type === 'error' ? '#ef4444' : n.type === 'success' ? '#10b981' : '#3b82f6',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};