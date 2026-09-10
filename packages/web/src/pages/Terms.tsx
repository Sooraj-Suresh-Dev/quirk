
import { Card } from '@/components/ui/Card';

import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { PageMeta } from '@/components/seo/PageMeta';
import { useInView } from '@/hooks/useInView';

const sections = [
  {
    title: '1. ACCEPTANCE OF TERMS',
    content: (
      <p className="font-serif text-warm-gray">
        By accessing or using Quirk, you agree to be bound by these Terms
        of Service. If you do not agree, do not use the service.
      </p>
    ),
  },
  {
    title: '2. USER RESPONSIBILITIES',
    content: (
      <ul className="font-serif text-warm-gray space-y-2 list-disc list-inside">
        <li>You are responsible for your account security</li>
        <li>You must not use the service for illegal purposes</li>
        <li>You must not attempt to bypass rate limits or restrictions</li>
        <li>You are responsible for the content you publish on LinkedIn</li>
        <li>You must not resell or redistribute the service</li>
      </ul>
    ),
  },
  {
    title: '3. INTELLECTUAL PROPERTY',
    content: (
      <>
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
      </>
    ),
  },
  {
    title: '4. SERVICE AVAILABILITY',
    content: (
      <p className="font-serif text-warm-gray">
        Quirk is provided "as is" without warranties. We may modify or
        discontinue features at any time. We are not liable for any
        downtime or data loss.
      </p>
    ),
  },
  {
    title: '5. LIMITATION OF LIABILITY',
    content: (
      <p className="font-serif text-warm-gray">
        Quirk shall not be liable for any indirect, incidental, or
        consequential damages. Our total liability shall not exceed the
        amount you paid for the service (currently $0).
      </p>
    ),
  },
  {
    title: '6. CONTACT',
    content: (
      <p className="font-serif text-warm-gray">
        For questions about these Terms, contact us at{' '}
        <span className="text-coral">legal@quirk.app</span>.
      </p>
    ),
  },
];

export function Terms() {
  
  const heroRef = useInView(0.3);
  const contentRef = useInView(0.1);

  return (
    <MarketingLayout>
      <PageMeta
        title="Terms of Service"
        description="Rules and guidelines for using Quirk."
        canonicalPath="/terms"
      />
      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 py-10 md:px-8 md:pt-16 md:pb-8">
          <div ref={heroRef.ref}>
            <p className={`font-mono text-sm uppercase text-coral mb-4 tracking-wider ${heroRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              LEGAL
            </p>
            <h1 className={`font-mono text-2xl md:text-4xl font-bold text-charcoal mb-4 ${heroRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
              TERMS OF SERVICE
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
