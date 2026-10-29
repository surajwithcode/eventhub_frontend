import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterAndLogin from './screens/auth/Login';
import CustomerDashboard from './screens/customer/CustomerDashboard';
import OrganiserDashboard from './screens/organiser/OrganiserDashboard';
import AdminDashboard from './screens/admin/AdminDashboard';
import RoleBasedRoute from './navigation/RoleBasedRoute';
import { useAppStore } from './context/useAppStore';

export default function App() {
  const { brandConfig, productsList, setBrandConfig, setProductsList } = useAppStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTE - LOGIN & REGISTER */}
        <Route path="/" element={<RegisterAndLogin />} />
        
        {/* CUSTOMER PROTECTED ROUTE */}
        <Route path="/customer-dashboard" element={
          <RoleBasedRoute allowedRoles={['customer']}>
            <CustomerDashboard brandConfig={brandConfig} productsList={productsList} />
          </RoleBasedRoute>
        } />

        {/* ORGANIZER PROTECTED ROUTE */}
        <Route path="/organizer-dashboard" element={
          <RoleBasedRoute allowedRoles={['organizer']}>
            <OrganiserDashboard brandConfig={brandConfig} />
          </RoleBasedRoute>
        } />

        {/* ADMIN PROTECTED ROUTE */}
        <Route path="/admin-dashboard" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminDashboard 
              brandConfig={brandConfig} 
              setBrandConfig={setBrandConfig} 
              productsList={productsList} 
              setProductsList={setProductsList} 
            />
          </RoleBasedRoute>
        } />

        {/* CATCH ALL - FALLBACK ROUTE */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}