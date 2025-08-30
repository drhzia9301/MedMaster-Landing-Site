import React, { useState, useEffect } from 'react';
import BugIcon from './icons/BugIcon';
import { authService } from '../services/authService';
import { subscriptionService } from '../services/subscriptionService';
import { toast } from 'sonner';
import GoogleSignIn from './GoogleSignIn';
import { handleRedirectResult } from '../config/firebase';

interface AuthPageProps {
  onAuthSuccess: (token: string, email: string, username: string, subscriptionType?: string, userId?: string) => void;
  onBackToLanding?: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onBackToLanding, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

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

  const handleGoogleSignIn = async (firebaseData: any) => {
    setError(null);
    setLoading(true);

    try {
      console.log('🔄 AuthPage: Processing Google Sign-In with Firebase data:', {
        uid: firebaseData?.uid,
        email: firebaseData?.email,
        displayName: firebaseData?.displayName,
        hasIdToken: !!firebaseData?.idToken
      });
      
      // Use authService.registerFirebase to sync with backend
      const result = await authService.registerFirebase(firebaseData);
      
      console.log('📥 AuthPage: registerFirebase result:', {
        success: result.success,
        hasUser: !!result.user,
        hasToken: !!result.token,
        error: result.error,
        userId: result.userId
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Google authentication failed - backend returned unsuccessful response');
      }
      
      if (!result.user) {
        throw new Error('Google authentication failed - no user data received from backend');
      }
      
      if (!result.token) {
        throw new Error('Google authentication failed - no authentication token received from backend');
      }

      console.log('✅ AuthPage: Google authentication successful:', {
        userId: result.user.id,
        email: result.user.email,
        username: result.user.username
      });

      // Store token
      localStorage.setItem('medMasterToken', result.token);
      localStorage.setItem('authToken', result.token); // For consistency with main app
      
      // Fetch subscription status after successful authentication
      try {
        const subscriptionStatus = await subscriptionService.getSubscriptionStatus();
        onAuthSuccess(result.token, result.user.email, result.user.username, subscriptionStatus.subscription_type, result.user.id.toString());
        toast.success(`Welcome ${result.user.username}! Logged in with Google successfully.`);
      } catch (subscriptionError) {
        console.warn('Could not fetch subscription status:', subscriptionError);
        // Continue with login even if subscription fetch fails
        onAuthSuccess(result.token, result.user.email, result.user.username, 'demo', result.user.id.toString());
        toast.success('Welcome! Logged in with Google successfully.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during Google sign-in';
      console.error('❌ AuthPage: Google Sign-In error:', errorMessage);
      
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

    try {
      let authResult: any;
      
      if (isLogin) {
        authResult = await authService.login({ email, password });
      } else {
        authResult = await authService.register({ email, password });
      }
      
      if (!authResult.success || !authResult.user || !authResult.token) {
        throw new Error(authResult.error || 'Authentication failed');
      }

      // Store token temporarily to fetch subscription status
      localStorage.setItem('medMasterToken', authResult.token);
      
      // Fetch subscription status after successful authentication
      try {
        const subscriptionStatus = await subscriptionService.getSubscriptionStatus();
        onAuthSuccess(authResult.token, authResult.user.email, authResult.user.username, subscriptionStatus.subscription_type, authResult.user.id.toString());
        
        // Show welcome message
        toast.success(`Welcome ${authResult.user.username}! ${isLogin ? 'Logged in' : 'Account created'} successfully.`);
      } catch (subscriptionError) {
          console.warn('Could not fetch subscription status:', subscriptionError);
          // Continue with login even if subscription fetch fails
          onAuthSuccess(authResult.token, authResult.user.email, authResult.user.username, 'demo', authResult.user.id.toString());
          toast.success('Welcome! Logged in successfully.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
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