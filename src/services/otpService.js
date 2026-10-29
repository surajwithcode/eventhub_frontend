import emailjs from '@emailjs/browser';

// Dynamic 4-digit OTP Generate karne ke liye
export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Direct Frontend se Email bhejney ka code
export const sendRealEmailOTP = async (userEmail, otpCode) => {
  try {
    // EmailJS credentials (Free account setup)
    await emailjs.send(
      'YOUR_SERVICE_ID', 
      'YOUR_TEMPLATE_ID', 
      { to_email: userEmail, otp: otpCode },
      'YOUR_PUBLIC_KEY'
    );
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
};
