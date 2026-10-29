import React from 'react';
import CountdownTimer from '../../components/advance/CountdownTimer';
import CustomButton from '../../components/common/CustomButton';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const EventDetailsScreen = ({ event, onBook }) => {
  if (!event) return <div>No Event Selected</div>;

  return (
    <div style={{ maxWidth: 700, margin: '20px auto', padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2>{event.title}</h2>
      <p>📍 {event.location}</p>
      <p>📅 {formatDate(event.date)}</p>
      <p style={{ fontWeight: 'bold', fontSize: 18, color: '#4f46e5' }}>Price: {formatCurrency(event.price || 0)}</p>
      
      <CountdownTimer targetDate={event.date} />
      
      <p style={{ margin: '20px 0', lineHeight: 1.6 }}>{event.description}</p>
      
      <CustomButton title="Book Tickets Now" onClick={() => onBook(event)} style={{ width: '100%' }} />
    </div>
  );
};

export default EventDetailsScreen;