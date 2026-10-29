import React, { useState } from 'react';
import HomeScreen from '../screens/customer/HomeScreen';
import MyBookingsScreen from '../screens/customer/MyBookingsScreen';
import ProfileScreen from '../screens/common/ProfileScreen';

const BottomTabNavigator = () => {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <div style={{ paddingBottom: 60 }}>
      {activeTab === 'Home' && <HomeScreen />}
      {activeTab === 'Bookings' && <MyBookingsScreen />}
      {activeTab === 'Profile' && <ProfileScreen />}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 50, background: '#fff', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <button onClick={() => setActiveTab('Home')} style={{ border: 'none', background: 'none', color: activeTab === 'Home' ? '#4f46e5' : '#666' }}>🏠 Home</button>
        <button onClick={() => setActiveTab('Bookings')} style={{ border: 'none', background: 'none', color: activeTab === 'Bookings' ? '#4f46e5' : '#666' }}>🎟️ Bookings</button>
        <button onClick={() => setActiveTab('Profile')} style={{ border: 'none', background: 'none', color: activeTab === 'Profile' ? '#4f46e5' : '#666' }}>👤 Profile</button>
      </div>
    </div>
  );
};

export default BottomTabNavigator;