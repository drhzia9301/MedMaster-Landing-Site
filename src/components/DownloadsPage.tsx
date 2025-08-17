import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';

interface DownloadsPageProps {
  onBackToLanding?: () => void;
  onGetStarted?: () => void;
  onLogin?: () => void;
}

const DownloadsPage: React.FC<DownloadsPageProps> = ({ onBackToLanding }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBackToLanding || (() => window.history.back())}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 mr-4"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-white">
                Med<span className="text-blue-400">Master</span> Downloads
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 pt-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6 animate-fadeIn">
              <Download className="w-4 h-4 mr-2" />
              Available on Multiple Platforms
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Download <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent">MedMaster</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get MedMaster on your preferred platform and study anywhere, anytime. Access thousands of medical questions, clinical cases, and study tools offline.
            </p>
          </div>

          {/* Downloads Section */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Windows Download */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Windows App</h3>
                <p className="text-blue-100 mb-6">
                  Download the desktop version for Windows with full offline support and enhanced performance.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-blue-100 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Offline access to all content
                  </div>
                  <div className="flex items-center text-blue-100 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Enhanced performance
                  </div>
                  <div className="flex items-center text-blue-100 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Auto-sync with cloud
                  </div>
                </div>
                <button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  Download for Windows
                </button>
                <p className="text-blue-200 text-sm mt-2">Coming Soon</p>
              </div>
            </div>

            {/* Android Download */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 hover:from-green-700 hover:to-green-900 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Android App</h3>
                <p className="text-green-100 mb-6">
                  Get the mobile app for Android with push notifications, offline mode, and seamless sync.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-green-100 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Push notifications
                  </div>
                  <div className="flex items-center text-green-100 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Offline study mode
                  </div>
                  <div className="flex items-center text-green-100 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Cross-device sync
                  </div>
                </div>
                <button className="w-full bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  Download APK
                </button>
                <p className="text-green-200 text-sm mt-2">Coming Soon</p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default DownloadsPage;