import React from 'react';
import { 
  Phone, Mail, MapPin, ShieldCheck, FileText, 
  HelpCircle, Send, Globe, Share2, MessageCircle
} from 'lucide-react';
import { DEFAULT_BRAND_CONFIG } from '../../constants/eventCategories';

export default function Footer({ brandConfig, setShowTermsModal }) {
  return (
    <footer style={{ 
      background: 'linear-gradient(180deg, #090d16 0%, #05080f 100%)', 
      borderTop: '1px solid #1e293b', 
      color: '#94a3b8', 
      padding: '48px 24px 24px 24px', 
      marginTop: '60px', 
      fontFamily: "'Inter', system-ui, sans-serif" 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* NEWSLETTER BANNER */}
        <div style={{ 
          background: 'linear-gradient(135deg, #131b2e 0%, #0f172a 100%)', 
          border: '1px solid #1e293b', 
          borderRadius: '16px', 
          padding: '24px 32px', 
          marginBottom: '40px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '16px' 
        }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 4px 0', fontWeight: '700' }}>Stay Updated with EventHub Pro</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Subscribe to get exclusive venue management deals and setup updates.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to EventHub Newsletter!'); }} style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '380px' }}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required 
              style={{ flex: 1, padding: '10px 14px', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none' }} 
            />
            <button type="submit" style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Subscribe</span> <Send size={14} />
            </button>
          </form>
        </div>

        {/* MAIN 4-COLUMN FOOTER GRID */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '36px', 
          paddingBottom: '36px', 
          borderBottom: '1px solid #1e293b' 
        }}>
          
          {/* COL 1: BRAND SUMMARY */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', background: '#4f46e5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                {brandConfig?.brandLogo || '🎪'}
              </div>
              <strong style={{ color: '#fff', fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px' }}>
                {brandConfig?.brandName || 'EventHub Pro'}
              </strong>
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.6', margin: '0 0 16px 0', color: '#94a3b8' }}>
              {brandConfig?.aboutText || DEFAULT_BRAND_CONFIG.aboutText}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[Globe, Share2, MessageCircle].map((Icon, idx) => (
                <div key={idx} style={{ width: '32px', height: '32px', background: '#131b2e', border: '1px solid #1e293b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', cursor: 'pointer' }}>
                  <Icon size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* COL 2: SERVICES & NAVIGATION */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '14px', margin: '0 0 16px 0', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <span style={{ cursor: 'pointer', color: '#cbd5e1' }} onClick={() => setShowTermsModal && setShowTermsModal(true)}>🛠️ On-Demand Event Services</span>
              <span style={{ cursor: 'pointer', color: '#cbd5e1' }} onClick={() => setShowTermsModal && setShowTermsModal(true)}>🎪 Mandap & Stage Customizations</span>
              <span style={{ cursor: 'pointer', color: '#cbd5e1' }} onClick={() => setShowTermsModal && setShowTermsModal(true)}>🔊 Sound & DJ Setup Pricing</span>
            </div>
          </div>

          {/* COL 3: LEGAL & COMPLIANCE */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '14px', margin: '0 0 16px 0', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Legal & Security</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <span style={{ cursor: 'pointer', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setShowTermsModal && setShowTermsModal(true)}>
                <FileText size={14} color="#818cf8" /> Terms & Conditions
              </span>
              <span style={{ cursor: 'pointer', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setShowTermsModal && setShowTermsModal(true)}>
                <ShieldCheck size={14} color="#34d399" /> Privacy & Safety Policy
              </span>
              <span style={{ cursor: 'pointer', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setShowTermsModal && setShowTermsModal(true)}>
                <HelpCircle size={14} color="#fbbf24" /> Dispute Resolution Desk
              </span>
            </div>
          </div>

          {/* COL 4: CONTACT & SUPPORT */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '14px', margin: '0 0 16px 0', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact & Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="#34d399" /> 
                <span>Helpline: <strong style={{ color: '#34d399' }}>{brandConfig?.phone || '+91 7318513719'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#818cf8" /> 
                <span>Email: <strong style={{ color: '#818cf8' }}>{brandConfig?.email || 'support@eventhub.com'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={15} color="#f87171" style={{ marginTop: '2px' }} /> 
                <span>HQ: {brandConfig?.address || 'Cyber City, Tech Park, India'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          paddingTop: '20px', 
          fontSize: '12px', 
          color: '#64748b', 
          flexWrap: 'wrap', 
          gap: '10px' 
        }}>
          <div>
            © {new Date().getFullYear()} {brandConfig?.brandName || 'EventHub Pro'} Technologies Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <span style={{ color: '#34d399', fontWeight: 'bold' }}>🔒 ISO 27001 Certified Platform</span>
          </div>
        </div>

      </div>
    </footer>
  );
}