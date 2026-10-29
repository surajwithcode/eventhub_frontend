import React, { useState } from 'react';

const QRScanner = ({ onScanSuccess }) => {
  const [ticketInput, setTicketInput] = useState('');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (ticketInput.trim()) {
      onScanSuccess(ticketInput.trim());
      setTicketInput('');
    }
  };

  return (
    <div style={{ padding: 20, border: '2px dashed #9ca3af', borderRadius: 8, textAlign: 'center', background: '#f9fafb' }}>
      <p style={{ fontWeight: 'bold' }}>📷 Camera Stream Simulator</p>
      <p style={{ fontSize: 13, color: '#6b7280' }}>Point camera to QR code or enter code manually below:</p>
      <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: 10, marginTop: 15 }}>
        <input
          type="text"
          placeholder="Scan or enter Ticket Code"
          value={ticketInput}
          onChange={(e) => setTicketInput(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 4 }}>
          Scan
        </button>
      </form>
    </div>
  );
};

export default QRScanner;