import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsConditionsPageProps {
  onBackToLanding: () => void;
}

const TermsConditionsPage: React.FC<TermsConditionsPageProps> = ({ onBackToLanding }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToLanding}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </button>
            </div>
            <div className="text-2xl font-bold text-white">
              MedMaster
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <h1 className="text-4xl font-bold text-white mb-8">Terms & Conditions</h1>
          
          <div className="text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using MedMaster's educational platform and services, you accept and agree to be bound 
                by the terms and provision of this agreement. If you do not agree to abide by the above, please do not 
                use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="mb-4">
                MedMaster provides online medical education services including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Interactive medical question banks and practice tests</li>
                <li>Clinical case studies and scenarios</li>
                <li>Spaced repetition learning system (SRS)</li>
                <li>Progress tracking and analytics</li>
                <li>Educational content for medical professionals and students</li>
                <li>Subscription-based premium features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts and Registration</h2>
              <p className="mb-4">
                To access certain features of our service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Subscription and Payment Terms</h2>
              <p className="mb-4">
                Our premium services are available through subscription plans:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Subscription fees are charged in advance on a monthly or annual basis</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>We reserve the right to change subscription prices with 30 days notice</li>
                <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
                <li>You may cancel your subscription at any time through your account settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Acceptable Use Policy</h2>
              <p className="mb-4">
                You agree not to use the service to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Share your account credentials with others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Distribute malware or engage in harmful activities</li>
                <li>Copy, reproduce, or distribute our content without permission</li>
                <li>Use automated tools to access our service</li>
                <li>Interfere with the proper functioning of the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property Rights</h2>
              <p className="mb-4">
                All content, features, and functionality of MedMaster are owned by us and are protected by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Copyright, trademark, and other intellectual property laws</li>
                <li>International copyright treaties and conventions</li>
              </ul>
              <p className="mt-4">
                You may not reproduce, distribute, modify, or create derivative works of our content without 
                explicit written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Educational Purpose Disclaimer</h2>
              <p>
                MedMaster is designed for educational purposes only. Our content should not be used as a substitute 
                for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare 
                providers with questions regarding medical conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, MedMaster shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, including but not limited to loss of profits, data, or 
                other intangible losses resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Service Availability</h2>
              <p>
                We strive to maintain high service availability but do not guarantee uninterrupted access. We may 
                temporarily suspend service for maintenance, updates, or due to circumstances beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
              <p className="mb-4">
                We may terminate or suspend your account and access to the service:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>For violation of these terms</li>
                <li>For non-payment of subscription fees</li>
                <li>At our sole discretion with or without notice</li>
              </ul>
              <p className="mt-4">
                Upon termination, your right to use the service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of Pakistan, 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of material changes 
                via email or through our service. Continued use of the service after changes constitutes acceptance 
                of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms & Conditions, please contact us:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                <p><strong>Email:</strong> contact@medmaster.site</p>
                <p><strong>Address:</strong> Peshawar, Khyber Pakhtunkhwa, 25000, Pakistan</p>

              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsConditionsPage;