import axios from 'axios';
import { API_ENDPOINTS, createAuthConfig } from '../config/api';

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
      const token = localStorage.getItem('medMasterToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        API_ENDPOINTS.payment.methods,
        createAuthConfig(token)
      );

      if (response.data.success) {
        return response.data.methods || this.getDefaultPaymentMethods();
      }
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
   * Create a unified payment session (supports both Stripe and PayFast)
   */
  async createPaymentSession(planId: number, paymentMethod?: string): Promise<PaymentSession> {
    try {
      const token = localStorage.getItem('medMasterToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        API_ENDPOINTS.payment.createSession,
        { planId, paymentMethod },
        createAuthConfig(token)
      );

      if (response.data.success) {
        return {
          success: true,
          sessionId: response.data.sessionId,
          url: response.data.paymentUrl || response.data.checkoutUrl,
          paymentMethod: response.data.paymentMethod,
          qrCode: response.data.qrCode,
          bankDetails: response.data.bankDetails
        };
      } else {
        return { success: false, error: response.data.error || 'Failed to create payment session' };
      }
    } catch (error: any) {
      console.error('Error creating payment session:', error);
      return { success: false, error: error.response?.data?.message || error.message || 'Failed to create payment session' };
    }
  }

  /**
   * Create a Paddle checkout session (legacy method)
   */
  async createCheckoutSession(planId: number): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const token = localStorage.getItem('medMasterToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        API_ENDPOINTS.payment.createCheckout,
        { planId },
        createAuthConfig(token)
      );

      if (response.data.success && response.data.checkoutUrl) {
        return { success: true, url: response.data.checkoutUrl };
      } else {
        return { success: false, error: response.data.error || 'Failed to create checkout session' };
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      return { success: false, error: error.response?.data?.message || error.message || 'Failed to create checkout session' };
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
      const response = await axios.get(
        `${API_ENDPOINTS.payment.success}?session_id=${sessionId}`
      );

      return response.data.success;
    } catch (error) {
      console.error('Error handling payment success:', error);
      return false;
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(sessionId: string): Promise<PaymentVerification> {
    try {
      const token = localStorage.getItem('medMasterToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        API_ENDPOINTS.payment.verify,
        { sessionId },
        createAuthConfig(token)
      );

      return response.data;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to verify payment'
      };
    }
  }

  /**
   * Get user's payment history
   */
  async getPaymentHistory(): Promise<PaymentHistory> {
    try {
      const token = localStorage.getItem('medMasterToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        API_ENDPOINTS.payment.history,
        createAuthConfig(token)
      );

      return response.data;
    } catch (error: any) {
      console.error('Error getting payment history:', error);
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
      const token = localStorage.getItem('medMasterToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        API_ENDPOINTS.payment.transaction(sessionId),
        createAuthConfig(token)
      );

      return response.data.success ? response.data.data : null;
    } catch (error) {
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