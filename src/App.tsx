import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import PricingPage from './components/PricingPage';
import DocumentationPage from './components/DocumentationPage';
import DownloadsPage from './components/DownloadsPage';
import { AuthProvider } from './contexts/AuthContext';

type CurrentPage = 'landing' | 'pricing' | 'documentation' | 'downloads';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentPage, setCurrentPage] = useState<CurrentPage>('landing');

  const handleGetStarted = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (token: string, email: string, username: string) => {
    // Store authentication data
    localStorage.setItem('medMasterToken', token);
    localStorage.setItem('medMasterEmail', email);
    localStorage.setItem('medMasterUsername', username);
    
    // Redirect to main app
    window.location.href = 'https://app.medmaster.site'; // Update this URL to your app domain
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
  };

  // Navigation handlers
  const handleNavigateToPricing = () => {
    setCurrentPage('pricing');
  };

  const handleNavigateToDocumentation = () => {
    setCurrentPage('documentation');
  };

  const handleNavigateToDownloads = () => {
    setCurrentPage('downloads');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'pricing':
        return <PricingPage onBackToLanding={handleBackToLanding} />;
      case 'documentation':
        return <DocumentationPage onBackToLanding={handleBackToLanding} />;
      case 'downloads':
        return <DownloadsPage onBackToLanding={handleBackToLanding} />;
      default:
        return (
          <LandingPage 
            onGetStarted={handleGetStarted}
            onLogin={handleLogin}
            onNavigateToPricing={handleNavigateToPricing}
            onNavigateToDocumentation={handleNavigateToDocumentation}
            onNavigateToDownloads={handleNavigateToDownloads}
          />
        );
    }
  };

  return (
    <AuthProvider>
      <div className="App">
        {renderCurrentPage()}
        
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

export default App;