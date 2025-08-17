import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { subscriptionService } from '../services/subscriptionService';
import { toast } from 'sonner';
import { useLandingAuth } from '../contexts/LandingAuthContext';
import { signUpWithEmailAndPassword, handleRedirectResult } from '../config/firebase';

import BugIcon from './icons/BugIcon';
import GoogleSignIn from './GoogleSignIn';
import EmailVerificationPending from './EmailVerificationPending';
import { ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LandingSignupPageProps {
  onSuccess?: () => void;
  onBackToLanding?: () => void;
  onSwitchToLogin?: () => void;
  onAuthSuccess?: (token: string, email: string, username: string, subscriptionType?: string) => void;
}

const LandingSignupPage: React.FC<LandingSignupPageProps> = ({ 
  onSuccess, 
  onBackToLanding, 
  onSwitchToLogin,
  onAuthSuccess
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showVerificationPending, setShowVerificationPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  // Removed PasswordSetupModal - Google users complete auth immediately
  const { login } = useLandingAuth();

  // Handle Google Sign-In redirect result on page load
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await handleRedirectResult();
        if (result && result.idToken) {
          console.log('Processing Google Sign-In redirect result:', result);
          await handleGoogleSignIn(result.idToken);
        }
      } catch (error: any) {
        console.error('Error handling Google Sign-In redirect:', error);
        setError('Authentication failed after redirect. Please try again.');
      }
    };

    checkRedirectResult();
  }, []);

  const handleGoogleSignIn = async (credential: string) => {
    setError(null);
    setLoading(true);

    try {
      // Send the Google credential to your backend
      const response = await axios.post(API_ENDPOINTS.auth.google, { credential });
      const { token, email, username, isNewUser } = response.data;

      // Store token in landing auth context immediately
      localStorage.setItem('landingPageToken', token);
      
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
        
        // Complete login immediately for both new and existing users
        login(token, email, username, subscriptionStatus.subscription_type);
        
        if (onAuthSuccess) {
          onAuthSuccess(token, email, username, subscriptionStatus.subscription_type);
        }
        
        if (isNewUser) {
          if (subscriptionStatus.subscription_type === 'demo') {
            toast.success('Welcome to MedMaster! Your Google account has been connected. You have demo access to Gram Positive content.');
          } else {
            toast.success(`Welcome to MedMaster! Your Google account has been connected. You have ${subscriptionStatus.subscription_type} access.`);
          }
        } else {
          toast.success('Successfully signed in with Google!');
        }
        
        onSuccess?.();
      } catch (subscriptionError) {
        console.warn('Could not fetch subscription status:', subscriptionError);
        
        // Complete login immediately for both new and existing users
        login(token, email, username, 'demo');
        
        if (onAuthSuccess) {
          onAuthSuccess(token, email, username, 'demo');
        }
        
        if (isNewUser) {
          toast.success('Welcome to MedMaster! Your Google account has been connected. You have demo access to Gram Positive content.');
        } else {
          toast.success('Successfully signed in with Google!');
        }
        
        onSuccess?.();
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Google sign-in failed.');
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
      // Use Firebase for email/password authentication with verification
      const firebaseResult = await signUpWithEmailAndPassword(email, password, username);
      
      if (firebaseResult.needsVerification) {
        // Show verification pending screen
        setPendingEmail(email);
        setShowVerificationPending(true);
        toast.success('Account created! Please check your email to verify your account.');
        setLoading(false);
        return;
      }
      
      // If email is already verified (shouldn't happen for new signups), continue with backend registration
      const response = await axios.post(API_ENDPOINTS.auth.registerFirebase, {
        credential: firebaseResult.idToken,
        email: firebaseResult.user.email,
        username: username
      });
      
      const { token } = response.data;
      
      if (response.data.needsVerification) {
        setPendingEmail(email);
        setShowVerificationPending(true);
        toast.success('Account created! Please check your email to verify your account.');
        return;
      }
      
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
        
        // Use landing page auth context
        login(token, email, username, subscriptionStatus.subscription_type);
        
        // Call onAuthSuccess callback if provided (for cross-origin scenarios)
        onAuthSuccess?.(token, email, username, subscriptionStatus.subscription_type);
        
        toast.success('Welcome to MedMaster! Your account has been created and verified.');
        onSuccess?.();
      } catch (subscriptionError) {
        console.warn('Could not fetch subscription status:', subscriptionError);
        login(token, email, username, 'demo');
        
        // Call onAuthSuccess callback if provided (for cross-origin scenarios)
        onAuthSuccess?.(token, email, username, 'demo');
        
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
      } else if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data.message || 'An error occurred.';
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
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="landing-signup-username">
                Username
              </label>
              <input
                id="landing-signup-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="Choose a username"
              />
            </div>
            
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
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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