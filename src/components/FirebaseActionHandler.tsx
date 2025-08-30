import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { applyActionCode, getAuth } from 'firebase/auth';
import { authService } from '../services/authService';

interface FirebaseActionHandlerProps {
  onBackToLanding?: () => void;
}

const FirebaseActionHandler: React.FC<FirebaseActionHandlerProps> = ({ onBackToLanding }) => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    const continueUrl = searchParams.get('continueUrl');

    if (!mode || !oobCode) {
      setError('Invalid verification link');
      setIsLoading(false);
      return;
    }

    handleFirebaseAction(mode, continueUrl);
  }, [searchParams]);

  const handleFirebaseAction = async (mode: string, continueUrl?: string | null) => {
    const oobCode = searchParams.get('oobCode');
    const auth = getAuth();

    try {
      switch (mode) {
        case 'verifyEmail':
          if (oobCode) {
            await applyActionCode(auth, oobCode);
            setMessage('Email verified successfully! Setting up your account...');

            // Now sync the verified user with the backend database
            const currentUser = auth.currentUser;
            if (currentUser && currentUser.emailVerified) {
              try {
                console.log('🔄 Syncing verified user with backend database...');
                const syncResult = await authService.syncVerifiedUser(currentUser);

                if (syncResult.success) {
                  console.log('✅ User successfully added to database after verification');
                  setMessage('Email verified and account set up successfully! Redirecting to login...');
                } else {
                  console.warn('⚠️ Email verified but backend sync failed:', syncResult.error);
                  setMessage('Email verified successfully! You can now log in.');
                }
              } catch (syncError) {
                console.error('❌ Error syncing verified user:', syncError);
                setMessage('Email verified successfully! You can now log in.');
              }
            }

            // Auto-redirect to login page after 3 seconds
            setTimeout(() => {
              // Always redirect to the login page, not the continueUrl
              window.location.href = 'https://medmaster.site/login';
            }, 3000);
          } else {
            setError('Invalid verification code');
          }
          break;
        case 'resetPassword':
          setError('Password reset is not implemented yet.');
          break;
        case 'recoverEmail':
          setError('Email recovery is not implemented yet.');
          break;
        default:
          setError('Unknown action mode');
      }
    } catch (error: any) {
      console.error('Firebase action error:', error);
      if (error.code === 'auth/invalid-action-code') {
        setError('This verification link has expired or has already been used.');
      } else if (error.code === 'auth/user-disabled') {
        setError('This user account has been disabled.');
      } else {
        setError('An error occurred while verifying your email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
        {message ? (
          <>
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Success!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
            </div>
          </>
        ) : (
          <>
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">✕</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
               onClick={() => onBackToLanding ? onBackToLanding() : window.location.href = 'https://medmaster.site'}
               className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
             >
               Go to Home
             </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FirebaseActionHandler;