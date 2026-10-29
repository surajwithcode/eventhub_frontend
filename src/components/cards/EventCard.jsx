import React from 'react';
import { formatDate } from '../../utils/formatDate';

const EventCard = ({ event, onClick }) => {
  return (
    <div onClick={() => onClick(event.id)} style={{ border: '1px solid #ddd', padding: 15, borderRadius: 8, cursor: 'pointer' }}>
      <h3>{event.title}</h3>
      <p>📅 {formatDate(event.date)}</p>
      <p>📍 {event.location}</p>
    </div>
  );
};

export default EventCard;