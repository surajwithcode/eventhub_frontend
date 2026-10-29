import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Phone, User, CheckCircle2, 
  ArrowLeft, CreditCard, QrCode, ShieldCheck, Truck 
} from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { TermsModal, showToast } from '../../components/common/Modal';
import { generateReceiptCSV } from '../../utils/receiptGenerator';

// ENHANCED CHECKOUT COMPONENT WITH PAYMENT MODAL
export function CustomerEventBookingSection({ selectedPackage, currentUser, brandConfig, onBack, onBookingComplete }) {
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  // CUSTOM ADD-ONS & BUDGET ESTIMATOR
  const [needDJ, setNeedDJ] = useState(false);
  const [needLighting, setNeedLighting] = useState(false);
  const [needPhotography, setNeedPhotography] = useState(false);

  // DISCOUNT COUPON
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // PAYMENT MODAL & METHOD STATE
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // FINANCIAL CALCULATIONS
  const basePrice = Number(selectedPackage?.price || 0);
  const djCost = needDJ ? 3000 : 0;
  const lightingCost = needLighting ? 2000 : 0;
  const photoCost = needPhotography ? 5000 : 0;
  
  const addOnsTotal = djCost + lightingCost + photoCost;
  const subTotal = basePrice + addOnsTotal;
  const discountAmount = (subTotal * discountPercent) / 100;
  const taxableAmount = subTotal - discountAmount;
  const gstRate = Number(brandConfig?.gstPercentage || 18);
  const gstAmount = Math.round((taxableAmount * gstRate) / 100);
  const finalTotal = taxableAmount + gstAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'EVENT10') {
      setDiscountPercent(10);
      showToast('🎉 10% Discount Applied!');
    } else {
      showToast('❌ Invalid Coupon! Try "EVENT10"');
    }
  };

  const handleInitiatePayment = (e) => {
    e.preventDefault();
    if (!eventDate || !eventTime || !address || !phone) {
      showToast('⚠️ Please fill in all required booking details!');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleFinalPaymentConfirm = () => {
    const newBooking = {
      bookingId: `EVT-${Date.now().toString().slice(-6)}`,
      customerName,
      customerEmail: currentUser?.email || 'customer@eventhub.com',
      eventType: selectedPackage?.title || 'Event Booking',
      price: finalTotal,
      basePrice,
      addOnsTotal,
      gstAmount,
      eventDate,
      eventTime,
      customAddress: address,
      contactPhone: phone,
      paymentMethod: paymentMethod.toUpperCase(),
      paymentStatus: 'PAID 🟢',
      assignedOrganizer: 'Unassigned ⏳',
      orderStage: 'Confirmed',
      status: 'Confirmed ✅',
      createdAt: new Date().toISOString()
    };

    // Save Booking to LocalStorage
    const existing = JSON.parse(localStorage.getItem('eventhub_doorstep_bookings') || '[]');
    const updated = [newBooking, ...existing];
    localStorage.setItem('eventhub_doorstep_bookings', JSON.stringify(updated));

    // Auto Download CSV Bill Receipt
    generateReceiptCSV(newBooking, brandConfig);
    showToast('💳 Payment Successful! Booking Confirmed & Bill Downloaded.');
    setShowPaymentModal(false);
    if (onBookingComplete) onBookingComplete(updated);
  };

  return (
    <div style={{ maxWidth: '950px', margin: '20px auto', padding: '24px', background: '#090d16', color: '#fff', borderRadius: '24px', border: '1px solid #1e293b' }}>
      
      {/* HEADER BAR */}
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#818cf8', fontWeight: 'bold', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}>
        <ArrowLeft size={16} /> Back to Packages
      </button>

      <div style={{ borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '24px' }}>
        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>On-Demand Doorstep Service</span>
        <h2 style={{ fontSize: '24px', color: '#fff', margin: '4px 0 0 0', fontWeight: '800' }}>{selectedPackage?.title || 'Event Package Checkout'}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* LEFT FORM INPUTS */}
        <form onSubmit={handleInitiatePayment} style={{ display: 'grid', gap: '16px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', fontWeight: 'bold' }}>CUSTOMER FULL NAME</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#131b2e', border: '1px solid #334155', borderRadius: '10px', padding: '0 12px' }}>
              <User size={16} color="#818cf8" />
              <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required placeholder="Your Name" style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '13px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', fontWeight: 'bold' }}>EVENT DATE</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#131b2e', border: '1px solid #334155', borderRadius: '10px', padding: '0 12px' }}>
                <Calendar size={16} color="#818cf8" />
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '12px', colorScheme: 'dark' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', fontWeight: 'bold' }}>EVENT TIME</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#131b2e', border: '1px solid #334155', borderRadius: '10px', padding: '0 12px' }}>
                <Clock size={16} color="#818cf8" />
                <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '12px', colorScheme: 'dark' }} />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', fontWeight: 'bold' }}>COMPLETE VENUE / DOORSTEP ADDRESS</label>
            <div style={{ display: 'flex', alignItems: 'flex-start', background: '#131b2e', border: '1px solid #334155', borderRadius: '10px', padding: '10px 12px' }}>
              <MapPin size={16} color="#818cf8" style={{ marginTop: '3px' }} />
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows="3" required placeholder="House/Venue No, Street, Landmark, City, Pincode" style={{ width: '100%', padding: '0 8px', background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '13px', resize: 'vertical' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px', fontWeight: 'bold' }}>CONTACT MOBILE NUMBER</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#131b2e', border: '1px solid #334155', borderRadius: '10px', padding: '0 12px' }}>
              <Phone size={16} color="#818cf8" />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 9876543210" style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '13px' }} />
            </div>
          </div>

          {/* ADD-ONS */}
          <div style={{ background: '#131b2e', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#fbbf24' }}>💡 Optional Event Add-ons</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#cbd5e1' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={needDJ} onChange={(e) => setNeedDJ(e.target.checked)} /> Sound & DJ Setup (+₹3,000)
              </label>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={needLighting} onChange={(e) => setNeedLighting(e.target.checked)} /> Stage Lighting (+₹2,000)
              </label>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={needPhotography} onChange={(e) => setNeedPhotography(e.target.checked)} /> Photography (+₹5,000)
              </label>
            </div>
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CreditCard size={18} /> Proceed to Pay ₹{finalTotal.toLocaleString()}
          </button>

        </form>

        {/* RIGHT PRICING BREAKDOWN */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#fff', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>🧾 Order Summary</h3>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <img src={selectedPackage?.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'} alt="Package" style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
            <div>
              <strong style={{ fontSize: '13px', color: '#fff' }}>{selectedPackage?.title}</strong>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>Base Price: ₹{basePrice.toLocaleString()}</p>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>COUPON DISCOUNT</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="e.g. EVENT10" style={{ flex: 1, padding: '8px', background: '#090d16', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
              <button type="button" onClick={handleApplyCoupon} style={{ padding: '8px 12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>Apply</button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '8px', fontSize: '12px', color: '#cbd5e1', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Base Price:</span>
              <span>₹{basePrice.toLocaleString()}</span>
            </div>
            {addOnsTotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}>
                <span>Add-ons:</span>
                <span>+₹{addOnsTotal.toLocaleString()}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                <span>Discount ({discountPercent}%):</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>GST ({gstRate}%):</span>
              <span>+₹{gstAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: '800', fontSize: '18px', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
              <span>Grand Total:</span>
              <span>₹{finalTotal.toLocaleString()}</span>
            </div>
          </div>

        </div>

      </div>

      {/* ONLINE PAYMENT MODAL (UPI / CARDS / RAZORPAY) */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', maxWidth: '420px', width: '100%', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={20} /> Secure Payment Gateway
              </h3>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: '#090d16', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ color: '#94a3b8' }}>Payable Amount</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#34d399' }}>₹{finalTotal.toLocaleString()}</div>
            </div>

            <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => setPaymentMethod('upi')} style={{ padding: '12px', borderRadius: '10px', border: paymentMethod === 'upi' ? '2px solid #10b981' : '1px solid #334155', background: paymentMethod === 'upi' ? 'rgba(16,185,129,0.1)' : '#090d16', color: '#fff', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <QrCode size={18} color="#10b981" /> <span>Instant UPI / QR Code (PhonePe, GPay, Paytm)</span>
              </button>
              <button onClick={() => setPaymentMethod('card')} style={{ padding: '12px', borderRadius: '10px', border: paymentMethod === 'card' ? '2px solid #10b981' : '1px solid #334155', background: paymentMethod === 'card' ? 'rgba(16,185,129,0.1)' : '#090d16', color: '#fff', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={18} color="#818cf8" /> <span>Credit / Debit Card / Net Banking</span>
              </button>
            </div>

            <button onClick={handleFinalPaymentConfirm} style={{ width: '100%', padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
              Complete Payment & Confirm Booking
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// MAIN CUSTOMER DASHBOARD SCREEN
export default function CustomerDashboard({ brandConfig, productsList }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('eventhub_users') || '[]').find(u => u.email === JSON.parse(localStorage.getItem('currentUser') || '{}').email) || JSON.parse(localStorage.getItem('currentUser') || '{}');

  const [activeTab, setActiveTab] = useState('explore');
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [myBookedEvents, setMyBookedEvents] = useState(() => {
    const all = JSON.parse(localStorage.getItem('eventhub_doorstep_bookings') || '[]');
    return all.filter(item => item.customerEmail === currentUser.email);
  });

  const handleBookingCompleted = (updatedBookingsList) => {
    setMyBookedEvents(updatedBookingsList.filter(item => item.customerEmail === currentUser.email));
    setSelectedEventForBooking(null);
    setActiveTab('my_booked');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <Header userName={currentUser.name} userRole="customer" onLogout={() => { localStorage.removeItem('currentUser'); navigate('/'); }} activeTab={activeTab} setActiveTab={setActiveTab} brandConfig={brandConfig} setShowTermsModal={setShowTermsModal} />
        
        <div style={{ maxWidth: '1000px', margin: '28px auto', padding: '0 20px' }}>
          
          {/* TAB 1: EXPLORE PACKAGES */}
          {activeTab === 'explore' && !selectedEventForBooking && (
            <div>
              <h2 style={{ fontSize: '22px', color: '#fbbf24', marginBottom: '20px' }}>Explore Doorstep Event Services & Packages</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {productsList.map((ev) => (
                  <div key={ev.id} style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <img src={ev.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'} alt={ev.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px' }} />
                      <h3 style={{ fontSize: '16px', margin: '12px 0 6px 0', color: '#fff' }}>{ev.title}</h3>
                      <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.4' }}>{ev.desc}</p>
                    </div>
                    <div>
                      <div style={{ fontSize: '20px', color: '#34d399', fontWeight: '800', margin: '12px 0' }}>₹{Number(ev.price).toLocaleString()}</div>
                      <button onClick={() => setSelectedEventForBooking(ev)} style={{ width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Customize & Book</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 1 (SUB-VIEW): ADVANCED EVENT CHECKOUT FORM */}
          {selectedEventForBooking && (
            <CustomerEventBookingSection 
              selectedPackage={selectedEventForBooking}
              currentUser={currentUser}
              brandConfig={brandConfig}
              onBack={() => setSelectedEventForBooking(null)}
              onBookingComplete={handleBookingCompleted}
            />
          )}

          {/* TAB 2: MY BOOKINGS WITH LIVE STAGE TRACKING */}
          {activeTab === 'my_booked' && (
            <div>
              <h2 style={{ fontSize: '22px', color: '#818cf8', marginBottom: '20px' }}>🎟️ My Bookings & Live Order Tracking ({myBookedEvents.length})</h2>
              {myBookedEvents.length === 0 ? (
                <p style={{ color: '#94a3b8', background: '#131b2e', padding: '20px', borderRadius: '14px', border: '1px solid #1e293b' }}>No bookings placed yet. Explore packages to make your first booking!</p>
              ) : (
                myBookedEvents.map(b => (
                  <div key={b.bookingId} style={{ background: '#131b2e', padding: '20px', borderRadius: '16px', margin: '14px 0', border: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #1e293b', paddingBottom: '12px', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{b.paymentStatus || 'PAID 🟢'}</span>
                        <h3 style={{ fontSize: '18px', color: '#fff', margin: '4px 0 0 0' }}>{b.eventType} - ₹{Number(b.price).toLocaleString()}</h3>
                      </div>
                      <button onClick={() => { generateReceiptCSV(b, brandConfig); showToast('📄 Bill Receipt Downloaded!'); }} style={{ padding: '10px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                        🧾 Download Bill
                      </button>
                    </div>

                    {/* LIVE TRACKING TIMELINE */}
                    <div style={{ background: '#090d16', padding: '14px', borderRadius: '12px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Truck size={14} /> LIVE SERVICE STATUS
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center', fontSize: '10px' }}>
                        <div style={{ color: '#34d399', fontWeight: 'bold' }}>1. Order Placed ✅</div>
                        <div style={{ color: b.assignedOrganizer && b.assignedOrganizer !== 'Unassigned ⏳' ? '#34d399' : '#64748b', fontWeight: 'bold' }}>2. Team Assigned</div>
                        <div style={{ color: '#64748b', fontWeight: 'bold' }}>3. Setup On-Site</div>
                        <div style={{ color: '#64748b', fontWeight: 'bold' }}>4. Event Ready</div>
                      </div>
                    </div>

                    <p style={{ margin: '4px 0', color: '#cbd5e1', fontSize: '12px' }}>📅 Date: <strong>{b.eventDate}</strong> at <strong>{b.eventTime}</strong> | 👤 Assigned Manager: <strong>{b.assignedOrganizer || 'Assigning Team...'}</strong></p>
                    <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>📍 Venue: {b.customAddress}</p>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>

      {showTermsModal && <TermsModal brandConfig={brandConfig} onClose={() => setShowTermsModal(false)} />}
      <Footer brandConfig={brandConfig} setShowTermsModal={setShowTermsModal} />
    </div>
  );
}