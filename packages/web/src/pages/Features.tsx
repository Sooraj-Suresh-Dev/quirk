import { ArrowRight, TrendingUp, Sparkles, Mail, Users, Github, ArrowUp, Star, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { PageMeta } from '@/components/seo/PageMeta';
import { useAuthModal } from '@/lib/auth-modal';
import { useInView } from '@/hooks/useInView';

const features = [
  {
    id: 'trend-detection',
    icon: TrendingUp,
    title: 'TREND DETECTION',
    description:
      'Quirk scans GitHub Trending, Product Hunt, and Hacker News every hour. You see what matters before your feed does.',
    details: [
      'Three sources updated on a rolling hourly cache',
      'Filter by source, language, or topic',
      'One-click from trending topic to content generation',
    ],
    bulletColor: 'text-coral',
  },
  {
    id: 'ghostwriting',
    icon: Sparkles,
    title: 'AI GHOSTWRITING',
    description:
      'Pick any trend, choose a format, and Quirk generates a post in your voice. Text posts, carousel frameworks, or image prompts — ready to copy and publish.',
    details: [
      'Text posts with hook, body, and CTA in your tone',
      'Carousel frameworks — caption with image prompts for each slide',
    ],
    bulletColor: 'text-mint',
  },
  {
    id: 'voice-training',
    icon: Users,
    title: 'VOICE TRAINING',
    description:
      'Paste 3-5 of your best LinkedIn posts. Quirk learns your tone, sentence rhythm, and CTA style — then applies it to every generation.',
    details: [
      'Tone analysis — formal, casual, or somewhere in between',
      'Sentence length patterns — short and punchy or long and thoughtful',
      'CTA style — how you drive engagement',
      'Emoji frequency — your natural emoji usage',
    ],
    bulletColor: 'text-coral',
  },
  {
    id: 'daily-digest',
    icon: Mail,
    title: 'DAILY DIGEST',
    description:
      'Every morning, Quirk sends a ready-to-post bundle to your inbox. Three text posts, a carousel framework, and an image prompt — all in your voice.',
    details: [
      'Delivered at your preferred time each morning',
      'Three text posts from today\'s top trends',
      'One carousel framework and one image prompt included',
    ],
    bulletColor: 'text-mint',
  },
];

function TrendDetectionVisual() {
  return (
    <div className="relative">
      <div className="absolute -top-3 -left-3 w-full h-full bg-coral/10 rounded-card border-2 border-coral/20 -z-10" />
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono border border-deep-black bg-coral text-soft-white">
            <Github size={12} className="mr-1" />
            GITHUB
          </span>
          <span className="font-mono text-xs text-warm-gray">2h ago</span>
        </div>
        <h3 className="font-mono text-lg font-bold text-charcoal mb-2">
          prompt-engineering-guide
        </h3>
        <p className="font-serif text-sm text-warm-gray mb-3">
          A comprehensive guide to prompt engineering techniques for LLMs
        </p>
        <div className="flex items-center gap-4 text-xs text-warm-gray font-mono">
          <span>★ 12.4k</span>
          <span>Python</span>
        </div>
      </Card>
      <div className="mt-3 flex gap-2">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono border border-deep-black bg-mint text-soft-white">
          <ArrowUp size={10} className="mr-1" />
          PRODUCT HUNT
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono border border-deep-black bg-[#F5A623] text-soft-white">
          <Star size={10} className="mr-1" />
          HACKER NEWS
        </span>
      </div>
    </div>
  );
}

function GhostwritingVisual() {
  return (
    <div className="relative">
      <div className="absolute -top-3 -right-3 w-full h-full bg-mint/10 rounded-card border-2 border-mint/20 -z-10" />
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-warm-gray">YOUR VOICE</span>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono border border-deep-black bg-mint text-soft-white">
            TEXT POST
          </span>
        </div>
        <span className="font-serif text-charcoal leading-relaxed">
          <span className="text-coral">Just discovered an incredible prompt engineering guide with 12k+ stars.</span>
          {" Here's the thing most people get wrong about prompts — it's not about being fancy. It's about being specific."}
        </span>
        <div className="mt-3 pt-3 border-t border-deep-black/10 flex items-center gap-4">
          <span className="font-mono text-xs text-warm-gray">Hook + Body + CTA</span>
          <span className="font-mono text-xs text-mint">✓ Voice-matched</span>
        </div>
      </Card>
    </div>
  );
}

function VoiceTrainingVisual() {
  return (
    <div className="relative">
      <div className="absolute -top-3 -left-3 w-full h-full bg-coral/10 rounded-card border-2 border-coral/20 -z-10" />
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs text-warm-gray">YOUR VOICE PROFILE</span>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono border border-deep-black bg-coral text-soft-white">
            TRAINED
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-warm-gray uppercase">Tone</span>
            <span className="font-serif text-sm text-charcoal">Casual & direct</span>
          </div>
          <div className="w-full bg-cream rounded-full h-1.5">
            <div className="bg-coral h-1.5 rounded-full" style={{ width: '72%' }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-warm-gray uppercase">Sentences</span>
            <span className="font-serif text-sm text-charcoal">Short & punchy</span>
          </div>
          <div className="w-full bg-cream rounded-full h-1.5">
            <div className="bg-mint h-1.5 rounded-full" style={{ width: '58%' }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-warm-gray uppercase">CTA Style</span>
            <span className="font-serif text-sm text-charcoal">Question-based</span>
          </div>
          <div className="w-full bg-cream rounded-full h-1.5">
            <div className="bg-coral h-1.5 rounded-full" style={{ width: '85%' }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-warm-gray uppercase">Emoji</span>
            <span className="font-serif text-sm text-charcoal">Moderate</span>
          </div>
          <div className="w-full bg-cream rounded-full h-1.5">
            <div className="bg-mint h-1.5 rounded-full" style={{ width: '40%' }} />
          </div>
        </div>
      </Card>
    </div>
  );
}

function DailyDigestVisual() {
  return (
    <div className="relative">
      <div className="absolute -top-3 -right-3 w-full h-full bg-mint/10 rounded-card border-2 border-mint/20 -z-10" />
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Mail size={16} className="text-mint" />
          <span className="font-mono text-xs text-warm-gray">YOUR DAILY DIGEST</span>
          <span className="font-mono text-xs text-warm-gray">Sep 6</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-cream rounded">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border border-deep-black bg-coral text-soft-white">
              GITHUB
            </span>
            <span className="font-serif text-xs text-charcoal truncate">prompt-engineering-guide</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-cream rounded">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border border-deep-black bg-mint text-soft-white">
              PRODUCT HUNT
            </span>
            <span className="font-serif text-xs text-charcoal truncate">DesignAI — Turn wireframes into code</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-cream rounded">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border border-deep-black bg-[#F5A623] text-soft-white">
              HACKER NEWS
            </span>
            <span className="font-serif text-xs text-charcoal truncate">Why Rust is the future of backend</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-deep-black/10 flex items-center gap-3">
          <span className="font-mono text-[10px] text-warm-gray">3 POSTS</span>
          <span className="font-mono text-[10px] text-warm-gray">1 CAROUSEL</span>
          <span className="font-mono text-[10px] text-warm-gray">1 IMAGE PROMPT</span>
        </div>
      </Card>
    </div>
  );
}

const visuals = [TrendDetectionVisual, GhostwritingVisual, VoiceTrainingVisual, DailyDigestVisual];

interface FeatureBlockProps {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  details: string[];
  bulletColor: string;
  visual: React.ElementType;
  idx: number;
}

function FeatureBlock({ id, icon: Icon, title, description, details, bulletColor, visual: Visual, idx }: FeatureBlockProps) {
  const blockRef = useInView(idx === 0 ? 0 : 0.25);
  const shouldAnimate = idx === 0 || blockRef.inView;
  return (
    <div
      id={id}
      className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-10 items-start mb-12 md:mb-20 last:mb-0`}
      ref={idx === 0 ? undefined : blockRef.ref}
    >
      <div className={`md:w-1/2 ${shouldAnimate ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <Visual />
      </div>

      <div className={`md:w-1/2 md:text-left ${shouldAnimate ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Icon size={28} className={bulletColor} />
          <h3 className="font-mono text-xl md:text-2xl font-bold text-charcoal">
            {title}
          </h3>
        </div>
        <p className="font-serif text-warm-gray leading-relaxed mb-6 text-base md:text-lg">
          {description}
        </p>
        <ul className="space-y-3">
          {details.map((detail, i) => (
            <li
              key={detail}
              className={`flex items-start gap-3 ${shouldAnimate ? `animate-fade-in-up stagger-${Math.min(i + 2, 4)}` : 'opacity-0'}`}
            >
              <Check size={18} className={`${bulletColor} mt-0.5 shrink-0`} />
              <span className="font-serif text-charcoal">
                {detail}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Features() {
  const { openSignup } = useAuthModal();
  const ctaRef = useInView(0.4);

  return (
    <MarketingLayout>
      <PageMeta
        title="Features"
        description="Trend detection, AI ghostwriting, voice training, and daily digests — everything you need for LinkedIn content."
        canonicalPath="/features"
      />
      <div>
        {/* Feature Sections */}
        <section id="features-section" className="max-w-6xl mx-auto px-4 py-12 md:px-8 md:py-20 pb-20">
          <div className="text-center mb-16">
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-charcoal mb-4 animate-fade-in-up">
              FOUR FEATURES, ONE WORKFLOW
            </h2>
            <p className="font-serif text-xl text-warm-gray max-w-2xl mx-auto animate-fade-in-up stagger-1">
              Each feature connects to the next. Discover a trend, generate
              content in your voice, and publish — all in minutes.
            </p>
          </div>

          {features.map((feature, idx) => (
            <FeatureBlock key={feature.title} {...feature} visual={visuals[idx]} idx={idx} />
          ))}
        </section>

        {/* CTA */}
        <section id="cta" className="py-10 md:py-16">
          <div ref={ctaRef.ref} className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h2 className={`font-mono text-2xl md:text-4xl font-bold text-charcoal mb-4 ${ctaRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              READY TO START?
            </h2>
            <p className={`font-serif text-base md:text-xl text-charcoal mb-8 max-w-xl mx-auto ${ctaRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
              Free during beta. No credit card required.
            </p>
            <div className={`flex flex-wrap justify-center gap-4 ${ctaRef.inView ? 'animate-fade-in-up stagger-2' : 'opacity-0'}`}>
              <Button className="text-sm md:text-lg px-5 py-3 md:px-8 md:py-4" onClick={openSignup}>
                TRY IT FREE <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
