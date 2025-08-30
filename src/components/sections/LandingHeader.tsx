import React from 'react';
import { useLandingAuth } from '../../contexts/LandingAuthContext';
import LandingProfileButton from '../LandingProfileButton';

interface LandingHeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onNavigateToDocumentation?: () => void;
  onNavigateToPricing?: () => void;
  onShowLandingLogin: () => void;
  onShowLandingSignup: () => void;
  onGoToApp: () => void;
  scrollToSection: (elementId: string) => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  onNavigateToDocumentation,
  onNavigateToPricing,
  onShowLandingLogin,
  onShowLandingSignup,
  onGoToApp,
  scrollToSection
}) => {
  const { isAuthenticated } = useLandingAuth();

  return (
    <>
      <style>{`
        .section-highlight {
          animation: highlight 1.5s ease-in-out;
        }
        @keyframes highlight {
          0%, 100% { box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out;
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 1s ease-out;
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-bounce-gentle {
          animation: bounceGentle 2s infinite;
        }
        @keyframes bounceGentle {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        .animate-pulse-glow {
          animation: pulseGlow 2s infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Med<span className="text-blue-400">Master</span>
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('hero')} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">Home</button>
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">Features</button>
              <button onClick={() => scrollToSection('preview')} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">Preview</button>
              <button onClick={onNavigateToDocumentation} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">Documentation</button>
              <button onClick={onNavigateToPricing} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">Pricing</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">Contact</button>
            </nav>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <LandingProfileButton onGoToApp={onGoToApp} />
              ) : (
                <>
                  <button
                    onClick={onShowLandingLogin}
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 hidden md:block"
                  >
                    Login
                  </button>
                  <button
                    onClick={onShowLandingSignup}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hidden md:block"
                  >
                    Sign Up
                  </button>
                </>
              )}
              {/* Mobile menu button */}
              <button 
                className="md:hidden text-gray-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900/98 backdrop-blur-sm border-t border-gray-800 animate-fadeIn">
            <div className="px-4 py-4 space-y-4">
              <button 
                className="block w-full text-left text-gray-300 hover:text-white transition-colors" 
                onClick={() => {
                  scrollToSection('hero');
                  setMobileMenuOpen(false);
                }}
              >
                Home
              </button>
              <button 
                className="block w-full text-left text-gray-300 hover:text-white transition-colors" 
                onClick={() => {
                  scrollToSection('features');
                  setMobileMenuOpen(false);
                }}
              >
                Features
              </button>
              <button 
                className="block w-full text-left text-gray-300 hover:text-white transition-colors" 
                onClick={() => {
                  scrollToSection('preview');
                  setMobileMenuOpen(false);
                }}
              >
                Preview
              </button>
              <button
                className="block w-full text-left text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  onNavigateToDocumentation?.();
                  setMobileMenuOpen(false);
                }}
              >
                Documentation
              </button>
              <button
                className="block w-full text-left text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  onNavigateToPricing?.();
                  setMobileMenuOpen(false);
                }}
              >
                Pricing
              </button>
              <button
                className="block w-full text-left text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  scrollToSection('contact');
                  setMobileMenuOpen(false);
                }}
              >
                Contact
              </button>
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-800 space-y-2">
                  <button
                    onClick={() => {
                      onShowLandingLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onShowLandingSignup();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default LandingHeader;
