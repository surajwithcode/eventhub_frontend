import React, { useState } from 'react';
import { scanTicketApi } from '../../api/organiserApi';

const TicketScannerScreen = () => {
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!manualCode) return;
    
    setLoading(true);
    setScanResult(null);

    try {
      const response = await scanTicketApi({ ticketId: manualCode });
      setScanResult({ success: true, message: 'Valid Ticket! Entry Granted.', user: response.userName });
    } catch (err) {
      setScanResult({ success: false, message: err.response?.data?.message || 'Invalid or Expired Ticket' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '30px auto', padding: 20, textAlign: 'center' }}>
      <h2>Scan / Verify Ticket</h2>
      
      <form onSubmit={handleVerify} style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Enter Ticket ID manually"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#4f46e5', color: '#fff', border: 'none' }}>
          {loading ? 'Verifying...' : 'Verify Ticket'}
        </button>
      </form>

      {scanResult && (
        <div style={{
          marginTop: 20,
          padding: 15,
          borderRadius: 8,
          backgroundColor: scanResult.success ? '#d1fae5' : '#fee2e2',
          color: scanResult.success ? '#065f46' : '#991b1b'
        }}>
          <h4>{scanResult.message}</h4>
          {scanResult.user && <p>Attendee: {scanResult.user}</p>}
        </div>
      )}
    </div>
  );
};

export default TicketScannerScreen;