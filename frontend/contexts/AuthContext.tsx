"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

interface Admin {
  id: number;
  username: string;
  email: string;
  lastLogin: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  admin: Admin | null;
  login: (password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async (): Promise<boolean> => {
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsAuthenticated(false);
        setAdmin(null);
        return false;
      }

      const response = await authAPI.verify();
      setIsAuthenticated(true);
      setAdmin(response.admin);
      return true;
    } catch (error) {
      // Token is invalid or expired
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('authTime');
        localStorage.removeItem('adminData');
      }
      setIsAuthenticated(false);
      setAdmin(null);
      return false;
    }
  };

  const login = async (password: string) => {
    try {
      const response = await authAPI.login(password);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authTime', Date.now().toString());
        localStorage.setItem('adminData', JSON.stringify(response.admin));
      }
      
      setIsAuthenticated(true);
      setAdmin(response.admin);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authTime');
      localStorage.removeItem('adminData');
    }
    
    setIsAuthenticated(false);
    setAdmin(null);
    
    // Optional: Call backend logout endpoint
    authAPI.logout().catch(() => {
      // Ignore errors on logout
    });
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      // Only run on client side
      if (typeof window !== 'undefined') {
        // Check if we have stored auth data
        const storedAuth = localStorage.getItem('isAuthenticated');
        const storedAdmin = localStorage.getItem('adminData');
        
        if (storedAuth === 'true' && storedAdmin) {
          try {
            // Verify token is still valid
            await checkAuth();
          } catch (error) {
            // Token verification failed, clear stored data
            logout();
          }
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    admin,
    login,
    logout,
    loading,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};