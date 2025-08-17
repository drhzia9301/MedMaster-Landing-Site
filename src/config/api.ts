/**
 * API Configuration for Landing Page
 * Connects to the shared MedMaster backend
 */

// Get API base URL from environment or fallback to production backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-domain.com'; // Update this to your actual backend URL

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    registerFirebase: `${API_BASE_URL}/api/auth/register-firebase`,
    google: `${API_BASE_URL}/api/auth/google`,
    profile: `${API_BASE_URL}/api/auth/profile`,
  },
  
  // Payment
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
    'Access-Control-Allow-Origin': '*',
  },
};