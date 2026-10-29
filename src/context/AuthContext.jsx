import React, { createContext, useState, useEffect } from 'react';
import { getItem, setItem, removeItem, clearStorage } from '../services/storageService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getItem('user');
    const token = getItem('userToken');

    if (storedUser && token) {
      setUser(storedUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const loginUser = (userData, token) => {
    setItem('userToken', token);
    setItem('user', userData);
    setUser(userData);
  };

  const logoutUser = () => {
    clearStorage();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};