import React, { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CustomerDashboard from './pages/CustomerDashboard';
import DeliveryPartnerDashboard from './pages/DeliveryPartnerDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WaitingApproval from './pages/WaitingApproval';
import { Toaster } from './components/ui/sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/waiting-approval" element={<WaitingApproval />} />
          
          <Route 
            path="/customer/*" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/delivery-partner/*" 
            element={
              <ProtectedRoute allowedRoles={['delivery_partner']}>
                <DeliveryPartnerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/*" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
