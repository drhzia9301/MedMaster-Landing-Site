import React, { useState, useEffect } from 'react';
import { signInWithGoogle, handleRedirectResult } from '../config/firebase';
import PopupBlockerNotice from './PopupBlockerNotice';

interface GoogleSignInProps {
  onSuccess: (userData: any) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  text?: string;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  onSuccess,
  onError,
  disabled = false,
  text = 'Continue with Google'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPopupNotice, setShowPopupNotice] = useState(false);

  // Check for redirect result on component mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        console.log('🔍 GoogleSignIn: Checking for redirect result on component mount...');
        const result = await handleRedirectResult();
        if (result && result.idToken && result.user) {
          console.log('✅ GoogleSignIn: Redirect result found:', {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            hasIdToken: !!result.idToken,
            idTokenLength: result.idToken?.length
          });
          const userData = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            idToken: result.idToken
          };
          console.log('🚀 GoogleSignIn: Calling onSuccess with userData:', userData);
          onSuccess(userData);
        } else {
          console.log('ℹ️ GoogleSignIn: No redirect result found on mount');
        }
      } catch (error: any) {
        console.error('❌ GoogleSignIn: Error handling redirect result:', error);
        // Don't call onError here to prevent infinite loops
        // onError?.('Authentication failed after redirect. Please try again.');
      }
    };

    // Add a small delay to prevent rapid successive calls
    const timeoutId = setTimeout(checkRedirectResult, 100);
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array - only run once on mount

  const handleGoogleSignIn = async () => {
    if (disabled || isLoading) return;
    
    console.log('🔄 GoogleSignIn: Starting Google Sign-In process...');
    setIsLoading(true);
    
    try {
      console.log('📞 GoogleSignIn: Calling signInWithGoogle()...');
      const result = await signInWithGoogle();
      console.log('📥 GoogleSignIn: signInWithGoogle() result:', {
        pending: result.pending,
        hasUser: !!result.user,
        hasIdToken: !!result.idToken,
        userEmail: result.user?.email,
        idTokenLength: result.idToken?.length
      });
      
      // Check if it's a pending redirect
      if (result.pending) {
        console.log('🔄 GoogleSignIn: Redirecting to Google Sign-In...');
        setShowPopupNotice(true);
        setIsLoading(false);
        return;
      }
      
      // Pass the complete user data to the parent component
      if (result.idToken && result.user) {
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          idToken: result.idToken
        };
        console.log('✅ GoogleSignIn: Authentication successful, calling onSuccess with:', userData);
        
        try {
          onSuccess(userData);
          console.log('✅ GoogleSignIn: onSuccess callback completed successfully');
        } catch (callbackError) {
          console.error('❌ GoogleSignIn: Error in onSuccess callback:', callbackError);
          const errorMessage = callbackError instanceof Error ? callbackError.message : 'Unknown error occurred';
          onError?.(`Authentication callback failed: ${errorMessage}`);
        }
      } else {
        console.error('❌ GoogleSignIn: Missing required data - idToken or user:', {
          hasIdToken: !!result.idToken,
          hasUser: !!result.user,
          resultKeys: Object.keys(result || {})
        });
        onError?.('Failed to get authentication token');
      }
    } catch (error: any) {
      console.error('❌ GoogleSignIn: Google Sign-In error:', error);
      
      let errorMessage = 'Failed to sign in with Google';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.code === 'auth/popup-blocked') {
        console.log('Popup blocked, showing notice...');
        setShowPopupNotice(true);
        setIsLoading(false);
        return;
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google Sign-In. Please check your Firebase configuration.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google Sign-In is not enabled. Please check your Firebase project settings.';
      } else if (error.message === 'Firebase not configured') {
        errorMessage = 'Google Sign-In is not configured. Please check your Firebase settings.';
      }
      
      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  const handleRetryWithRedirect = async () => {
    setShowPopupNotice(false);
    setIsLoading(true);
    try {
      // Force redirect method by calling signInWithGoogle again
      // The popup should fail and automatically trigger redirect
      const result = await signInWithGoogle();
      if (result.pending) {
        console.log('🔄 GoogleSignIn: Redirecting to Google Sign-In...');
        // Don't set loading to false here, let the redirect happen
        return;
      }
      // If we get here, popup worked
      setIsLoading(false);
    } catch (error: any) {
      console.error('❌ GoogleSignIn: Retry with redirect failed:', error);
      onError?.('Sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDismissNotice = () => {
    setShowPopupNotice(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={disabled || isLoading}
        className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {isLoading ? 'Signing in...' : text}
      </button>
      
      {showPopupNotice && (
        <PopupBlockerNotice
          onRetryWithRedirect={handleRetryWithRedirect}
          onDismiss={handleDismissNotice}
        />
      )}
    </>
  );
};

export default GoogleSignIn;