import React from 'react';

const TicketDetailsScreen = ({ ticket }) => {
  if (!ticket) return null;

  return (
    <div style={{ maxWidth: 500, margin: '20px auto', padding: 20, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <h3>Ticket Details</h3>
      <p><strong>Ticket ID:</strong> {ticket.id}</p>
      <p><strong>Event:</strong> {ticket.eventTitle}</p>
      <p><strong>Seats:</strong> {ticket.quantity}</p>
      <button onClick={() => window.print()} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4 }}>
        Download PDF
      </button>
    </div>
  );
};

export default TicketDetailsScreen;