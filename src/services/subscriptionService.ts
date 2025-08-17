import axios from 'axios';
import { API_ENDPOINTS, createAuthConfig } from '../config/api';

export interface SubscriptionStatus {
  subscription_type: 'demo' | 'starter' | 'popular' | 'premium';
  status: 'active' | 'expired' | 'cancelled' | null;
  plan_name?: string;
  end_date?: string;
  days_remaining?: number;
}

export interface UsageStats {
  questions_today: number;
  clinical_cases_today: number;
  questions_limit: number;
  clinical_cases_limit: number;
  subscription_type: 'demo' | 'starter' | 'popular' | 'premium';
}

export interface FeatureAccess {
  allowed: boolean;
  remaining_usage?: number;
  upgrade_required?: boolean;
  message?: string;
}

class SubscriptionService {
  /**
   * Check if app is running in dev mode
   */
  private isDevMode(): boolean {
    const queryParams = new URLSearchParams(window.location.search);
    
    // Only enable dev mode when explicitly requested with ?dev=true
    return queryParams.get('dev') === 'true';
  }

  /**
   * Get user's current subscription status
   */
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    // In dev mode, return premium subscription with active status
    if (this.isDevMode()) {
      console.log('Running in dev mode, returning premium subscription');
      return {
        subscription_type: 'premium',
        status: 'active',
        plan_name: 'Premium Plan (Dev Mode)',
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        days_remaining: 365
      };
    }

    try {
      const token = localStorage.getItem('medMasterToken');
      console.log('Token exists:', !!token);
      
      if (!token) {
        console.log('No authentication token found, returning demo status');
        return {
          subscription_type: 'demo',
          status: null
        };
      }

      console.log('Making API request to:', API_ENDPOINTS.auth.profile);
      const response = await axios.get(
        API_ENDPOINTS.auth.profile,
        createAuthConfig(token)
      );

      console.log('Subscription API response:', response.data);
      
      // Handle the nested response format from the server
      const subscriptionData = response.data.subscription || response.data;
      
      // Map the server response to our expected format
      return {
        subscription_type: subscriptionData.subscription_type || 'demo',
        status: subscriptionData.status,
        plan_name: subscriptionData.plan_name,
        end_date: subscriptionData.end_date,
        days_remaining: subscriptionData.end_date ? 
          Math.max(0, Math.ceil((new Date(subscriptionData.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 
          undefined
      };
    } catch (error: any) {
      console.error('Error fetching subscription status:', error);
      console.log('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Return demo status as fallback
      return {
        subscription_type: 'demo',
        status: null
      };
    }
  }

  // Note: Usage statistics methods removed as they are no longer needed
  // Daily usage tracking has been disabled for all subscription types

  /**
   * Check if user has access to a specific feature
   */
  async checkFeatureAccess(_feature: string, _requestCount: number = 1): Promise<FeatureAccess> {
    // In dev mode, allow access to all features
    if (this.isDevMode()) {
      return {
        allowed: true,
        remaining_usage: -1, // unlimited
        upgrade_required: false,
        message: 'Dev mode - unlimited access'
      };
    }

    try {
      const token = localStorage.getItem('medMasterToken');
      if (!token) {
        return {
          allowed: false,
          upgrade_required: true,
          message: 'Please log in to access this feature'
        };
      }

      // For landing page, we'll just return allowed for now
      // since we don't have the checkAccess endpoint configured
      return {
        allowed: true,
        remaining_usage: -1,
        upgrade_required: false,
        message: 'Access granted'
      };
    } catch (error: any) {
      console.error('Error checking feature access:', error);
      return {
        allowed: false,
        upgrade_required: true,
        message: 'Unable to verify access. Please try again.'
      };
    }
  }

  /**
   * Get available subscription plans
   */
  async getSubscriptionPlans() {
    try {
      // For landing page, return mock plans for now
      return [
        {
          id: 1,
          name: 'Demo',
          price: 0,
          description: 'Limited access to Gram Positive content'
        },
        {
          id: 2,
          name: 'Starter',
          price: 999,
          description: 'Full access to all content'
        },
        {
          id: 3,
          name: 'Popular',
          price: 1999,
          description: 'Full access plus premium features'
        }
      ];
    } catch (error: any) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  }

  /**
   * Check if user is on demo plan
   */
  isDemoUser(subscriptionType: string): boolean {
    return subscriptionType === 'demo';
  }

  /**
   * Check if user has premium access
   */
  hasPremiumAccess(subscriptionType: string): boolean {
    return subscriptionType === 'starter' || subscriptionType === 'popular';
  }

  /**
   * Get feature limits based on subscription type
   */
  getFeatureLimits(subscriptionType: 'demo' | 'starter' | 'popular') {
    const limits = {
      demo: {
        questions_per_day: -1, // unlimited (content-filtered to gram positive)
        clinical_cases_per_day: -1, // unlimited (content-filtered to gram positive)
        flashcards_access: true, // limited to gram positive content
        analytics_access: false
      },
      starter: {
        questions_per_day: -1, // unlimited
        clinical_cases_per_day: -1, // unlimited
        flashcards_access: true,
        analytics_access: true
      },
      popular: {
        questions_per_day: -1, // unlimited
        clinical_cases_per_day: -1, // unlimited
        flashcards_access: true,
        analytics_access: true
      }
    };

    return limits[subscriptionType] || limits.demo;
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;