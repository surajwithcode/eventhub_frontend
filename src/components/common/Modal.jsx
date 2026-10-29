import React from 'react';
import { DEFAULT_BRAND_CONFIG } from '../../constants/eventCategories';

export const showToast = (message) => {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: #10b981; color: #fff; padding: 12px 20px;
    border-radius: 12px; font-weight: bold; font-size: 13px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.4); font-family: sans-serif;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

export function TermsModal({ brandConfig, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '20px', padding: '28px', maxWidth: '500px', width: '100%', color: '#fff' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#818cf8' }}>📋 Terms & Conditions & Services</h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
          {brandConfig?.termsText || DEFAULT_BRAND_CONFIG.termsText}
        </p>
        <button onClick={onClose} style={{ marginTop: '16px', width: '100%', padding: '10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Close
        </button>
      </div>
    </div>
  );
}