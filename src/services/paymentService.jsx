export const processPayment = async ({ amount, paymentMethod, token }) => {
  try {
    // Gateway integration logic (e.g. Stripe / Razorpay)
    return { success: true, transactionId: `TXN_${Date.now()}` };
  } catch (error) {
    return { success: false, error: error.message };
  }
};