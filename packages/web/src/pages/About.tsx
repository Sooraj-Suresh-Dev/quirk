import { ArrowRight, Users, Zap, Heart } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { useAuthModal } from '@/lib/auth-modal';

const pillars = [
  {
    icon: Users,
    title: 'VOICE-FIRST GENERATION',
    description:
      'Every AI output reflects your personal brand voice, not generic AI content. Train once, generate forever.',
  },
  {
    icon: Zap,
    title: 'TREND-TO-POST PIPELINE',
    description:
      'Minimal friction from discovering trending topics to having ready-to-post content. One click from trend to LinkedIn.',
  },
  {
    icon: Heart,
    title: 'PERSONALITY OVER CORPORATE',
    description:
      'Distinctive, warm design that stands out from typical B2B SaaS tools. Your content should feel like you.',
  },
];

export function About() {
  const { openSignup } = useAuthModal();
  return (
    <MarketingLayout>
      <main>
        {/* Hero — editorial statement */}
        <section className="max-w-4xl mx-auto px-8 pt-20 pb-16">
          <div className="max-w-3xl">
            <p className="font-mono text-sm uppercase text-coral mb-4 tracking-wider">Our Story</p>
            <h1 className="font-mono text-5xl font-bold text-charcoal mb-8 tracking-tight leading-tight">
              BUILT FOR CREATORS
              <br />
              WHO SHOW UP
            </h1>
            <p className="font-serif text-2xl text-warm-gray leading-relaxed">
              The hardest part of building a personal brand on LinkedIn isn't writing —
              it's showing up consistently with content that sounds like you.
            </p>
          </div>
        </section>

        {/* Mission — editorial pull-quote */}
        <section className="border-y-3 border-deep-black bg-soft-white">
          <div className="max-w-4xl mx-auto px-8 py-16">
            <blockquote className="font-serif text-3xl text-charcoal leading-relaxed italic max-w-3xl">
              "Everyone deserves to have a voice on LinkedIn — not just the people
              who can afford ghostwriters or have hours to spend crafting each post."
            </blockquote>
            <div className="mt-6 font-mono text-sm uppercase text-warm-gray tracking-wider">
              — The Quirk Mission
            </div>
          </div>
        </section>

        {/* Pillars — three-column */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <p className="font-mono text-sm uppercase text-coral mb-4 tracking-wider text-center">What We Believe</p>
          <h2 className="font-mono text-3xl font-bold text-charcoal mb-12 text-center">
            THREE PILLARS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map(({ icon: Icon, title, description }) => (
              <Card key={title} hover>
                <Icon size={32} className="text-coral mb-4" />
                <h3 className="font-mono text-lg font-bold text-charcoal mb-2">
                  {title}
                </h3>
                <p className="font-serif text-warm-gray">{description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Quirk — editorial list */}
        <section className="max-w-4xl mx-auto px-8 pb-20">
          <h2 className="font-mono text-2xl font-bold text-charcoal mb-8">
            WHY QUIRK EXISTS
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-coral mt-1 text-2xl">●</span>
              <div>
                <h3 className="font-mono text-lg font-bold text-charcoal mb-1">
                  Trend detection
                </h3>
                <p className="font-serif text-warm-gray">
                  From GitHub, Product Hunt, Hacker News, and TechCrunch — automatically
                  updated every hour. No more feed-scrolling.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-mint mt-1 text-2xl">●</span>
              <div>
                <h3 className="font-mono text-lg font-bold text-charcoal mb-1">
                  Voice training
                </h3>
                <p className="font-serif text-warm-gray">
                  Extracts your tone, sentence structure, and CTA style from sample posts.
                  Every generation sounds like you.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-coral mt-1 text-2xl">●</span>
              <div>
                <h3 className="font-mono text-lg font-bold text-charcoal mb-1">
                  Multiple post formats
                </h3>
                <p className="font-serif text-warm-gray">
                  Text posts, carousel frameworks, and image prompts for every trend.
                  Choose the format that fits your strategy.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-mint mt-1 text-2xl">●</span>
              <div>
                <h3 className="font-mono text-lg font-bold text-charcoal mb-1">
                  Daily digest
                </h3>
                <p className="font-serif text-warm-gray">
                  Ready-to-post content delivered to your inbox every morning.
                  Wake up, copy, post.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Button className="text-lg px-8 py-4" onClick={openSignup}>
              JOIN THE BETA <ArrowRight size={20} />
            </Button>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
