import React from 'react';

const CustomButton = ({ title, onClick, variant = 'primary', loading = false, disabled = false, style = {} }) => {
  const bg = variant === 'danger' ? '#ef4444' : variant === 'success' ? '#10b981' : '#4f46e5';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: '10px 18px',
        backgroundColor: bg,
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        fontWeight: '600',
        ...style,
      }}
    >
      {loading ? 'Please wait...' : title}
    </button>
  );
};

export default CustomButton;