import React from 'react';

export default function Header({ userName, userRole, onLogout, activeTab, setActiveTab, brandConfig, setShowTermsModal }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e293b',
      padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab && setActiveTab('explore')}>
        <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
          <span style={{ fontSize: '20px' }}>{brandConfig?.brandLogo || '🎪'}</span>
        </div>
        <div>
          <strong style={{ fontSize: '18px', fontWeight: '800', color: '#fff', letterSpacing: '0.5px' }}>{brandConfig?.brandName || 'EventHub Pro'}</strong>
          <span style={{ display: 'block', fontSize: '10px', color: '#818cf8', fontWeight: '700' }}>{brandConfig?.tagline || 'ON-DEMAND VENUE MANAGEMENT'}</span>
        </div>
      </div>

      {userRole === 'customer' && (
        <nav style={{ display: 'flex', gap: '8px', background: '#090d16', padding: '4px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <button onClick={() => setActiveTab('explore')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'explore' ? '#4f46e5' : 'transparent', color: activeTab === 'explore' ? '#fff' : '#94a3b8', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
            🌐 Event Packages & Services
          </button>
          <button onClick={() => setActiveTab('my_booked')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'my_booked' ? '#4f46e5' : 'transparent', color: activeTab === 'my_booked' ? '#fff' : '#94a3b8', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
            🎟️ My Orders
          </button>
          <button onClick={() => setActiveTab('complaint')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: activeTab === 'complaint' ? '#ef4444' : 'transparent', color: activeTab === 'complaint' ? '#fff' : '#94a3b8', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
            🔒 Secret Admin Report
          </button>
        </nav>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button onClick={() => setShowTermsModal(true)} style={{ background: 'transparent', color: '#818cf8', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
          📄 Terms & Services
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#090d16', padding: '6px 12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: userRole === 'admin' ? '#ef4444' : '#818cf8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px' }}>
            {userRole === 'admin' ? 'A' : (userName ? userName.charAt(0).toUpperCase() : 'U')}
          </div>
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
            {userRole === 'admin' ? <strong style={{ color: '#ef4444' }}>Master Admin Command</strong> : <>Welcome, <strong style={{ color: '#fff' }}>{userName || 'User'}</strong></>}
          </span>
        </div>

        <button onClick={onLogout} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
          Logout
        </button>
      </div>
    </header>
  );
}