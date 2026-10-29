import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeModal({ booking, onClose }) {
  if (!booking) return null;

  // Status Timeline Stages
  const stages = ['Confirmed ✅', 'Vendor Assigned 🚚', 'Setup in Progress 🎪', 'Completed 🎉'];
  const currentStageIndex = stages.indexOf(booking.status) !== -1 ? stages.indexOf(booking.status) : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '20px', padding: '28px', maxWidth: '450px', width: '100%', color: '#fff', textAlign: 'center' }}>
        
        <h3 style={{ margin: '0 0 4px 0', color: '#818cf8' }}>🎟️ Event Digital Pass</h3>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Booking ID: {booking.bookingId}</p>

        {/* QR CODE RENDER */}
        <div style={{ background: '#fff', padding: '16px', borderRadius: '14px', display: 'inline-block', marginBottom: '16px' }}>
          <QRCodeSVG value={`EVENTHUB-${booking.bookingId}-${booking.customerEmail}`} size={160} />
        </div>

        <p style={{ fontSize: '12px', color: '#34d399', fontWeight: 'bold' }}>Scan at Venue Entrance for Entry Verification</p>

        {/* LIVE TRACKING TIMELINE */}
        <div style={{ marginTop: '20px', textAlign: 'left', background: '#090d16', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <h4 style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#fbbf24' }}>📍 Live Setup Status Tracking</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            {stages.map((stage, idx) => (
              <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: idx <= currentStageIndex ? '#34d399' : '#64748b' }}>
                <span>{idx <= currentStageIndex ? '🟢' : '⚪'}</span>
                <span style={{ fontWeight: idx === currentStageIndex ? 'bold' : 'normal' }}>{stage}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onClose} style={{ marginTop: '20px', width: '100%', padding: '10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Close Ticket
        </button>
      </div>
    </div>
  );
}