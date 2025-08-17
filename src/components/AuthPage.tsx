import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BugIcon from './icons/BugIcon';
import { API_ENDPOINTS } from '../config/api';
import { subscriptionService } from '../services/subscriptionService';
import { toast } from 'sonner';
import GoogleSignIn from './GoogleSignIn';
import { handleRedirectResult } from '../config/firebase';

interface AuthPageProps {
  onAuthSuccess: (token: string, email: string, username: string, subscriptionType?: string) => void;
  onBackToLanding?: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onBackToLanding, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle Google Sign-In redirect result on page load
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await handleRedirectResult();
        if (result && result.idToken) {
          console.log('Processing Google Sign-In redirect result for auth page:', result);
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
      const { token, email, username } = response.data;

      // Store token temporarily to fetch subscription status
      localStorage.setItem('medMasterToken', token);
      
      try {
        const subscriptionStatus = await subscriptionService.getSubscriptionStatus();
        
        onAuthSuccess(token, email, username, subscriptionStatus.subscription_type);
        
        // Show welcome message based on subscription type
        if (subscriptionStatus.subscription_type === 'demo') {
          toast.success('Welcome! You have demo access to Gram Positive content across all modes.');
        } else {
          toast.success(`Welcome back! You have ${subscriptionStatus.subscription_type} access.`);
        }
      } catch (subscriptionError) {
        console.warn('Could not fetch subscription status:', subscriptionError);
        // Continue with login even if subscription fetch fails
        onAuthSuccess(token, email, username, 'demo');
        toast.success('Welcome! Logged in successfully.');
      }
    } catch (err: any) {
      const errorMessage = axios.isAxiosError(err) && err.response
        ? err.response.data.message || 'Google sign-in failed'
        : 'An error occurred during Google sign-in';
      
      setError(errorMessage);
      toast.error(errorMessage);
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

    const url = isLogin ? API_ENDPOINTS.auth.login : API_ENDPOINTS.auth.register;
    const payload = isLogin ? { username, password } : { username, email, password };

    try {
      let authToken: string;
      let userEmail: string;
      let userName: string;

      if (isLogin) {
        const response = await axios.post(url, payload);
        authToken = response.data.token;
        userEmail = response.data.email;
        userName = response.data.username;
      } else {
        await axios.post(url, payload);
        // Automatically log in after successful registration
        const loginResponse = await axios.post(API_ENDPOINTS.auth.login, { username, password });
        authToken = loginResponse.data.token;
        userEmail = email;
        userName = username;
      }

      // Store token temporarily to fetch subscription status
      localStorage.setItem('medMasterToken', authToken);
      
      // Fetch subscription status after successful authentication
      try {
        const subscriptionStatus = await subscriptionService.getSubscriptionStatus();
        onAuthSuccess(authToken, userEmail, userName, subscriptionStatus.subscription_type);
        
        // Show welcome message based on subscription type
        if (subscriptionStatus.subscription_type === 'demo') {
          toast.success('Welcome! You have demo access to Gram Positive content across all modes.');
        } else {
          toast.success(`Welcome back! You have ${subscriptionStatus.subscription_type} access.`);
        }
      } catch (subscriptionError) {
        console.warn('Could not fetch subscription status:', subscriptionError);
        // Continue with login even if subscription fetch fails
        onAuthSuccess(authToken, userEmail, userName, 'demo');
        toast.success('Welcome! Logged in successfully.');
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
            <BugIcon className="h-16 w-16 mx-auto mb-4 text-blue-500" />
            <h2 className="text-3xl font-extrabold text-white">
              Welcome to <span className="text-blue-500">Med</span>Master
            </h2>
            <p className="text-lg text-gray-300 mt-2">
              {isLogin ? 'Log in to continue your journey' : 'Create an account to start'}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {error && (
            <div className="text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait"
            >
              {loading ? 'Loading...' : (isLogin ? 'Log In' : 'Register')}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="mt-8 mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800 text-gray-400">or</span>
            </div>
          </div>
        </div>

        {/* Google Sign-In */}
        <div className="mb-6">
          <GoogleSignIn
            onSuccess={handleGoogleSignIn}
            onError={handleGoogleError}
            disabled={loading}
            text={isLogin ? 'Sign in with Google' : 'Sign up with Google'}
          />
        </div>

        <div className="mt-6 text-center space-y-3">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="block w-full text-sm font-medium text-gray-400 hover:text-blue-500"
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Log in'}
          </button>
          
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="block w-full text-sm font-medium text-gray-400 hover:text-blue-500 transition-colors"
            >
              ← Back to Landing Page
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;