import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { PageMeta } from '@/components/seo/PageMeta';
import { useAuthModal } from '@/lib/auth-modal';

const features = [
  { label: 'Trend sources', value: '3 sources, refreshed hourly' },
  { label: 'Post generations', value: '20 per hour' },
  { label: 'Voice training', value: '3–5 sample posts' },
  { label: 'AI models', value: 'GPT-4o, Llama' },
  { label: 'Post formats', value: 'Text, carousel, image prompt' },
  { label: 'Daily digest', value: 'Email with ready-to-post content' },
  { label: 'Post library', value: 'History, copy, regenerate' },
];

const faqs = [
  {
    q: 'Is it really free?',
    a: 'Yes. No trial, no credit card, no hidden fees. Every core feature — trend detection, AI generation, voice training, and daily digests — is included at no cost.',
  },
  {
    q: 'Why free instead of a trial?',
    a: "Trials expire. Free doesn't. We want you to build a habit, not race a clock. If Quirk works for you, you'll keep using it — not because a timer ran out.",
  },
  {
    q: 'What happens if I hit the generation limit?',
    a: 'You get 20 generations per hour. If you hit the limit, wait for the hourly reset or spread your usage throughout the day. Most users find this more than enough for daily content.',
  },
  {
    q: 'Can I export my data?',
    a: 'Yes. Your posts, voice profile, and generated content are always yours. Export or delete anything from your account settings.',
  },
];

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function Pricing() {
  const { openSignup } = useAuthModal();
  const howRef = useInView(0.3);
  const faqRef = useInView(0.3);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <MarketingLayout>
      <PageMeta
        title="Start Free"
        description="No trial, no credit card. All features included — trend detection, AI generation, voice training."
        canonicalPath="/pricing"
      />
      <main>
        {/* Split Hero: Price + Comparison Table */}
        <section className="max-w-6xl mx-auto px-4 py-10 md:px-8 md:pt-16 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-start animate-fade-in-up">
            {/* Left: Price + CTA */}
            <div className="lg:sticky lg:top-24">
              <h1 className="font-mono text-3xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-4 tracking-tight leading-tight">
                START FREE
              </h1>
              <p className="font-serif text-xl text-warm-gray mb-8 leading-relaxed">
                No trial. No credit card. No catch.
              </p>

              <div className="bg-soft-white rounded-card border-3 border-deep-black shadow-card p-5 md:p-8 mb-6">
                <span className="font-mono text-sm uppercase text-warm-gray tracking-wider">
                  Free Forever
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-mono text-4xl md:text-6xl font-bold text-charcoal">
                    $0
                  </span>
                  <span className="font-serif text-warm-gray text-lg">
                    /month
                  </span>
                </div>
                <p className="font-serif text-warm-gray mt-3 mb-6">
                  All features included. No upsells.
                </p>
                <Button
                  className="w-full justify-center text-lg px-6 py-4"
                  onClick={openSignup}
                >
              START CREATING <ArrowRight size={20} />
                </Button>
                <p className="font-serif text-xs text-warm-gray text-center mt-3">
                  No credit card required · Cancel anytime
                </p>
              </div>
            </div>

            {/* Right: Features List */}
            <div>
              <Card className="p-8">
                <h2 className="font-mono text-2xl font-bold text-charcoal mb-2">
                  WHAT'S INCLUDED
                </h2>
                <p className="font-serif text-warm-gray mb-6">
                  Everything included. No hidden fees.
                </p>

                <div className="divide-y divide-deep-black/5">
                  {features.map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-4 py-3">
                      <span className="font-mono text-xs uppercase tracking-wider text-warm-gray shrink-0">
                        {label}
                      </span>
                      <span className="font-serif text-sm text-charcoal text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Quirk vs Alternatives */}
        <section className="max-w-6xl mx-auto px-4 py-10 md:px-8 md:py-16">
          <div ref={howRef.ref}>
            <h2
              className={`font-mono text-2xl md:text-3xl font-bold text-charcoal mb-4 text-center ${
                howRef.inView ? 'animate-slide-up' : 'opacity-0'
              }`}
            >
              QUIRK VS THE ALTERNATIVES
            </h2>
            <p
              className={`font-serif text-warm-gray mb-10 text-center max-w-2xl mx-auto ${
                howRef.inView ? 'animate-slide-up-delay-1' : 'opacity-0'
              }`}
            >
              See how Quirk compares to doing it yourself or using generic AI tools.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'QUIRK',
                  accent: true,
                  rows: [
                    { label: 'Trend discovery', value: 'Auto-discovers from 3 sources hourly' },
                    { label: 'Voice matching', value: 'Trains on your past posts' },
                    { label: 'Post formats', value: 'Text, carousel, image prompt', hideOnMobile: true },
                    { label: 'Time to post', value: '~2 minutes' },
                    { label: 'Daily content', value: 'Delivered to your inbox' },
                  ],
                },
                {
                  name: 'MANUAL POSTING',
                  accent: false,
                  rows: [
                    { label: 'Trend discovery', value: 'You scroll feeds manually' },
                    { label: 'Voice matching', value: 'You write in your own voice' },
                    { label: 'Post formats', value: 'Text only, you build carousels', hideOnMobile: true },
                    { label: 'Time to post', value: '30–60 minutes' },
                    { label: 'Daily content', value: 'Nothing — you start from zero' },
                  ],
                },
                {
                  name: 'GENERIC AI TOOLS',
                  accent: false,
                  rows: [
                    { label: 'Trend discovery', value: 'You find and paste topics' },
                    { label: 'Voice matching', value: 'Generic output, not your voice' },
                    { label: 'Post formats', value: 'Text only, no carousel framework', hideOnMobile: true },
                    { label: 'Time to post', value: '10–15 minutes' },
                    { label: 'Daily content', value: 'Nothing — you start from zero' },
                  ],
                },
              ].map(({ name, accent, rows }, i) => (
                <Card
                  key={name}
                  className={`${accent ? 'border-coral bg-coral/5 relative' : ''} ${
                    howRef.inView
                      ? i === 0
                        ? 'animate-fade-in-up stagger-2'
                        : i === 1
                          ? 'animate-fade-in-up stagger-3'
                          : 'animate-fade-in-up stagger-4'
                      : 'opacity-0'
                  }`}
                >
                  {accent && (
                    <span className="absolute -top-3 left-4 font-mono text-xs uppercase tracking-wider bg-coral text-soft-white px-2 py-0.5 rounded">
                      Best value
                    </span>
                  )}
                  <h3 className="font-mono text-lg font-bold text-charcoal mb-4">
                    {name}
                  </h3>
                  <div className="space-y-0">
                    {rows.map(({ label, value, hideOnMobile }, ri) => (
                      <div
                        key={label}
                        className={`py-3 ${
                          ri < rows.length - 1 ? 'border-b border-deep-black/5' : ''
                        } ${hideOnMobile ? 'hidden md:block' : ''}`}
                      >
                        <span className="font-mono text-xs uppercase tracking-wider text-coral block mb-1">
                          {label}
                        </span>
                        <span className="font-serif text-base text-charcoal">
                          {accent ? `✓ ${value}` : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="border-y border-deep-black/10">
          <div className="max-w-4xl mx-auto px-4 py-4 md:px-8 md:py-6 flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-16">
            {[
              'No credit card required',
              'Export your data anytime',
              'Your data, your posts',
            ].map((claim) => (
              <span
                key={claim}
                className="font-mono text-sm uppercase tracking-wider text-charcoal flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-mint" />
                {claim}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ — Accordion */}
        <section>
          <div className="max-w-3xl mx-auto px-4 py-12 md:px-8 md:py-20">
            <div ref={faqRef.ref}>
              <h2
                className={`font-mono text-2xl md:text-3xl font-bold text-charcoal mb-10 text-center ${
                  faqRef.inView ? 'animate-slide-up' : 'opacity-0'
                }`}
              >
                COMMON QUESTIONS
              </h2>

              <div className="divide-y-2 divide-deep-black/10">
                {faqs.map(({ q, a }, i) => (
                  <div
                    key={q}
                    className={`${
                      faqRef.inView
                        ? i === 0
                          ? 'animate-slide-up-delay-1'
                          : 'animate-slide-up-delay-2'
                        : 'opacity-0'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between py-5 text-left cursor-pointer hover:bg-cream/50 transition-colors focus-visible:outline-2 focus-visible:outline-coral focus-visible:outline-offset-2 rounded"
                    >
                      <span className="font-mono text-base font-bold text-charcoal pr-4">
                        {q}
                      </span>
                      <span className="shrink-0 text-warm-gray transition-transform duration-300" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                        <Plus size={18} />
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openFaq === i ? 'max-h-96 pb-5' : 'max-h-0'
                      }`}
                    >
                      <p className={`font-serif text-warm-gray leading-relaxed transition-opacity duration-200 delay-100 ${openFaq === i ? 'opacity-100' : 'opacity-0'}`}>
                        {a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-center mt-8">
                <a
                  href="/faq"
                  className="font-mono text-sm uppercase tracking-wider text-coral hover:text-coral/80 transition-colors"
                >
                  See all FAQs →
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner — full-width coral */}
        <section >
          <div className="max-w-4xl mx-auto px-4 py-12 md:px-8 md:py-20 text-center">
            <h2 className="font-mono text-2xl md:text-4xl font-bold text-charcoal mb-4">
              READY TO TRY QUIRK?
            </h2>
            <p className="font-serif text-base md:text-xl text-charcoal mb-8 max-w-xl mx-auto">
              Takes 30 seconds. No strings attached.
            </p>
            <Button
              variant="secondary"
              className="text-sm md:text-lg px-5 py-3 md:px-8 md:py-4 bg-soft-white text-charcoal border-deep-black hover:bg-cream"
              onClick={openSignup}
            >
              GET STARTED FREE <ArrowRight size={20} />
            </Button>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
