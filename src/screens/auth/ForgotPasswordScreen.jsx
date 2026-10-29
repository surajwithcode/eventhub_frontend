import React, { useState } from 'react';
import InputField from '../../components/common/InputField';
import CustomButton from '../../components/common/CustomButton';
import { forgotPasswordApi } from '../../api/authApi';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPasswordApi(email);
      setSent(true);
    } catch (err) {
      alert('Request failed. Check email.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <h2>Reset Password</h2>
      {sent ? (
        <p style={{ color: '#10b981' }}>Password reset link sent to your email!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <InputField label="Enter your registered email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <CustomButton title="Send Reset Link" style={{ width: '100%' }} />
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordScreen;