import React, { useState, useRef, useEffect } from 'react';
import { useLandingAuth } from '../contexts/LandingAuthContext';
import { User, LogOut, Crown, Shield, Zap } from 'lucide-react';

interface LandingProfileButtonProps {
  onGoToApp?: () => void;
}

const LandingProfileButton: React.FC<LandingProfileButtonProps> = ({ onGoToApp }) => {
  const { user, logout, refreshSubscriptionStatus } = useLandingAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Refresh subscription status when component mounts
  useEffect(() => {
    refreshSubscriptionStatus();
  }, [refreshSubscriptionStatus]);

  if (!user) return null;

  const getSubscriptionIcon = () => {
    switch (user.subscriptionType) {
      case 'premium':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'starter':
        return <Shield className="w-4 h-4 text-blue-400" />;
      default:
        return <Zap className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSubscriptionLabel = () => {
    switch (user.subscriptionType) {
      case 'premium':
        return 'Premium Plan';
      case 'starter':
        return 'Starter Plan';
      default:
        return 'Demo Account';
    }
  };

  const getSubscriptionColor = () => {
    switch (user.subscriptionType) {
      case 'premium':
        return 'text-yellow-400';
      case 'starter':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 transition-all duration-300 hover:scale-105"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-white font-medium text-sm">{user.username}</div>
          <div className={`text-xs ${getSubscriptionColor()} flex items-center gap-1`}>
            {getSubscriptionIcon()}
            {getSubscriptionLabel()}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">{user.username}</div>
                <div className="text-blue-100 text-sm">{user.email}</div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="p-4 space-y-4">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-gray-300 text-sm mb-1">Current Plan</div>
              <div className={`font-medium flex items-center gap-2 ${getSubscriptionColor()}`}>
                {getSubscriptionIcon()}
                {getSubscriptionLabel()}
              </div>
            </div>


            {/* Action Buttons */}
            <div className="space-y-2">
              {onGoToApp && (
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onGoToApp();
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Go to App
                </button>
              )}
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingProfileButton;