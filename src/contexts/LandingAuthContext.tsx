import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { authService } from '../services/authService';
import { crossOriginAuth, AuthData } from '../utils/crossOriginAuth';

interface User {
  id: string; // Changed to string for UUID compatibility
  username: string;
  email: string;
  subscriptionType: string;
  subscriptionStatus?: 'active' | 'expired' | 'cancelled' | null;
  planName?: string;
  endDate?: string;
  daysRemaining?: number;
}

interface LandingAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, email: string, username: string, userId: string, subscriptionType?: string) => void;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; message?: string; token?: string; user?: User }>;
  register: (email: string, password: string) => Promise<{ success: boolean; message?: string; token?: string; user?: User }>;
  logout: () => void;
  refreshSubscriptionStatus: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const LandingAuthContext = createContext<LandingAuthContextType | undefined>(undefined);

interface LandingAuthProviderProps {
  children: ReactNode;
}

export const LandingAuthProvider: React.FC<LandingAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token: string, email: string, username: string, userId: string, subscriptionType: string = 'demo') => {
    const userData: User = {
      id: userId,
      username,
      email,
      subscriptionType
    };
    const authData: AuthData = { token, email, username, userId, subscriptionType };

    // Store JWT token in localStorage for consistency with main app
    localStorage.setItem('authToken', token);
    localStorage.setItem('medMasterToken', token);
    localStorage.setItem('medMasterEmail', email);
    localStorage.setItem('medMasterUsername', username);

    // Use cross-origin auth utility for better token management
    crossOriginAuth.storeAuthData(authData);

    setUser(userData);
    setIsAuthenticated(true);
  };

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const result = await authService.login({ email, password });

      if (result.success && result.user) {
        const userData = {
          id: result.user.id.toString(),
          username: result.user.username,
          email: result.user.email,
          subscriptionType: result.user.subscription_status || 'demo'
        };

        // Store authentication data
        localStorage.setItem('medMasterToken', result.token || '');
        localStorage.setItem('medMasterEmail', userData.email);
        localStorage.setItem('medMasterUsername', userData.username);
        localStorage.setItem('medMasterUserId', userData.id);
        localStorage.setItem('medMasterSubscriptionType', userData.subscriptionType);

        // Update context state
        login(result.token || '', userData.email, userData.username, userData.id, userData.subscriptionType);

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
        const loginResult = await loginWithCredentials(email, password);
        return loginResult;
      } else {
        return { success: false, message: result.error || 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    // Clear JWT token from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('medMasterToken');
    localStorage.removeItem('medMasterEmail');
    localStorage.removeItem('medMasterUsername');
    localStorage.removeItem('medMasterUserId');
    localStorage.removeItem('medMasterSubscriptionType');

    // Use cross-origin auth utility to clear all auth data
    crossOriginAuth.clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshSubscriptionStatus = async () => {
    const authData = crossOriginAuth.getAuthData();
    const currentUser = user;
    if (!authData || !currentUser) return;

    try {
      // Temporarily set the main token for API call
      const originalToken = localStorage.getItem('medMasterToken');
      localStorage.setItem('medMasterToken', authData.token);

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Subscription status request timeout')), 5000)
      );

      const subscriptionPromise = subscriptionService.getSubscriptionStatus();
      const subscriptionStatus = await Promise.race([subscriptionPromise, timeoutPromise]) as any;

      // Restore original token
      if (originalToken) {
        localStorage.setItem('medMasterToken', originalToken);
      } else {
        localStorage.removeItem('medMasterToken');
      }

      // Update user with latest subscription status
      const updatedUser = {
        ...currentUser,
        subscriptionType: subscriptionStatus.subscription_type,
        subscriptionStatus: subscriptionStatus.status,
        planName: subscriptionStatus.plan_name,
        endDate: subscriptionStatus.end_date,
        daysRemaining: subscriptionStatus.days_remaining
      };

      setUser(updatedUser);

      // Update stored auth data with new subscription status
      const updatedAuthData: AuthData = {
        ...authData,
        subscriptionType: subscriptionStatus.subscription_type
      };
      crossOriginAuth.storeAuthData(updatedAuthData);
    } catch (error) {
      // Don't fail the whole auth flow if subscription refresh fails
      // Restore original token in case of error
      const originalToken = localStorage.getItem('medMasterToken');
      if (originalToken) {
        localStorage.setItem('medMasterToken', originalToken);
      }
    }
  };

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      // Check if token exists in localStorage
      const token = localStorage.getItem('medMasterToken');
      const email = localStorage.getItem('medMasterEmail');
      const username = localStorage.getItem('medMasterUsername');

      if (!token || !email || !username) {
        setIsLoading(false);
        return;
      }

      // For now, if we have stored credentials, consider user authenticated
      // In a full implementation, this would validate the token with the backend
      const userData = {
        id: localStorage.getItem('medMasterUserId') || '0',
        username,
        email,
        subscriptionType: localStorage.getItem('medMasterSubscriptionType') || 'demo'
      };

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // Clear any stored auth data
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing authentication on mount and when localStorage changes
  useEffect(() => {
    const checkExistingAuth = async () => {
      // Test localStorage access
      try {
        localStorage.setItem('test', 'working');
        localStorage.getItem('test');
        localStorage.removeItem('test');
      } catch (error) {
        // localStorage access error - handle silently
      }

      // First check cross-origin auth data
      let authData = crossOriginAuth.getAuthData();

      // If no cross-origin auth data, check main app tokens
      if (!authData) {
        const token = localStorage.getItem('medMasterToken');
        const email = localStorage.getItem('medMasterEmail');
        const username = localStorage.getItem('medMasterUsername');

        if (token && email && username) {
          authData = {
            token,
            email,
            username,
            userId: '0', // Default, will be updated if available
            subscriptionType: 'demo' // Default, will be updated below
          };
        }
      }

      if (authData) {
        try {
          const parsedUser = {
            id: authData.userId || '0',
            username: authData.username,
            email: authData.email,
            subscriptionType: authData.subscriptionType || 'demo'
          };
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Refresh subscription status after setting user data
          // Use a separate function to avoid dependency issues
          try {
            // Temporarily set the main token for API call
            const originalToken = localStorage.getItem('medMasterToken');
            localStorage.setItem('medMasterToken', authData.token);

            const subscriptionStatus = await subscriptionService.getSubscriptionStatus();

            // Restore original token
            if (originalToken) {
              localStorage.setItem('medMasterToken', originalToken);
            } else {
              localStorage.removeItem('medMasterToken');
            }

            // Update user with latest subscription status
            const updatedUser = {
              ...parsedUser,
              id: authData.userId || '0',
              subscriptionType: subscriptionStatus.subscription_type,
              subscriptionStatus: subscriptionStatus.status,
              planName: subscriptionStatus.plan_name,
              endDate: subscriptionStatus.end_date,
              daysRemaining: subscriptionStatus.days_remaining
            };

            setUser(updatedUser);

            // Update stored auth data with new subscription status
            const updatedAuthData: AuthData = {
              ...authData,
              subscriptionType: subscriptionStatus.subscription_type
            };
            crossOriginAuth.storeAuthData(updatedAuthData);
          } catch (error) {
            // Continue with cached user data if refresh fails
          }
        } catch (error) {
          logout();
        }
      }
    };

    checkExistingAuth();

    // Listen for localStorage changes (for when auth data is added by other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'medMasterToken' || e.key === 'landingPageToken') {
        checkExistingAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check once more after a short delay to catch any immediate localStorage updates
    const timeout = setTimeout(checkExistingAuth, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(timeout);
    };
  }, []); // No dependencies - only run once on mount

  const value: LandingAuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithCredentials,
    register,
    logout,
    refreshSubscriptionStatus,
    checkAuthStatus
  };

  return (
    <LandingAuthContext.Provider value={value}>
      {children}
    </LandingAuthContext.Provider>
  );
};

export const useLandingAuth = (): LandingAuthContextType => {
  const context = useContext(LandingAuthContext);
  if (context === undefined) {
    throw new Error('useLandingAuth must be used within a LandingAuthProvider');
  }
  return context;
};