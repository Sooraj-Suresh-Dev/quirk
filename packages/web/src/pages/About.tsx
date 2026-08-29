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
      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="font-mono text-5xl font-bold text-charcoal mb-4 tracking-tight">
            BUILT FOR CREATORS WHO SHOW UP
          </h1>
          <p className="font-serif text-xl text-warm-gray max-w-2xl mx-auto">
            Quirk was born from a simple observation: the hardest part of
            building a personal brand on LinkedIn isn't writing — it's
            showing up consistently with content that sounds like you.
          </p>
        </div>

        <div className="mb-16">
          <Card className="max-w-3xl mx-auto">
            <h2 className="font-mono text-2xl font-bold text-charcoal mb-4">
              OUR MISSION
            </h2>
            <p className="font-serif text-lg text-warm-gray leading-relaxed">
              We believe everyone deserves to have a voice on LinkedIn — not
              just the people who can afford ghostwriters or have hours to
              spend crafting each post. Quirk combines AI-powered content
              generation with personal voice training, so every post you
              publish sounds authentically like you.
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
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

        <div className="text-center">
          <h2 className="font-mono text-2xl font-bold text-charcoal mb-4">
            WHY QUIRK?
          </h2>
          <ul className="font-serif text-warm-gray max-w-2xl mx-auto text-left space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <span className="text-coral mt-1">&#9679;</span>
              <span>
                <strong className="text-charcoal">Trend detection</strong> from
                GitHub, Product Hunt, and TechCrunch — automatically
                updated every hour.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-coral mt-1">&#9679;</span>
              <span>
                <strong className="text-charcoal">Voice training</strong> that
                extracts your tone, sentence structure, and CTA style from sample
                posts.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-coral mt-1">&#9679;</span>
              <span>
                <strong className="text-charcoal">Multiple post formats</strong> —
                text posts, carousel frameworks, and image prompts for every
                trend.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-coral mt-1">&#9679;</span>
              <span>
                <strong className="text-charcoal">Daily digest</strong> with
                ready-to-post content delivered to your inbox every morning.
              </span>
            </li>
          </ul>
          <Button className="text-lg px-8 py-4" onClick={openSignup}>
              START CREATING <ArrowRight size={20} />
            </Button>
        </div>
      </main>
    </MarketingLayout>
  );
}
