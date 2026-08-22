import { Card } from '@/components/ui/Card';
import { MarketingLayout } from '@/components/layout/MarketingLayout';

export function Terms() {
  return (
    <MarketingLayout>
      <main className="max-w-3xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-mono text-4xl font-bold text-charcoal mb-4">
            TERMS OF SERVICE
          </h1>
          <p className="font-serif text-warm-gray">Last updated: August 2026</p>
        </div>

        <Card className="mb-8">
          <h2 className="font-mono text-xl font-bold text-charcoal mb-4">
            1. ACCEPTANCE OF TERMS
          </h2>
          <p className="font-serif text-warm-gray">
            By accessing or using Quirk, you agree to be bound by these Terms
            of Service. If you do not agree, do not use the service.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="font-mono text-xl font-bold text-charcoal mb-4">
            2. USER RESPONSIBILITIES
          </h2>
          <ul className="font-serif text-warm-gray space-y-2 list-disc list-inside">
            <li>You are responsible for your account security</li>
            <li>You must not use the service for illegal purposes</li>
            <li>You must not attempt to bypass rate limits or restrictions</li>
            <li>You are responsible for the content you publish on LinkedIn</li>
            <li>You must not resell or redistribute the service</li>
          </ul>
        </Card>

        <Card className="mb-8">
          <h2 className="font-mono text-xl font-bold text-charcoal mb-4">
            3. INTELLECTUAL PROPERTY
          </h2>
          <p className="font-serif text-warm-gray mb-4">
            Quirk retains ownership of the service and its technology. You
            retain ownership of:
          </p>
          <ul className="font-serif text-warm-gray space-y-2 list-disc list-inside">
            <li>Your voice samples and training data</li>
            <li>Content you generate using Quirk</li>
            <li>Your LinkedIn posts and profile</li>
          </ul>
          <p className="font-serif text-warm-gray mt-4">
            You grant Quirk a limited license to process your voice samples
            and generate content on your behalf.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="font-mono text-xl font-bold text-charcoal mb-4">
            4. SERVICE AVAILABILITY
          </h2>
          <p className="font-serif text-warm-gray">
            Quirk is provided "as is" without warranties. We may modify or
            discontinue features at any time. We are not liable for any
            downtime or data loss.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="font-mono text-xl font-bold text-charcoal mb-4">
            5. LIMITATION OF LIABILITY
          </h2>
          <p className="font-serif text-warm-gray">
            Quirk shall not be liable for any indirect, incidental, or
            consequential damages. Our total liability shall not exceed the
            amount you paid for the service (currently $0).
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="font-mono text-xl font-bold text-charcoal mb-4">
            6. CONTACT
          </h2>
          <p className="font-serif text-warm-gray">
            For questions about these Terms, contact us at{' '}
            <span className="text-coral">legal@quirk.app</span>.
          </p>
        </Card>
      </main>
    </MarketingLayout>
  );
}
