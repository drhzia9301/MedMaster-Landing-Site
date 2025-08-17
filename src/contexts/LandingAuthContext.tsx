import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { crossOriginAuth, AuthData } from '../utils/crossOriginAuth';

interface User {
  username: string;
  email: string;
  subscriptionType: string;
}

interface LandingAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, email: string, username: string, subscriptionType?: string) => void;
  logout: () => void;
  refreshSubscriptionStatus: () => Promise<void>;
}

const LandingAuthContext = createContext<LandingAuthContextType | undefined>(undefined);

interface LandingAuthProviderProps {
  children: ReactNode;
}

export const LandingAuthProvider: React.FC<LandingAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token: string, email: string, username: string, subscriptionType: string = 'demo') => {
    const userData: User = {
      username,
      email,
      subscriptionType
    };
    const authData: AuthData = { token, email, username, subscriptionType };
    
    // Use cross-origin auth utility for better token management
    crossOriginAuth.storeAuthData(authData);
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
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
      console.log('🔄 Refreshing subscription status...');
      
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
        ...currentUser,
        subscriptionType: subscriptionStatus.subscription_type
      };
      
      console.log('✅ Subscription status updated:', subscriptionStatus.subscription_type);
      setUser(updatedUser);
      
      // Update stored auth data with new subscription status
      const updatedAuthData: AuthData = {
        ...authData,
        subscriptionType: subscriptionStatus.subscription_type
      };
      crossOriginAuth.storeAuthData(updatedAuthData);
    } catch (error) {
      console.error('❌ Error refreshing subscription status:', error);
      // Don't fail the whole auth flow if subscription refresh fails
    }
  };

  // Check for existing authentication on mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      const authData = crossOriginAuth.getAuthData();
      
      if (authData) {
        try {
          const parsedUser = {
            username: authData.username,
            email: authData.email,
            subscriptionType: authData.subscriptionType || 'demo'
          };
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Refresh subscription status after setting user data
          // Use a separate function to avoid dependency issues
          try {
            console.log('🔄 Refreshing subscription status on mount...');
            
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
              subscriptionType: subscriptionStatus.subscription_type
            };
            
            console.log('✅ Subscription status updated on mount:', subscriptionStatus.subscription_type);
            setUser(updatedUser);
            
            // Update stored auth data with new subscription status
            const updatedAuthData: AuthData = {
              ...authData,
              subscriptionType: subscriptionStatus.subscription_type
            };
            crossOriginAuth.storeAuthData(updatedAuthData);
          } catch (error) {
            console.error('Error refreshing subscription on mount:', error);
            // Continue with cached user data if refresh fails
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          logout();
        }
      }
    };

    checkExistingAuth();
  }, []); // No dependencies - only run once on mount

  const value: LandingAuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    refreshSubscriptionStatus
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