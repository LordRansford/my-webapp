import { Metadata } from 'next';
import BaseLayout from '@/components/Layout/BaseLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | RansfordsNotes',
  description: 'Privacy Policy for RansfordsNotes - Learn how we handle your data',
};

export default function PrivacyPage() {
  return (
    <BaseLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-slate-900">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
            <p className="text-slate-700 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Email address (for account creation and authentication)</li>
              <li>Name (if provided during sign-up)</li>
              <li>Learning progress and course completion data</li>
              <li>Usage analytics (anonymized, privacy-friendly)</li>
              <li>Payment information (processed securely by Stripe, we don't store card details)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Track your learning progress across devices</li>
              <li>Send you important updates about our services (only when necessary)</li>
              <li>Improve our services and user experience</li>
              <li>Process payments and donations securely</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Data Storage and Security</h2>
            <p className="text-slate-700 mb-4">
              Your data is stored securely using:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Encrypted databases (PostgreSQL with TLS encryption)</li>
              <li>Secure file storage (Vercel Blob with encryption at rest)</li>
              <li>HTTPS for all data transmission</li>
              <li>Industry-standard security practices</li>
              <li>Regular security audits and monitoring</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Third-Party Services</h2>
            <p className="text-slate-700 mb-4">
              We use the following third-party services to provide our platform:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li><strong>Vercel</strong>: Hosting and deployment (privacy policy: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700">vercel.com/legal/privacy-policy</a>)</li>
              <li><strong>Neon</strong>: Database hosting (privacy policy: <a href="https://neon.tech/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700">neon.tech/legal/privacy-policy</a>)</li>
              <li><strong>Stripe</strong>: Payment processing - we don't store card details (privacy policy: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700">stripe.com/privacy</a>)</li>
              <li><strong>Google</strong>: Authentication (OAuth) - only email and name (privacy policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700">policies.google.com/privacy</a>)</li>
              <li><strong>Sentry</strong>: Error tracking and monitoring (privacy policy: <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700">sentry.io/privacy</a>)</li>
              <li><strong>Plausible</strong>: Privacy-friendly analytics (no cookies, GDPR compliant) (privacy policy: <a href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700">plausible.io/privacy</a>)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Your Rights</h2>
            <p className="text-slate-700 mb-4">
              Under GDPR, CCPA, and other privacy laws, you have the right to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li><strong>Access</strong>: Request a copy of your personal data</li>
              <li><strong>Correction</strong>: Request correction of inaccurate data</li>
              <li><strong>Deletion</strong>: Request deletion of your data</li>
              <li><strong>Export</strong>: Export your data in a portable format</li>
              <li><strong>Opt-out</strong>: Opt out of certain data processing</li>
              <li><strong>Objection</strong>: Object to processing of your data</li>
            </ul>
            <p className="text-slate-700 mb-4">
              To exercise these rights, contact us at: <a href="mailto:privacy@ransfordsnotes.com" className="text-sky-600 hover:text-sky-700 underline">privacy@ransfordsnotes.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Cookies and Tracking</h2>
            <p className="text-slate-700 mb-4">
              We use essential cookies for:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Authentication and session management</li>
              <li>Security and fraud prevention</li>
            </ul>
            <p className="text-slate-700 mb-4">
              We do <strong>not</strong> use:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Tracking cookies</li>
              <li>Advertising cookies</li>
              <li>Third-party analytics cookies</li>
            </ul>
            <p className="text-slate-700 mb-4">
              Our analytics (Plausible) is privacy-friendly and does not use cookies or track individuals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Data Retention</h2>
            <p className="text-slate-700 mb-4">
              We retain your data for as long as your account is active or as needed to provide our services. 
              You can request deletion of your account and data at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Children's Privacy</h2>
            <p className="text-slate-700 mb-4">
              Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-slate-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page 
              and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Contact Us</h2>
            <p className="text-slate-700 mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <p className="text-slate-700">
              Email: <a href="mailto:privacy@ransfordsnotes.com" className="text-sky-600 hover:text-sky-700 underline">privacy@ransfordsnotes.com</a>
            </p>
          </section>
        </div>
      </div>
    </BaseLayout>
  );
}
