import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, placeholder, required = false, error }) => {
  return (
    <div style={{ marginBottom: 15 }}>
      {label && <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '6px',
          border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
          boxSizing: 'border-box',
        }}
      />
      {error && <span style={{ color: '#ef4444', fontSize: '12px' }}>{error}</span>}
    </div>
  );
};

export default InputField;