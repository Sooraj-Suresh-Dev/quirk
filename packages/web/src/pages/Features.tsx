import { ArrowRight, TrendingUp, Sparkles, Mail, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { useAuthModal } from '@/lib/auth-modal';

const features = [
  {
    icon: TrendingUp,
    title: 'TREND DETECTION',
    description:
      'No more scrolling through feeds to find what matters. Quirk automatically discovers trending topics from three major tech sources every hour.',
    details: [
      'GitHub Trending — discover rising repos and dev tools',
      'Product Hunt — catch new product launches early',
      'TechCrunch — breaking tech news and analysis',
    ],
    iconColor: 'text-coral',
    bulletColor: 'text-coral',
    borderColor: '',
  },
  {
    icon: Sparkles,
    title: 'AI GHOSTWRITING',
    description:
      'Select any trending topic and generate LinkedIn content in seconds. Choose from three post formats, each crafted in your personal brand voice.',
    details: [
      'Text posts — hook, body, and CTA in your tone',
      'Carousel frameworks — 5-slide structures for engagement',
      'Image prompts — Gemini-ready prompts with captions',
    ],
    iconColor: 'text-mint',
    bulletColor: 'text-mint',
    borderColor: 'border-mint',
  },
  {
    icon: Users,
    title: 'VOICE TRAINING',
    description:
      'Paste 3-5 of your best LinkedIn posts and Quirk extracts your unique writing style. Every generated post sounds like you, not generic AI.',
    details: [
      'Tone analysis — formal, casual, or somewhere in between',
      'Sentence length patterns — short and punchy or long and thoughtful',
      'CTA style — how you drive engagement',
      'Emoji frequency — your natural emoji usage',
    ],
    iconColor: 'text-coral',
    bulletColor: 'text-coral',
    borderColor: '',
  },
  {
    icon: Mail,
    title: 'DAILY DIGEST',
    description:
      'Wake up to ready-to-post content in your inbox every morning. Three text posts, a carousel framework, and an image prompt — all personalized.',
    details: [
      'Delivered at your preferred time each morning',
      'Three text posts from today\'s top trends',
      'One carousel framework for deeper engagement',
      'One image prompt for visual content',
    ],
    iconColor: 'text-mint',
    bulletColor: 'text-mint',
    borderColor: 'border-mint',
  },
];

export function Features() {
  const { openSignup } = useAuthModal();
  return (
    <MarketingLayout>
      <main>
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-8 pt-16 pb-12 text-center">
          <h1 className="font-mono text-5xl font-bold text-charcoal mb-6 tracking-tight">
            EVERYTHING YOU NEED
            <br />
            TO POST WITH PERSONALITY
          </h1>
          <p className="font-serif text-xl text-warm-gray max-w-2xl mx-auto">
            From trend discovery to ready-to-post content — Quirk handles
            the hard part so you can focus on building your presence.
          </p>
        </section>

        {/* Alternating Feature Sections */}
        <section className="max-w-6xl mx-auto px-8 pb-20">
          {features.map(({ icon: Icon, title, description, details, iconColor, bulletColor, borderColor }, idx) => (
            <div
              key={title}
              className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center mb-16 last:mb-0`}
            >
              {/* Feature Visual */}
              <div className="md:w-1/2">
                <Card className={borderColor}>
                  <div className="p-4">
                    <Icon size={48} className={`${iconColor} mb-4`} />
                    <h2 className="font-mono text-2xl font-bold text-charcoal mb-3">
                      {title}
                    </h2>
                    <p className="font-serif text-warm-gray leading-relaxed">
                      {description}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Feature Details */}
              <div className="md:w-1/2">
                <ul className="space-y-4">
                  {details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <span className={`${bulletColor} mt-1 text-lg`}>●</span>
                      <span className="font-serif text-charcoal text-lg">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="border-t-3 border-deep-black bg-soft-white py-16">
          <div className="max-w-3xl mx-auto px-8 text-center">
            <h2 className="font-mono text-3xl font-bold text-charcoal mb-4">
              SEE IT IN ACTION
            </h2>
            <p className="font-serif text-lg text-warm-gray mb-8">
              The best way to understand Quirk is to try it. Start generating
              content in your voice — no credit card required.
            </p>
            <Button className="text-lg px-8 py-4" onClick={openSignup}>
              TRY QUIRK FREE <ArrowRight size={20} />
            </Button>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
