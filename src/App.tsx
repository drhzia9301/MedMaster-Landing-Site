import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

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

  return (
    <AuthProvider>
      <div className="App">
        <LandingPage 
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
        />
        
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