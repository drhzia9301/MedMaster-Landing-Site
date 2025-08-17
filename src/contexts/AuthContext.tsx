import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, createAuthConfig } from '../config/api';

interface User {
  id: number;
  username: string;
  email: string;
  subscriptionType?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string; token?: string; user?: User }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string; token?: string; user?: User }>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('medMasterToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await axios.get(API_ENDPOINTS.auth.profile, createAuthConfig(token));
      setUser(response.data.user);
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('medMasterToken');
      localStorage.removeItem('medMasterEmail');
      localStorage.removeItem('medMasterUsername');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(API_ENDPOINTS.auth.login, {
        username,
        password,
      });

      const { token, user: userData } = response.data;
      
      // Store authentication data
      localStorage.setItem('medMasterToken', token);
      localStorage.setItem('medMasterEmail', userData.email);
      localStorage.setItem('medMasterUsername', userData.username);
      
      setUser(userData);
      
      return { success: true, token, user: userData };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await axios.post(API_ENDPOINTS.auth.register, {
        username,
        email,
        password,
      });

      // After successful registration, log the user in
      const loginResult = await login(username, password);
      
      return loginResult;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('medMasterToken');
    localStorage.removeItem('medMasterEmail');
    localStorage.removeItem('medMasterUsername');
    setUser(null);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};