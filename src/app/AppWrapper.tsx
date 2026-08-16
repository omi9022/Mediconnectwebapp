import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import Login from './components/Login';
import SupportDashboard from './components/SupportDashboard';
import HospitalDashboard from './components/HospitalDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import DistributorDashboard from './components/DistributorDashboard';
import AnimatedChatbot from './components/AnimatedChatbot';
import api from '../services/api';
import { FALLBACK_USERS } from '../utils/constants';
import { 
  getUserSession, 
  saveUserSession, 
  clearUserSession, 
  getCustomUsers 
} from '../utils/storage';

export default function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'hospital' | 'support' | 'customer' | 'distributor' | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [backendAvailable, setBackendAvailable] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const session = getUserSession();
    if (session) {
      setUserData(session.user);
      setUserType(session.userType as 'hospital' | 'support' | 'customer' | 'distributor');
      setIsAuthenticated(true);
    }
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:8000/', { 
        method: 'GET',
        mode: 'cors'
      });
      setBackendAvailable(response.ok);
      if (response.ok) {
        console.log('✅ Backend connected - Full features enabled');
      }
    } catch (error) {
      // Backend not available - using fallback mode (this is fine for testing)
      setBackendAvailable(false);
      console.log('ℹ️ Running in fallback mode (frontend only). Start backend for full features.');
    }
  };

  const handleLogin = async (type: 'hospital' | 'support' | 'customer' | 'distributor', username: string, password: string) => {
    try {
      // Try backend first if available
      if (backendAvailable) {
        try {
          const response = await api.login(username, password);
          
          if (response.success) {
            setUserType(type);
            setUserData(response.user);
            setIsAuthenticated(true);
            saveUserSession(response.user, type);
            return true;
          }
        } catch (error) {
          console.warn('Backend login failed, trying fallback');
          setBackendAvailable(false);
        }
      }

      // Check custom users from Support Dashboard
      const customUsers = getCustomUsers();
      const userList = type === 'hospital' ? customUsers.hospital : type === 'customer' ? customUsers.customer : type === 'distributor' ? customUsers.distributor : [];
      
      const customUser = userList.find((u: any) => u.username === username && u.password === password && u.status === 'active');
      if (customUser) {
        const userWithoutPassword = { ...customUser };
        delete userWithoutPassword.password;
        
        setUserType(type);
        setUserData(userWithoutPassword);
        setIsAuthenticated(true);
        saveUserSession(userWithoutPassword, type);
        return true;
      }

      // Fallback authentication
      const user = FALLBACK_USERS[username];
      if (user && user.password === password) {
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        
        setUserType(type);
        setUserData(userWithoutPassword);
        setIsAuthenticated(true);
        saveUserSession(userWithoutPassword, type);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const handleLogout = () => {
    api.logout();
    clearUserSession();
    setIsAuthenticated(false);
    setUserType(null);
    setUserData(null);
  };

  let content = null;

  // Show login if not authenticated
  if (!isAuthenticated) {
    content = <Login onLogin={handleLogin} />;
  }
  // Show Support Dashboard for support users
  else if (userType === 'support') {
    content = <SupportDashboard userData={userData} onLogout={handleLogout} />;
  }
  // Show Hospital Dashboard for hospital users
  else if (userType === 'hospital') {
    content = <HospitalDashboard user={userData} onLogout={handleLogout} />;
  }
  // Show Customer Dashboard for customer users
  else if (userType === 'customer') {
    content = <CustomerDashboard user={userData} onLogout={handleLogout} />;
  }
  // Show Distributor Dashboard for distributor users
  else if (userType === 'distributor') {
    content = <DistributorDashboard userData={userData} onLogout={handleLogout} />;
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      {content}
      {userType === 'customer' && <AnimatedChatbot userType="customer" />}
    </>
  );
}