import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandingAuth } from '../contexts/LandingAuthContext';
import { supabaseHelpers } from '../config/supabase';
import BrainIcon from './icons/BrainIcon';
import FireIcon from './icons/FireIcon';
import CrownIcon from './icons/CrownIcon';

interface PricingPageProps {
  onShowLandingLogin?: () => void;
  onBackToLanding?: () => void;
}

function PricingPage({ onShowLandingLogin, onBackToLanding }: PricingPageProps) {
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const { user, isAuthenticated, refreshSubscriptionStatus } = useLandingAuth();
  const navigate = useNavigate();

  // Refresh subscription status when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      refreshSubscriptionStatus();
    }
  }, [isAuthenticated, refreshSubscriptionStatus]);

  // Helper functions
  const isActivePlan = (planType: 'demo' | 'starter' | 'popular') => {
    if (!user) return false;
    if (planType === 'demo') return user.subscriptionType === 'demo';
    if (planType === 'starter') return user.subscriptionType === 'starter';
    if (planType === 'popular') return user.subscriptionType === 'premium' || user.subscriptionType === 'popular';
    return false;
  };

  const getButtonText = (planType: 'demo' | 'starter' | 'popular') => {
    if (!isAuthenticated) {
      if (planType === 'demo') return 'Try Demo - FREE';
      if (planType === 'starter') return 'Start Learning - ₨700';
      if (planType === 'popular') return 'Choose Premium - ₨1200';
    }

    if (isActivePlan(planType)) {
      if (planType === 'demo') return 'Current Plan';
      return 'Active Plan';
    }

    if (user?.subscriptionType === 'demo') {
      if (planType === 'starter') return 'Upgrade to Starter - ₨700';
      if (planType === 'popular') return 'Upgrade to Premium - ₨1200';
    }

    if (user?.subscriptionType === 'starter') {
      if (planType === 'popular') return 'Upgrade to Premium - ₨1200';
      if (planType === 'demo') return 'Downgrade to Demo';
    }

    if (user?.subscriptionType === 'premium' || user?.subscriptionType === 'popular') {
      if (planType === 'starter') return 'Downgrade to Starter';
      if (planType === 'demo') return 'Downgrade to Demo';
    }

    return 'Select Plan';
  };

  // Payment handling functions
  const handlePayment = async (planType: 'demo' | 'starter' | 'popular') => {
    console.log('🔄 handlePayment called with planType:', planType);
    console.log('🔐 isAuthenticated:', isAuthenticated);
    console.log('👤 user:', user);
    
    setPaymentLoading(planType);
    
    try {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        console.log('❌ User not authenticated, showing login');
        if (onShowLandingLogin) {
          onShowLandingLogin();
        } else {
          console.log('⚠️ onShowLandingLogin not provided');
        }
        return;
      }

      const token = localStorage.getItem('medMasterToken') || localStorage.getItem('authToken');
      console.log('🔑 Token check:', token ? 'Found' : 'Not found');
      if (!token) {
        console.log('❌ No token found, redirecting to login');
        if (onShowLandingLogin) {
          onShowLandingLogin();
        } else {
          console.log('⚠️ onShowLandingLogin not provided');
        }
        return;
      }

      // If clicking on current active plan, show unsubscribe option
      if (isActivePlan(planType) && planType !== 'demo') {
        const confirmUnsubscribe = window.confirm('Do you want to unsubscribe from your current plan?');
        if (confirmUnsubscribe) {
          if (!user?.id) {
            throw new Error('User not found');
          }
          const result = await supabaseHelpers.cancelUserSubscription(user.id);
          
          if (result.success) {
            await refreshSubscriptionStatus();
            alert('Unsubscribed successfully! You now have demo access.');
          } else {
            throw new Error(result.error || 'Failed to unsubscribe');
          }
        }
        return;
      }

      // Handle plan changes
      if (user) {
        const currentPlan = user.subscriptionType;
        const planIdMap = { starter: 1, popular: 2, premium: 2 };
        
        console.log('💳 Processing plan change:', {
          planType,
          currentPlan,
          user: user.username
        });
        
        if (planType === 'demo' && currentPlan !== 'demo') {
          const confirmDowngrade = window.confirm('Are you sure you want to downgrade to Demo? You will lose access to premium features.');
          if (confirmDowngrade) {
            if (!user?.id) {
              throw new Error('User not found');
            }
            const result = await supabaseHelpers.cancelUserSubscription(user.id);
            
            if (result.success) {
              await refreshSubscriptionStatus();
              alert('Successfully downgraded to Demo plan!');
            } else {
              throw new Error(result.error || 'Failed to downgrade');
            }
          }
        } else if (planType === 'starter' && (currentPlan === 'premium' || currentPlan === 'popular')) {
          const confirmDowngrade = window.confirm('Are you sure you want to downgrade to Starter? You will lose some premium features.');
          if (confirmDowngrade) {
            if (!user?.id) {
              throw new Error('User not found');
            }
            const result = await supabaseHelpers.updateUserSubscriptionByUserId(user.id, {
              plan_id: planIdMap.starter,
              subscription_type: 'starter'
            });
            
            if (result.success) {
              await refreshSubscriptionStatus();
              alert('Successfully downgraded to Starter plan!');
            } else {
              throw new Error(result.error || 'Failed to downgrade');
            }
          }
        } else if (planType === 'popular' && currentPlan !== 'premium' && currentPlan !== 'popular') {
          if (currentPlan === 'demo') {
            // Navigate to payment for new subscription
            console.log('🚀 Navigating to payment page for premium plan');
            console.log('📍 Current location before navigation:', window.location.href);
            navigate('/payment?plan=premium');
            console.log('✅ Navigation command executed');
          } else {
            // Upgrade from starter to premium
            if (!user?.id) {
              throw new Error('User not found');
            }
            const result = await supabaseHelpers.updateUserSubscriptionByUserId(user.id, {
              plan_id: planIdMap.popular,
              subscription_type: 'premium'
            });
            
            if (result.success) {
              await refreshSubscriptionStatus();
              alert('Successfully upgraded to Premium plan!');
            } else {
              throw new Error(result.error || 'Failed to upgrade');
            }
          }
        } else if (planType === 'starter' && currentPlan === 'demo') {
          // Navigate to payment for new subscription
          console.log('🚀 Navigating to payment page for starter plan');
          console.log('📍 Current location before navigation:', window.location.href);
          navigate('/payment?plan=starter');
          console.log('✅ Navigation command executed');
        }
      }
    } catch (error) {
      console.error('❌ Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      const errorName = error instanceof Error ? error.name : 'Error';
      
      console.error('Error details:', {
        message: errorMessage,
        stack: errorStack,
        name: errorName
      });
      // For authentication errors, redirect to login instead of showing alert
      if (errorMessage && (errorMessage.includes('token') || errorMessage.includes('auth') || errorMessage.includes('login'))) {
        console.log('🔐 Authentication error, redirecting to login');
        if (onShowLandingLogin) {
          onShowLandingLogin();
        }
      } else {
        alert(`Operation failed: ${errorMessage || 'Please try again.'}`);
      }
    } finally {
      console.log('🏁 Payment process finished, clearing loading state');
      setPaymentLoading(null);
    }
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
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Demo Plan */}
            <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col relative ${
              isActivePlan('demo') 
                ? 'border-green-400 border-2 shadow-green-400/20 shadow-2xl' 
                : 'border-gray-700 hover:border-green-500'
            }`}>
              {isActivePlan('demo') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
                    ✓ Active Plan
                  </div>
                </div>
              )}
              <div className="text-center flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-2xl font-bold">🎯</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Demo Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-green-400">FREE</span>
                  <span className="text-gray-400 ml-2">/limited access</span>
                </div>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-200">Limited Content Access</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-200">Basic Analytics</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-200">50 Practice Questions</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-200">5 Case Studies</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-xs">⏰</span>
                    </div>
                    <span className="text-white font-semibold">7 days trial</span>
                  </li>
                </ul>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Demo button clicked');
                    handlePayment('demo');
                  }}
                  disabled={paymentLoading === 'demo' || (isActivePlan('demo') && user?.subscriptionType === 'demo')}
                  className={`mt-auto w-full font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl relative z-10 ${
                    isActivePlan('demo') 
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white cursor-pointer'
                  }`}
                  style={{ pointerEvents: 'auto' }}
                >
                  {paymentLoading === 'demo' ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      {isActivePlan('demo') && <span className="mr-2">✓</span>}
                      {getButtonText('demo')}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3 Months Plan */}
            <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col relative ${
              isActivePlan('starter') 
                ? 'border-blue-400 border-2 shadow-blue-400/20 shadow-2xl' 
                : 'border-gray-700 hover:border-blue-500'
            }`}>
              {isActivePlan('starter') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
                    ✓ Active Plan
                  </div>
                </div>
              )}
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Starter button clicked');
                    handlePayment('starter');
                  }}
                  disabled={paymentLoading === 'starter'}
                  className={`mt-auto w-full font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl relative z-10 ${
                    isActivePlan('starter') 
                      ? 'bg-blue-700 text-blue-100 border-2 border-blue-400' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white cursor-pointer'
                  }`}
                  style={{ pointerEvents: 'auto' }}
                >
                  {paymentLoading === 'starter' ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      {isActivePlan('starter') && <span className="mr-2">✓</span>}
                      {getButtonText('starter')}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 6 Months Plan - POPULAR */}
            <div className={`bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-8 border-2 transform scale-105 relative shadow-2xl flex flex-col ${
              isActivePlan('popular') 
                ? 'border-orange-300 shadow-orange-400/30' 
                : 'border-orange-400'
            }`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                {isActivePlan('popular') ? (
                  <div className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                    ✓ ACTIVE PLAN
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                    <FireIcon className="w-4 h-4 mr-1" />
                    MOST POPULAR
                  </div>
                )}
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Premium button clicked');
                    handlePayment('popular');
                  }}
                  disabled={paymentLoading === 'popular'}
                  className={`mt-auto w-full font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl relative z-10 ${
                    isActivePlan('popular') 
                      ? 'bg-orange-600 text-orange-100 border-2 border-orange-400' 
                      : 'bg-white text-orange-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                  }`}
                  style={{ pointerEvents: 'auto' }}
                >
                  {paymentLoading === 'popular' ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      {isActivePlan('popular') && <span className="mr-2">✓</span>}
                      {getButtonText('popular')}
                    </>
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