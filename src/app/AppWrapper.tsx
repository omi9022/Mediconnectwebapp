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

type PortalKey = 'hospital' | 'support' | 'customer' | 'distributor';

export default function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<PortalKey | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [backendAvailable, setBackendAvailable] = useState(true);

  useEffect(() => {
    const session = getUserSession();
    if (session?.user && session?.userType) {
      setUserData(session.user);
      setUserType(session.userType as PortalKey);
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
    } catch {
      setBackendAvailable(false);
    }
  };

  const handleLogin = async (type: PortalKey, username: string, password: string) => {
    try {
      if (backendAvailable) {
        try {
          const response = await api.login(username, password);
          if (response.success && response.user) {
            setUserType(type);
            setUserData(response.user);
            setIsAuthenticated(true);
            saveUserSession(response.user, type);
            return true;
          }
        } catch {
          setBackendAvailable(false);
        }
      }

      const customUsers = getCustomUsers();
      const userList = type === 'hospital' ? customUsers.hospital : type === 'customer' ? customUsers.customer : type === 'distributor' ? customUsers.distributor : [];

      const customUser = userList.find((u: any) => u.username === username && u.password === password && u.status === 'active');
      if (customUser) {
        const { password: _pw, ...userWithoutPassword } = customUser;
        setUserType(type);
        setUserData(userWithoutPassword);
        setIsAuthenticated(true);
        saveUserSession(userWithoutPassword, type);
        return true;
      }

      const user = FALLBACK_USERS[username];
      if (user && user.password === password) {
        const { password: _pw, ...userWithoutPassword } = user;
        setUserType(type);
        setUserData(userWithoutPassword);
        setIsAuthenticated(true);
        saveUserSession(userWithoutPassword, type);
        return true;
      }

      return false;
    } catch {
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

  if (!isAuthenticated) {
    content = <Login onLogin={handleLogin} />;
  } else if (userType === 'support') {
    content = <SupportDashboard userData={userData} onLogout={handleLogout} />;
  } else if (userType === 'hospital') {
    content = <HospitalDashboard user={userData} onLogout={handleLogout} />;
  } else if (userType === 'customer') {
    content = <CustomerDashboard user={userData} onLogout={handleLogout} />;
  } else if (userType === 'distributor') {
    content = <DistributorDashboard userData={userData} onLogout={handleLogout} />;
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      {content}
      {userType === 'customer' && isAuthenticated && <AnimatedChatbot userType="customer" />}
    </>
  );
}
