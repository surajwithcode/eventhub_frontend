import React from 'react';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

const TicketCard = ({ ticket, onViewQR }) => {
  return (
    <div style={{ border: '1px solid #e5e7eb', padding: 15, borderRadius: 8, background: '#fff', marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: '0 0 5px 0' }}>{ticket.eventTitle}</h4>
          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>📅 {formatDate(ticket.date)}</p>
          <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>Seats: {ticket.quantity} | Total: {formatCurrency(ticket.totalPrice)}</p>
        </div>
        <button
          onClick={() => onViewQR(ticket)}
          style={{ padding: '8px 12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          View QR
        </button>
      </div>
    </div>
  );
};

export default TicketCard;