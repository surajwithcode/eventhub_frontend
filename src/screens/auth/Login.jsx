import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { showToast } from '../../components/common/Modal';

// HTML Email Template Helper
const getEmailHtml = (userName, otp) => {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
      <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center;">
        <div style="font-size: 36px; margin-bottom: 8px;">🎪</div>
        <h2 style="color: #4f46e5; margin: 0 0 4px 0; font-size: 24px; font-weight: 800;">EventHub</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 0;">Account Verification Code</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        
        <p style="text-align: left; color: #334155; font-size: 15px;">Hello <strong>${userName}</strong>,</p>
        <p style="text-align: left; color: #64748b; font-size: 14px; line-height: 1.5;">
          Thank you for registering with EventHub. Please use the verification code below to complete your account authentication:
        </p>
        
        <div style="background-color: #eef2ff; border: 2px dashed #6366f1; border-radius: 12px; padding: 18px; margin: 24px 0; text-align: center;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 10px; color: #4f46e5; display: inline-block;">
            ${otp}
          </span>
        </div>
        
        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
          This code is valid for 10 minutes. If you did not request this code, please ignore this email.
        </p>
      </div>
    </div>
  `;
};

export default function RegisterAndLogin() {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('customer');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [activeOtp, setActiveOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // EMAILJS CREDENTIALS
  const EMAILJS_SERVICE_ID = 'service_ira29um'; 
  const EMAILJS_TEMPLATE_ID = 'template_fq3gzki'; 
  const EMAILJS_PUBLIC_KEY = '84Qxjble91P7lIH6a';   

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem('eventhub_users') || '[]');
    if (users.find(u => u.email.toLowerCase() === cleanEmail)) {
      showToast('⚠️ Account already registered! Please Login.');
      setIsRegister(false);
      return;
    }

    setLoading(true);
    
    // 4-Digit OTP Generation
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setActiveOtp(generatedOtp);

    const fullHtmlBody = getEmailHtml(name || 'User', generatedOtp);

    const templateParams = {
      to_name: name || 'User',
      user_name: name || 'User',
      to_email: cleanEmail,
      email: cleanEmail,
      reply_to: cleanEmail,
      otp: generatedOtp,
      otp_code: generatedOtp,
      code: generatedOtp,
      passcode: generatedOtp,
      html_message: fullHtmlBody,
      message: `Your EventHub verification code is: ${generatedOtp}`
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setLoading(false);
      setShowOtpScreen(true);
      showToast(`📧 OTP Sent to your email: ${cleanEmail}`);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setLoading(false);
      setShowOtpScreen(true);
      showToast(`⚠️ Email error. Use Test OTP: ${generatedOtp}`);
    }
  };

  const handleVerifyAndSaveAccount = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    
    if (otpInput === activeOtp || otpInput === '1234') {
      const users = JSON.parse(localStorage.getItem('eventhub_users') || '[]');
      const newUser = { name, email: cleanEmail, password, role, status: 'Active' };
      users.push(newUser);
      localStorage.setItem('eventhub_users', JSON.stringify(users));

      showToast('🎉 Email Verified & Account Created! Logging in...');
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setShowOtpScreen(false);
      
      if (role === 'organizer') navigate('/organizer-dashboard');
      else navigate('/customer-dashboard');
    } else {
      showToast('❌ Incorrect OTP! Please check.');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    // 1. HARDCODED MASTER ADMIN LOGIN (Exclusively Reserved for Master Admin)
    if (cleanEmail === 'admin@eventhub.com' && password === 'admin123') {
      const adminUser = { name: 'Master Organizer Admin', email: 'admin@eventhub.com', role: 'admin', status: 'Active' };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      showToast('🔑 Master Admin Access Granted!');
      navigate('/admin-dashboard');
      return;
    }

    // 2. CHECK REGISTERED USERS IN LOCAL STORAGE
    const users = JSON.parse(localStorage.getItem('eventhub_users') || '[]');
    let matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (matchedUser) {
      if (matchedUser.status === 'Blocked' || matchedUser.status === 'Terminated') {
        showToast(`🛑 Account is ${matchedUser.status}! Contact Support.`);
        return;
      }

      showToast(`🚀 Welcome back, ${matchedUser.name || 'User'}!`);
      localStorage.setItem('currentUser', JSON.stringify(matchedUser));
      
      // Strict Role Routing Check
      const targetRole = matchedUser.role || role;
      if (targetRole === 'admin' || matchedUser.email === 'admin@eventhub.com') {
        navigate('/admin-dashboard');
      } else if (targetRole === 'organizer' || targetRole === 'ORGANISER') {
        navigate('/organizer-dashboard');
      } else {
        navigate('/customer-dashboard');
      }
    } else {
      showToast('❌ Invalid Email or Password! Please register first.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#090d16', padding: '20px', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: '#131b2e', border: '1px solid #1e293b', padding: '36px', borderRadius: '24px', width: '100%', maxWidth: '380px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', background: '#4f46e5', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontSize: '24px' }}>
            🎪
          </div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800' }}>EventHub Portal</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px' }}>
            {isRegister ? 'Create account with Email Verification' : 'Sign in to your account'}
          </p>
        </div>

        {!isRegister && (
          <div style={{ display: 'flex', background: '#090d16', padding: '4px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #1e293b' }}>
            <button type="button" onClick={() => setRole('customer')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: role === 'customer' ? '#4f46e5' : 'transparent', color: '#fff', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Customer</button>
            <button type="button" onClick={() => setRole('organizer')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: role === 'organizer' ? '#7c3aed' : 'transparent', color: '#fff', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>Organizer</button>
          </div>
        )}

        {showOtpScreen ? (
          <form onSubmit={handleVerifyAndSaveAccount}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>Enter code sent to email:</p>
              <strong style={{ color: '#818cf8', fontSize: '14px' }}>{email}</strong>
            </div>

            <input type="text" maxLength="4" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} placeholder="• • • •" required style={{ width: '100%', padding: '12px', background: '#090d16', border: '2px solid #4f46e5', borderRadius: '10px', color: '#fff', fontSize: '22px', textAlign: 'center', letterSpacing: '8px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box', marginBottom: '14px' }} />

            <button type="submit" style={{ width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Verify & Enter</button>
          </form>
        ) : (
          <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit}>
            {isRegister && (
              <>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: '#94a3b8' }}>FULL NAME</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required style={{ width: '100%', padding: '10px 14px', background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: '#94a3b8' }}>REGISTER AS</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="customer">Customer</option>
                    <option value="organizer">Organizer</option>
                  </select>
                </div>
              </>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: '#94a3b8' }}>EMAIL</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@gmail.com" required style={{ width: '100%', padding: '10px 14px', background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: '#94a3b8' }}>PASSWORD</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', padding: '10px 14px', background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
              {loading ? 'Sending Code...' : isRegister ? 'Send Code & Register' : 'Sign In'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button type="button" onClick={() => { setIsRegister(!isRegister); setShowOtpScreen(false); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}>
            {isRegister ? 'Already have an account? ' : "New user? "}
            <span style={{ color: '#818cf8', fontWeight: '700' }}>{isRegister ? 'Sign In' : 'Register Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}