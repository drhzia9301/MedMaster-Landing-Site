import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { subscriptionService } from '../services/subscriptionService';
import { toast } from 'sonner';

import BugIcon from './icons/BugIcon';
import GoogleSignIn from './GoogleSignIn';
import { handleRedirectResult } from '../config/firebase';
import { ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LandingLoginPageProps {
  onSuccess?: () => void;
  onBackToLanding?: () => void;
  onSwitchToSignup?: () => void;
  onAuthSuccess?: (token: string, email: string, username: string, subscriptionType?: string) => void;
}

const LandingLoginPage: React.FC<LandingLoginPageProps> = ({ 
  onSuccess, 
  onBackToLanding, 
  onSwitchToSignup,
  onAuthSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Add CSS to hide browser-native password reveal buttons
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

  // Handle Google Sign-In redirect result on page load
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        console.log('🚀 Login page loaded, checking for redirect result...');
        const result = await handleRedirectResult();
        if (result && result.idToken) {
          console.log('📧 Processing Google Sign-In redirect result:', result);
          console.log('🔄 Calling handleGoogleSignIn with token...');
          await handleGoogleSignIn(result.idToken);
        }
      } catch (error: any) {
        console.error('❌ Error handling Google Sign-In redirect:', error);
        setError('Authentication failed after redirect. Please try again.');
      }
    };

    checkRedirectResult();
  }, []);

  const handleGoogleSignIn = async (credential: string) => {
    setError(null);
    setLoading(true);

    try {
      console.log('🔐 Sending Google credential to backend...');
      // Send the Google credential to your backend
      const response = await axios.post(API_ENDPOINTS.auth.google, { credential });
      console.log('✅ Backend response:', response.data);
      const { token, email, username, isNewUser } = response.data;

      // Store authentication data in the format expected by LandingAuthContext
      localStorage.setItem('landingPageToken', token);
      localStorage.setItem('medMasterToken', token);
      localStorage.setItem('medMasterEmail', email);
      localStorage.setItem('medMasterUsername', username);
      
      try {
        const subscriptionStatus = await subscriptionService.getSubscriptionStatus();
        
        // Call onAuthSuccess callback if provided (for cross-origin scenarios)
        onAuthSuccess?.(token, email, username, subscriptionStatus.subscription_type);
        
        if (isNewUser) {
          toast.success('Welcome to MedMaster! Your Google account has been connected.');
        } else {
          toast.success('Successfully signed in with Google!');
        }
        
        onSuccess?.();
      } catch (subscriptionError) {
        console.warn('Could not fetch subscription status:', subscriptionError);
        
        // Call onAuthSuccess callback if provided (for cross-origin scenarios)
        onAuthSuccess?.(token, email, username, 'demo');
        
        if (isNewUser) {
          toast.success('Welcome to MedMaster! Your Google account has been connected.');
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
      const response = await axios.post(API_ENDPOINTS.auth.login, { username, password });
      const authToken = response.data.token;
      const userEmail = response.data.email;
      const userName = response.data.username;

      // Store token temporarily to fetch subscription status
      const originalToken = localStorage.getItem('medMasterToken');
      localStorage.setItem('medMasterToken', authToken);
      
      // Fetch subscription status after successful authentication
      try {
        const subscriptionStatus = await subscriptionService.getSubscriptionStatus();
        
        // Restore original token
        if (originalToken) {
          localStorage.setItem('medMasterToken', originalToken);
        } else {
          localStorage.removeItem('medMasterToken');
        }
        
        // Store authentication data in the format expected by LandingAuthContext
        localStorage.setItem('landingPageToken', authToken);
        localStorage.setItem('medMasterToken', authToken);
        localStorage.setItem('medMasterEmail', userEmail);
        localStorage.setItem('medMasterUsername', userName);
        
        // Call onAuthSuccess callback if provided (for cross-origin scenarios)
        onAuthSuccess?.(authToken, userEmail, userName, subscriptionStatus.subscription_type);
        
        // Show welcome message
        toast.success('Welcome! Logged in successfully.');
        
        onSuccess?.();
      } catch (subscriptionError) {
        console.warn('Could not fetch subscription status:', subscriptionError);
        // Continue with login even if subscription fetch fails
        localStorage.setItem('landingPageToken', authToken);
        localStorage.setItem('medMasterToken', authToken);
        localStorage.setItem('medMasterEmail', userEmail);
        localStorage.setItem('medMasterUsername', userName);
        
        // Call onAuthSuccess callback if provided (for cross-origin scenarios)
        onAuthSuccess?.(authToken, userEmail, userName, 'demo');
        
        toast.success('Welcome! Logged in successfully.');
        onSuccess?.();
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'An error occurred.');
      } else {
        setError('An unknown error occurred. Is the server running?');
      }
    } finally {
      setLoading(false);
    }
  };

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
                Welcome Back to <span className="text-blue-400">Med</span>Master
              </h1>
              <p className="text-gray-300">
                Sign in to access your landing page account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="landing-login-username">
                  Username
                </label>
                <input
                  id="landing-login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter your username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="landing-login-password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="landing-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none"
                    placeholder="Enter your password"
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
                    Sign In
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
                text="Sign in with Google"
              />
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={onSwitchToSignup}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingLoginPage;