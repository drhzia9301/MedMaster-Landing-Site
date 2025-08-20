import React, { useState, useEffect } from 'react';
import { ArrowRight, Medal, X, Book } from 'lucide-react';
import BrainIcon from './icons/BrainIcon';
import TrophyIcon from './icons/TrophyIcon';
import BugIcon from './icons/BugIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import { useAnalytics } from '../hooks/useAnalytics';
import { useIntersectionObserver } from '../hooks/useLazyLoading';
import LazyImage from './LazyImage';
import FAQSection from './FAQSection';
import AuthPage from './AuthPage';
import LandingLoginPage from './LandingLoginPage';
import LandingSignupPage from './LandingSignupPage';
import LandingProfileButton from './LandingProfileButton';
import { useLandingAuth } from '../contexts/LandingAuthContext';
import { PaymentSession } from '../services/paymentService';
import { toast } from 'sonner';

import LoadingSpinner from './LoadingSpinner';
import PaymentMethodSelector from './PaymentMethodSelector';
// Using custom icons for main features

// Mix of custom icons and some Lucide icons for UI elements

interface LandingPageProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
  onNavigateToPricing?: () => void;
  onNavigateToDocumentation?: () => void;
  onNavigateToDownloads?: () => void;
  onAuthSuccess?: (token: string, email: string, username: string, subscriptionType?: string) => void;
}

function LandingPageContent({ onAuthSuccess, onNavigateToPricing, onNavigateToDocumentation, onNavigateToDownloads }: LandingPageProps) {
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
  const { isAuthenticated } = useLandingAuth();
  
  console.log('🏠 LandingPage render - isAuthenticated:', isAuthenticated);

  
  const { trackPageView, trackEvent } = useAnalytics();
  const { targetRef: heroRef, isIntersecting: heroVisible } = useIntersectionObserver({ threshold: 0.5 });
  const { targetRef: featuresRef, isIntersecting: featuresVisible } = useIntersectionObserver({ threshold: 0.3 });


  // Track page view on mount
  useEffect(() => {
    trackPageView('/landing');
    setIsLoading(false);
  }, [trackPageView]);

  // Track section views
  useEffect(() => {
    if (heroVisible) trackEvent('hero_section_viewed');
  }, [heroVisible, trackEvent]);

  useEffect(() => {
    if (featuresVisible) trackEvent('features_section_viewed');
  }, [featuresVisible, trackEvent]);


  
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
    setShowLandingLogin(true);
  };

  const handleShowLandingSignup = () => {
    setShowLandingSignup(true);
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
  const handleAuthSuccess = (token: string, email: string, username: string, subscriptionType?: string) => {
    setShowAuthModal(false);
    
    // Call parent auth success handler if provided
    onAuthSuccess?.(token, email, username, subscriptionType);
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
  }, [trackEvent]);

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

      
      {/* Header */}
      <style>{`
        .section-highlight {
          animation: highlight 1.5s ease-in-out;
        }
        @keyframes highlight {
          0%, 100% { box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }
        }
      `}</style>
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Med<span className="text-blue-400">Master</span>
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('hero')} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">Home</button>
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">Features</button>
              <button onClick={() => scrollToSection('preview')} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">Preview</button>
              <button onClick={onNavigateToDocumentation} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">Documentation</button>
              <button onClick={onNavigateToPricing} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">Pricing</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer">Contact</button>
            </nav>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <LandingProfileButton onGoToApp={handleGoToApp} />
              ) : (
                <>                  <button
                    onClick={handleShowLandingLogin}
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 hidden md:block"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleShowLandingSignup}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hidden md:block"
                  >
                    Sign Up
                  </button>
                </>
              )}
              {/* Mobile menu button */}
              <button 
                className="md:hidden text-gray-300 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900/98 backdrop-blur-sm border-t border-gray-800 animate-fadeIn">
            <div className="px-4 py-4 space-y-4">
              <button 
                className="block w-full text-left text-gray-300 hover:text-white transition-colors" 
                onClick={() => {
                  scrollToSection('hero');
                  setMobileMenuOpen(false);
                }}
              >
                Home
              </button>
              <button 
                className="block w-full text-left text-gray-300 hover:text-white transition-colors" 
                onClick={() => {
                  scrollToSection('features');
                  setMobileMenuOpen(false);
                }}
              >
                Features
              </button>
              <button 
                className="block w-full text-left text-gray-300 hover:text-white transition-colors" 
                onClick={() => {
                  scrollToSection('preview');
                  setMobileMenuOpen(false);
                }}
              >
                Preview
              </button>
              <button
                className="block w-full text-left text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  onNavigateToDocumentation?.();
                  setMobileMenuOpen(false);
                }}
              >
                Documentation
              </button>
              <button
                className="block w-full text-left text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  onNavigateToPricing?.();
                  setMobileMenuOpen(false);
                }}
              >
                Pricing
              </button>
              <button
                className="block w-full text-left text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  scrollToSection('contact');
                  setMobileMenuOpen(false);
                }}
              >
                Contact
              </button>
              <div className="pt-4 border-t border-gray-700 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2">
                      <LandingProfileButton onGoToApp={handleGoToApp} />
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleGoToApp();
                      }}
                      className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      Go to App
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleShowLandingLogin();
                      }}
                      className="block w-full text-left text-gray-300 hover:text-white transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleShowLandingSignup();
                      }}
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div id="hero" ref={heroRef as React.RefObject<HTMLDivElement>} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/50 to-purple-900/30"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6 animate-fadeIn">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                The Future of Medical Education
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slideDown">
                <span className="text-white">Master</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent">
                  Medical Knowledge
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed animate-slideUp">
                Stop cramming. Start mastering. Get 
                <span className="text-blue-400 font-semibold">practice questions</span>, 
                <span className="text-purple-400 font-semibold">real clinical cases</span>, and 
                <span className="text-green-400 font-semibold">personalized study insights</span> that actually help you learn.
              </p>
              

              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-slideUp">
                <button 
                  onClick={onNavigateToDownloads}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    Download Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
                </button>
              </div>
              

            </div>
            
            {/* Right Column - Visual Element */}
            <div className="relative lg:block hidden">
              <div className="relative">
                {/* Main visual container */}
                <div className="relative w-full h-96 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                  {/* Floating elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-float">
                    <BrainIcon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg animate-float delay-1000">
                    <BrainIcon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                    <TrophyIcon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-8 grid-rows-8 gap-2 h-full">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className="bg-blue-400 rounded-sm animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Features Section */}
        <section ref={featuresRef as React.RefObject<HTMLElement>} id="features" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4 text-white">Why Choose MedMaster?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to ace your medical exams, all in one place
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quick Fire Mode */}
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all duration-500 transform hover:scale-105 hover:shadow-xl animate-slideRight">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 hover:rotate-12">
                <BrainIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Quick Fire Mode</h3>
              <p className="text-gray-400 mb-4">
                Blast through 7,000+ questions at lightning speed. Perfect your timing and accuracy with our smart spaced repetition system that actually works.
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Customizable difficulty levels</li>
                <li>• Subject-specific filtering</li>
                <li>• Real-time scoring</li>
              </ul>
            </div>

            {/* Clinical Cases */}
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6">
                <BrainIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Clinical Cases</h3>
              <p className="text-gray-400 mb-4">
                Work through 3,000+ cases that feel like the real thing. Practice your clinical reasoning before you step into the hospital.
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Real-world scenarios</li>
                <li>• Step-by-step diagnosis</li>
                <li>• Detailed explanations</li>
              </ul>
            </div>

            {/* Gamification */}
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Gamified Learning</h3>
              <p className="text-gray-400 mb-4">
                Level up while you study. Earn points, unlock cool themes, and see how you stack up against other med students. Who said studying can't be fun?
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• XP and leveling system</li>
                <li>• Unlockable themes</li>
                <li>• Achievement badges</li>
              </ul>
            </div>

            {/* Spaced Repetition */}
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-6">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Smart Learning</h3>
              <p className="text-gray-400 mb-4">
                Never forget what you've learned. Our smart review system brings back topics right when you're about to forget them.
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Adaptive scheduling</li>
                <li>• Progress tracking</li>
                <li>• Personalized review</li>
              </ul>
            </div>

            {/* Analytics */}
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-6">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Advanced Analytics</h3>
              <p className="text-gray-400 mb-4">
                See exactly where you're crushing it and where you need work. No more guessing what to study next.
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Real-time performance tracking</li>
                <li>• Predictive learning insights</li>
                <li>• Personalized study recommendations</li>
              </ul>
            </div>

            {/* Leaderboards */}
            <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <Medal className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Compete & Excel</h3>
              <p className="text-gray-400 mb-4">
                Track your progress and compete with peers. See how you rank and stay motivated with our comprehensive leaderboard system.
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Global rankings</li>
                <li>• Daily goals</li>
                <li>• Social learning</li>
              </ul>
            </div>



            {/* More Content Coming Soon */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-dashed border-yellow-500/50 rounded-xl p-8 hover:border-yellow-400/70 transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">More Content to be Added</h3>
              <p className="text-gray-400 mb-4">
                We're constantly expanding our platform with new features, subjects, and learning tools to enhance your medical education journey.
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• New subject areas</li>
                <li>• Enhanced AI features</li>
                <li>• Community features</li>
              </ul>
            </div>
          </div>
        </div>
      </section>



        {/* App Preview Section */}
      <section id="preview" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">See MedMaster in Action</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience our intuitive interface and powerful features designed for medical students
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gray-900 rounded-2xl p-8 shadow-2xl">
              <div className="relative overflow-hidden rounded-xl">
                <div className="flex transition-transform duration-500 ease-in-out" 
                     style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {screenshots.map((screenshot, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <LazyImage 
                        src={screenshot.src} 
                        alt={screenshot.alt}
                        className="w-full h-auto rounded-lg shadow-lg"
                        onLoad={() => trackEvent('screenshot_loaded', { slide: index })}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Navigation Dots */}
                <div className="flex justify-center mt-6 space-x-2">
                  {screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-blue-500 scale-125' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Screenshot Title */}
                <div className="text-center mt-4">
                  <h3 className="text-xl font-semibold text-white">
                    {screenshots[currentSlide].title}
                  </h3>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Trusted by Medical Students</h2>
            <p className="text-xl text-gray-300">Join thousands of students mastering microbiology and pharmacology</p>
          </div>

          {/* Student Testimonials Slideshow */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Student Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-400 to-purple-400 shadow-lg">
                      <img
                        src={testimonials[currentTestimonial].image}
                        alt={testimonials[currentTestimonial].name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to a default avatar if image fails to load
                          e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
                              <rect width="128" height="128" fill="#4F46E5"/>
                              <circle cx="64" cy="45" r="20" fill="white"/>
                              <circle cx="64" cy="105" r="35" fill="white"/>
                              <text x="64" y="70" text-anchor="middle" fill="#4F46E5" font-size="16" font-weight="bold">
                                ${testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
                              </text>
                            </svg>
                          `)}`
                        }}
                      />
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="flex-1 text-center md:text-left">
                    <blockquote className="text-lg md:text-xl text-gray-200 mb-4 italic">
                      "{testimonials[currentTestimonial].comment}"
                    </blockquote>
                    <div className="text-white">
                      <div className="font-bold text-xl">{testimonials[currentTestimonial].name}</div>
                      <div className="text-blue-400 font-medium">{testimonials[currentTestimonial].college}</div>
                      <div className="text-gray-400">{testimonials[currentTestimonial].year}</div>
                    </div>
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? 'bg-blue-400 scale-125'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Famous Resources Card */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
              <div className="relative z-10 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Book className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Questions Based on Famous Resources</h3>
                <p className="text-xl text-blue-100 mb-6">
                  Questions pulled from the resources you already know and trust
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="text-white font-bold text-lg">Sketchy</div>
                    <div className="text-blue-200 text-sm">Visual Learning</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="text-white font-bold text-lg">Pixorize</div>
                    <div className="text-blue-200 text-sm">Memory Palace</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="text-white font-bold text-lg">First Aid</div>
                    <div className="text-blue-200 text-sm">USMLE Prep</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="text-white font-bold text-lg">Anki</div>
                    <div className="text-blue-200 text-sm">Spaced Repetition</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



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
                      href="mailto:haroon@medmaster.com" 
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    <a 
                      href="https://linkedin.com/in/muhammad-haroon-medstudent" 
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



      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4 text-white">Get In Touch</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white font-semibold">contact@medmaster.com</p>
                    </div>
                  </div>
                  

                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Office Address</p>
                      <p className="text-white font-semibold">Peshawar, Khyber Pakhtunkhwa, 25000<br/>Pakistan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Actions */}
            <div className="flex flex-col justify-center space-y-6">
              <a 
                href="mailto:contact@medmaster.com" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Send us an Email</span>
              </a>
              

              
              <a 
                href="https://linkedin.com/company/medmaster" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-gradient-to-r from-blue-800 to-indigo-800 hover:from-blue-900 hover:to-indigo-900 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>Connect on LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <BugIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-white">MedMaster</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Empowering the next generation of medical professionals with innovative learning solutions.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>MedMaster</p>
                <p>Peshawar, Khyber Pakhtunkhwa, 25000</p>
                <p>Pakistan</p>

                <p>Email: contact@medmaster.com</p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Features</button></li>
                <li><button onClick={onNavigateToPricing} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Pricing</button></li>
                <li><button onClick={onNavigateToDocumentation} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Documentation</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</button></li>
              </ul>
            </div>
            
            {/* Legal Pages */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-conditions" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="/refund-policy" className="text-gray-400 hover:text-white transition-colors">Return/Refund Policy</a></li>
                <li><a href="/service-policy" className="text-gray-400 hover:text-white transition-colors">Service Policy</a></li>
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="text-white font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Quick Fire Mode (7,000+ Questions)</li>
                <li>Clinical Cases (3,000+ Cases)</li>
                <li>Gamified Learning System</li>
                <li>Smart Spaced Repetition</li>
                <li>Advanced Analytics</li>
                <li>Competitive Leaderboards</li>
                <li>Personalized Study Plans</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 MedMaster. All rights reserved. Empowering the next generation of medical professionals.
            </p>
            <div className="flex space-x-6">
              <a href="https://linkedin.com/company/medmaster" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="mailto:contact@medmaster.com" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>


        

        
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
      <LandingPageContent 
        onGetStarted={onGetStarted} 
        onLogin={onLogin}
        onNavigateToPricing={onNavigateToPricing}
        onNavigateToDocumentation={onNavigateToDocumentation}
        onNavigateToDownloads={onNavigateToDownloads}
        onAuthSuccess={onAuthSuccess} 
      />
    );
  };

  export default LandingPage;