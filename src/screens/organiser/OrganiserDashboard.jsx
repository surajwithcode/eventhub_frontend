import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { generateReceiptCSV } from '../../utils/receiptGenerator';
import { showToast } from '../../components/common/Modal';

// INLINE TERMS & CONDITIONS MODAL (IMPORT ERROR FIX)
function TermsModal({ brandConfig, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '20px', padding: '28px', maxWidth: '500px', width: '100%', color: '#fff' }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#818cf8' }}>📋 Terms & Conditions & Services</h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
          {brandConfig?.termsText || "1. All bookings require a 24-hour prior confirmation.\n2. Cancellation charges apply if cancelled within 12 hours.\n3. Vendors and users must adhere to regional safety and noise policies."}
        </p>
        <button onClick={onClose} style={{ marginTop: '16px', width: '100%', padding: '10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Close
        </button>
      </div>
    </div>
  );
}

// CALENDAR COMPONENT FOR ORGANIZER SCHEDULE
export function OrganizerCalendarView({ bookings = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatLocalDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateStr = formatLocalDate(selectedDate);
  const selectedDateBookings = bookings.filter(b => b.eventDate === selectedDateStr);

  return (
    <div style={{ background: '#131b2e', padding: '20px', borderRadius: '16px', border: '1px solid #1e293b', marginTop: '24px' }}>
      <h3 style={{ color: '#818cf8', margin: '0 0 16px 0', fontSize: '18px' }}>📅 Event Schedule Calendar</h3>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ background: '#090d16', padding: '14px', borderRadius: '14px', border: '1px solid #1e293b', color: '#000' }}>
          <Calendar 
            onChange={setSelectedDate} 
            value={selectedDate}
            tileContent={({ date, view }) => {
              if (view === 'month') {
                const dateStr = formatLocalDate(date);
                const count = bookings.filter(b => b.eventDate === dateStr).length;
                if (count > 0) {
                  return (
                    <div style={{ background: '#10b981', color: '#fff', fontSize: '9px', borderRadius: '4px', marginTop: '2px', padding: '1px 2px', fontWeight: 'bold' }}>
                      {count} Event
                    </div>
                  );
                }
              }
              return null;
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '260px' }}>
          <h4 style={{ color: '#fbbf24', margin: '0 0 12px 0', fontSize: '15px' }}>
            Events on {selectedDate.toDateString()}:
          </h4>
          {selectedDateBookings.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '13px', background: '#090d16', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
              Is date ko koi event scheduled nahi hai (Free Date).
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              {selectedDateBookings.map(b => (
                <div key={b.bookingId} style={{ background: '#090d16', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                  <strong style={{ color: '#34d399', fontSize: '14px', display: 'block' }}>{b.eventType} - ₹{b.price}</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#cbd5e1' }}>
                    Client: <strong>{b.customerName}</strong> | Time: <strong>{b.eventTime}</strong>
                  </p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>
                    📍 {b.customAddress} | 📞 {b.contactPhone}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrganiserDashboard({ brandConfig }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'add_package', 'my_packages'
  
  const [allBookings, setAllBookings] = useState([]);
  const [productsList, setProductsList] = useState([]);

  // UPLOAD FORM STATE
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wedding & Reception');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [desc, setDesc] = useState('');

  // Load Data
  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem('eventhub_doorstep_bookings') || '[]');
    const products = JSON.parse(localStorage.getItem('eventhub_products') || '[]');
    setAllBookings(bookings);
    setProductsList(products);
  }, []);

  const myBookings = allBookings.filter(b => !b.organizerEmail || b.organizerEmail === currentUser.email);
  const completedOrders = myBookings.filter(b => b.status === 'Completed' || b.status === 'Confirmed ✅');
  const totalRevenue = completedOrders.reduce((sum, b) => sum + (Number(b.price) || 0), 0);

  const handleStatusChange = (bookingId, newStatus) => {
    const updated = allBookings.map((b) => {
      if (b.bookingId === bookingId) {
        return { ...b, status: newStatus };
      }
      return b;
    });

    setAllBookings(updated);
    localStorage.setItem('eventhub_doorstep_bookings', JSON.stringify(updated));
    showToast(`✅ Status updated to: ${newStatus}`);
  };

  const handleCreatePackage = (e) => {
    e.preventDefault();
    if (!title || !price || !desc) {
      showToast('⚠️ Please fill all required fields!');
      return;
    }

    const newPackage = {
      id: Date.now(),
      title,
      category,
      price: Number(price),
      image: image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      desc,
      createdBy: currentUser.email || 'organizer'
    };

    const updatedProducts = [newPackage, ...productsList];
    setProductsList(updatedProducts);
    localStorage.setItem('eventhub_products', JSON.stringify(updatedProducts));

    showToast('✨ New Event Package Created & Published for Customers!');
    setTitle(''); setPrice(''); setImage(''); setDesc('');
    setActiveTab('my_packages');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', fontFamily: "'Inter', system-ui, sans-serif", color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <Header 
          userName={currentUser.name || 'Organizer'} 
          userRole="organizer" 
          onLogout={() => { localStorage.removeItem('currentUser'); navigate('/'); }} 
          brandConfig={brandConfig} 
          setShowTermsModal={setShowTermsModal} 
        />

        <div style={{ maxWidth: '1100px', margin: '28px auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#818cf8', marginBottom: '20px' }}>
            🎪 Organizer Business Command Center
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>TOTAL EARNED REVENUE</span>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#34d399', marginTop: '4px' }}>
                ₹{totalRevenue.toLocaleString()}
              </div>
            </div>

            <div style={{ background: '#131b2e', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>ASSIGNED EVENT ORDERS</span>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>
                {myBookings.length}
              </div>
            </div>

            <div style={{ background: '#131b2e', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>PUBLISHED PACKAGES</span>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#818cf8', marginTop: '4px' }}>
                {productsList.length}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveTab('orders')} 
              style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: activeTab === 'orders' ? '#4f46e5' : '#131b2e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              📋 Assigned Customer Orders ({myBookings.length})
            </button>

            <button 
              onClick={() => setActiveTab('add_package')} 
              style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: activeTab === 'add_package' ? '#10b981' : '#131b2e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ➕ Publish New Event Package
            </button>

            <button 
              onClick={() => setActiveTab('my_packages')} 
              style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: activeTab === 'my_packages' ? '#4f46e5' : '#131b2e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🌐 Active Packages Catalog ({productsList.length})
            </button>
          </div>

          {activeTab === 'orders' && (
            <div>
              <OrganizerCalendarView bookings={myBookings} />

              <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', marginTop: '24px' }}>
                <h3 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#fbbf24' }}>📋 Customer Event Orders</h3>
                {myBookings.length === 0 ? <p style={{ color: '#94a3b8' }}>No bookings assigned yet.</p> : (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {myBookings.map((b) => (
                      <div key={b.bookingId} style={{ background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <strong style={{ color: '#34d399', fontSize: '15px' }}>{b.eventType} - ₹{b.price}</strong>
                          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#cbd5e1' }}>
                            Customer: <strong>{b.customerName}</strong> ({b.customerEmail}) | Date: {b.eventDate} ({b.eventTime})
                          </p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>📍 {b.customAddress} | 📞 {b.contactPhone}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <select 
                            value={b.status || 'Confirmed ✅'} 
                            onChange={(e) => handleStatusChange(b.bookingId, e.target.value)} 
                            style={{ padding: '8px', background: '#131b2e', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                          >
                            <option value="Confirmed ✅">Confirmed ✅</option>
                            <option value="In Preparation 🛠️">In Preparation 🛠️</option>
                            <option value="Event Live 🚀">Event Live 🚀</option>
                            <option value="Completed">Completed 🎉</option>
                            <option value="Cancelled ❌">Cancelled ❌</option>
                          </select>

                          <button 
                            onClick={() => { generateReceiptCSV(b, brandConfig); showToast('📄 Bill Receipt Downloaded!'); }} 
                            style={{ padding: '8px 12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                          >
                            📥 Bill Receipt
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'add_package' && (
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '20px', padding: '28px' }}>
              <h3 style={{ fontSize: '20px', color: '#10b981', margin: '0 0 16px 0' }}>✨ Upload New Event Package / Service</h3>
              <form onSubmit={handleCreatePackage}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>PACKAGE TITLE</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Royal Stage Setup" required style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>CATEGORY</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }}>
                      <option value="Wedding & Reception">Wedding & Reception</option>
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="College Fest & Concert">College Fest & Concert</option>
                      <option value="Corporate Event">Corporate Event</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>PRICE (INR)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 25000" required style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>IMAGE URL</label>
                  <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://images.unsplash.com/..." style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>PACKAGE DESCRIPTION & INCLUSIONS</label>
                  <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Includes Mandap, Stage Lights, Sound system..." required rows="3" style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                </div>

                <button type="submit" style={{ padding: '12px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🚀 Publish Package to Store</button>
              </form>
            </div>
          )}

          {activeTab === 'my_packages' && (
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', color: '#818cf8', margin: '0 0 16px 0' }}>🌐 Published Packages ({productsList.length})</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                {productsList.map((p) => (
                  <div key={p.id} style={{ background: '#090d16', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                    <img src={p.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'} alt={p.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                    <strong style={{ color: '#fff', fontSize: '14px', display: 'block' }}>{p.title}</strong>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 8px 0' }}>{p.desc}</p>
                    <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: '16px' }}>₹{p.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {showTermsModal && <TermsModal brandConfig={brandConfig} onClose={() => setShowTermsModal(false)} />}
      <Footer brandConfig={brandConfig} />
    </div>
  );
}