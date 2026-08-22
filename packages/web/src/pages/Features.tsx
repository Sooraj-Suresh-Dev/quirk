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
      'Quirk automatically discovers trending topics from four major tech sources every hour. No more scrolling through feeds to find what matters.',
    details: [
      'GitHub Trending — discover rising repos and dev tools',
      'Product Hunt — catch new product launches early',
      'Hacker News — top stories from the tech community',
      'TechCrunch — breaking tech news and analysis',
    ],
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
  },
];

export function Features() {
  const { openSignup } = useAuthModal();
  return (
    <MarketingLayout>
      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="font-mono text-5xl font-bold text-charcoal mb-4 tracking-tight">
            EVERYTHING YOU NEED TO POST WITH PERSONALITY
          </h1>
          <p className="font-serif text-xl text-warm-gray max-w-2xl mx-auto">
            From trend discovery to ready-to-post content — Quirk handles
            the hard part so you can focus on building your presence.
          </p>
        </div>

        <div className="space-y-8">
          {features.map(({ icon: Icon, title, description, details }) => (
            <Card key={title}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <Icon size={40} className="text-coral mb-4" />
                  <h2 className="font-mono text-xl font-bold text-charcoal mb-3">
                    {title}
                  </h2>
                  <p className="font-serif text-warm-gray">{description}</p>
                </div>
                <div className="md:w-2/3">
                  <ul className="space-y-3">
                    {details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <span className="text-coral mt-1">&#9679;</span>
                        <span className="font-serif text-charcoal">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button className="text-lg px-8 py-4" onClick={openSignup}>
              START CREATING <ArrowRight size={20} />
            </Button>
        </div>
      </main>
    </MarketingLayout>
  );
}
