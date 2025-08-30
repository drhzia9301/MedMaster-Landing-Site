import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { subscriptionService } from '../services/subscriptionService';
import { toast } from 'sonner';
import { useLandingAuth } from '../contexts/LandingAuthContext';
import { handleRedirectResult } from '../config/firebase';

import BugIcon from './icons/BugIcon';
import GoogleSignIn from './GoogleSignIn';
import EmailVerificationPending from './EmailVerificationPending';
import { ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LandingSignupPageProps {
  onSuccess?: () => void;
  onBackToLanding?: () => void;
  onSwitchToLogin?: () => void;
  onAuthSuccess?: (token: string, email: string, username: string, subscriptionType?: string, userId?: string) => void;
}

const LandingSignupPage: React.FC<LandingSignupPageProps> = ({ 
  onSuccess, 
  onBackToLanding, 
  onSwitchToLogin,
  onAuthSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showVerificationPending, setShowVerificationPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  // Removed PasswordSetupModal - Google users complete auth immediately
  const { login } = useLandingAuth();

  // Component mounted - ready for user interaction
  useEffect(() => {
    console.log('🔍 LandingSignupPage: Component mounted and ready');
  }, []);

  // Handle Google Sign-In redirect result on page load
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await handleRedirectResult();
        if (result && result.idToken) {
          console.log('Processing Google Sign-In redirect result:', result);
          // Pass the complete result object, not just the idToken
          const userData = {
            idToken: result.idToken,
            email: result.user.email,
            displayName: result.user.displayName,
            uid: result.user.uid,
            photoURL: result.user.photoURL
          };
          await handleGoogleSignIn(userData);
        }
      } catch (error: any) {
        console.error('Error handling Google Sign-In redirect:', error);
        setError('Authentication failed after redirect. Please try again.');
      }
    };

    checkRedirectResult();
  }, []);

  // Hide browser password reveal buttons
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      input[type="password"]::-ms-reveal,
      input[type="password"]::-ms-clear,
      input[type="password"]::-webkit-credentials-auto-fill-button {
        display: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleGoogleSignIn = async (userData: any) => {
    console.log('🎯 LandingSignupPage: handleGoogleSignIn called with userData:', {
      uid: userData?.uid,
      email: userData?.email,
      displayName: userData?.displayName,
      hasIdToken: !!userData?.idToken,
      idTokenLength: userData?.idToken?.length
    });
    setError(null);
    setLoading(true);

    try {
      // Extract the required data from userData object
      const firebaseData = {
        idToken: userData.idToken,
        email: userData.email,
        displayName: userData.displayName,
        uid: userData.uid,
        photoURL: userData.photoURL
      };
      
      console.log('🔄 LandingSignupPage: Processing Google Sign-In data:', { ...firebaseData, idToken: '[REDACTED]' });
      
      // Use auth service for Google authentication
      console.log('🔐 LandingSignupPage: Sending Google user data to auth service...');
      const result = await authService.registerFirebase(firebaseData);
      console.log('✅ LandingSignupPage: Auth service response:', {
        success: result.success,
        hasUser: !!result.user,
        hasToken: !!result.token,
        userId: result.userId,
        isNewUser: result.isNewUser,
        error: result.error
      });
      console.log('🔍 LandingSignupPage: Full auth service result object:', result);
      console.log('🔍 LandingSignupPage: API Configuration Debug:', {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        MODE: import.meta.env.MODE,
        PROD: import.meta.env.PROD,
        DEV: import.meta.env.DEV
      });
      
      if (!result.success || !result.user || !result.token) {
        throw new Error(result.error || 'Google authentication failed');
      }
      
      const { token, user } = result;
      const { email, username } = user;
      const userId = (result as any).userId || user.id || 0;
      const isNewUser = (result as any).isNewUser || false;

      // Store authentication data in the format expected by LandingAuthContext
      localStorage.setItem('landingPageToken', token);
      localStorage.setItem('medMasterToken', token);
      localStorage.setItem('medMasterEmail', email);
      localStorage.setItem('medMasterUsername', username);
      
      try {
        const subscriptionStatus = await subscriptionService.getSubscriptionStatus();
        
        // Complete login immediately for both new and existing users
        login(token, email, username, userId, subscriptionStatus.subscription_type);
        
        if (onAuthSuccess) {
          onAuthSuccess(token, email, username, subscriptionStatus.subscription_type, userId.toString());
        }
        
        if (isNewUser) {
          toast.success('Welcome to MedMaster! Your Google account has been connected.');
        } else {
          toast.success('Successfully signed in with Google!');
        }
        
        onSuccess?.();
      } catch (subscriptionError) {
        console.warn('Could not fetch subscription status:', subscriptionError);
        
        // Complete login immediately for both new and existing users
        login(token, email, username, userId, 'demo');
        
        if (onAuthSuccess) {
          onAuthSuccess(token, email, username, 'demo', userId.toString());
        }
        
        if (isNewUser) {
          toast.success('Welcome to MedMaster! Your Google account has been connected.');
        } else {
          toast.success('Successfully signed in with Google!');
        }
        
        onSuccess?.();
      }
    } catch (err: any) {
      console.error('Google Sign-In backend error:', err);
      
      if (err.message) {
        setError(err.message);
      } else if (err.code === 'ERR_NETWORK' || err.code === 'ERR_NAME_NOT_RESOLVED') {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError('An unknown error occurred during Google sign-in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error: string) => {
    setError(`Google Sign-In error: ${error}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use Firebase auth service for registration with email verification
      const result = await authService.register({ email, password });
      
      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }
      
      // Check if email verification is needed (Supabase sends verification email automatically)
      if (result.needsVerification) {
        // User created but needs email verification
        setPendingEmail(email);
        setShowVerificationPending(true);
        toast.success(result.message || 'Account created! Please check your email to verify your account before logging in.');
        setLoading(false);
        return;
      }
      
      // Auto-login after successful registration
      const loginResult = await authService.login({ email, password });
      if (!loginResult.success || !loginResult.token) {
        throw new Error('Registration successful but login failed');
      }
      
      const { token } = loginResult;
      const userId = (loginResult as any).userId || (loginResult as any).user?.id || 0;
      
      // Store token temporarily to fetch subscription status
      const originalToken = localStorage.getItem('medMasterToken');
      localStorage.setItem('medMasterToken', token);
      
      try {
        const subscriptionStatus = await subscriptionService.getSubscriptionStatus();
        
        // Restore original token
        if (originalToken) {
          localStorage.setItem('medMasterToken', originalToken);
        } else {
          localStorage.removeItem('medMasterToken');
        }
        
        // Generate username from email for compatibility
        const username = email.split('@')[0];
        
        // Use landing page auth context
        login(token, email, username, userId, subscriptionStatus.subscription_type);
        
        // Call onAuthSuccess callback if provided (for cross-origin scenarios)
        onAuthSuccess?.(token, email, username, subscriptionStatus.subscription_type, userId.toString());
        
        toast.success('Welcome to MedMaster! Your account has been created and verified.');
        onSuccess?.();
      } catch (subscriptionError) {
        console.warn('Could not fetch subscription status:', subscriptionError);
        // Generate username from email for compatibility
        const username = email.split('@')[0];
        
        login(token, email, username, userId, 'demo');
        
        // Call onAuthSuccess callback if provided (for cross-origin scenarios)
        onAuthSuccess?.(token, email, username, 'demo', userId.toString());
        
        toast.success('Welcome to MedMaster! Account created successfully.');
        onSuccess?.();
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      
      let errorMessage = 'An error occurred during signup.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  // Show verification pending screen if needed
  if (showVerificationPending) {
    return (
      <EmailVerificationPending
        email={pendingEmail}
        onBackToLogin={() => {
          setShowVerificationPending(false);
          onSwitchToLogin?.();
        }}
        onResendSuccess={() => {
          toast.success('Verification email sent! Please check your inbox.');
        }}
      />
    );
  }

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Landing Button */}
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Landing Page
          </button>
        )}

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <BugIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Join <span className="text-blue-400">Med</span>Master
            </h1>
            <p className="text-gray-300">
              Create your landing page account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="landing-signup-email">
                Email
              </label>
              <input
                id="landing-signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="landing-signup-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="landing-signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800/50 text-gray-400">or</span>
              </div>
            </div>
          </div>

          {/* Google Sign-In */}
          <div className="mb-6">
            <GoogleSignIn
              onSuccess={handleGoogleSignIn}
              onError={handleGoogleError}
              disabled={loading}
              text="Sign up with Google"
            />
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default LandingSignupPage;