import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useIntersectionObserver } from '../hooks/useLazyLoading';
import FAQSection from './FAQSection';
import AuthPage from './AuthPage';
import LandingLoginPage from './LandingLoginPage';
import LandingSignupPage from './LandingSignupPage';
import { useLandingAuth } from '../contexts/LandingAuthContext';
import { PaymentSession } from '../services/paymentService';
import { toast } from 'sonner';
import LoadingSpinner from './LoadingSpinner';
import PaymentMethodSelector from './PaymentMethodSelector';
import { DebugInfo } from './DebugInfo';

// Import new section components
import LandingHeader from './sections/LandingHeader';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import AppPreviewSection from './sections/AppPreviewSection';
import StatsSection from './sections/StatsSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';
// Using custom icons for main features

// Mix of custom icons and some Lucide icons for UI elements

interface LandingPageProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
  onNavigateToPricing?: () => void;
  onNavigateToDocumentation?: () => void;
  onNavigateToDownloads?: () => void;
  onAuthSuccess?: (token: string, email: string, username: string, subscriptionType?: string, userId?: string) => void;
}

function LandingPageContent({ onAuthSuccess, onNavigateToPricing, onNavigateToDocumentation, onNavigateToDownloads }: LandingPageProps) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: number; name: string; price: number } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode] = useState<'login' | 'signup'>('login');
  const [showLandingLogin, setShowLandingLogin] = useState(false);
  const [showLandingSignup, setShowLandingSignup] = useState(false);
  const { } = useLandingAuth();

  
  const { trackPageView, trackEvent } = useAnalytics();
  const { targetRef: heroRef, isIntersecting: heroVisible } = useIntersectionObserver({ threshold: 0.5 });
  const { targetRef: featuresRef, isIntersecting: featuresVisible } = useIntersectionObserver({ threshold: 0.3 });


  // Track page view on mount
  useEffect(() => {
    trackPageView('/landing');
    setIsLoading(false);
  }, []);

  // Track section views
  useEffect(() => {
    if (heroVisible) trackEvent('hero_section_viewed');
  }, [heroVisible]);

  useEffect(() => {
    if (featuresVisible) trackEvent('features_section_viewed');
  }, [featuresVisible]);


  
  const screenshots = [
    { src: '/screenshots/dashboard.svg', alt: 'Dashboard Overview', title: 'Personalized Dashboard' },
    { src: '/screenshots/quiz.svg', alt: 'Quiz Interface', title: 'Interactive Quizzes' },
    { src: '/screenshots/flashcards.svg', alt: 'Flashcards Interface', title: 'Smart Flashcards' },
    { src: '/screenshots/clinical-case.svg', alt: 'Clinical Case Study', title: 'Clinical Cases' },
    { src: '/screenshots/analytics.svg', alt: 'Analytics Dashboard', title: 'Detailed Analytics' },
    { src: '/screenshots/leaderboard.svg', alt: 'Leaderboard Rankings', title: 'Global Leaderboard' }
  ];

  const testimonials = [
    {
      name: "Ahmed Hassan",
      college: "Dow University of Health Sciences",
      year: "3rd Year",
      image: "/testimonials/ahmed.svg",
      comment: "MedMaster transformed my study routine! The spaced repetition system helped me retain complex microbiology concepts effortlessly."
    },
    {
      name: "Fatima Khan",
      college: "Aga Khan University",
      year: "4th Year",
      image: "/testimonials/fatima.svg",
      comment: "The clinical cases are incredibly realistic. I feel much more confident approaching real patients after practicing here."
    },
    {
      name: "Ali Raza",
      college: "King Edward Medical University",
      year: "2nd Year",
      image: "/testimonials/ali.svg",
      comment: "Gamification made studying fun! I'm actually excited to learn pharmacology now. The leaderboard keeps me motivated."
    },
    {
      name: "Ayesha Malik",
      college: "Allama Iqbal Medical College",
      year: "5th Year",
      image: "/testimonials/ayesha.svg",
      comment: "The analytics feature helped me identify my weak areas. My exam scores improved by 25% in just 2 months!"
    },
    {
      name: "Hassan Ali",
      college: "Lahore Medical College",
      year: "3rd Year",
      image: "/testimonials/hassan.svg",
      comment: "Quick Fire mode is addictive! I can study anywhere, anytime. Perfect for busy medical students like us."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [screenshots.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Function to handle smooth scrolling with enhanced animation
  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Using smooth scrolling with improved animation
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Add a subtle highlight effect to the section
      element.classList.add('section-highlight');
      setTimeout(() => {
        element.classList.remove('section-highlight');
      }, 1500);
      
      // Track navigation click
      trackEvent('navigation_click', { section: elementId });
    }
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };









  const handlePaymentInitiated = (session: PaymentSession) => {
    trackEvent('payment_initiated', { 
      method: session.paymentMethod,
      sessionId: session.sessionId 
    });
    
    if (session.paymentMethod === 'paddle' && session.url) {
      // Paddle redirects immediately
      setShowPaymentModal(false);
    } else {
      // PayFast shows payment details in modal
      toast.success('Payment session created! Follow the instructions to complete payment.');
    }
  };

  const handlePaymentError = (error: string) => {
    trackEvent('payment_error', { 
      plan: selectedPlan?.name,
      error 
    });
    toast.error(error);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  // Authentication handling functions
  const handleLandingAuthSuccess = () => {
    setShowLandingLogin(false);
    setShowLandingSignup(false);
    
    // If user was trying to purchase a plan, show payment modal
    if (selectedPlan) {
      setShowPaymentModal(true);
    }
  };

  const handleShowLandingLogin = () => {
    navigate('/login');
  };

  const handleShowLandingSignup = () => {
    navigate('/signup');
  };

  const handleBackToLanding = () => {
    setShowLandingLogin(false);
    setShowLandingSignup(false);
  };

  const handleSwitchToLogin = () => {
    setShowLandingLogin(true);
    setShowLandingSignup(false);
  };

  const handleSwitchToSignup = () => {
    setShowLandingLogin(false);
    setShowLandingSignup(true);
  };

  const handleGoToApp = () => {
    // Redirect to the main MedMaster app using environment variable
    const appUrl = import.meta.env.VITE_MAIN_APP_URL || 'http://localhost:5173';
    window.open(appUrl, '_blank');
  };

  // Authentication handling functions for app login modal (separate from landing auth)
  const handleAuthSuccess = (token: string, email: string, username: string, subscriptionType?: string, userId?: string) => {
    setShowAuthModal(false);
    
    // Call parent auth success handler if provided
    onAuthSuccess?.(token, email, username, subscriptionType, userId);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setSelectedPlan(null);
  };

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        trackEvent('exit_intent_detected');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // Render full-page authentication if active
  if (showLandingLogin) {
    return (
      <LandingLoginPage
        onSuccess={handleLandingAuthSuccess}
        onBackToLanding={handleBackToLanding}
        onSwitchToSignup={handleSwitchToSignup}
        onAuthSuccess={onAuthSuccess}
      />
    );
  }

  if (showLandingSignup) {
    return (
      <LandingSignupPage
        onSuccess={handleLandingAuthSuccess}
        onBackToLanding={handleBackToLanding}
        onSwitchToLogin={handleSwitchToLogin}
        onAuthSuccess={onAuthSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 transition-all duration-500" style={{ scrollBehavior: 'smooth' }}>

      
      <LandingHeader
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onNavigateToDocumentation={onNavigateToDocumentation}
        onNavigateToPricing={onNavigateToPricing}
        onShowLandingLogin={handleShowLandingLogin}
        onShowLandingSignup={handleShowLandingSignup}
        onGoToApp={handleGoToApp}
        scrollToSection={scrollToSection}
      />



      <HeroSection
        heroRef={heroRef}
        onNavigateToDownloads={onNavigateToDownloads}
      />



      <FeaturesSection featuresRef={featuresRef} />




      <AppPreviewSection
        currentSlide={currentSlide}
        screenshots={screenshots}
        trackEvent={trackEvent}
      />

      <StatsSection
        testimonials={testimonials}
        currentTestimonial={currentTestimonial}
        setCurrentTestimonial={setCurrentTestimonial}
      />




      {/* Pricing Section */}


      {/* About the Developer Section */}
      <section id="about-developer" className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">About the Developer</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Meet the mind behind MedMaster
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-700">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Developer Photo */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-400 to-purple-400 shadow-xl">
                    <img
                      src="/developer/haroon.jpg"
                      alt="Muhammad Haroon - Developer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a default avatar if image fails to load
                        e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                          <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
                            <rect width="160" height="160" fill="#4F46E5"/>
                            <circle cx="80" cy="60" r="25" fill="white"/>
                            <circle cx="80" cy="130" r="45" fill="white"/>
                            <text x="80" y="85" text-anchor="middle" fill="#4F46E5" font-size="20" font-weight="bold">
                              MH
                            </text>
                          </svg>
                        `)}`
                      }}
                    />
                  </div>
                </div>

                {/* Developer Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-white mb-4">Muhammad Haroon</h3>
                  <div className="text-blue-400 font-semibold text-lg mb-4">
                    4th Year Medical Student
                  </div>
                  <div className="text-purple-400 font-medium mb-6">
                    Saidu Medical College, Swat
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    As a passionate 4th-year medical student at Saidu Medical College Swat, I created MedMaster to revolutionize how we learn microbiology and pharmacology. Having experienced the challenges of medical education firsthand, I designed this platform to make complex medical concepts more accessible, engaging, and memorable through gamification and innovative learning techniques.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    My goal is to empower fellow medical students with tools that not only help them excel in their studies but also prepare them to become better healthcare professionals. MedMaster represents my commitment to improving medical education and making learning an enjoyable journey rather than a burden.
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex justify-center md:justify-start gap-4 mt-8">
                    <a 
                      href="mailto:contact@medmaster.site" 
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/haroon-zia-a3a516369/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-blue-800 hover:bg-blue-900 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />



      <ContactSection />

      <Footer
        scrollToSection={scrollToSection}
        onNavigateToPricing={onNavigateToPricing}
        onNavigateToDocumentation={onNavigateToDocumentation}
      />


        

        
        {/* Authentication Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-[var(--border-color)]">
              <div className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{authMode === 'login' ? 'Login to Continue' : 'Create Account'}</h2>
                <button
                  onClick={closeAuthModal}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <AuthPage
                  onAuthSuccess={handleAuthSuccess}
                  initialMode={authMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-900">Choose Payment Method</h2>
                <button
                  onClick={closePaymentModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <PaymentMethodSelector
                  planId={selectedPlan.id}
                  planName={selectedPlan.name}
                  planPrice={selectedPlan.price}
                  onPaymentInitiated={handlePaymentInitiated}
                  onError={handlePaymentError}
                />
              </div>
            </div>
          </div>
        )}



        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <LoadingSpinner size="lg" color="white" />
          </div>
        )}
      </div>
    );
  }

  const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  onLogin, 
  onNavigateToPricing,
  onNavigateToDocumentation,
  onNavigateToDownloads,
  onAuthSuccess 
}) => {
    return (
      <>
        <DebugInfo show={import.meta.env.MODE === 'development' || window.location.search.includes('debug=true')} />
        <LandingPageContent
          onGetStarted={onGetStarted}
          onLogin={onLogin}
          onNavigateToPricing={onNavigateToPricing}
          onNavigateToDocumentation={onNavigateToDocumentation}
          onNavigateToDownloads={onNavigateToDownloads}
          onAuthSuccess={onAuthSuccess}
        />
      </>
    );
  };

  export default LandingPage;