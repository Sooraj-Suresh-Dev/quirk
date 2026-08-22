import { Card } from '@/components/ui/Card';
import { MarketingLayout } from '@/components/layout/MarketingLayout';

export function Privacy() {
  return (
    <MarketingLayout>
      <main className="max-w-3xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-mono text-4xl font-bold text-charcoal mb-4">
            PRIVACY POLICY
          </h1>
          <p className="font-serif text-warm-gray">Last updated: August 2026</p>
        </div>

        <Card className="mb-8">
          <h2 className="font-mono text-xl font-bold text-charcoal mb-4">
            1. INFORMATION WE COLLECT
          </h2>
          <p className="font-serif text-warm-gray mb-4">
            When you use Quirk, we collect information that you provide
            directly and information about your use of the service.
          </p>
          <ul className="font-serif text-warm-gray space-y-2 list-disc list-inside">
            <li>
              <strong className="text-charcoal">Account information:</strong>{' '}
              Your email address (via magic link authentication)
            </li>
            <li>
              <strong className="text-charcoal">Voice samples:</strong> LinkedIn
              posts you paste for voice training
            </li>
            <li>
              <strong className="text-charcoal">Generated content:</strong> Posts,
              carousels, and prompts created using Quirk
            </li>
            <li>
              <strong className="text-charcoal">Usage data:</strong> How you
              interact with the service (features used, frequency)
            </li>
          </ul>
        </Card>

        <Card className="mb-8">
          <h2 className="font-mono text-xl font-bold text-charcoal mb-4">
            2. HOW WE USE YOUR INFORMATION
          </h2>
          <ul className="font-serif text-warm-gray space-y-2 list-disc list-inside">
            <li>To provide and improve the Quirk service</li>
            <li>To personalize your content generation experience</li>
            <li>To train and maintain your voice profile</li>
            <li>To send daily digest emails (if subscribed)</li>
            <li>To communicate about service updates</li>
          </ul>
        </Card>

        <Card className="mb-8">
          <h2 className="font-mono text-xl font-bold text-charcoal mb-4">
            3. DATA SHARING
          </h2>
          <p className="font-serif text-warm-gray">
            We do not sell your personal information. We share data only with
            service providers necessary to operate Quirk (hosting, email
            delivery, AI processing). These providers are bound by contractual
            obligations to protect your data.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="font-mono text-xl font-bold text-charcoal mb-4">
            4. DATA RETENTION
          </h2>
          <p className="font-serif text-warm-gray">
            We retain your account information and generated content for as
            long as your account is active. You may delete your account at
            any time, which will remove your data from our systems.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="font-mono text-xl font-bold text-charcoal mb-4">
            5. CONTACT US
          </h2>
          <p className="font-serif text-warm-gray">
            If you have questions about this Privacy Policy, please contact
            us at{' '}
            <span className="text-coral">privacy@quirk.app</span>.
          </p>
        </Card>
      </main>
    </MarketingLayout>
  );
}
