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
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

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
   * Login with email and password using Firebase and sync with backend
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;
      
      const result = await signInWithEmailAndPasswordFirebase(email, password);
      
      if (!result.user.emailVerified) {
        return {
          success: false,
          needsVerification: true,
          error: 'Please verify your email before logging in.'
        };
      }

      // Get Firebase ID token from result (already included)
      const idToken = result.idToken;
      
      try {
        const response = await fetch(API_ENDPOINTS.auth.login, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: idToken
          }),
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Backend login failed' }));
          throw new Error(errorData.message || 'Backend login failed');
        }

        const data = await response.json();

        return {
          success: true,
          user: {
            id: result.user.uid,
            email: data.email || result.user.email || '',
            username: data.username || result.user.email?.split('@')[0] || 'User',
            subscription_status: data.subscription_status || 'demo'
          },
          token: data.token || idToken, // Use backend token if available, fallback to Firebase token
          userId: result.user.uid
        };
      } catch (backendError) {
        console.warn('Backend login failed, using Firebase-only login:', backendError);

        // Fallback to Firebase-only login - this ensures the app always works
        return {
          success: true,
          user: {
            id: result.user.uid,
            email: result.user.email || '',
            username: result.user.email?.split('@')[0] || 'User',
            subscription_status: 'demo'
          },
          token: idToken,
          userId: result.user.uid
        };
      }
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
      
      // Step 2: Get Firebase ID token from result (already included)
      const idToken = result.idToken;
      
      try {
        const backendData = {
          credential: idToken,
          email: result.user.email || '',
          username: username
        };
        
        console.log('🔄 Syncing Firebase user with Railway backend...', {
          endpoint: API_ENDPOINTS.auth.google,
          domain: window.location.hostname
        });

        const response = await fetch(API_ENDPOINTS.auth.google, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendData),
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }).catch(fetchError => {
          console.error('❌ Network error during backend sync:', {
            error: fetchError.message,
            endpoint: API_ENDPOINTS.auth.google
          });
          throw fetchError;
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
            token: backendResult.token || idToken,
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
   * Sync user with Google OAuth backend endpoint (handles both sign-up and sign-in)
   */
  async registerFirebase(firebaseData: any): Promise<AuthResponse> {
    try {
      console.log('🔄 AuthService: registerFirebase called with:', {
        uid: firebaseData?.uid,
        email: firebaseData?.email,
        displayName: firebaseData?.displayName,
        hasIdToken: !!firebaseData?.idToken,
        idTokenLength: firebaseData?.idToken?.length
      });
      
      console.log('[AuthService] API_BASE_URL:', API_BASE_URL);
      console.log('[AuthService] Environment:', import.meta.env.MODE);
      console.log('[AuthService] VITE_API_URL:', import.meta.env.VITE_API_URL);

      // Use the Google OAuth endpoint instead of register-firebase
      const backendData = {
        credential: firebaseData.idToken // Google endpoint expects just the credential
      };

      console.log('🔄 AuthService: Sending to Google OAuth endpoint:', {
        ...backendData,
        credential: '[REDACTED]',
        endpoint: API_ENDPOINTS.auth.google,
        currentDomain: window.location.hostname,
        userAgent: navigator.userAgent
      });

      const response = await fetch(API_ENDPOINTS.auth.google, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      }).catch(fetchError => {
        console.error('❌ AuthService: Network error during fetch:', {
          error: fetchError.message,
          stack: fetchError.stack,
          endpoint: API_ENDPOINTS.auth.google
        });
        throw fetchError;
      });
      
      console.log('📥 AuthService: Backend response status:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Parse JSON response directly
      let data;
      try {
        data = await response.json();
        console.log('📥 AuthService: Raw response data:', data);
      } catch (parseError) {
        console.error('❌ AuthService: JSON parse error:', parseError);
        // Fallback: try to get response as text for debugging
        try {
          const responseText = await response.text();
          console.log('📥 AuthService: Raw response text (fallback):', responseText);
        } catch (textError) {
          console.log('📥 AuthService: Could not read response as text either');
        }
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('📥 AuthService: Backend response data:', {
        success: data.success,
        hasUser: !!data.user,
        hasToken: !!data.token,
        userId: data.userId,
        isNewUser: data.isNewUser,
        error: data.error,
        message: data.message
      });

      console.log('📥 AuthService: Full response object keys:', Object.keys(data));
      console.log('📥 AuthService: Response data types:', {
        successType: typeof data.success,
        userType: typeof data.user,
        tokenType: typeof data.token,
        userIdType: typeof data.userId
      });
      
      console.log('📥 AuthService: Raw data object:', data);
      
      if (!response.ok) {
        console.error('❌ AuthService: Backend request failed:', {
          status: response.status,
          error: data.error || 'Firebase registration failed'
        });
        return {
          success: false,
          error: data.error || 'Firebase registration failed'
        };
      }
      
      // Validate response data structure
      console.log('🔍 AuthService: Detailed response validation:', {
        dataKeys: Object.keys(data),
        userExists: 'user' in data,
        tokenExists: 'token' in data,
        userValue: data.user,
        tokenValue: data.token ? '[TOKEN_PRESENT]' : null,
        userType: typeof data.user,
        tokenType: typeof data.token,
        fullResponse: JSON.stringify(data, null, 2)
      });
      
      if (!data.user || !data.token) {
        console.error('❌ AuthService: Invalid response structure:', {
          hasUser: !!data.user,
          hasToken: !!data.token,
          rawData: data
        });
        return {
          success: false,
          error: 'Invalid response from server. Missing user or token data.'
        };
      }
      
      console.log('✅ AuthService: Backend registration successful');
      const result = {
        success: true,
        user: data.user,
        token: data.token,
        userId: data.userId || data.user.id,
        isNewUser: data.isNewUser
      };
      
      console.log('🔍 AuthService: Final response being returned:', result);
      return result;
    } catch (error) {
      console.error('❌ AuthService: Firebase registration error:', error);
      return {
        success: false,
        error: 'Firebase registration failed. Please try again.'
      };
    }
  },

  /**
   * Get user profile using backend API endpoint
   */
  async getProfile(): Promise<AuthResponse> {
    try {
      // Get token from localStorage (consistent with main app)
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found'
        };
      }

      console.log('🔄 Fetching profile from backend API...');
      
      const response = await fetch(API_ENDPOINTS.auth.profile, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          return {
            success: false,
            error: 'Authentication token expired. Please log in again.'
          };
        }
        
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || 'Failed to fetch profile'
        };
      }
      
      const profileData = await response.json();
      
      console.log('✅ Profile fetched successfully from backend');
      
      return {
        success: true,
        user: {
          id: profileData.id,
          email: profileData.email,
          username: profileData.username,
          subscription_status: 'demo', // Default for landing page
          profile_picture: profileData.profile_picture
        }
      };
    } catch (error: any) {
      console.error('Get profile error:', error);
      
      // Fallback to Firebase Auth if backend fails
      try {
        if (!auth) {
          throw new Error('Firebase auth not initialized');
        }
        
        const user = auth.currentUser;
        
        if (!user) {
          return {
            success: false,
            error: 'User not found or invalid token'
          };
        }

        console.warn('⚠️ Backend profile fetch failed, using Firebase fallback');
        
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
      } catch (fallbackError) {
        console.error('Firebase fallback also failed:', fallbackError);
        return {
          success: false,
          error: 'Failed to get user profile'
        };
      }
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