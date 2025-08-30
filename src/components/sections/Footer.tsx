import React from 'react';
import BugIcon from '../icons/BugIcon';

interface FooterProps {
  scrollToSection: (elementId: string) => void;
  onNavigateToPricing?: () => void;
  onNavigateToDocumentation?: () => void;
}

const Footer: React.FC<FooterProps> = ({
  scrollToSection,
  onNavigateToPricing,
  onNavigateToDocumentation
}) => {
  return (
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
              <p>Email: contact@medmaster.site</p>
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
            <a href="mailto:contact@medmaster.site" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
