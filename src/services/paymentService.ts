import { supabaseHelpers } from '../config/supabase';

export interface PaymentPlan {
  id: number;
  name: string;
  price: number;
  duration_months: number;
  features: string[];
}

export interface PaymentSession {
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
  paymentMethod?: 'paddle' | 'payfast';
  qrCode?: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountTitle: string;
  };
}

export interface PaymentMethodOption {
  id: string;
  name: string;
  type: 'card' | 'bank' | 'mobile';
  icon: string;
  description: string;
  available: boolean;
}

export interface PaymentTransaction {
  id: number;
  user_id: number;
  plan_id: number;
  amount: number;
  currency: string;
  session_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  plan_name?: string;
}

export interface PaymentHistory {
  success: boolean;
  data: PaymentTransaction[];
}

export interface PaymentVerification {
  success: boolean;
  data?: {
    transaction: PaymentTransaction;
    subscription: any;
    paymentStatus: string;
    subscriptionActive: boolean;
  };
  error?: string;
}

class PaymentService {
  /**
   * Get available payment methods for the user
   */
  async getAvailablePaymentMethods(): Promise<PaymentMethodOption[]> {
    try {
      // TODO: Implement getAvailablePaymentMethods in supabaseHelpers
      // const { data: methods, error } = await supabaseHelpers.getAvailablePaymentMethods();
      
      // For now, return default payment methods
      console.warn('Using default payment methods - getAvailablePaymentMethods not implemented');
      return this.getDefaultPaymentMethods();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return this.getDefaultPaymentMethods();
    }
  }

  /**
   * Get default payment methods (fallback)
   */
  private getDefaultPaymentMethods(): PaymentMethodOption[] {
    return [
      {
        id: 'payfast_card',
        name: 'Debit/Credit Card',
        type: 'card',
        icon: '💳',
        description: 'Pay securely with your debit or credit card via PayFast',
        available: true
      },
      {
        id: 'payfast_bank',
        name: 'Bank Transfer',
        type: 'bank',
        icon: '🏦',
        description: 'Direct bank transfer via PayFast',
        available: true
      },
      {
        id: 'paddle_card',
        name: 'International Card',
        type: 'card',
        icon: '🌍',
        description: 'Pay with international cards via Paddle',
        available: true
      }
    ];
  }

  /**
   * Create a payment session for the selected plan
   */
  async createPaymentSession(planId: number, userId: number, paymentMethod?: string): Promise<PaymentSession> {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID required'
        };
      }

      // Get plan details
      const { data: plans, error: planError } = await supabaseHelpers.getSubscriptionPlans();
      const plan = plans?.find(p => p.id === planId);
      
      if (planError || !plan) {
        return {
          success: false,
          error: 'Invalid subscription plan'
        };
      }

      // Generate session ID
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // For demo purposes, return a mock payment session
      // In production, this would integrate with actual payment processors
      return {
        success: true,
        sessionId,
        url: `/payment/checkout?session=${sessionId}&plan=${planId}`,
        paymentMethod: paymentMethod as any || 'paddle'
      };
    } catch (error: any) {
      console.error('Error creating payment session:', error);
      return {
        success: false,
        error: 'Failed to create payment session'
      };
    }
  }

  /**
   * Create a checkout session using Supabase
   */
  async createCheckoutSession(_planId: number): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Get user ID from token (assuming it's stored in localStorage)
      const token = localStorage.getItem('medMasterToken');
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }

      // For now, we'll need to pass userId from the calling component
      // This is a temporary solution until proper auth integration
      return { success: false, error: 'User ID required for payment session' };
      
      // TODO: Implement proper checkout session creation
      // const session = await supabaseHelpers.createCheckoutSession(userId, planId);
      // if (session.success && session.url) {
      //   return { success: true, url: session.url };
      // } else {
      //   return { success: false, error: session.error || 'Failed to create checkout session' };
      // }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      return { success: false, error: error.message || 'Failed to create checkout session' };
    }
  }

  /**
   * Redirect to Paddle checkout
   */
  async redirectToCheckout(planId: number): Promise<boolean> {
    try {
      const session = await this.createCheckoutSession(planId);
      
      if (session.success && session.url) {
        // Redirect to Paddle checkout
        window.location.href = session.url;
        return true;
      } else {
        console.error('Failed to create checkout session:', session.error);
        return false;
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      return false;
    }
  }

  /**
   * Handle payment success callback
   */
  async handlePaymentSuccess(sessionId: string): Promise<boolean> {
    try {
      // TODO: Implement handlePaymentSuccess in supabaseHelpers
      // const { data, error } = await supabaseHelpers.handlePaymentSuccess(sessionId);
      console.warn('handlePaymentSuccess not implemented, sessionId:', sessionId);
      return false;
    } catch (error) {
      console.error('Error handling payment success:', error);
      return false;
    }
  }

  /**
   * Verify payment status and update subscription
   */
  async verifyPayment(sessionId: string, userId: number): Promise<PaymentVerification> {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID required'
        };
      }

      // Get transaction by session ID
      const { data: transaction, error: transactionError } = await supabaseHelpers.getPaymentTransactionBySession(sessionId);
      
      if (transactionError || !transaction) {
        return {
          success: false,
          error: 'Transaction not found'
        };
      }

      // Get user subscription
      const { data: subscription, error: _subscriptionError } = await supabaseHelpers.getUserSubscription(userId);
      
      const paymentStatus = transaction.status;
      const subscriptionActive = subscription?.status === 'active';

      return {
        success: true,
        data: {
          transaction,
          subscription,
          paymentStatus,
          subscriptionActive
        }
      };
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      return {
        success: false,
        error: 'Payment verification failed'
      };
    }
  }

  /**
   * Get payment history for the current user
   */
  async getPaymentHistory(userId: number): Promise<PaymentHistory> {
    try {
      if (!userId) {
        return {
          success: false,
          data: []
        };
      }

      const { data: transactions, error } = await supabaseHelpers.getUserPaymentHistory(userId);
      
      if (error) {
        return {
          success: false,
          data: []
        };
      }

      return {
        success: true,
        data: transactions || []
      };
    } catch (error: any) {
      console.error('Error fetching payment history:', error);
      return {
        success: false,
        data: []
      };
    }
  }

  /**
   * Get payment transaction details
   */
  async getTransaction(sessionId: string): Promise<PaymentTransaction | null> {
    try {
      const { data: transaction, error } = await supabaseHelpers.getPaymentTransactionBySession(sessionId);
      
      if (error || !transaction) {
        return null;
      }

      return transaction;
    } catch (error: any) {
      console.error('Error getting transaction:', error);
      return null;
    }
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number, currency: string = 'PKR'): string {
    if (currency === 'PKR') {
      return `₨${amount.toLocaleString()}`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  }

  /**
   * Get payment status display text
   */
  getStatusDisplay(status: string): { text: string; color: string } {
    switch (status.toLowerCase()) {
      case 'completed':
        return { text: 'Completed', color: 'text-green-600' };
      case 'pending':
        return { text: 'Pending', color: 'text-yellow-600' };
      case 'failed':
        return { text: 'Failed', color: 'text-red-600' };
      case 'cancelled':
        return { text: 'Cancelled', color: 'text-gray-600' };
      default:
        return { text: status, color: 'text-gray-600' };
    }
  }

  /**
   * Check if payment is successful
   */
  isPaymentSuccessful(status: string): boolean {
    return status.toLowerCase() === 'completed';
  }

  /**
   * Get success page URL with session ID
   */
  getSuccessPageUrl(sessionId: string): string {
    return `/payment/success?session_id=${sessionId}`;
  }

  /**
   * Get cancel page URL
   */
  getCancelPageUrl(): string {
    return '/payment/cancel';
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;