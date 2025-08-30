import { useNavigate } from 'react-router-dom';

/**
 * Custom hook that provides reusable navigation handlers
 * for common navigation patterns in the landing page.
 */
export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateToPricing = () => {
    navigate('/pricing');
  };

  const navigateToDocumentation = () => {
    navigate('/documentation');
  };

  const navigateToDownloads = () => {
    navigate('/downloads');
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToSignup = () => {
    navigate('/signup');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateBack = () => {
    navigate(-1);
  };

  return {
    navigateToPricing,
    navigateToDocumentation,
    navigateToDownloads,
    navigateToLogin,
    navigateToSignup,
    navigateToHome,
    navigateBack,
    // Expose the raw navigate function for custom navigation
    navigate
  };
};

export default useNavigation;
