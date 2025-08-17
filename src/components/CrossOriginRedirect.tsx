import React, { useEffect, useState } from 'react';
import { crossOriginAuth } from '../utils/crossOriginAuth';
import { useLandingAuth } from '../contexts/LandingAuthContext';

interface CrossOriginRedirectProps {
  redirectPath?: string;
  onRedirect?: () => void;
  showMessage?: boolean;
}

const CrossOriginRedirect: React.FC<CrossOriginRedirectProps> = ({
  redirectPath = '/',
  onRedirect,
  showMessage = true
}) => {
  const { user, isAuthenticated } = useLandingAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsRedirecting(true);
      
      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            handleRedirect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [isAuthenticated, user]);

  const handleRedirect = () => {
    if (!user) return;

    const authData = crossOriginAuth.getAuthData();
    if (authData) {
      // Call onRedirect callback if provided
      onRedirect?.();
      
      // Handle redirect to main app
      crossOriginAuth.handleAuthSuccess(authData, redirectPath);
    }
  };

  const handleRedirectNow = () => {
    setCountdown(0);
    handleRedirect();
  };

  if (!isAuthenticated || !user || !isRedirecting) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Successful!</h2>
          <p className="text-gray-600">
            Welcome, {user.username}! You will be redirected to the main application.
          </p>
        </div>

        {showMessage && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Subscription:</strong> {user.subscriptionType}
              </p>
            </div>
            
            <p className="text-sm text-gray-500">
              Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRedirectNow}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to App Now
          </button>
          
          <button
            onClick={() => setIsRedirecting(false)}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Stay on Landing
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrossOriginRedirect;