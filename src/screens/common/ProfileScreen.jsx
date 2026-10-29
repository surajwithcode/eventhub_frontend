import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  if (!user) return <p>Please login to view profile.</p>;

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>My Profile</h2>
      <div style={{ margin: '20px 0' }}>
        <p><strong>Name:</strong> {user.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <button
        onClick={logout}
        style={{ width: '100%', padding: 10, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileScreen;