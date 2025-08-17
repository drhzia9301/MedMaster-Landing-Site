import React, { useState } from 'react';

interface DocumentationPageProps {
  onBack: () => void;
}

const DocumentationPage: React.FC<DocumentationPageProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📚' },
    { id: 'study-modes', title: 'Study Modes', icon: '🧠' },
    { id: 'srs-system', title: 'Spaced Repetition', icon: '⏰' },
    { id: 'gamification', title: 'Gamification', icon: '🎮' },
    { id: 'analytics', title: 'Analytics & Progress', icon: '📊' },
    { id: 'leaderboards', title: 'Leaderboards', icon: '🏆' },
    { id: 'achievements', title: 'Achievements', icon: '🏅' },
    { id: 'tips', title: 'Study Tips', icon: '🎯' },
    { id: 'support', title: 'Support', icon: '🔗' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mr-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            MedMaster Complete Guide
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sticky top-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Navigation</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-3">{section.icon}</span>
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {/* Overview Section */}
                {activeSection === 'overview' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-3">📚</span>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white m-0">
                        What is MedMaster?
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                      MedMaster is a comprehensive study platform designed specifically for medical students. It combines scientifically-proven learning techniques with engaging gamification to help you master medical knowledge efficiently and effectively.
                    </p>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Content Library at a Glance</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <span className="text-orange-500 mr-2">⚡</span>
                          <span className="text-gray-700 dark:text-gray-300">7,000+ QuickFire questions</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-blue-500 mr-2">📄</span>
                          <span className="text-gray-700 dark:text-gray-300">3,000+ clinical cases</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-purple-500 mr-2">🧠</span>
                          <span className="text-gray-700 dark:text-gray-300">500+ smart flashcards</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-500 mr-2">📚</span>
                          <span className="text-gray-700 dark:text-gray-300">Hundreds of articles</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Subject Coverage</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🦠 Microbiology</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• Bacteria (Gram-positive & Gram-negative)</li>
                          <li>• Viruses (DNA & RNA viruses)</li>
                          <li>• Fungi (Yeasts & Molds)</li>
                          <li>• Parasites (Protozoa & Helminths)</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💊 Pharmacology</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• Drug mechanisms of action</li>
                          <li>• Pharmacokinetics & Pharmacodynamics</li>
                          <li>• Drug interactions & side effects</li>
                          <li>• Clinical applications</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Why Choose MedMaster?</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4">
                        <span className="text-4xl block mb-2">⏰</span>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Scientifically Proven</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Uses SM2 spaced repetition algorithm for optimal retention</p>
                      </div>
                      <div className="text-center p-4">
                        <span className="text-4xl block mb-2">🏆</span>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Engaging & Fun</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Gamification keeps you motivated with achievements and leaderboards</p>
                      </div>
                      <div className="text-center p-4">
                        <span className="text-4xl block mb-2">📊</span>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Data-Driven</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Detailed analytics help you identify and focus on weak areas</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Study Modes Section */}
                {activeSection === 'study-modes' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-3">🧠</span>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white m-0">
                        Study Modes
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                      MedMaster offers four distinct study modes, each designed for different learning objectives and study preferences.
                    </p>

                    <div className="space-y-8">
                      {/* QuickFire Mode */}
                      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">⚡</span>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">QuickFire Mode</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Rapid-fire multiple choice questions designed to test your knowledge quickly and efficiently. Perfect for active recall and identifying knowledge gaps.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Customizable difficulty levels (Easy, Moderate, Hard)</li>
                              <li>• Subject-specific filtering</li>
                              <li>• Real-time scoring with combo multipliers</li>
                              <li>• Instant feedback with detailed explanations</li>
                              <li>• Timer options for exam simulation</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Best For:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Quick knowledge assessment</li>
                              <li>• Warm-up sessions before studying</li>
                              <li>• Reviewing specific topics</li>
                              <li>• Building confidence before exams</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Clinical Cases */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">🏥</span>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">Clinical Cases</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Realistic patient scenarios that test your clinical reasoning and diagnostic skills. Each case includes patient history, symptoms, and step-by-step problem-solving.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Real-world patient scenarios</li>
                              <li>• Progressive case revelation</li>
                              <li>• Multiple diagnostic pathways</li>
                              <li>• Detailed explanations and reasoning</li>
                              <li>• Difficulty progression system</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Best For:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Developing clinical reasoning</li>
                              <li>• Exam-style practice</li>
                              <li>• Bridging theory to practice</li>
                              <li>• Building diagnostic confidence</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Flashcards */}
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">🧠</span>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">Smart Flashcards</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Intelligent flashcards powered by spaced repetition algorithm. Focus on high-yield facts, drug mechanisms, and organism characteristics.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Spaced repetition scheduling</li>
                              <li>• Detailed organism/drug profiles</li>
                              <li>• Multiple information layers</li>
                              <li>• Progress tracking per card</li>
                              <li>• Category-based organization</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Best For:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Long-term retention</li>
                              <li>• Memorizing key facts</li>
                              <li>• Daily review sessions</li>
                              <li>• Weak area reinforcement</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Article Review */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">📚</span>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">Article Review</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Concise, focused articles covering essential medical topics. Each article includes integrated comprehension checks and key takeaway summaries.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Features:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Bite-sized topic summaries</li>
                              <li>• Integrated comprehension checks</li>
                              <li>• Key takeaway highlights</li>
                              <li>• Progressive difficulty</li>
                              <li>• Cross-referenced content</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Best For:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Topic introduction</li>
                              <li>• Quick revision</li>
                              <li>• Concept reinforcement</li>
                              <li>• Comprehensive understanding</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                   </div>
                 )}

                {/* SRS System Section */}
                {activeSection === 'srs-system' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-3">⏰</span>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white m-0">
                        Spaced Repetition System (SRS)
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                      MedMaster uses the scientifically-proven SM2 algorithm (the same one used by Anki) to optimize your learning schedule and maximize long-term retention.
                    </p>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How It Works</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📊 Smart Scheduling</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            Cards appear based on your performance and memory strength. Difficult cards show up more frequently, while mastered cards appear less often.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Adaptive Learning</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            The system adapts to your individual learning pace, ensuring optimal challenge without overwhelming you.
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">SRS Configuration Options</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Daily Study Limits</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• New Cards Per Day: 1-50 cards (customize based on your schedule)</li>
                          <li>• Maximum Reviews Per Day: 1-200 cards (control your daily workload)</li>
                          <li>• Study Load Preview: See estimated daily study time</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Content Selection</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• Category Selection: Choose specific medical categories</li>
                          <li>• Subcategory Filtering: Focus on particular topics</li>
                          <li>• Difficulty Levels: Easy, Moderate, and Hard options</li>
                          <li>• Real-time Question Counts: See available content for each selection</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Review Status Tracking</h4>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• Card Statistics: Total, due, learning, and mature cards</li>
                          <li>• Progress Overview: Visual progress bars</li>
                          <li>• Real-time Updates: Refresh statistics anytime</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Pro Tip</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Start with 5-10 new cards per day and gradually increase as you get comfortable. Consistency is more important than volume!
                      </p>
                    </div>
                  </div>
                )}

                {/* Gamification Section */}
                {activeSection === 'gamification' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-3">🎮</span>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white m-0">
                        Gamification Features
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                      Stay motivated and engaged with MedMaster's comprehensive gamification system designed to make learning fun and rewarding.
                    </p>

                    <div className="space-y-8">
                      {/* XP and Scoring System */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">⭐</span>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">XP & Scoring System</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Earn XP Points For:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Correct answers in QuickFire mode</li>
                              <li>• Completing clinical cases</li>
                              <li>• Reviewing flashcards</li>
                              <li>• Reading articles</li>
                              <li>• Daily study streaks</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Combo Multipliers:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• 2x multiplier for 5 correct answers in a row</li>
                              <li>• 3x multiplier for 10 correct answers in a row</li>
                              <li>• 5x multiplier for 15+ correct answers in a row</li>
                              <li>• Multipliers are retained between sessions</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Avatar System */}
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">👥</span>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">Avatar & Customization</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Avatar Selection:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• 8 unique avatar designs to choose from</li>
                              <li>• Personalize your profile appearance</li>
                              <li>• Avatar frames unlock with achievements</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Unlockable Frames:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Bronze, Silver, Gold, and Platinum frames</li>
                              <li>• Special event frames</li>
                              <li>• Achievement-based unlocks</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Daily Challenges */}
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">🎯</span>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">Daily Challenges & Streaks</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Daily Goals:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Complete a certain number of questions</li>
                              <li>• Maintain study streaks</li>
                              <li>• Achieve target accuracy rates</li>
                              <li>• Bonus XP for goal completion</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Streak Rewards:</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• 7-day streak: Bonus XP multiplier</li>
                              <li>• 30-day streak: Special achievement</li>
                              <li>• 100-day streak: Exclusive avatar frame</li>
                              <li>• Streak protection for missed days</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analytics Section */}
                {activeSection === 'analytics' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-3">📊</span>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white m-0">
                        Analytics & Progress Tracking
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                      Get detailed insights into your learning progress with comprehensive analytics that help you identify strengths, weaknesses, and optimize your study strategy.
                    </p>

                    <div className="space-y-8">
                      {/* Performance Metrics */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📊 Overall Statistics</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Total questions answered</li>
                              <li>• Overall accuracy rate</li>
                              <li>• Study time tracking</li>
                              <li>• Session completion rates</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📈 Progress Trends</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Weekly/monthly progress charts</li>
                              <li>• Accuracy improvement over time</li>
                              <li>• Study consistency tracking</li>
                              <li>• Performance predictions</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Subject Breakdown</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Performance by subject area</li>
                              <li>• Difficulty level analysis</li>
                              <li>• Topic-specific weak areas</li>
                              <li>• Recommended focus areas</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Learning Insights */}
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">AI-Powered Learning Insights</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🤖 Personalized Recommendations</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Suggested study topics based on performance</li>
                              <li>• Optimal study session timing</li>
                              <li>• Difficulty level recommendations</li>
                              <li>• Review schedule optimization</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📋 Detailed Reports</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Weekly performance summaries</li>
                              <li>• Learning pattern analysis</li>
                              <li>• Retention rate tracking</li>
                              <li>• Goal achievement progress</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Study Patterns */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Study Pattern Analysis</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⏰ Time Management</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Peak performance hours identification</li>
                              <li>• Session length optimization</li>
                              <li>• Break time recommendations</li>
                              <li>• Study schedule suggestions</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🧠 Learning Efficiency</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Most effective study modes for you</li>
                              <li>• Question type performance analysis</li>
                              <li>• Memory retention patterns</li>
                              <li>• Spaced repetition effectiveness</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Leaderboards Section */}
                {activeSection === 'leaderboards' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-3">🏆</span>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white m-0">
                        Leaderboards & Competition
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                      Compete with fellow medical students worldwide and climb the ranks through consistent study and high performance.
                    </p>

                    <div className="space-y-8">
                      {/* Global Leaderboards */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Global Rankings</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🏆 Weekly Leaderboard</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Resets every Monday for fresh competition</li>
                              <li>• Based on XP earned during the week</li>
                              <li>• Top 10 players receive special recognition</li>
                              <li>• Weekly winners get exclusive rewards</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎖️ All-Time Rankings</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Cumulative XP from all sessions</li>
                              <li>• Prestigious titles for top performers</li>
                              <li>• Hall of Fame for legendary players</li>
                              <li>• Special avatar frames for top 100</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Scoring System */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Leaderboard Scoring</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚡ QuickFire Points</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Base points per correct answer</li>
                              <li>• Combo multiplier bonuses</li>
                              <li>• Difficulty level multipliers</li>
                              <li>• Speed bonus for quick answers</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🏥 Clinical Case Points</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Higher points for complex cases</li>
                              <li>• Perfect case completion bonuses</li>
                              <li>• Diagnostic accuracy rewards</li>
                              <li>• Time efficiency bonuses</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Activity Bonuses</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Daily study streak multipliers</li>
                              <li>• Flashcard review bonuses</li>
                              <li>• Article completion points</li>
                              <li>• Achievement unlock bonuses</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Weekly Prizes */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Weekly Prizes & Recognition</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🥇 Winner Rewards</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Exclusive "Champion" avatar frame</li>
                              <li>• Special winner badge for profile</li>
                              <li>• Featured on winner's showcase</li>
                              <li>• Bonus XP for the following week</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🏅 Top 10 Benefits</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Special leaderboard badge</li>
                              <li>• Priority access to new features</li>
                              <li>• Exclusive avatar frame options</li>
                              <li>• Recognition in weekly newsletter</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Achievements Section */}
                {activeSection === 'achievements' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-3">🏅</span>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white m-0">
                        Achievements & Badges
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                      Unlock achievements as you progress through your medical studies. Each achievement represents a significant milestone in your learning journey.
                    </p>

                    <div className="space-y-8">
                      {/* Question-Based Achievements */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Question Mastery Achievements</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🦠 Microbiology Mastery</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Bug Hunter: Answer 100 microbiology questions</li>
                              <li>• Microbe Slayer: Answer 1,000 microbiology questions</li>
                              <li>• Infection Fighter: Answer 2,500 microbiology questions</li>
                              <li>• Microbe Master: Answer 5,000 microbiology questions</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💊 Pharmacology Mastery</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Drug Discoverer: Answer 100 pharmacology questions</li>
                              <li>• Pill Pusher: Answer 1,000 pharmacology questions</li>
                              <li>• Pharma Expert: Answer 2,500 pharmacology questions</li>
                              <li>• Medicine Maestro: Answer 5,000 pharmacology questions</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Clinical Case Achievements */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Clinical Excellence</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🏥 Case Completion</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Case Cracker: Complete your first clinical case</li>
                              <li>• Case Solver: Complete 50 clinical cases</li>
                              <li>• Case Expert: Complete 250 clinical cases</li>
                              <li>• Case Virtuoso: Complete 500 clinical cases</li>
                              <li>• Senior Resident: Complete 1,000 clinical cases</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Performance Excellence</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Top of the Class: Get a perfect score on a clinical case</li>
                              <li>• Diagnostic Genius: Achieve 90%+ accuracy on 10 cases</li>
                              <li>• Clinical Reasoning Master: Perfect scores on 5 complex cases</li>
                              <li>• Future Doctor: Maintain 85%+ accuracy over 100 cases</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Performance & Streak Achievements */}
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Performance & Consistency</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🔥 Streak Achievements</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Study Starter: 3-day study streak</li>
                              <li>• Consistent Learner: 7-day study streak</li>
                              <li>• Dedicated Student: 30-day study streak</li>
                              <li>• Study Machine: 100-day study streak</li>
                              <li>• Legend: 365-day study streak</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚡ Speed & Accuracy</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Quick Draw: Answer 10 questions in under 2 minutes</li>
                              <li>• Sharpshooter: Achieve 95% accuracy in a session</li>
                              <li>• Perfect Storm: 20 correct answers in a row</li>
                              <li>• Unstoppable: 50 correct answers in a row</li>
                              <li>• Legendary: 100 correct answers in a row</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Special Achievements */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Special & Milestone Achievements</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">👑 Ultimate Achievements</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Med Master: Answer 10,000 questions correctly (combined)</li>
                              <li>• Knowledge Seeker: Complete all available content</li>
                              <li>• Perfectionist: Achieve 100% in all categories</li>
                              <li>• Hall of Fame: Top 10 all-time leaderboard</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎉 Milestone Rewards</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Early Adopter: Join during beta period</li>
                              <li>• Community Builder: Refer 5 friends</li>
                              <li>• Feedback Champion: Submit valuable feedback</li>
                              <li>• Anniversary: Study for one full year</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Study Tips Section */}
                {activeSection === 'tips' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-3">🎯</span>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white m-0">
                        Study Tips & Best Practices
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                      Maximize your learning efficiency with these proven study strategies and tips from successful medical students.
                    </p>

                    <div className="space-y-8">
                      {/* General Study Strategy */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">General Study Strategy</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📚 Effective Study Routine</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Start with QuickFire:</strong> Use it to identify weak areas and warm up your brain</li>
                              <li>• <strong>Deep dive with Cases:</strong> Practice clinical reasoning on topics you struggled with</li>
                              <li>• <strong>Reinforce with Flashcards:</strong> Convert mistakes into flashcards for daily review</li>
                              <li>• <strong>Consolidate with Articles:</strong> Read comprehensive summaries to fill knowledge gaps</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">⏰ Time Management</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Short & Frequent:</strong> 15-30 minute sessions are more effective than marathon study</li>
                              <li>• <strong>Consistency over Intensity:</strong> Daily 20-minute sessions beat weekly 3-hour cramming</li>
                              <li>• <strong>Peak Hours:</strong> Study during your most alert hours (usually morning)</li>
                              <li>• <strong>Break Time:</strong> Take 5-10 minute breaks between study sessions</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Mode-Specific Tips */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Mode-Specific Tips</h3>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚡ QuickFire Mode Tips</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Read questions carefully - don't rush through them</li>
                              <li>• Use elimination method for difficult questions</li>
                              <li>• Pay attention to explanations, especially for wrong answers</li>
                              <li>• Start with easier difficulties and gradually increase</li>
                              <li>• Use filters to focus on specific weak areas</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🏥 Clinical Cases Tips</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Think step-by-step: History → Physical → Tests → Diagnosis</li>
                              <li>• Consider differential diagnoses before settling on one</li>
                              <li>• Pay attention to patient demographics and risk factors</li>
                              <li>• Review the explanation even if you got it right</li>
                              <li>• Practice pattern recognition for common presentations</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🧠 Flashcard Tips</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Be honest with your confidence ratings</li>
                              <li>• Review cards daily, even if just for 5 minutes</li>
                              <li>• Focus on understanding, not just memorization</li>
                              <li>• Create mental associations and mnemonics</li>
                              <li>• Don't skip difficult cards - they need the most attention</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* SRS Optimization */}
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">SRS Optimization</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">🎯 Getting Started</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Start Small:</strong> Begin with 5-10 new cards per day</li>
                              <li>• <strong>Build Gradually:</strong> Increase by 2-5 cards weekly as you get comfortable</li>
                              <li>• <strong>Find Your Limit:</strong> Stop increasing when reviews become overwhelming</li>
                              <li>• <strong>Consistency is Key:</strong> Better to do fewer cards daily than many sporadically</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📊 Advanced Strategies</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Honest Ratings:</strong> Rate cards based on actual confidence, not desired outcome</li>
                              <li>• <strong>Review Backlog:</strong> Prioritize overdue reviews over new cards</li>
                              <li>• <strong>Difficult Cards:</strong> Don't avoid them - they need the most practice</li>
                              <li>• <strong>Regular Breaks:</strong> Take study breaks to prevent burnout</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Motivation & Mindset */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Motivation & Mindset</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">🔥 Staying Motivated</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Set Small Goals:</strong> Aim for daily achievements rather than distant milestones</li>
                              <li>• <strong>Track Progress:</strong> Use the analytics to see your improvement over time</li>
                              <li>• <strong>Celebrate Wins:</strong> Acknowledge achievements and streaks</li>
                              <li>• <strong>Join Community:</strong> Connect with other medical students for support</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">🧠 Growth Mindset</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Embrace Mistakes:</strong> Wrong answers are learning opportunities</li>
                              <li>• <strong>Focus on Process:</strong> Consistency matters more than perfection</li>
                              <li>• <strong>Be Patient:</strong> Medical knowledge takes time to build</li>
                              <li>• <strong>Stay Curious:</strong> Ask "why" and "how" for deeper understanding</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Support Section */}
                {activeSection === 'support' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <span className="text-4xl mr-3">🔗</span>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white m-0">
                        Support & Help
                      </h2>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                      Need help or have questions? We're here to support your learning journey.
                    </p>

                    <div className="space-y-8">
                      {/* Contact Information */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Get in Touch</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📧 Contact Options</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Email Support:</strong> support@medmaster.com</li>
                              <li>• <strong>Feature Requests:</strong> features@medmaster.com</li>
                              <li>• <strong>Bug Reports:</strong> bugs@medmaster.com</li>
                              <li>• <strong>General Inquiries:</strong> hello@medmaster.com</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">⏰ Response Times</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• <strong>Technical Issues:</strong> Within 24 hours</li>
                              <li>• <strong>Account Problems:</strong> Within 12 hours</li>
                              <li>• <strong>Feature Requests:</strong> Within 48 hours</li>
                              <li>• <strong>General Questions:</strong> Within 24 hours</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Common Issues */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Common Issues & Solutions</h3>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🔄 Sync Issues</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                              If your progress isn't syncing across devices:
                            </p>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Check your internet connection</li>
                              <li>• Log out and log back in</li>
                              <li>• Clear browser cache and cookies</li>
                              <li>• Contact support if issues persist</li>
                            </ul>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Performance Issues</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                              If the app is running slowly:
                            </p>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                              <li>• Close other browser tabs</li>
                              <li>• Update your browser to the latest version</li>
                              <li>• Disable browser extensions temporarily</li>
                              <li>• Try using a different browser</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Community Resources */}
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Community & Resources</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">👥 Study Groups</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• Join our Discord community for study groups</li>
                              <li>• Participate in weekly study challenges</li>
                              <li>• Share tips and strategies with peers</li>
                              <li>• Get motivation from fellow students</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📚 Additional Resources</h4>
                            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                              <li>• Study guides and cheat sheets</li>
                              <li>• Video tutorials and walkthroughs</li>
                              <li>• Medical school preparation tips</li>
                              <li>• Career guidance and advice</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;