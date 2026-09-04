import { ArrowRight, Check, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { useAuthModal } from '@/lib/auth-modal';

const freeFeatures = [
  'Trend detection from 4 sources',
  'AI text post generation',
  'Carousel framework generation',
  'Image prompt generation',
  'Voice training (3-5 sample posts)',
  'Daily digest email',
  'Post history & management',
];

const comingSoon = [
  { label: 'LinkedIn OAuth & auto-posting', icon: Lock },
  { label: 'Multi-seat team plans', icon: Lock },
  { label: 'Advanced analytics', icon: Lock },
  { label: 'Priority AI model access', icon: Lock },
];

export function Pricing() {
  const { openSignup } = useAuthModal();
  return (
    <MarketingLayout>
      <main>
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-8 pt-16 pb-12 text-center">
          <p className="font-mono text-sm uppercase text-coral mb-4 tracking-wider">Pricing</p>
          <h1 className="font-mono text-5xl font-bold text-charcoal mb-6 tracking-tight">
            START FREE,
            <br />
            GROW WITH QUIRK
          </h1>
          <p className="font-serif text-xl text-warm-gray max-w-2xl mx-auto">
            Everything you need to build your LinkedIn presence — no credit
            card required. Seriously, it's free.
          </p>
        </section>

        {/* Pricing Card — larger, centered */}
        <section className="max-w-lg mx-auto px-8 pb-16">
          <Card className="border-coral relative overflow-hidden">
            {/* Badge */}
            <div className="absolute top-0 right-0 bg-coral text-soft-white font-mono text-xs uppercase px-4 py-2 rounded-bl-card">
              Current Plan
            </div>

            <div className="text-center mb-8 pt-4">
              <span className="font-mono text-sm uppercase text-warm-gray tracking-wider">
                Free Forever
              </span>
              <div className="mt-3 flex items-baseline justify-center gap-1">
                <span className="font-mono text-6xl font-bold text-charcoal">$0</span>
                <span className="font-serif text-warm-gray text-lg">/month</span>
              </div>
              <p className="font-serif text-warm-gray mt-3">
                All features included. No hidden fees.
              </p>
            </div>

            <div className="border-t-2 border-deep-black/10 pt-6 mb-8">
              <ul className="space-y-4">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check size={20} className="text-mint mt-0.5 shrink-0" />
                    <span className="font-serif text-charcoal">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button className="w-full justify-center text-lg px-6 py-4" onClick={openSignup}>
              GET STARTED FREE <ArrowRight size={20} />
            </Button>
          </Card>
        </section>

        {/* Coming Soon — distinct treatment */}
        <section className="border-t-3 border-deep-black bg-soft-white py-16">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-10">
              <p className="font-mono text-sm uppercase text-warm-gray mb-3 tracking-wider">On the Roadmap</p>
              <h2 className="font-mono text-3xl font-bold text-charcoal mb-4">
                COMING SOON
              </h2>
              <p className="font-serif text-warm-gray max-w-xl mx-auto">
                We're building more features to help you scale your LinkedIn
                presence. Premium plans will be available in a future release.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {comingSoon.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 font-serif text-charcoal bg-cream rounded-card border-3 border-deep-black/10 px-5 py-4"
                >
                  <Icon size={16} className="text-warm-gray shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
