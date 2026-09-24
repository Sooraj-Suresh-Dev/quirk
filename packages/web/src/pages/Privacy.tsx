
import { Card } from '@/components/ui/Card';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { PageMeta } from '@/components/seo/PageMeta';
import { useInView } from '@/hooks/useInView';

const sections = [
  {
    title: '1. INFORMATION WE COLLECT',
    content: (
      <>
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
      </>
    ),
  },
  {
    title: '2. HOW WE USE YOUR INFORMATION',
    content: (
      <ul className="font-serif text-warm-gray space-y-2 list-disc list-inside">
        <li>To provide and improve the Quirk service</li>
        <li>To personalize your content generation experience</li>
        <li>To train and maintain your voice profile</li>
        <li>To send daily digest emails (if subscribed)</li>
        <li>To communicate about service updates</li>
      </ul>
    ),
  },
  {
    title: '3. DATA SHARING',
    content: (
      <p className="font-serif text-warm-gray">
        We do not sell your personal information. We share data only with
        service providers necessary to operate Quirk (hosting, email
        delivery, AI processing). These providers are bound by contractual
        obligations to protect your data.
      </p>
    ),
  },
  {
    title: '4. DATA RETENTION',
    content: (
      <p className="font-serif text-warm-gray">
        We retain your account information and generated content for as
        long as your account is active. You may delete your account at
        any time, which will remove your data from our systems.
      </p>
    ),
  },
  {
    title: '5. CONTACT US',
    content: (
      <p className="font-serif text-warm-gray">
        If you have questions about this Privacy Policy, please contact
        us at{' '}
        <span className="text-coral">soorajsuresh9597@gmail.com</span>.
      </p>
    ),
  },
];

export function Privacy() {
  const heroRef = useInView(0.3);
  const contentRef = useInView(0.1);

  return (
    <MarketingLayout>
      <PageMeta
        title="Privacy Policy"
        description="How Quirk collects, uses, and protects your data."
        canonicalPath="/privacy"
      />
      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 py-10 md:px-8 md:pt-16 md:pb-8">
          <div ref={heroRef.ref}>
            <p className={`font-mono text-sm uppercase text-coral mb-4 tracking-wider ${heroRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              LEGAL
            </p>
            <h1 className={`font-mono text-2xl md:text-4xl font-bold text-charcoal mb-4 ${heroRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
              PRIVACY POLICY
            </h1>
            <p className={`font-serif text-base md:text-xl text-warm-gray ${heroRef.inView ? 'animate-fade-in-up stagger-2' : 'opacity-0'}`}>
              Last updated: August 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-4 py-8 md:px-8 md:py-12" ref={contentRef.ref}>
          <div className="space-y-6">
            {sections.map(({ title, content }, i) => (
              <Card
                key={title}
                hover
                className={`${contentRef.inView ? `animate-fade-in-up stagger-${Math.min(i + 1, 4)}` : 'opacity-0'}`}
              >
                <h2 className="font-mono text-xl font-bold text-charcoal mb-4">
                  {title}
                </h2>
                {content}
              </Card>
            ))}
          </div>
        </section>

        
      </main>
    </MarketingLayout>
  );
}
