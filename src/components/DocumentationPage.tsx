import React, { useState } from 'react';

interface DocumentationPageProps {
  onBackToLanding?: () => void;
}

const DocumentationPage: React.FC<DocumentationPageProps> = ({ onBackToLanding }) => {
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
            onClick={onBackToLanding || (() => window.history.back())}
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
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      MedMaster is a study companion built specifically for medical students. It combines evidence‑based learning methods with a clean, motivating experience so you can learn faster, remember longer, and study with purpose.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Inside, you'll find a growing library of more than <strong>7,000</strong> QuickFire questions, <strong>3,000</strong> realistic clinical cases, <strong>500+</strong> smart flashcards, and hundreds of concise, high‑yield articles—curated to reflect how medicine is learned and tested.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Subject Coverage</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Current content focuses on <strong>Microbiology</strong> and <strong>Pharmacology</strong>. In Microbiology, you'll review core organisms across bacteria (Gram‑positive and Gram‑negative), viruses (DNA and RNA), fungi (yeasts and molds), and parasites (protozoa and helminths). In Pharmacology, you'll connect mechanisms of action with PK/PD principles, drug interactions and adverse effects, and real clinical applications.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Why Choose MedMaster?</h3>
                    <div className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>Scientifically grounded:</strong> Our spaced‑repetition engine implements the SM‑2 algorithm to schedule reviews at the moment they're most effective—helping you convert short‑term knowledge into durable memory.
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>Motivating by design:</strong> Achievements, streaks, and leaderboards turn consistency into a habit without distracting from what matters—mastery.
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>Driven by insight:</strong> Clear analytics highlight strengths and blind spots so you always know what to study next.
                      </p>
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
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      MedMaster offers four distinct study modes, each designed for different learning objectives and study preferences. Whether you need quick knowledge checks or deep clinical reasoning practice, there's a mode that fits your current study goals.
                    </p>

                    <div className="space-y-8">
                      {/* QuickFire Mode */}
                      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">⚡</span>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">QuickFire Mode</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          QuickFire delivers rapid‑fire multiple choice questions designed to test your knowledge quickly and efficiently. You can customize difficulty levels from Easy to Hard, filter by specific subjects, and track your performance with real‑time scoring and combo multipliers. Each question comes with instant feedback and detailed explanations, making it perfect for active recall and identifying knowledge gaps.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          <strong>Best for:</strong> Quick knowledge assessment, warm‑up sessions before studying, reviewing specific topics, and building confidence before exams. The timer options also make it excellent for exam simulation practice.
                        </p>
                      </div>

                      {/* Clinical Cases */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">🏥</span>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">Clinical Cases</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          Clinical Cases present realistic patient scenarios that test your clinical reasoning and diagnostic skills. Each case unfolds progressively, revealing patient history, symptoms, and diagnostic information step‑by‑step. You'll work through multiple diagnostic pathways with detailed explanations and reasoning, all within a difficulty progression system that grows with your expertise.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          <strong>Best for:</strong> Developing clinical reasoning skills, exam‑style practice, bridging theory to practice, and building diagnostic confidence. These cases mirror real‑world scenarios you'll encounter in clinical settings.
                        </p>
                      </div>

                      {/* Flashcards */}
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">🧠</span>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">Smart Flashcards</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          Smart Flashcards use intelligent spaced repetition scheduling to focus on high‑yield facts, drug mechanisms, and organism characteristics. Each card contains detailed profiles with multiple information layers, organized by category with individual progress tracking. The system automatically schedules reviews based on your performance, ensuring optimal retention.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          <strong>Best for:</strong> Long‑term retention, memorizing key facts, daily review sessions, and reinforcing weak areas. The spaced repetition algorithm makes this the most effective mode for building lasting knowledge.
                        </p>
                      </div>

                      {/* Article Review */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">📚</span>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">Article Review</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                          Article Review offers concise, focused articles covering essential medical topics in bite‑sized summaries. Each article includes integrated comprehension checks and highlighted key takeaways, with progressive difficulty and cross‑referenced content that connects related concepts across different topics.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          <strong>Best for:</strong> Topic introduction, quick revision, concept reinforcement, and building comprehensive understanding. These articles serve as excellent primers before diving into more intensive study modes.
                        </p>
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
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      MedMaster uses the scientifically‑proven SM‑2 algorithm (the same one used by Anki) to optimize your learning schedule and maximize long‑term retention. This evidence‑based approach ensures you review material at precisely the right intervals to strengthen memory consolidation.
                    </p>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How It Works</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        The system intelligently schedules cards based on your performance and memory strength. Difficult cards appear more frequently while mastered cards show up less often, creating a personalized learning rhythm that adapts to your individual pace. This ensures optimal challenge without overwhelming you, making every study session as effective as possible.
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Customization Options</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      You have complete control over your study experience. Set daily limits for new cards (1‑50) and maximum reviews (1‑200) to match your schedule and capacity. Choose specific medical categories and subcategories, select difficulty levels from Easy to Hard, and see real‑time question counts for each selection. The system provides comprehensive statistics including total, due, learning, and mature cards, with visual progress bars and real‑time updates available anytime.
                    </p>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      The study load preview feature estimates your daily study time, helping you plan sessions that fit your schedule. Whether you're preparing for exams or maintaining long‑term retention, the SRS adapts to support your goals while tracking your progress every step of the way.
                    </p>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Pro Tip</h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Start with 5‑10 new cards per day and gradually increase as you get comfortable. Consistency is more important than volume—daily practice with fewer cards beats sporadic sessions with many cards.
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
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Stay motivated and engaged with MedMaster's comprehensive gamification system designed to make learning fun and rewarding. Our carefully crafted progression mechanics transform studying into an engaging experience that keeps you coming back.
                    </p>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg mb-6">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">⭐</span>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">XP & Scoring System</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Earn experience points for every learning activity—correct answers in QuickFire mode, completing clinical cases, reviewing flashcards, reading articles, and maintaining daily study streaks. The system rewards consistency and accuracy with combo multipliers that scale from 2x for 5 correct answers in a row up to 5x for 15+ consecutive correct responses. These multipliers persist between sessions, encouraging sustained performance and making each study session feel rewarding.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">👥</span>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">Avatar & Customization</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Personalize your learning journey with 8 unique avatar designs and unlock special frames as you progress. Choose from Bronze, Silver, Gold, and Platinum frames, plus exclusive special event frames that commemorate your achievements. Your avatar becomes a visual representation of your dedication and progress, creating a sense of identity within your learning experience.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg mb-6">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">🎯</span>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white m-0">Daily Challenges & Streaks</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Build lasting study habits with daily goals that challenge you to complete questions, maintain accuracy rates, and sustain study streaks. Milestone rewards include bonus XP multipliers at 7 days, special achievements at 30 days, and exclusive avatar frames for reaching 100‑day streaks. The system includes streak protection for missed days, ensuring that life's interruptions don't derail your long‑term progress.
                      </p>
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
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Get detailed insights into your learning progress with comprehensive analytics that help you identify strengths, weaknesses, and optimize your study strategy. Our data‑driven approach transforms your study patterns into actionable insights.
                    </p>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Track your overall statistics including total questions answered, accuracy rates, study time, and session completion rates. Visual progress charts show weekly and monthly trends, revealing accuracy improvements over time and study consistency patterns. Subject‑specific breakdowns highlight performance by area, difficulty level analysis, and topic‑specific weak spots, providing clear recommendations for focus areas that need attention.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">AI‑Powered Learning Insights</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Our intelligent system provides personalized recommendations for study topics based on your performance, suggests optimal study session timing, and recommends appropriate difficulty levels. Weekly performance summaries and detailed learning pattern analysis track retention rates and goal achievement progress, while the AI optimizes your review schedule to maximize learning efficiency and long‑term retention.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Study Pattern Analysis</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Discover your peak performance hours and optimize session lengths with intelligent break time recommendations. The system identifies your most effective study modes, analyzes question type performance, and tracks memory retention patterns to measure spaced repetition effectiveness. These insights help you understand when, how, and what to study for maximum learning efficiency, creating a personalized study strategy that adapts to your unique learning patterns.
                      </p>
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
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Compete with fellow medical students worldwide and climb the ranks through consistent study and high performance. Our competitive environment motivates excellence while fostering a global community of learners.
                    </p>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Global Rankings</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Our dual ranking system features weekly leaderboards that reset every Monday for fresh competition, based on XP earned during the week, alongside all‑time rankings that track cumulative XP from all sessions. Weekly winners receive exclusive rewards and special recognition, while top 10 players earn special leaderboard badges. The all‑time rankings feature prestigious titles for top performers, a Hall of Fame for legendary players, and special avatar frames for the top 100 students worldwide.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Scoring System</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Points are earned through multiple activities with sophisticated scoring mechanics. QuickFire mode awards base points per correct answer, enhanced by combo multiplier bonuses, difficulty level multipliers, and speed bonuses for quick responses. Clinical cases provide higher points for complex scenarios, with perfect completion bonuses, diagnostic accuracy rewards, and time efficiency bonuses. Additional activity bonuses include daily study streak multipliers, flashcard review bonuses, article completion points, and achievement unlock bonuses.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Weekly Prizes & Recognition</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Weekly winners receive exclusive "Champion" avatar frames, special winner badges for their profiles, featured placement on the winner's showcase, and bonus XP for the following week. Top 10 finishers earn special leaderboard badges, priority access to new features, exclusive avatar frame options, and recognition in our weekly newsletter. This recognition system celebrates achievement while encouraging continued excellence and community engagement.
                      </p>
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
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Unlock achievements as you progress through your medical studies. Each achievement represents a significant milestone in your learning journey, celebrating your dedication and mastery of medical knowledge.
                    </p>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Question Mastery Achievements</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Progress through subject-specific achievement tiers as you master medical knowledge. In Microbiology, advance from Bug Hunter (100 questions) to Microbe Slayer (1,000), Infection Fighter (2,500), and ultimately Microbe Master (5,000 questions). Similarly, Pharmacology achievements progress from Drug Discoverer (100 questions) through Pill Pusher (1,000), Pharma Expert (2,500), to Medicine Maestro (5,000 questions). These achievements track your growing expertise in each medical discipline.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Clinical Excellence</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Clinical case achievements celebrate your diagnostic skills and case-solving abilities. Case completion milestones progress from Case Cracker (first case) through Case Solver (50 cases), Case Expert (250 cases), Case Virtuoso (500 cases), to Senior Resident (1,000 cases). Performance excellence achievements recognize diagnostic accuracy, including Top of the Class (perfect case score), Diagnostic Genius (90%+ accuracy on 10 cases), Clinical Reasoning Master (perfect scores on 5 complex cases), and Future Doctor (85%+ accuracy over 100 cases).
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Performance & Consistency</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Consistency achievements reward regular study habits with streak milestones from Study Starter (3 days) through Consistent Learner (7 days), Dedicated Student (30 days), Study Machine (100 days), to Legend (365 days). Speed and accuracy achievements celebrate exceptional performance, including Quick Draw (10 questions under 2 minutes), Sharpshooter (95% session accuracy), and consecutive correct answer streaks from Perfect Storm (20 in a row) to Unstoppable (50) and Legendary (100 consecutive correct answers).
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Special & Milestone Achievements</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Ultimate achievements represent the pinnacle of dedication, including Med Master (10,000 correct answers combined), Knowledge Seeker (complete all content), Perfectionist (100% in all categories), and Hall of Fame (top 10 all-time leaderboard). Milestone rewards celebrate community engagement and loyalty, featuring Early Adopter (beta participation), Community Builder (5 referrals), Feedback Champion (valuable contributions), and Anniversary (one full year of study). These special achievements recognize both exceptional performance and meaningful participation in the MedMaster community.
                      </p>
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
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Maximize your learning efficiency with these proven study strategies and tips from successful medical students. These evidence-based approaches will help you build lasting knowledge and achieve your academic goals.
                    </p>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">General Study Strategy</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Develop an effective study routine by starting with QuickFire mode to identify weak areas and warm up your brain, then deep dive with clinical cases to practice reasoning on challenging topics. Reinforce your learning by converting mistakes into flashcards for daily review, and consolidate knowledge gaps by reading comprehensive article summaries. For optimal time management, prioritize short, frequent 15-30 minute sessions over marathon study periods, as daily 20-minute sessions consistently outperform weekly 3-hour cramming sessions. Study during your peak alert hours (typically morning), and take 5-10 minute breaks between sessions to maintain focus and retention.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Mode-Specific Strategies</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        For QuickFire mode, read questions carefully without rushing, use elimination methods for difficult questions, and pay special attention to explanations for wrong answers. Start with easier difficulties and gradually increase complexity while using filters to focus on specific weak areas. In clinical cases, think systematically through History → Physical → Tests → Diagnosis, consider differential diagnoses before settling on one, and pay attention to patient demographics and risk factors. Always review explanations even for correct answers and practice pattern recognition for common presentations. When using flashcards, be honest with confidence ratings, review cards daily even for just 5 minutes, focus on understanding rather than memorization, create mental associations and mnemonics, and never skip difficult cards as they require the most attention.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">SRS Optimization</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Begin your spaced repetition journey by starting small with 5-10 new cards per day, then build gradually by increasing 2-5 cards weekly as you become comfortable. Find your sustainable limit by stopping increases when reviews become overwhelming, remembering that consistency trumps intensity—it's better to do fewer cards daily than many sporadically. For advanced optimization, rate cards based on actual confidence rather than desired outcomes, prioritize overdue reviews over new cards, embrace difficult cards rather than avoiding them, and take regular study breaks to prevent burnout and maintain long-term motivation.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Motivation & Mindset</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Maintain motivation by setting small, achievable daily goals rather than distant milestones, using analytics to track your improvement over time, celebrating achievements and streaks, and connecting with other medical students for community support. Cultivate a growth mindset by embracing mistakes as learning opportunities, focusing on consistent process over perfect outcomes, being patient as medical knowledge takes time to build, and staying curious by asking "why" and "how" for deeper understanding. Remember that every expert was once a beginner, and your consistent effort today builds the foundation for tomorrow's clinical expertise.
                      </p>
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
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      Need help or have questions? We're here to support your learning journey with comprehensive assistance and a vibrant community of medical students.
                    </p>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Get in Touch</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Our dedicated support team is ready to assist you with any questions or issues. For general support and technical assistance, reach out to support@medmaster.com. Have ideas for new features or improvements? Send your suggestions to features@medmaster.com. Encountered a bug or technical problem? Report it to bugs@medmaster.com for quick resolution. For all other inquiries, including partnerships and general questions, contact us at hello@medmaster.com. We pride ourselves on responsive support with technical issues resolved within 24 hours, account problems addressed within 12 hours, feature requests acknowledged within 48 hours, and general questions answered within 24 hours.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Common Issues & Solutions</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        If you're experiencing sync issues where your progress isn't updating across devices, start by checking your internet connection, then try logging out and back in, clearing your browser cache and cookies, and contacting support if problems persist. For performance issues where the app runs slowly, close other browser tabs to free up memory, update your browser to the latest version, temporarily disable browser extensions that might interfere, and try using a different browser if issues continue. Most technical problems can be resolved quickly with these troubleshooting steps, but our support team is always available for additional assistance.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Community & Resources</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        Join our thriving Discord community to connect with fellow medical students in study groups, participate in weekly study challenges, share effective tips and strategies, and find motivation from peers on similar academic journeys. Beyond community support, we provide extensive additional resources including comprehensive study guides and cheat sheets, detailed video tutorials and walkthroughs, valuable medical school preparation tips, and career guidance and advice from experienced professionals. Our community-driven approach ensures you're never studying alone and always have access to the collective wisdom of successful medical students and professionals.
                      </p>
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