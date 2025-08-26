/**
 * Supabase Configuration for Landing Page
 * Direct database access for authentication and subscriptions
 */

import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types for TypeScript
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  last_login?: string;
  subscription_status: 'demo' | 'active' | 'expired' | 'cancelled';
  subscription_end_date?: string;
  google_id?: string;
  profile_picture?: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  duration_months: number;
  price_pkr: number;
  features: string;
  is_active: boolean;
  created_at: string;
}

export interface UserSubscription {
  id: number;
  user_id: number;
  plan_id: number;
  status: 'demo' | 'active' | 'expired' | 'cancelled';
  start_date?: string;
  end_date?: string;
  payment_method?: string;
  transaction_id?: string;
  created_at: string;
}

// Helper functions for common database operations
export const supabaseHelpers = {
  // User operations
  async getUserByUsername(username: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    return { data, error };
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    return { data, error };
  },

  async getUserById(id: number) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  async createUser(userData: Omit<User, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    return { data, error };
  },

  async updateUser(id: number, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  // Subscription operations
  async getSubscriptionPlans() {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_pkr', { ascending: true });
    
    return { data, error };
  },

  async getUserSubscription(userId: number) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    return { data, error };
  },

  async createUserSubscription(subscriptionData: Omit<UserSubscription, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert(subscriptionData)
      .select()
      .single();
    
    return { data, error };
  },

  async updateUserSubscription(id: number, updates: Partial<UserSubscription>) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  // Payment management
  async createPaymentTransaction(transactionData: any) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert(transactionData)
      .select()
      .single();
    
    return { data, error };
  },

  async getPaymentTransaction(transactionId: string) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();
    
    return { data, error };
  },

  async getPaymentTransactionBySession(sessionId: string) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    return { data, error };
  },

  async getUserPaymentHistory(userId: number) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select(`
        *,
        subscription_plans(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Analytics
  async getUserAnalytics(userId: number) {
    const { data, error } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return { data, error };
  },

  // Cancel user subscription by user ID
  async cancelUserSubscription(userId: number) {
    try {
      // Update subscription status to cancelled
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', userId)
        .eq('status', 'active')
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Update user subscription status
      const { error: userError } = await supabase
        .from('users')
        .update({ subscription_status: 'demo' })
        .eq('id', userId);

      if (userError) {
        return { success: false, error: userError.message };
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Update user subscription by user ID
  async updateUserSubscriptionByUserId(userId: number, updates: { plan_id: number; subscription_type: string }) {
    try {
      // Update the active subscription
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          plan_id: updates.plan_id,
          status: 'active'
        })
        .eq('user_id', userId)
        .eq('status', 'active')
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Update user subscription status
      const { error: userError } = await supabase
        .from('users')
        .update({ subscription_status: updates.subscription_type })
        .eq('id', userId);

      if (userError) {
        return { success: false, error: userError.message };
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

// Debug configuration
console.log('🔗 Supabase Configuration:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  environment: import.meta.env.MODE
});