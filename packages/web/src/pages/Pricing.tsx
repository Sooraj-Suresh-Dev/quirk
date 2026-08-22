import { ArrowRight, Check } from 'lucide-react';
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
  'LinkedIn OAuth & auto-posting',
  'Multi-seat team plans',
  'Advanced analytics',
  'Priority AI model access',
];

export function Pricing() {
  const { openSignup } = useAuthModal();
  return (
    <MarketingLayout>
      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="font-mono text-5xl font-bold text-charcoal mb-4 tracking-tight">
            START FREE, GROW WITH QUIRK
          </h1>
          <p className="font-serif text-xl text-warm-gray max-w-2xl mx-auto">
            Everything you need to build your LinkedIn presence — no credit
            card required.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-16">
          <Card className="border-coral">
            <div className="text-center mb-6">
              <span className="font-mono text-sm uppercase text-warm-gray">
                Free
              </span>
              <div className="mt-2">
                <span className="font-mono text-5xl font-bold text-charcoal">
                  $0
                </span>
                <span className="font-serif text-warm-gray">/month</span>
              </div>
            </div>

            <div className="border-t border-deep-black/10 pt-6 mb-6">
              <ul className="space-y-3">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check size={18} className="text-mint mt-0.5 shrink-0" />
                    <span className="font-serif text-charcoal">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button className="w-full justify-center text-lg px-6 py-4" onClick={openSignup}>
                GET STARTED <ArrowRight size={20} />
              </Button>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="font-mono text-2xl font-bold text-charcoal mb-4">
            COMING SOON
          </h2>
          <p className="font-serif text-warm-gray max-w-xl mx-auto mb-8">
            We're building more features to help you scale your LinkedIn
            presence. Premium plans will be available in a future release.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {comingSoon.map((feature) => (
              <div
                key={feature}
                className="font-serif text-charcoal bg-soft-white rounded-card border-2 border-deep-black/10 px-4 py-3 text-left"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </main>
    </MarketingLayout>
  );
}
