import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
      {[1, 2, 3].map((item) => (
        <div key={item} style={{ background: '#131b2e', borderRadius: '18px', padding: '16px', height: '260px', opacity: 0.6, animation: 'pulse 1.5s infinite' }}>
          <div style={{ width: '100%', height: '140px', background: '#1e293b', borderRadius: '12px' }}></div>
          <div style={{ width: '70%', height: '16px', background: '#1e293b', borderRadius: '4px', margin: '16px 0 8px 0' }}></div>
          <div style={{ width: '40%', height: '14px', background: '#1e293b', borderRadius: '4px' }}></div>
        </div>
      ))}
    </div>
  );
}