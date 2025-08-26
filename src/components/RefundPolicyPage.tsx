import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface RefundPolicyPageProps {
  onBackToLanding: () => void;
}

const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onBackToLanding }) => {
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
          <h1 className="text-4xl font-bold text-white mb-8">Return & Refund Policy</h1>
          
          <div className="text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Overview</h2>
              <p>
                At MedMaster, we are committed to providing high-quality educational services. This Return & Refund Policy 
                outlines the circumstances under which refunds may be provided for our digital educational services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Digital Service Nature</h2>
              <p className="mb-4">
                MedMaster provides digital educational services including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Online access to medical question banks</li>
                <li>Interactive learning modules and case studies</li>
                <li>Progress tracking and analytics</li>
                <li>Spaced repetition learning system</li>
                <li>Premium educational content</li>
              </ul>
              <p className="mt-4">
                As these are digital services that are immediately accessible upon purchase, different refund terms 
                apply compared to physical products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. 7-Day Money-Back Guarantee</h2>
              <p className="mb-4">
                We offer a 7-day money-back guarantee for new subscribers under the following conditions:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Request must be made within 7 days of initial subscription purchase</li>
                <li>Account must not have excessive usage (more than 50% of available content accessed)</li>
                <li>No previous refunds have been issued for the same user</li>
                <li>Request must be made in good faith with valid reason</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Eligible Refund Scenarios</h2>
              <p className="mb-4">
                Refunds may be considered in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Technical Issues:</strong> Persistent technical problems preventing service access</li>
                <li><strong>Billing Errors:</strong> Incorrect charges or duplicate payments</li>
                <li><strong>Service Unavailability:</strong> Extended service outages beyond our control</li>
                <li><strong>Accidental Purchases:</strong> Unintended subscription activations (within 24 hours)</li>
                <li><strong>Medical Circumstances:</strong> Documented medical emergencies preventing service use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Non-Refundable Situations</h2>
              <p className="mb-4">
                Refunds will not be provided in the following cases:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Change of mind after the 7-day guarantee period</li>
                <li>Failure to use the service due to personal circumstances</li>
                <li>Dissatisfaction with exam results or academic performance</li>
                <li>Account suspension due to terms of service violations</li>
                <li>Requests made after significant content consumption</li>
                <li>Subscription renewals (automatic or manual) after the initial period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Refund Process</h2>
              <p className="mb-4">
                To request a refund:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Contact our support team at <strong>support@medmaster.site</strong></li>
                <li>Provide your account email and subscription details</li>
                <li>Explain the reason for your refund request</li>
                <li>Include any relevant documentation (for technical issues)</li>
                <li>Allow 3-5 business days for review and processing</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Refund Timeline</h2>
              <p className="mb-4">
                Once a refund is approved:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
                <li><strong>PayFast:</strong> 3-7 business days</li>
                <li><strong>Bank Transfer:</strong> 7-14 business days</li>
                <li><strong>Mobile Wallets (JazzCash/EasyPaisa):</strong> 1-3 business days</li>
              </ul>
              <p className="mt-4">
                Refund processing times may vary depending on your bank or payment provider.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Partial Refunds</h2>
              <p>
                In certain circumstances, we may offer partial refunds calculated on a pro-rata basis for the unused 
                portion of your subscription, particularly in cases of extended service outages or technical issues 
                that significantly impact service availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Subscription Cancellation</h2>
              <p className="mb-4">
                You can cancel your subscription at any time:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your account settings</li>
                <li>Navigate to subscription management</li>
                <li>Select "Cancel Subscription"</li>
                <li>Confirm cancellation</li>
              </ul>
              <p className="mt-4">
                Cancellation stops future billing but does not automatically trigger a refund for the current period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Dispute Resolution</h2>
              <p>
                If you disagree with our refund decision, you may escalate the matter by contacting our management team 
                at <strong>contact@medmaster.site</strong>. We will review your case within 7 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Policy Changes</h2>
              <p>
                We reserve the right to modify this refund policy at any time. Changes will be communicated via email 
                and posted on our website. The updated policy will apply to future purchases.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
              <p className="mb-4">
                For refund requests or questions about this policy:
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

export default RefundPolicyPage;