import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { TermsModal, showToast } from '../../components/common/Modal';
import { DEFAULT_BRAND_CONFIG } from '../../constants/eventCategories';
import { handleFileUpload } from '../../utils/imageUpload';

export default function AdminDashboard({ brandConfig, setBrandConfig, productsList, setProductsList }) {
  const navigate = useNavigate();
  
  const [usersList, setUsersList] = useState(() => JSON.parse(localStorage.getItem('eventhub_users') || '[]'));
  const [reviewsList, setReviewsList] = useState(() => JSON.parse(localStorage.getItem('eventhub_reviews') || '[]'));
  const [allDoorstepBookings, setAllDoorstepBookings] = useState(() => JSON.parse(localStorage.getItem('eventhub_doorstep_bookings') || '[]'));
  const [complaintsList, setComplaintsList] = useState(() => JSON.parse(localStorage.getItem('eventhub_complaints') || '[]'));

  const [activeAdminTab, setActiveAdminTab] = useState('products');
  const [showTermsModal, setShowTermsModal] = useState(false);

  // PRODUCT ENHANCED FORM STATE
  const [editingProductId, setEditingProductId] = useState(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Wedding & Reception');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodStatus, setProdStatus] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');

  // BRAND CONFIG EDIT STATES
  const [brandLogo, setBrandLogo] = useState(brandConfig?.brandLogo || '🎪');
  const [brandName, setBrandName] = useState(brandConfig?.brandName || 'EventHub Pro');
  const [tagline, setTagline] = useState(brandConfig?.tagline || 'ON-DEMAND VENUE MANAGEMENT');
  const [phone, setPhone] = useState(brandConfig?.phone || '+91 7318513719');
  const [email, setEmail] = useState(brandConfig?.email || 'support@eventhub.com');
  const [address, setAddress] = useState(brandConfig?.address || 'Cyber City, Tech Park, India');
  const [aboutText, setAboutText] = useState(brandConfig?.aboutText || DEFAULT_BRAND_CONFIG.aboutText);
  const [termsText, setTermsText] = useState(brandConfig?.termsText || DEFAULT_BRAND_CONFIG.termsText);
  
  const [primaryColor, setPrimaryColor] = useState(brandConfig?.primaryColor || '#4f46e5');
  const [gstPercentage, setGstPercentage] = useState(brandConfig?.gstPercentage || '18');
  const [instagramUrl, setInstagramUrl] = useState(brandConfig?.instagramUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(brandConfig?.facebookUrl || '');

  // METRICS
  const totalRevenue = allDoorstepBookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
  const avgOrderValue = allDoorstepBookings.length > 0 ? Math.round(totalRevenue / allDoorstepBookings.length) : 0;
  const totalCustomers = usersList.filter(u => u.role === 'customer').length;
  const totalOrganizers = usersList.filter(u => u.role === 'organizer').length;

  const saveUsersToStorage = (updated) => {
    setUsersList(updated);
    localStorage.setItem('eventhub_users', JSON.stringify(updated));
  };

  const handleUpdateUserStatus = (userEmail, actionType) => {
    const updated = usersList.map(u => u.email === userEmail ? { ...u, status: actionType } : u);
    saveUsersToStorage(updated);
    showToast(`✉️ Account status set to ${actionType}: ${userEmail}`);
  };

  const handleDeleteUser = (userEmail) => {
    if (window.confirm(`Are you sure you want to permanently delete user: ${userEmail}?`)) {
      const updated = usersList.filter(u => u.email !== userEmail);
      saveUsersToStorage(updated);
      showToast('🗑️ User ID permanently deleted!');
    }
  };

  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await handleFileUpload(file);
        setProdImage(compressed);
        showToast('📸 Package Banner Uploaded Successfully!');
      } catch (err) {
        showToast('❌ Image upload failed');
      }
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await handleFileUpload(file);
        setBrandLogo(compressed);
        showToast('📸 Logo Image Uploaded!');
      } catch (err) {
        showToast('❌ Failed to upload logo');
      }
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingProductId) {
      const updated = productsList.map(p => p.id === editingProductId ? {
        ...p, 
        title: prodTitle, 
        price: Number(prodPrice), 
        originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : null,
        category: prodCategory,
        desc: prodDesc, 
        image: prodImage,
        status: prodStatus
      } : p);
      setProductsList(updated);
      localStorage.setItem('eventhub_products', JSON.stringify(updated));
      showToast('✏️ Package updated successfully!');
      setEditingProductId(null);
    } else {
      const newProd = {
        id: Date.now(), 
        title: prodTitle, 
        price: Number(prodPrice), 
        originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : null,
        category: prodCategory,
        desc: prodDesc,
        status: prodStatus,
        image: prodImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
      };
      const updated = [newProd, ...productsList];
      setProductsList(updated);
      localStorage.setItem('eventhub_products', JSON.stringify(updated));
      showToast('✨ New Real-World Event Package Published!');
    }
    setProdTitle(''); setProdPrice(''); setProdOriginalPrice(''); setProdDesc(''); setProdImage(''); setProdStatus('Active');
  };

  const startEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProdTitle(prod.title);
    setProdPrice(prod.price);
    setProdOriginalPrice(prod.originalPrice || '');
    setProdCategory(prod.category || 'Wedding & Reception');
    setProdDesc(prod.desc);
    setProdImage(prod.image);
    setProdStatus(prod.status || 'Active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setProdTitle(''); setProdPrice(''); setProdOriginalPrice(''); setProdDesc(''); setProdImage(''); setProdStatus('Active');
  };

  const handleDeleteProduct = (id) => {
    const updated = productsList.filter(p => p.id !== id);
    setProductsList(updated);
    localStorage.setItem('eventhub_products', JSON.stringify(updated));
    showToast('🗑️ Package deleted successfully!');
  };

  const handleDeleteReview = (revId) => {
    const updated = reviewsList.filter(r => r.id !== revId);
    setReviewsList(updated);
    localStorage.setItem('eventhub_reviews', JSON.stringify(updated));
    showToast('🗑️ Review deleted!');
  };

  const handleDeleteBooking = (id) => {
    const updated = allDoorstepBookings.filter(b => b.bookingId !== id);
    setAllDoorstepBookings(updated);
    localStorage.setItem('eventhub_doorstep_bookings', JSON.stringify(updated));
    showToast('🗑️ Order deleted!');
  };

  const handleDeleteComplaint = (id) => {
    const updated = complaintsList.filter(c => c.id !== id);
    setComplaintsList(updated);
    localStorage.setItem('eventhub_complaints', JSON.stringify(updated));
    showToast('🗑️ Report removed!');
  };

  const handleSaveBrandSettings = (e) => {
    e.preventDefault();
    const updatedConfig = { brandLogo, brandName, tagline, phone, email, address, aboutText, termsText, primaryColor, gstPercentage, instagramUrl, facebookUrl };
    setBrandConfig(updatedConfig);
    localStorage.setItem('eventhub_brand_config', JSON.stringify(updatedConfig));
    showToast('🎨 Logo, Branding & Settings Saved Globally!');
  };

  const handleDownloadExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Booking ID,Customer Name,Email,Event Type,Price (INR),Date\n";
    allDoorstepBookings.forEach(b => {
      csvContent += `${b.bookingId},${b.customerName},${b.customerEmail},"${b.eventType}",${b.price},${b.eventDate}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EventHub_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📊 Excel Report Downloaded!');
  };

  const filteredProducts = productsList.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', fontFamily: "'Inter', system-ui, sans-serif", color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <Header userName="Master Admin" userRole="admin" onLogout={() => { localStorage.removeItem('currentUser'); navigate('/'); }} brandConfig={brandConfig} setShowTermsModal={setShowTermsModal} />

        <div style={{ maxWidth: '1100px', margin: '28px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveAdminTab('products')} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: activeAdminTab === 'products' ? primaryColor : '#131b2e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🎪 Manage Packages ({productsList.length})</button>
            <button onClick={() => setActiveAdminTab('users')} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: activeAdminTab === 'users' ? primaryColor : '#131b2e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>👥 Manage Users</button>
            <button onClick={() => setActiveAdminTab('analytics')} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: activeAdminTab === 'analytics' ? primaryColor : '#131b2e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>📊 Data Analyst & Reports</button>
            <button onClick={() => setActiveAdminTab('orders')} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: activeAdminTab === 'orders' ? primaryColor : '#131b2e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>📦 Customer Orders ({allDoorstepBookings.length})</button>
            <button onClick={() => setActiveAdminTab('reviews')} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: activeAdminTab === 'reviews' ? primaryColor : '#131b2e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>⭐ Public Reviews ({reviewsList.length})</button>
            <button onClick={() => setActiveAdminTab('complaints')} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: activeAdminTab === 'complaints' ? '#ef4444' : '#131b2e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🔒 Conflict Desk ({complaintsList.length})</button>
            <button onClick={() => setActiveAdminTab('settings')} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: activeAdminTab === 'settings' ? primaryColor : '#131b2e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>⚙️ Logo & Branding Setup</button>
          </div>

          {activeAdminTab === 'products' && (
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '24px', padding: '28px' }}>
              <h2 style={{ fontSize: '22px', color: '#fbbf24', margin: '0 0 16px 0' }}>🎪 Enterprise Event Package Management</h2>
              
              {/* ADVANCED PRODUCT FORM */}
              <form onSubmit={handleSaveProduct} style={{ background: '#090d16', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #1e293b' }}>
                <h3 style={{ fontSize: '15px', color: editingProductId ? '#fbbf24' : '#10b981', margin: '0 0 14px 0' }}>
                  {editingProductId ? '✏️ Edit Package Inventory' : '+ Publish New Event Package'}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>PACKAGE TITLE</label>
                    <input type="text" value={prodTitle} onChange={(e) => setProdTitle(e.target.value)} placeholder="e.g. Royal Gold Wedding Setup" required style={{ width: '100%', padding: '10px', background: '#131b2e', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>EVENT CATEGORY</label>
                    <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} style={{ width: '100%', padding: '10px', background: '#131b2e', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }}>
                      <option value="Wedding & Reception">💍 Wedding & Reception</option>
                      <option value="Corporate Events">💼 Corporate Events</option>
                      <option value="Birthday & Parties">🎂 Birthday & Parties</option>
                      <option value="Concerts & Shows">🎵 Concerts & Shows</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>OFFER PRICE (INR)</label>
                    <input type="number" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} placeholder="e.g. 25000" required style={{ width: '100%', padding: '10px', background: '#131b2e', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>ORIGINAL PRICE (MRP FOR DISCOUNT)</label>
                    <input type="number" value={prodOriginalPrice} onChange={(e) => setProdOriginalPrice(e.target.value)} placeholder="e.g. 30000" style={{ width: '100%', padding: '10px', background: '#131b2e', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>UPLOAD BANNER IMAGE</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input type="file" accept="image/*" onChange={handleProductImageUpload} style={{ flex: 1, padding: '8px', background: '#131b2e', border: '1px dashed #4f46e5', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                      {prodImage && <img src={prodImage} alt="Preview" style={{ width: '40px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>AVAILABILITY STATUS</label>
                    <select value={prodStatus} onChange={(e) => setProdStatus(e.target.value)} style={{ width: '100%', padding: '10px', background: '#131b2e', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }}>
                      <option value="Active">🟢 Active / Available</option>
                      <option value="Draft">🟡 Draft / Hidden</option>
                      <option value="Sold Out">🔴 Sold Out</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>PACKAGE DESCRIPTION & INCLUSIONS</label>
                  <input type="text" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} placeholder="e.g. Includes Stage Decor, Entrance Arch, LED Lighting & Audio Setup" required style={{ width: '100%', padding: '10px', background: '#131b2e', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={{ padding: '12px 24px', background: editingProductId ? '#f59e0b' : '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                    {editingProductId ? 'Update Package' : 'Publish Event Package'}
                  </button>
                  {editingProductId && (
                    <button type="button" onClick={cancelEditProduct} style={{ padding: '12px 20px', background: '#475569', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Cancel Edit</button>
                  )}
                </div>
              </form>

              {/* SEARCH & INVENTORY GRID */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#818cf8' }}>📦 Published Inventory ({filteredProducts.length})</h3>
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="🔍 Search packages or category..." 
                  style={{ padding: '8px 14px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '12px', width: '240px' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {filteredProducts.map((p) => (
                  <div key={p.id} style={{ background: '#090d16', padding: '14px', borderRadius: '14px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                    
                    {/* STATUS BADGE */}
                    <span style={{ position: 'absolute', top: '20px', right: '20px', background: p.status === 'Sold Out' ? '#ef4444' : p.status === 'Draft' ? '#f59e0b' : '#10b981', color: '#fff', fontSize: '9px', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                      {p.status || 'Active'}
                    </span>

                    <div>
                      <img src={p.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'} alt={p.title} style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }} />
                      <span style={{ fontSize: '10px', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase' }}>{p.category || 'General Package'}</span>
                      <strong style={{ color: '#fff', fontSize: '15px', display: 'block', margin: '2px 0 4px 0' }}>{p.title}</strong>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 10px 0', lineHeight: '1.4' }}>{p.desc}</p>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ color: '#34d399', fontWeight: '800', fontSize: '18px' }}>₹{p.price}</span>
                        {p.originalPrice && (
                          <span style={{ color: '#64748b', textDecoration: 'line-through', fontSize: '13px' }}>₹{p.originalPrice}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => startEditProduct(p)} style={{ flex: 1, padding: '8px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>✏️ Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ flex: 1, padding: '8px', background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeAdminTab === 'users' && (
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '24px', padding: '28px' }}>
              <h2 style={{ fontSize: '22px', color: '#fbbf24', margin: '0 0 16px 0' }}>👥 Registered Users & Access Control ({usersList.length})</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#090d16', borderBottom: '1px solid #1e293b', color: '#818cf8' }}>
                    <th style={{ padding: '12px' }}>NAME</th>
                    <th style={{ padding: '12px' }}>EMAIL</th>
                    <th style={{ padding: '12px' }}>PASSWORD</th>
                    <th style={{ padding: '12px' }}>STATUS</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.email} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{u.name}</td>
                      <td style={{ padding: '12px', color: '#34d399' }}>{u.email}</td>
                      <td style={{ padding: '12px', color: '#fbbf24' }}>{u.password || '••••••••'}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', background: u.status === 'Blocked' || u.status === 'Terminated' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: u.status === 'Blocked' || u.status === 'Terminated' ? '#f87171' : '#34d399' }}>
                          {u.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => handleUpdateUserStatus(u.email, 'Active')} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>✅ Active</button>
                        <button onClick={() => handleUpdateUserStatus(u.email, 'Warned')} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>⚠️ Warn</button>
                        <button onClick={() => handleUpdateUserStatus(u.email, 'Blocked')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🛑 Block</button>
                        <button onClick={() => handleDeleteUser(u.email)} style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeAdminTab === 'analytics' && (
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '24px', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '22px', color: '#34d399', margin: 0 }}>📈 Data Analyst Dashboard & Financial Insights</h2>
                <button onClick={handleDownloadExcel} style={{ padding: '8px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>📊 Download Excel (.csv)</button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#090d16', padding: '18px', borderRadius: '14px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>TOTAL GROSS REVENUE</span>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>₹{totalRevenue.toLocaleString()}</div>
                </div>
                <div style={{ background: '#090d16', padding: '18px', borderRadius: '14px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>AVERAGE ORDER VALUE</span>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#818cf8', marginTop: '4px' }}>₹{avgOrderValue.toLocaleString()}</div>
                </div>
                <div style={{ background: '#090d16', padding: '18px', borderRadius: '14px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>TOTAL BOOKINGS</span>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>{allDoorstepBookings.length}</div>
                </div>
                <div style={{ background: '#090d16', padding: '18px', borderRadius: '14px', border: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>CUSTOMER / ORGANIZER</span>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>{totalCustomers} / {totalOrganizers}</div>
                </div>
              </div>
            </div>
          )}

          {activeAdminTab === 'orders' && (
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '24px', padding: '28px' }}>
              <h2 style={{ fontSize: '22px', color: '#fbbf24', margin: '0 0 16px 0' }}>📦 Customer Orders ({allDoorstepBookings.length})</h2>
              {allDoorstepBookings.length === 0 ? <p style={{ color: '#94a3b8' }}>No bookings uploaded yet.</p> : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {allDoorstepBookings.map((b) => (
                    <div key={b.bookingId} style={{ background: '#090d16', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#34d399', fontSize: '14px' }}>{b.eventType} - ₹{b.price}</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#cbd5e1' }}>Customer: {b.customerName} ({b.customerEmail}) | Address: {b.customAddress}</p>
                      </div>
                      <button onClick={() => handleDeleteBooking(b.bookingId)} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Delete Order</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeAdminTab === 'reviews' && (
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '24px', padding: '28px' }}>
              <h2 style={{ fontSize: '22px', color: '#fbbf24', margin: '0 0 16px 0' }}>⭐ Public Reviews</h2>
              {reviewsList.length === 0 ? <p style={{ color: '#94a3b8' }}>No reviews found.</p> : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {reviewsList.map((r) => (
                    <div key={r.id} style={{ background: '#090d16', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#818cf8', fontSize: '13px' }}>{r.userName} ({'⭐'.repeat(Number(r.rating))})</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#cbd5e1' }}>"{r.text}"</p>
                      </div>
                      <button onClick={() => handleDeleteReview(r.id)} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Delete Review</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeAdminTab === 'complaints' && (
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '24px', padding: '28px' }}>
              <h2 style={{ fontSize: '22px', color: '#ef4444', margin: '0 0 16px 0' }}>🔒 Conflict Desk & Confidential Reports</h2>
              {complaintsList.length === 0 ? <p style={{ color: '#94a3b8' }}>No active reports.</p> : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {complaintsList.map((c) => (
                    <div key={c.id} style={{ background: '#090d16', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#ef4444', fontSize: '13px' }}>From: {c.senderName} ({c.senderEmail})</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#cbd5e1' }}>Target: {c.target} | Msg: "{c.message}"</p>
                      </div>
                      <button onClick={() => handleDeleteComplaint(c.id)} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Delete Report</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeAdminTab === 'settings' && (
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '24px', padding: '28px' }}>
              <h2 style={{ fontSize: '22px', color: '#fbbf24', margin: '0 0 16px 0' }}>⚙️ Global Branding, Theme & Financial Settings</h2>
              <form onSubmit={handleSaveBrandSettings}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '4px 0' }}>UPLOAD BRAND LOGO IMAGE OR ENTER EMOJI</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ flex: 1, padding: '8px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                      <div style={{ width: '40px', height: '40px', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {brandLogo?.startsWith('data:image') ? (
                          <img src={brandLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '20px' }}>{brandLogo}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '4px 0' }}>BRAND NAME</label>
                    <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Brand Name" required style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '4px 0' }}>PRIMARY THEME ACCENT COLOR</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: '40px', height: '38px', background: 'none', border: 'none', cursor: 'pointer' }} />
                      <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ flex: 1, padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '4px 0' }}>GST / BILLING TAX (%)</label>
                    <input type="number" value={gstPercentage} onChange={(e) => setGstPercentage(e.target.value)} placeholder="18" style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '8px 0 4px 0' }}>TAGLINE</label>
                <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Tagline" required style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '4px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '8px 0 4px 0' }}>INSTAGRAM PROFILE URL</label>
                    <input type="url" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '8px 0 4px 0' }}>FACEBOOK PAGE URL</label>
                    <input type="url" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="https://facebook.com/..." style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '8px 0 4px 0' }}>PHONE HELPLINE</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '8px 0 4px 0' }}>SUPPORT EMAIL</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '8px 0 4px 0' }}>HQ LOCATION ADDRESS</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" required style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />

                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '8px 0 4px 0' }}>ABOUT US DESCRIPTION (FOOTER)</label>
                <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} placeholder="About Us text..." required rows="2" style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />

                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', margin: '8px 0 4px 0' }}>TERMS & SERVICES POLICY TEXT</label>
                <textarea value={termsText} onChange={(e) => setTermsText(e.target.value)} placeholder="Terms and Services text..." required rows="4" style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />

                <button type="submit" style={{ padding: '12px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '14px' }}>Save Global Branding & Settings</button>
              </form>
            </div>
          )}
        </div>
      </div>

      {showTermsModal && <TermsModal brandConfig={brandConfig} onClose={() => setShowTermsModal(false)} />}
      <Footer brandConfig={brandConfig} setShowTermsModal={setShowTermsModal} />
    </div>
  );
}