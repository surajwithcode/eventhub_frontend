import React, { useState } from 'react';
import { bookTicketApi } from '../../api/customerApi';
import { processPayment } from '../../services/paymentService';
import CustomButton from '../../components/common/CustomButton';
import { formatCurrency } from '../../utils/formatCurrency';

const BookingCheckoutScreen = ({ event, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalPrice = (event?.price || 0) * quantity;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const paymentRes = await processPayment({ amount: totalPrice, paymentMethod: 'CARD' });
      if (paymentRes.success) {
        await bookTicketApi({ eventId: event.id, quantity, transactionId: paymentRes.transactionId });
        alert('Booking Completed!');
        onSuccess();
      }
    } catch (err) {
      alert('Payment / Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '30px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Checkout - {event?.title}</h2>
      <div style={{ margin: '20px 0' }}>
        <label>Select Quantity: </label>
        <input
          type="number"
          min="1"
          max="10"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: 60, padding: 5, marginLeft: 10 }}
        />
      </div>
      <p style={{ fontWeight: 'bold' }}>Total Amount: {formatCurrency(totalPrice)}</p>
      <CustomButton title="Pay & Confirm" onClick={handleCheckout} loading={loading} style={{ width: '100%' }} />
    </div>
  );
};

export default BookingCheckoutScreen;