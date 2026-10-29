import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import CustomButton from '../../components/common/CustomButton';
import { registerApi } from '../../api/authApi';
import { ROLES } from '../../constants/roles';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.CUSTOMER || 'CUSTOMER',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await registerApi(formData);
      alert('Registration successful! Please login.');
      navigate('/login'); // Register hone ke baad Login page par redirect
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '60px auto',
        padding: 24,
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
      }}
    >
      <h2 style={{ marginBottom: 20, color: '#111827' }}>Create EventHub Account</h2>

      {errorMsg && (
        <div
          style={{
            color: '#ef4444',
            marginBottom: 16,
            fontSize: '14px',
            backgroundColor: '#fee2e2',
            padding: '10px',
            borderRadius: '6px',
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <InputField
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <InputField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <InputField
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: '600', fontSize: '14px', color: '#374151' }}>
            Register As
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              outline: 'none',
              backgroundColor: '#fff',
            }}
          >
            <option value={ROLES.CUSTOMER || 'CUSTOMER'}>Customer</option>
            <option value={ROLES.ORGANISER || 'ORGANISER'}>Event Organiser</option>
          </select>
        </div>

        <CustomButton title="Register" loading={loading} style={{ width: '100%' }} />
      </form>

      {/* LOGIN NAVIGATION LINK */}
      <div style={{ marginTop: 20, textAlign: 'center', fontSize: '14px', color: '#4b5563' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold' }}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterScreen;