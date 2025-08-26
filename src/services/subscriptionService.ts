import { API_ENDPOINTS } from '../config/api';
import { supabaseHelpers } from '../config/supabase';

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
  async getSubscriptionStatus(_userId?: number): Promise<SubscriptionStatus> {
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
      
      if (!token) {
        // No token means demo user
        return {
          subscription_type: 'demo',
          status: null
        };
      }

      const response = await fetch(API_ENDPOINTS.subscription.status, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Could not fetch subscription status:', response.status, response.statusText);
        // Default to demo if API call fails
        return {
          subscription_type: 'demo',
          status: null
        };
      }

      const data = await response.json();
      
      return {
        subscription_type: data.subscription_type || 'demo',
        status: data.status || null,
        plan_name: data.plan_name,
        end_date: data.end_date,
        days_remaining: data.days_remaining
      };
    } catch (error: any) {
      console.error('Error fetching subscription status:', error);
      
      // Return demo status as fallback
      return {
        subscription_type: 'demo',
        status: null
      };
    }
  }

  /**
   * Get user's usage statistics
   */
  async getUsageStats(userId?: number): Promise<UsageStats> {
    // In dev mode, return unlimited usage
    if (this.isDevMode()) {
      return {
        questions_today: 0,
        clinical_cases_today: 0,
        questions_limit: 999,
        clinical_cases_limit: 999,
        subscription_type: 'premium'
      };
    }

    if (!userId) {
      // Return demo limits if no user ID
      return {
        questions_today: 0,
        clinical_cases_today: 0,
        questions_limit: 10,
        clinical_cases_limit: 2,
        subscription_type: 'demo'
      };
    }

    try {
      // Get user's subscription status
      const subscriptionStatus = await this.getSubscriptionStatus(userId);
      
      // Get today's usage from user_analytics or daily_usage table
      const { data: analytics, error } = await supabaseHelpers.getUserAnalytics(userId);
      
      let questionsToday = 0;
      let clinicalCasesToday = 0;
      
      if (!error && analytics) {
        // Filter today's data if available
        questionsToday = analytics.questions_answered_today || 0;
        clinicalCasesToday = analytics.clinical_cases_completed_today || 0;
      }
      
      // Get limits based on subscription type
      const limits = this.getFeatureLimits(subscriptionStatus.subscription_type as any);
      
      return {
        questions_today: questionsToday,
        clinical_cases_today: clinicalCasesToday,
        questions_limit: limits.questions_per_day,
        clinical_cases_limit: limits.clinical_cases_per_day,
        subscription_type: subscriptionStatus.subscription_type
      };
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      // Return demo limits as fallback
      return {
        questions_today: 0,
        clinical_cases_today: 0,
        questions_limit: 10,
        clinical_cases_limit: 2,
        subscription_type: 'demo'
      };
    }
  }

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
      const { data: plans, error } = await supabaseHelpers.getSubscriptionPlans();
      
      if (error) {
        throw new Error('Failed to fetch subscription plans');
      }
      
      return {
        success: true,
        plans: plans || []
      };
    } catch (error: any) {
      console.error('Error fetching subscription plans:', error);
      // Return default plans as fallback
      return {
        success: true,
        plans: [
          {
            id: 1,
            name: 'Starter',
            price: 9.99,
            duration: '1 month',
            features: ['Basic features', 'Limited questions']
          },
          {
            id: 2,
            name: 'Popular',
            price: 19.99,
            duration: '1 month',
            features: ['All features', 'Unlimited questions']
          },
          {
            id: 3,
            name: 'Premium',
            price: 29.99,
            duration: '1 month',
            features: ['All features', 'Priority support']
          }
        ]
      };
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