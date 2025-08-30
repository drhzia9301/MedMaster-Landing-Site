import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import PricingPage from './components/PricingPage';
import DocumentationPage from './components/DocumentationPage';
import DownloadsPage from './components/DownloadsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsConditionsPage from './components/TermsConditionsPage';
import RefundPolicyPage from './components/RefundPolicyPage';
import ServicePolicyPage from './components/ServicePolicyPage';
import PaymentPage from './components/PaymentPage';
import LandingLoginPage from './components/LandingLoginPage';
import LandingSignupPage from './components/LandingSignupPage';
import FirebaseActionHandler from './components/FirebaseActionHandler';
import { LandingAuthProvider, useLandingAuth } from './contexts/LandingAuthContext';
import { useNavigation } from './hooks/useNavigation';

function AppContentWithAuth() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { login } = useLandingAuth();
  const {
    navigateToPricing,
    navigateToDocumentation,
    navigateToDownloads,
    navigateToHome,
    navigateToSignup,
    navigate
  } = useNavigation();

  const handleGetStarted = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (token: string, email: string, username: string, subscriptionType?: string, userId?: string) => {
    // Store authentication data
    localStorage.setItem('medMasterToken', token);
    localStorage.setItem('medMasterEmail', email);
    localStorage.setItem('medMasterUsername', username);
    if (userId) {
      localStorage.setItem('medMasterUserId', userId);
    }
    if (subscriptionType) {
      localStorage.setItem('medMasterSubscriptionType', subscriptionType);
    }

    // Update the LandingAuthContext
    login(token, email, username, userId || '0', subscriptionType || 'demo');

    // Close the auth modal
    setShowAuthModal(false);
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="App">
      <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage
                onGetStarted={handleGetStarted}
                onLogin={handleLogin}
                onNavigateToPricing={navigateToPricing}
                onNavigateToDocumentation={navigateToDocumentation}
                onNavigateToDownloads={navigateToDownloads}
                onAuthSuccess={handleAuthSuccess}
              />
            } 
          />
          <Route
            path="/pricing"
            element={
              <PricingPage
                onBackToLanding={navigateToHome}
                onShowLandingLogin={navigateToSignup}
              />
            }
          />
          <Route
            path="/documentation"
            element={<DocumentationPage onBackToLanding={navigateToHome} />}
          />
          <Route
            path="/downloads"
            element={<DownloadsPage onBackToLanding={navigateToHome} />}
          />
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicyPage onBackToLanding={navigateToHome} />}
          />
          <Route
            path="/terms-conditions"
            element={<TermsConditionsPage onBackToLanding={navigateToHome} />}
          />
          <Route
            path="/refund-policy"
            element={<RefundPolicyPage onBackToLanding={navigateToHome} />}
          />
          <Route
            path="/service-policy"
            element={<ServicePolicyPage onBackToLanding={navigateToHome} />}
          />
          <Route
            path="/payment"
            element={<PaymentPage onBackToLanding={navigateToHome} />}
          />
          <Route
            path="/login"
            element={
              <LandingLoginPage
                onBackToLanding={navigateToHome}
                onAuthSuccess={(token, email, username, userId, subscriptionType) => {
                  handleAuthSuccess(token, email, username, userId, subscriptionType);
                  // After successful login, redirect back to home page
                  navigateToHome();
                }}
                onSwitchToSignup={navigateToSignup}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <LandingSignupPage
                onBackToLanding={navigateToHome}
                onAuthSuccess={(token, email, username, userId, subscriptionType) => {
                  handleAuthSuccess(token, email, username, userId, subscriptionType);
                  // After successful signup, redirect back to home page
                  navigateToHome();
                }}
                onSwitchToLogin={() => navigate('/login')}
              />
            }
          />
          <Route
            path="/auth/action"
            element={
              <FirebaseActionHandler
                onBackToLanding={navigateToHome}
              />
            }
          />
        </Routes>
        
        {showAuthModal && (
          <AuthModal
            mode={authMode}
            onClose={handleCloseAuth}
            onAuthSuccess={handleAuthSuccess}
            onSwitchMode={(mode) => setAuthMode(mode)}
          />
        )}
      </div>
  );
}

function AppContent() {
  return (
    <LandingAuthProvider>
      <AppContentWithAuth />
    </LandingAuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;