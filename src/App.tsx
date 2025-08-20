import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import { AuthProvider } from './contexts/AuthContext';
import { LandingAuthProvider, useLandingAuth } from './contexts/LandingAuthContext';

function AppContentWithAuth() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();
  const { login } = useLandingAuth();

  const handleGetStarted = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (token: string, email: string, username: string, subscriptionType?: string) => {
    console.log('🎉 APP.TSX handleAuthSuccess called with:', { token: token.substring(0, 20) + '...', email, username, subscriptionType });
    
    // Store authentication data
    localStorage.setItem('medMasterToken', token);
    localStorage.setItem('medMasterEmail', email);
    localStorage.setItem('medMasterUsername', username);
    if (subscriptionType) {
      localStorage.setItem('medMasterSubscriptionType', subscriptionType);
    }
    
    console.log('💾 Stored auth data in localStorage');
    
    // Update the LandingAuthContext
    console.log('🔄 Calling login function...');
    login(token, email, username, subscriptionType || 'demo');
    
    // Close the auth modal
    setShowAuthModal(false);
    console.log('✅ Auth modal closed');
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
  };

  // Navigation handlers
  const handleNavigateToPricing = () => {
    navigate('/pricing');
  };

  const handleNavigateToDocumentation = () => {
    navigate('/documentation');
  };

  const handleNavigateToDownloads = () => {
    navigate('/downloads');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                onGetStarted={handleGetStarted}
                onLogin={handleLogin}
                onNavigateToPricing={handleNavigateToPricing}
                onNavigateToDocumentation={handleNavigateToDocumentation}
                onNavigateToDownloads={handleNavigateToDownloads}
                onAuthSuccess={handleAuthSuccess}
              />
            } 
          />
          <Route 
            path="/pricing" 
            element={
              <PricingPage 
                onBackToLanding={handleBackToLanding} 
                onShowLandingLogin={() => navigate('/signup')}
              />
            } 
          />
          <Route 
            path="/documentation" 
            element={<DocumentationPage onBackToLanding={handleBackToLanding} />} 
          />
          <Route 
            path="/downloads" 
            element={<DownloadsPage onBackToLanding={handleBackToLanding} />} 
          />
          <Route 
            path="/privacy-policy" 
            element={<PrivacyPolicyPage onBackToLanding={handleBackToLanding} />} 
          />
          <Route 
            path="/terms-conditions" 
            element={<TermsConditionsPage onBackToLanding={handleBackToLanding} />} 
          />
          <Route 
            path="/refund-policy" 
            element={<RefundPolicyPage onBackToLanding={handleBackToLanding} />} 
          />
          <Route 
            path="/service-policy" 
            element={<ServicePolicyPage onBackToLanding={handleBackToLanding} />} 
          />
          <Route 
            path="/payment" 
            element={<PaymentPage onBackToLanding={handleBackToLanding} />} 
          />
          <Route 
            path="/login" 
            element={
              <LandingLoginPage 
                onBackToLanding={handleBackToLanding}
                onAuthSuccess={(token, email, username, subscriptionType) => {
                  handleAuthSuccess(token, email, username, subscriptionType);
                  // After successful login, redirect back to pricing
                  navigate('/pricing');
                }}
                onSwitchToSignup={() => navigate('/signup')}
              />
            } 
          />
          <Route 
            path="/signup" 
            element={
              <LandingSignupPage 
                onBackToLanding={handleBackToLanding}
                onAuthSuccess={(token, email, username, subscriptionType) => {
                  handleAuthSuccess(token, email, username, subscriptionType);
                  // After successful signup, redirect back to pricing
                  navigate('/pricing');
                }}
                onSwitchToLogin={() => navigate('/login')}
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
    </AuthProvider>
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