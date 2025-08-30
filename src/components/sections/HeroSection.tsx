import React from 'react';
import { ArrowRight } from 'lucide-react';
import BrainIcon from '../icons/BrainIcon';
import TrophyIcon from '../icons/TrophyIcon';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLElement>;
  onNavigateToDownloads?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  heroRef,
  onNavigateToDownloads
}) => {
  return (
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
              <span className="text-blue-400 font-semibold"> practice questions</span>, 
              <span className="text-purple-400 font-semibold"> real clinical cases</span>, and 
              <span className="text-green-400 font-semibold"> personalized study insights</span> that actually help you learn.
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
  );
};

export default HeroSection;
