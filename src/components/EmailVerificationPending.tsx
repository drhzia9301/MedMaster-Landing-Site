import React, { useState } from 'react';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';

interface EmailVerificationPendingProps {
  email: string;
  onBackToLogin?: () => void;
  onResendSuccess?: () => void;
}

const EmailVerificationPending: React.FC<EmailVerificationPendingProps> = ({
  email,
  onBackToLogin,
  onResendSuccess
}) => {
  const [isResending, setIsResending] = useState(false);
  const [lastResendTime, setLastResendTime] = useState<number | null>(null);

  const handleResendEmail = async () => {
    // Throttle resend requests (60 seconds between requests)
    const now = Date.now();
    if (lastResendTime && now - lastResendTime < 60000) {
      const remainingTime = Math.ceil((60000 - (now - lastResendTime)) / 1000);
      toast.error(`Please wait ${remainingTime} seconds before resending.`);
      return;
    }

    setIsResending(true);
    
    try {
      const result = await authService.resendVerification();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to resend verification email');
      }
      
      setLastResendTime(now);
      toast.success(result.message || 'Verification email sent! Please check your inbox.');
      onResendSuccess?.();
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      toast.error(error.message || 'Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Login Button */}
        {onBackToLogin && (
          <button
            onClick={onBackToLogin}
            className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>
        )}

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Mail className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Check Your Email
            </h1>
            
            <p className="text-gray-300 mb-2">
              We've sent a verification link to:
            </p>
            
            <p className="text-blue-400 font-medium text-lg mb-6">
              {email}
            </p>
            
            <p className="text-gray-400 text-sm mb-8">
              Click the link in the email to verify your account. 
              You won't be able to sign in until your email is verified.
            </p>
          </div>

          <div className="space-y-4">
            {/* Resend Email Button */}
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isResending ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Didn't receive an email? Check your spam folder or try resending.
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onBackToLogin}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Already verified? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPending;