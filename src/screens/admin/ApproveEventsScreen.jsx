import React, { useState, useEffect } from 'react';
import { getPendingEventsApi, approveEventApi } from '../../api/adminApi';

const ApproveEventsScreen = () => {
  const [pendingEvents, setPendingEvents] = useState([]);

  const fetchPendingEvents = async () => {
    try {
      const data = await getPendingEventsApi();
      setPendingEvents(data);
    } catch (err) {
      console.error('Failed to fetch pending events', err);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const handleAction = async (eventId, status) => {
    try {
      await approveEventApi(eventId, status);
      setPendingEvents(pendingEvents.filter((ev) => ev.id !== eventId));
    } catch (err) {
      alert('Action failed');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>Pending Event Approvals</h2>
      {pendingEvents.length === 0 ? (
        <p>No pending events to review.</p>
      ) : (
        pendingEvents.map((event) => (
          <div key={event.id} style={{ border: '1px solid #ccc', padding: 15, borderRadius: 8, marginBottom: 15 }}>
            <h3>{event.title}</h3>
            <p><strong>Organiser:</strong> {event.organiserName}</p>
            <p><strong>Category:</strong> {event.category}</p>
            <p>{event.description}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button
                onClick={() => handleAction(event.id, 'APPROVED')}
                style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(event.id, 'REJECTED')}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ApproveEventsScreen;