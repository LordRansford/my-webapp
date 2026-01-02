import { Metadata } from 'next';
import BaseLayout from '@/components/Layout/BaseLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | RansfordsNotes',
  description: 'Terms of Service for RansfordsNotes',
};

export default function TermsPage() {
  return (
    <BaseLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-slate-900">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-700 mb-4">
              By accessing and using RansfordsNotes ("the Service"), you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
            <p className="text-slate-700 mb-4">
              RansfordsNotes is an educational platform that provides:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Interactive learning content and courses</li>
              <li>Tools and dashboards for hands-on learning</li>
              <li>Progress tracking and certificates</li>
              <li>Template downloads and resources</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Use of Service</h2>
            <p className="text-slate-700 mb-4">
              You agree to use our service only for lawful purposes and in accordance with these Terms. You agree <strong>not</strong> to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Upload malicious code, viruses, or attempt to breach security</li>
              <li>Use the service to spam, harass, or harm others</li>
              <li>Attempt to reverse engineer, extract, or copy our source code</li>
              <li>Use automated systems to access the service without permission</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Account Responsibility</h2>
            <p className="text-slate-700 mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Maintaining the security and confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Keeping your account information accurate and up to date</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Payment and Refunds</h2>
            <p className="text-slate-700 mb-4">
              For paid features and donations:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Payments are processed securely through Stripe</li>
              <li>All sales are final unless otherwise stated</li>
              <li>Refunds are handled on a case-by-case basis</li>
              <li>Prices may change with 30 days notice to existing customers</li>
              <li>Donations are non-refundable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Intellectual Property</h2>
            <p className="text-slate-700 mb-4">
              All content, features, and functionality of the Service are owned by RansfordsNotes and protected by international 
              copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-slate-700 mb-4">
              You may not:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Copy, modify, or distribute our content without permission</li>
              <li>Use our trademarks or logos without authorization</li>
              <li>Remove copyright or proprietary notices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. User Content</h2>
            <p className="text-slate-700 mb-4">
              You retain ownership of any content you upload or create. By using the Service, you grant us a license to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Store and process your content to provide the Service</li>
              <li>Display your content to you and authorized users</li>
              <li>Back up and secure your content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-slate-700 mb-4">
              RansfordsNotes is provided "as is" and "as available" without warranties of any kind, either express or implied. 
              We are not liable for any damages arising from your use of the Service, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Loss of data or content</li>
              <li>Service interruptions or downtime</li>
              <li>Errors or inaccuracies in content</li>
              <li>Indirect, incidental, or consequential damages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Termination</h2>
            <p className="text-slate-700 mb-4">
              We reserve the right to suspend or terminate your account at any time for:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Non-payment of fees (for paid accounts)</li>
            </ul>
            <p className="text-slate-700 mb-4">
              You may terminate your account at any time by contacting us or using account deletion features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Changes to Terms</h2>
            <p className="text-slate-700 mb-4">
              We reserve the right to modify these Terms at any time. We will notify you of significant changes by:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Posting the updated Terms on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending an email notification (for major changes)</li>
            </ul>
            <p className="text-slate-700 mb-4">
              Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Governing Law</h2>
            <p className="text-slate-700 mb-4">
              These Terms are governed by and construed in accordance with applicable laws. Any disputes will be resolved 
              through binding arbitration or in the appropriate courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Contact</h2>
            <p className="text-slate-700 mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <p className="text-slate-700">
              Email: <a href="mailto:legal@ransfordsnotes.com" className="text-sky-600 hover:text-sky-700 underline">legal@ransfordsnotes.com</a>
            </p>
          </section>
        </div>
      </div>
    </BaseLayout>
  );
}
