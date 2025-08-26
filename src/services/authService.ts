/**
 * Authentication Service for Landing Page
 * Uses Supabase Auth directly for authentication operations
 */

import { 
  signUpWithEmailAndPassword, 
  signInWithEmailAndPasswordFirebase, 
  resendVerificationEmail,
  auth
} from '../config/firebase';
// Remove unused import since we're not using Firebase User type directly
import { API_ENDPOINTS } from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    subscription_status: string;
    subscription_end_date?: string;
    profile_picture?: string;
  };
  token?: string;
  userId?: string;
  isNewUser?: boolean;
  message?: string;
  error?: string;
  needsVerification?: boolean;
}

export const authService = {
  /**
   * Login with email and password using Firebase
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;
      
      const result = await signInWithEmailAndPasswordFirebase(email, password);
      
      // Generate username from email for compatibility
      const username = result.user.email?.split('@')[0] || 'User';
      
      return {
        success: true,
        user: {
          id: result.user.uid,
          email: result.user.email || '',
          username: username,
          subscription_status: 'demo'
        },
        token: result.idToken,
        userId: result.user.uid
      };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Firebase error cases
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }
      if (error.message === 'EMAIL_NOT_VERIFIED') {
        return {
          success: false,
          error: 'Please verify your email address before logging in. Check your inbox for a verification link.',
          needsVerification: true
        };
      }
      if (error.code === 'auth/too-many-requests') {
        return {
          success: false,
          error: 'Too many failed attempts. Please try again later.'
        };
      }
      
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  },

  /**
   * Register new user using Firebase Auth and sync with backend
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const { email, password } = userData;
      
      // Step 1: Create Firebase user
      const result = await signUpWithEmailAndPassword(email, password);
      
      // Generate username from email for compatibility
      const username = result.user.email?.split('@')[0] || 'User';
      
      // Step 2: Sync with Railway backend (same as main app)
      try {
        const backendData = {
          credential: result.idToken,
          email: result.user.email || '',
          username: username
        };
        
        console.log('🔄 Syncing Firebase user with Railway backend...');
        
        const response = await fetch(API_ENDPOINTS.auth.registerFirebase, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendData),
        });
        
        const backendResult = await response.json();
        
        if (!response.ok) {
          console.warn('Railway backend sync failed:', backendResult.error);
          // Continue with Firebase-only registration
        } else {
          console.log('✅ User successfully synced with Railway backend database');
          
          // Return Railway backend response for consistency
          return {
            success: true,
            user: {
              id: backendResult.user?.id || result.user.uid,
              email: backendResult.user?.email || result.user.email || '',
              username: backendResult.user?.username || username,
              subscription_status: backendResult.user?.subscription_status || 'demo'
            },
            token: backendResult.token || result.idToken,
            userId: backendResult.user?.id || result.user.uid,
            isNewUser: backendResult.isNewUser || true,
            message: 'Registration successful! Please check your email to verify your account before logging in.',
            needsVerification: true
          };
        }
      } catch (backendError) {
        console.warn('Railway backend sync failed:', backendError);
        // Continue with Firebase-only registration
      }
      
      // Fallback to Firebase-only response
      return {
        success: true,
        user: {
          id: result.user.uid,
          email: result.user.email || '',
          username: username,
          subscription_status: 'demo'
        },
        token: result.idToken,
        userId: result.user.uid,
        isNewUser: true,
        message: 'Registration successful! Please check your email to verify your account before logging in.',
        needsVerification: true
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific Firebase error cases
      if (error.code === 'auth/email-already-in-use') {
        return {
          success: false,
          error: 'An account with this email already exists'
        };
      }
      if (error.code === 'auth/weak-password') {
        return {
          success: false,
          error: 'Password is too weak. Please choose a stronger password.'
        };
      }
      if (error.code === 'auth/invalid-email') {
        return {
          success: false,
          error: 'Invalid email address'
        };
      }
      
      return {
        success: false,
        error: 'Registration failed. Please try again.'
      };
    }
  },

  /**
   * Register with Firebase (Google OAuth) - keeping for compatibility
   */
  async registerFirebase(firebaseData: any): Promise<AuthResponse> {
    try {
      // Map the frontend data structure to what the backend expects
      const backendData = {
        credential: firebaseData.idToken, // Backend expects 'credential', frontend sends 'idToken'
        email: firebaseData.email,
        username: firebaseData.displayName || firebaseData.email?.split('@')[0] || 'User'
      };
      
      console.log('🔄 Sending to backend:', { ...backendData, credential: '[REDACTED]' });
      
      const response = await fetch(API_ENDPOINTS.auth.registerFirebase, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Firebase registration failed'
        };
      }
      
      return {
        success: true,
        user: data.user,
        token: data.token,
        userId: data.userId,
        isNewUser: data.isNewUser
      };
    } catch (error) {
      console.error('Firebase registration error:', error);
      return {
        success: false,
        error: 'Firebase registration failed. Please try again.'
      };
    }
  },

  /**
   * Get user profile using Firebase Auth
   */
  async getProfile(): Promise<AuthResponse> {
    try {
      if (!auth) {
        throw new Error('Firebase auth not initialized');
      }
      // Get current user from Firebase Auth
      const user = auth.currentUser;
      
      if (!user) {
        return {
          success: false,
          error: 'User not found or invalid token'
        };
      }

      // Generate username from email for compatibility
      const username = user.email?.split('@')[0] || 'User';
      
      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email || '',
          username: username,
          subscription_status: 'demo'
        }
      };
    } catch (error: any) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'Failed to get user profile'
      };
    }
  },

  /**
   * Resend email verification
   */
  async resendVerification(): Promise<AuthResponse> {
    try {
      await resendVerificationEmail();

      return {
        success: true,
        message: 'Verification email sent! Please check your inbox.'
      };
    } catch (error: any) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        error: 'Failed to resend verification email'
      };
    }
  }
};