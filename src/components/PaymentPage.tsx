import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLandingAuth } from '../contexts/LandingAuthContext';
import { toast } from 'sonner';
import { supabaseHelpers } from '../config/supabase';

interface PaymentPageProps {
  onBackToLanding: () => void;
}

interface Plan {
  id: number;
  name: string;
  price: number;
  currency: string;
  duration_months: number;
  features: string[];
}

const PaymentPage: React.FC<PaymentPageProps> = ({ onBackToLanding }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useLandingAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'paddle' | 'payfast'>('paddle');

  const planName = searchParams.get('plan');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue with payment');
      navigate('/pricing');
      return;
    }

    if (!planName) {
      toast.error('No plan selected');
      navigate('/pricing');
      return;
    }

    fetchPlanDetails();
  }, [isAuthenticated, planName, navigate]);

  const fetchPlanDetails = async () => {
    try {
      console.log('🔄 Fetching plan details for:', planName);
      
      // First try to fetch from Supabase
      try {
        const plansResult = await supabaseHelpers.getSubscriptionPlans();
        console.log('📊 Supabase data received:', plansResult);
        if (plansResult.data) {
          const selectedPlan = plansResult.data.find((p: Plan) => 
            p.name.toLowerCase().includes(planName?.toLowerCase() || '')
          );
        
          if (selectedPlan) {
            console.log('✅ Plan found from Supabase:', selectedPlan);
            setPlan(selectedPlan);
            return;
          }
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase fetch failed, using fallback data:', supabaseError);
      }
      
      // Fallback to hardcoded plan data
      console.log('🔄 Using fallback plan data');
      const fallbackPlans = {
        starter: {
          id: 1,
          name: 'Starter Plan',
          price: 700,
          currency: '₨',
          duration_months: 3,
          features: [
            'Full Content Access',
            'Analytics Dashboard',
            '3 months access',
            'Email Support'
          ]
        },
        premium: {
          id: 2,
          name: 'Premium Plan',
          price: 1200,
          currency: '₨',
          duration_months: 6,
          features: [
            'Full Content Access',
            'Advanced Analytics',
            'Priority Access to New Content',
            'Custom Questions',
            'Custom Avatars',
            '6 months access',
            'Priority Support'
          ]
        }
      };
      
      const planKey = planName?.toLowerCase() === 'premium' ? 'premium' : 'starter';
      const selectedPlan = fallbackPlans[planKey];
      
      if (selectedPlan) {
        console.log('✅ Using fallback plan:', selectedPlan);
        setPlan(selectedPlan);
      } else {
        throw new Error('Plan not found in fallback data');
      }
      
    } catch (error) {
      console.error('❌ Error fetching plan details:', error);
      toast.error('Failed to load plan details');
      navigate('/pricing');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!plan || !user) {
      toast.error('Missing plan or user information');
      return;
    }

    setPaymentLoading(true);
    
    try {
      // TODO: Implement createCheckoutSession in supabaseHelpers
      // For now, we'll simulate a failed checkout session creation
      const result = {
        success: false,
        error: 'Payment processing not yet implemented'
      };
      
      if (result.success) {
        // TODO: Redirect to payment provider when implemented
        // window.location.href = result.url;
      } else {
        throw new Error(result.error || 'Failed to create payment session');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment initiation failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading payment details...</div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Plan not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={onBackToLanding}
                className="text-blue-400 hover:text-blue-300 transition-colors mr-4"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold text-white">Complete Your Purchase</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Plan Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Plan:</span>
                <span className="text-white font-semibold">{plan.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Duration:</span>
                <span className="text-white">{plan.duration_months} months</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Price:</span>
                <span className="text-white font-bold text-xl">
                  {plan.currency} {plan.price}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-3">Included Features:</h3>
              <ul className="space-y-2">
                {plan.features?.map((feature, index) => (
                  <li key={index} className="text-gray-300 flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                )) || [
                  <li key="default" className="text-gray-300 flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Full access to MedMaster features
                  </li>
                ]}
              </ul>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
            
            <div className="space-y-4 mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paddle"
                  checked={paymentMethod === 'paddle'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'paddle')}
                  className="text-blue-500"
                />
                <div>
                  <div className="text-white font-medium">Credit/Debit Card</div>
                  <div className="text-gray-400 text-sm">Secure payment via Paddle</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="payfast"
                  checked={paymentMethod === 'payfast'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'payfast')}
                  className="text-blue-500"
                />
                <div>
                  <div className="text-white font-medium">PayFast (PKR)</div>
                  <div className="text-gray-400 text-sm">For Pakistani customers</div>
                </div>
              </label>
            </div>

            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Pay ${plan.currency} ${plan.price}`
              )}
            </button>

            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Secure payment processing. Your data is protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;