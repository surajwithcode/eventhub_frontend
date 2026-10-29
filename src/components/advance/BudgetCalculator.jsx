import React, { useState } from 'react';

export default function BudgetCalculator({ basePrice, onConfirmBooking }) {
  const [needDJ, setNeedDJ] = useState(false);
  const [needLighting, setNeedLighting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const djCost = needDJ ? 3000 : 0;
  const lightingCost = needLighting ? 2000 : 0;
  const subTotal = Number(basePrice) + djCost + lightingCost;
  const discountAmount = (subTotal * discountPercent) / 100;
  const finalPrice = subTotal - discountAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'EVENT10') {
      setDiscountPercent(10);
      alert('🎉 10% Discount Coupon Applied Successfully!');
    } else {
      alert('❌ Invalid Coupon Code! Try EVENT10');
    }
  };

  return (
    <div style={{ background: '#090d16', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b', marginTop: '16px' }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#fbbf24' }}>💡 Interactive Budget & Customization Estimator</h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
        <label style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={needDJ} onChange={(e) => setNeedDJ(e.target.checked)} /> Add Sound & DJ Setup (+₹3,000)
        </label>
        <label style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={needLighting} onChange={(e) => setNeedLighting(e.target.checked)} /> Add Premium Stage Lighting (+₹2,000)
        </label>
      </div>

      {/* COUPON INPUT */}
      <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <input 
          type="text" 
          value={couponCode} 
          onChange={(e) => setCouponCode(e.target.value)} 
          placeholder="Coupon (e.g. EVENT10)" 
          style={{ flex: 1, padding: '8px', background: '#131b2e', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '12px' }} 
        />
        <button type="submit" style={{ padding: '8px 12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Apply</button>
      </form>

      {/* PRICE BREAKUP */}
      <div style={{ marginTop: '14px', borderTop: '1px solid #1e293b', paddingTop: '10px', fontSize: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
          <span>Subtotal:</span> <span>₹{subTotal}</span>
        </div>
        {discountPercent > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
            <span>Discount ({discountPercent}%):</span> <span>-₹{discountAmount}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 'bold', fontSize: '18px', marginTop: '6px' }}>
          <span>Final Total:</span> <span>₹{finalPrice}</span>
        </div>
      </div>
    </div>
  );
}