/**
 * API Configuration for Landing Page
 * Connects to the shared MedMaster backend
 */

// Get API base URL from environment
const VITE_API_URL = import.meta.env.VITE_API_URL;

// Use environment variable if set, otherwise fallback to localhost
let resolvedApiUrl = VITE_API_URL || 'http://localhost:3003';

// In production, the API URL must be set
if (import.meta.env.PROD && !VITE_API_URL) {
  throw new Error('VITE_API_URL is not defined. Please set it in your Vercel environment variables.');
}

export const API_BASE_URL = resolvedApiUrl;

// Debug API configuration
console.log('🌐 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL,
  environment: import.meta.env.MODE
});

// API endpoints - EXACTLY matching main app
export const API_ENDPOINTS = {
  // Authentication endpoints
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    registerFirebase: `${API_BASE_URL}/api/auth/register-firebase`,
    google: `${API_BASE_URL}/api/auth/google`,
    profile: `${API_BASE_URL}/api/auth/profile`,
  },

  // Subscription endpoints
  subscriptions: {
    status: `${API_BASE_URL}/api/subscriptions/status`,
    plans: `${API_BASE_URL}/api/subscriptions/plans`,
    checkAccess: `${API_BASE_URL}/api/subscriptions/check-access`,
  },

  // Subscription management endpoints
  subscription: {
    cancel: `${API_BASE_URL}/api/subscriptions/cancel`,
    upgrade: `${API_BASE_URL}/api/subscriptions/upgrade`,
    downgrade: `${API_BASE_URL}/api/subscriptions/downgrade`,
    status: `${API_BASE_URL}/api/subscriptions/status`,
  },

  // Payment endpoints
  payment: {
    createCheckout: `${API_BASE_URL}/api/payment/create-checkout-session`,
    createSession: `${API_BASE_URL}/api/payment/create-session`,
    methods: `${API_BASE_URL}/api/payment/methods`,
    verify: `${API_BASE_URL}/api/payment/verify`,
    history: `${API_BASE_URL}/api/payment/history`,
    transaction: (sessionId: string) => `${API_BASE_URL}/api/payment/transaction/${sessionId}`,
    success: `${API_BASE_URL}/api/payment/success`,
  },
};

// Helper function to create auth config for axios
export const createAuthConfig = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` }
});

// Environment info
export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: API_BASE_URL,
  appEnv: import.meta.env.VITE_APP_ENV || 'production',
};

// CORS configuration for cross-domain authentication
export const CORS_CONFIG = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};