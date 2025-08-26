import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

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
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; token?: string; user?: User }>;
  register: (email: string, password: string) => Promise<{ success: boolean; message?: string; token?: string; user?: User }>;
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
      // For now, check if token exists in localStorage
      const token = localStorage.getItem('medMasterToken');
      if (!token) {
        setIsLoading(false);
        return;
      }
      // TODO: Implement proper token validation with authService
      // TODO: Implement proper token validation
      const result = { success: false };
      if (result.success) {
        // This would be populated when proper auth is implemented
        // setUser({
        //   id: parseInt(result.user.id),
        //   username: result.user.username,
        //   email: result.user.email,
        //   subscriptionType: result.user.subscription_status
        // });
      }
    } catch (error) {
      // Clear any stored auth data
      localStorage.removeItem('medMasterToken');
      localStorage.removeItem('medMasterEmail');
      localStorage.removeItem('medMasterUsername');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login({ email, password });
      
      if (result.success && result.user) {
        const userData = {
          id: parseInt(result.user.id),
          username: result.user.username,
          email: result.user.email,
          subscriptionType: result.user.subscription_status
        };
        
        // Store authentication data
        localStorage.setItem('medMasterToken', result.token || '');
        localStorage.setItem('medMasterEmail', userData.email);
        localStorage.setItem('medMasterUsername', userData.username);
        
        setUser(userData);
        
        return { success: true, token: result.token, user: userData };
      } else {
        return { success: false, message: result.error || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const result = await authService.register({ email, password });
      
      if (result.success) {
        // After successful registration, log the user in
        const loginResult = await login(email, password);
        return loginResult;
      } else {
        return { success: false, message: result.error || 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, message: 'Registration failed' };
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