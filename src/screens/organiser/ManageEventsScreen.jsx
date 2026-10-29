import React, { useState, useEffect } from 'react';
import { getOrganiserEventsApi } from '../../api/organiserApi';

const ManageEventsScreen = () => {
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getOrganiserEventsApi();
        setMyEvents(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>Manage Created Events</h2>
      {myEvents.map((ev) => (
        <div key={ev.id} style={{ padding: 15, border: '1px solid #ddd', borderRadius: 8, marginBottom: 10 }}>
          <h4>{ev.title}</h4>
          <p>Status: <strong>{ev.status || 'Active'}</strong></p>
        </div>
      ))}
    </div>
  );
};

export default ManageEventsScreen;