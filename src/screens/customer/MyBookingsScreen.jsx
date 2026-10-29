import React, { useState, useEffect } from 'react';
import { getMyBookingsApi } from '../../api/customerApi';
import QRCodeModal from '../../components/advance/QRCodeModal';
import { formatDate } from '../../utils/formatDate';

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookingsApi();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings', err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: 20 }}>
      <h2>My Booked Tickets</h2>
      {bookings.length === 0 ? (
        <p>No active bookings found.</p>
      ) : (
        bookings.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ccc', padding: 15, borderRadius: 8, marginBottom: 15 }}>
            <h3>{item.eventTitle}</h3>
            <p>📅 {formatDate(item.date)}</p>
            <p>🎟️ Tickets Count: {item.quantity}</p>
            <button
              onClick={() => setSelectedTicket(item)}
              style={{ marginTop: 10, padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              Show Ticket QR
            </button>
          </div>
        ))
      )}

      <QRCodeModal
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        ticketData={selectedTicket}
      />
    </div>
  );
};

export default MyBookingsScreen;