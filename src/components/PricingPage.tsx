import { useState } from 'react';
import BrainIcon from './icons/BrainIcon';
import FireIcon from './icons/FireIcon';
import CrownIcon from './icons/CrownIcon';

interface PricingPageProps {
  onShowLandingLogin?: () => void;
  onBackToLanding?: () => void;
}

function PricingPage({ onShowLandingLogin, onBackToLanding }: PricingPageProps) {
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  // Payment handling functions
  const handlePayment = async (planType: 'starter' | 'popular') => {
    setPaymentLoading(planType);
    // For the landing page, redirect to login or show a message
    if (onShowLandingLogin) {
      onShowLandingLogin();
    } else {
      alert('Please sign up or log in to purchase a plan.');
    }
    setPaymentLoading(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBackToLanding || (() => window.history.back())}
                className="text-gray-300 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-xl font-bold text-white">Pricing Plans</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">
              Choose Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Learning Plan</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Unlock your medical education potential with our comprehensive study platform. 
              Join thousands of medical students who've transformed their learning experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 3 Months Plan */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col">
              <div className="text-center flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BrainIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Starter Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">₨700</span>
                  <span className="text-gray-400 ml-2">/3 months</span>
                </div>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-200">Full Content</span>
                  </li>

                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-200">Analytics</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <span className="text-white font-semibold">3 months</span>
                  </li>
                </ul>
                <button 
                  onClick={() => handlePayment('starter')}
                  disabled={paymentLoading === 'starter'}
                  className="mt-auto w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {paymentLoading === 'starter' ? (
                    <span>Processing...</span>
                  ) : (
                    'Start Learning - ₨700'
                  )}
                </button>
              </div>
            </div>

            {/* 6 Months Plan - POPULAR */}
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-400 transform scale-105 relative shadow-2xl flex flex-col">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                  <FireIcon className="w-4 h-4 mr-1" />
                  MOST POPULAR
                </div>
              </div>
              <div className="text-center flex flex-col h-full">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CrownIcon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Premium Plan</h3>
                <div className="mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-2xl text-orange-200 line-through mr-2">₨1500</span>
                    <span className="text-4xl font-bold text-white">₨1200</span>
                  </div>
                  <div className="text-sm text-yellow-300 mb-1 font-semibold">Save 20% • Best Value</div>
                  <span className="text-gray-300 text-sm">/6 months</span>
                </div>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-orange-500 text-xs">✓</span>
                    </div>
                    <span className="text-gray-200">Full Content</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-orange-500 text-xs">✓</span>
                    </div>
                    <span className="text-gray-200">Analytics</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-orange-500 text-xs">✓</span>
                    </div>
                    <span className="text-gray-200">Priority Access to New Content</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-orange-500 text-xs">✓</span>
                    </div>
                    <span className="text-gray-200 font-semibold">Custom questions</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-orange-500 text-xs">✓</span>
                    </div>
                    <span className="text-gray-200 font-semibold">Custom avatars</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-orange-500 text-xs font-bold">6</span>
                    </div>
                    <span className="text-white font-semibold">6 months</span>
                  </li>
                </ul>
                <button 
                  onClick={() => handlePayment('popular')}
                  disabled={paymentLoading === 'popular'}
                  className="mt-auto w-full bg-white text-orange-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {paymentLoading === 'popular' ? (
                    <span>Processing...</span>
                  ) : (
                    'Choose Premium - ₨1200'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PricingPage;