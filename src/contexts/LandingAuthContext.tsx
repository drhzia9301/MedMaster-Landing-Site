import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { crossOriginAuth, AuthData } from '../utils/crossOriginAuth';

interface User {
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
    console.log('🔐 LandingAuthContext.login called with:', { token: token.substring(0, 20) + '...', email, username, subscriptionType });
    
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
    
    console.log('✅ LandingAuthContext state updated - isAuthenticated:', true);
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
        subscriptionType: subscriptionStatus.subscription_type,
        subscriptionStatus: subscriptionStatus.status,
        planName: subscriptionStatus.plan_name,
        endDate: subscriptionStatus.end_date,
        daysRemaining: subscriptionStatus.days_remaining
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

  // Check for existing authentication on mount and when localStorage changes
  useEffect(() => {
    const checkExistingAuth = async () => {
      console.log('🔍 Checking existing auth...');
      
      // Test localStorage access
      try {
        localStorage.setItem('test', 'working');
        const testValue = localStorage.getItem('test');
        console.log('🧪 localStorage test:', testValue === 'working' ? 'Working' : 'Failed');
        localStorage.removeItem('test');
      } catch (error) {
        console.error('❌ localStorage access error:', error);
      }
      
      // First check cross-origin auth data
      let authData = crossOriginAuth.getAuthData();
      console.log('📋 Cross-origin auth data:', authData ? 'Found' : 'Not found');
      
      // If no cross-origin auth data, check main app tokens
      if (!authData) {
        const token = localStorage.getItem('medMasterToken');
        const email = localStorage.getItem('medMasterEmail');
        const username = localStorage.getItem('medMasterUsername');
        
        console.log('🔑 Main app tokens:', { 
          token: token ? token.substring(0, 20) + '...' : 'None', 
          email: email || 'None', 
          username: username || 'None' 
        });
        
        // Also check all localStorage keys
        console.log('📦 All localStorage keys:', Object.keys(localStorage));
        
        if (token && email && username) {
          authData = {
            token,
            email,
            username,
            subscriptionType: 'demo' // Default, will be updated below
          };
          console.log('✅ Created authData from main app tokens');
        }
      }
      
      if (authData) {
        console.log('🎯 Auth data found, setting user state...');
        try {
          const parsedUser = {
            username: authData.username,
            email: authData.email,
            subscriptionType: authData.subscriptionType || 'demo'
          };
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('✅ User state set - isAuthenticated: true, user:', parsedUser);
          
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
              subscriptionType: subscriptionStatus.subscription_type,
              subscriptionStatus: subscriptionStatus.status,
              planName: subscriptionStatus.plan_name,
              endDate: subscriptionStatus.end_date,
              daysRemaining: subscriptionStatus.days_remaining
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
      } else {
        console.log('❌ No auth data found');
      }
    };

    checkExistingAuth();

    // Listen for localStorage changes (for when auth data is added by other components)
    const handleStorageChange = (e: StorageEvent) => {
      console.log('📦 localStorage change detected:', e.key);
      if (e.key === 'medMasterToken' || e.key === 'landingPageToken') {
        console.log('🔄 Triggering auth check due to localStorage change');
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