import React from 'react';
import Header from '../components/common/Header';

const WebHeaderNavigator = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default WebHeaderNavigator;