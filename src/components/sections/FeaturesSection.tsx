import React from 'react';
import BrainIcon from '../icons/BrainIcon';
import TrophyIcon from '../icons/TrophyIcon';
import BugIcon from '../icons/BugIcon';
import ChartBarIcon from '../icons/ChartBarIcon';

interface FeaturesSectionProps {
  featuresRef: React.RefObject<HTMLElement>;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ featuresRef }) => {
  return (
    <section ref={featuresRef} id="features" className="py-20 bg-gray-900">
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
              <li>• Expert explanations</li>
            </ul>
          </div>

          {/* Smart Flashcards */}
          <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-6">
              <BugIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Smart Flashcards</h3>
            <p className="text-gray-400 mb-4">
              AI-powered flashcards that adapt to your learning style. Focus on what you don't know, skip what you've mastered.
            </p>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Spaced repetition algorithm</li>
              <li>• Visual memory aids</li>
              <li>• Progress tracking</li>
            </ul>
          </div>

          {/* Performance Analytics */}
          <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Performance Analytics</h3>
            <p className="text-gray-400 mb-4">
              Get detailed insights into your learning patterns. See exactly where you're strong and where you need more practice.
            </p>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Detailed progress reports</li>
              <li>• Weakness identification</li>
              <li>• Study recommendations</li>
            </ul>
          </div>

          {/* Global Leaderboard */}
          <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-6">
              <TrophyIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Global Leaderboard</h3>
            <p className="text-gray-400 mb-4">
              Compete with medical students worldwide. Climb the ranks and earn achievements as you master each topic.
            </p>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Weekly competitions</li>
              <li>• Achievement badges</li>
              <li>• University rankings</li>
            </ul>
          </div>

          {/* Offline Access */}
          <div className="bg-gray-800 rounded-xl p-8 hover:bg-gray-750 transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
              <BrainIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Offline Access</h3>
            <p className="text-gray-400 mb-4">
              Study anywhere, anytime. Download content for offline access and never miss a study session.
            </p>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Download for offline use</li>
              <li>• Sync across devices</li>
              <li>• No internet required</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
