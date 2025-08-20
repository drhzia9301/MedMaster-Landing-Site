import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ServicePolicyPageProps {
  onBackToLanding: () => void;
}

const ServicePolicyPage: React.FC<ServicePolicyPageProps> = ({ onBackToLanding }) => {
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
          <h1 className="text-4xl font-bold text-white mb-8">Service Delivery Policy</h1>
          
          <div className="text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Service Overview</h2>
              <p>
                MedMaster provides digital educational services delivered entirely online. As a digital platform, 
                we do not ship physical products. This policy outlines how our digital services are delivered and 
                what you can expect from our service delivery process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Digital Service Delivery</h2>
              <p className="mb-4">
                Our services are delivered digitally through our web platform and include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Instant Access:</strong> Immediate access to subscribed content upon payment confirmation</li>
                <li><strong>24/7 Availability:</strong> Round-the-clock access to all educational materials</li>
                <li><strong>Cross-Platform Access:</strong> Available on desktop, tablet, and mobile devices</li>
                <li><strong>Cloud-Based Storage:</strong> Your progress and data are securely stored in the cloud</li>
                <li><strong>Real-Time Updates:</strong> Automatic content updates and new feature releases</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Service Activation Timeline</h2>
              <p className="mb-4">
                Service activation times vary by payment method:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Credit/Debit Cards:</strong> Instant activation upon payment confirmation</li>
                <li><strong>PayFast:</strong> Instant to 5 minutes after successful payment</li>
                <li><strong>JazzCash/EasyPaisa:</strong> Instant to 10 minutes after payment confirmation</li>
                <li><strong>Bank Transfer:</strong> 1-3 business days after payment verification</li>
              </ul>
              <p className="mt-4">
                If your service is not activated within the expected timeframe, please contact our support team.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Service Features and Content</h2>
              <p className="mb-4">
                Upon subscription activation, you will have access to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Question Banks:</strong> Comprehensive medical question databases</li>
                <li><strong>Clinical Cases:</strong> Interactive case studies and scenarios</li>
                <li><strong>Spaced Repetition System:</strong> Personalized learning algorithm</li>
                <li><strong>Progress Analytics:</strong> Detailed performance tracking and insights</li>
                <li><strong>Mobile App:</strong> Full-featured mobile application</li>
                <li><strong>Offline Mode:</strong> Download content for offline study</li>
                <li><strong>Expert Support:</strong> Access to educational support team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Technical Requirements</h2>
              <p className="mb-4">
                To ensure optimal service delivery, please ensure your device meets these requirements:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Web Browser</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Chrome 90+ (Recommended)</li>
                    <li>Firefox 88+</li>
                    <li>Safari 14+</li>
                    <li>Edge 90+</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Internet Connection</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Minimum: 1 Mbps</li>
                    <li>Recommended: 5+ Mbps</li>
                    <li>Stable connection required</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Service Availability</h2>
              <p className="mb-4">
                We strive to maintain high service availability:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Uptime Target:</strong> 99.5% monthly uptime</li>
                <li><strong>Maintenance Windows:</strong> Scheduled during low-usage periods (typically 2-4 AM PKT)</li>
                <li><strong>Advance Notice:</strong> 24-48 hours notice for planned maintenance</li>
                <li><strong>Emergency Maintenance:</strong> Immediate notification via email and platform alerts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Content Updates and Delivery</h2>
              <p className="mb-4">
                We continuously improve our educational content:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Regular Updates:</strong> New questions and cases added monthly</li>
                <li><strong>Curriculum Alignment:</strong> Content updated to match current medical education standards</li>
                <li><strong>Expert Review:</strong> All content reviewed by medical professionals</li>
                <li><strong>User Feedback Integration:</strong> Improvements based on user suggestions</li>
                <li><strong>Automatic Delivery:</strong> Updates delivered automatically to your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Customer Support Services</h2>
              <p className="mb-4">
                Our support services include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Technical Support:</strong> Help with platform navigation and technical issues</li>
                <li><strong>Educational Guidance:</strong> Study tips and learning strategy advice</li>
                <li><strong>Account Management:</strong> Subscription and billing support</li>
                <li><strong>Response Times:</strong> 24 hours for general inquiries, 4 hours for urgent issues</li>
                <li><strong>Multiple Channels:</strong> Email support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Service Interruptions</h2>
              <p className="mb-4">
                In case of service interruptions:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We will notify users immediately via email and platform notifications</li>
                <li>Estimated resolution time will be provided</li>
                <li>Regular updates will be posted on our status page</li>
                <li>Service credits may be applied for extended outages</li>
                <li>Alternative access methods will be provided when possible</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Data Backup and Security</h2>
              <p className="mb-4">
                We ensure your learning data is protected:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Daily Backups:</strong> All user data backed up daily</li>
                <li><strong>Redundant Storage:</strong> Data stored in multiple secure locations</li>
                <li><strong>Encryption:</strong> All data encrypted in transit and at rest</li>
                <li><strong>Access Controls:</strong> Strict access controls and monitoring</li>
                <li><strong>Disaster Recovery:</strong> Comprehensive disaster recovery procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Service Limitations</h2>
              <p className="mb-4">
                Please note the following service limitations:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Services require active internet connection for most features</li>
                <li>Offline content has limited functionality</li>
                <li>Some features may not be available on all devices</li>
                <li>Content availability may vary by subscription plan</li>
                <li>Geographic restrictions may apply to certain content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
              <p className="mb-4">
                For service delivery questions or technical support:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                <p><strong>Email:</strong> contact@medmaster.com</p>

                <p><strong>Address:</strong> Peshawar, Khyber Pakhtunkhwa, 25000, Pakistan</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServicePolicyPage;