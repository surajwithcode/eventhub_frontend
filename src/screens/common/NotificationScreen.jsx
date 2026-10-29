import React from 'react';

const NotificationScreen = () => {
  const mockNotifications = [
    { id: 1, text: 'Booking confirmed for Tech Conference 2026', time: '2 mins ago' },
    { id: 2, text: 'Your event Music Festival was approved by Admin', time: '1 hour ago' },
  ];

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20 }}>
      <h2>Notifications</h2>
      {mockNotifications.map((n) => (
        <div key={n.id} style={{ padding: 12, borderBottom: '1px solid #eee', background: '#fff', marginBottom: 8 }}>
          <p style={{ margin: 0 }}>{n.text}</p>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{n.time}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationScreen;