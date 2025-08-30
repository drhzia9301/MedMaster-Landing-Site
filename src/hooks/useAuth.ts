import { useLandingAuth } from '../contexts/LandingAuthContext';

/**
 * Unified auth hook that provides a consistent interface
 * for authentication across the landing page application.
 * 
 * This replaces the separate useAuth and useLandingAuth hooks
 * to provide a single, consolidated authentication interface.
 */
export const useAuth = () => {
  return useLandingAuth();
};

// Export the hook as default for convenience
export default useAuth;
