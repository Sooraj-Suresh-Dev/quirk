import { useState } from 'react';
import { ArrowRight, Clock, Users, Sparkles, Zap, Mail } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { PageMeta } from '@/components/seo/PageMeta';
import { useAuthModal } from '@/lib/auth-modal';
import { useInView } from '@/hooks/useInView';

const beliefs = [
  {
    icon: Users,
    accent: 'coral',
    title: 'YOUR VOICE MATTERS',
    description:
      'Generic AI content makes everyone sound the same. We think that\'s broken. Every post should sound like you, not a robot.',
  },
  {
    icon: Zap,
    accent: 'mint',
    title: 'CONSISTENCY BEATS PERFECTION',
    description:
      'A good post today beats a perfect post next week. Show up, even when it\'s not perfect. That\'s how brands are built.',
  },
  {
    icon: Sparkles,
    accent: 'coral',
    title: 'HUMAN CONTROL, AI ASSISTANCE',
    description:
      'We generate. You decide what to post. No auto-publishing without your approval — because your brand is yours.',
  },
  {
    icon: Mail,
    accent: 'mint',
    title: 'TRENDS ARE NOISE WITHOUT CONTEXT',
    description:
      'We don\'t just find trending topics — we help you say something about them. Your perspective is what matters.',
  },
];

const roadmap = [
  {
    title: 'LinkedIn OAuth',
    description: 'One-click posting directly from Quirk.',
  },
  {
    title: 'Team Plans',
    description: 'Consistent brand voice across your entire team.',
  },
  {
    title: 'More AI Models',
    description: 'Anthropic Claude for premium generation.',
  },
  {
    title: 'Analytics',
    description: 'Track what content performs best.',
  },
];

export function About() {
  const { openSignup } = useAuthModal();
  const heroRef = useInView(0.3);
  const storyRef = useInView(0.3);
  const beliefsRef = useInView(0.2);
  const roadmapRef = useInView(0.2);
  const ctaRef = useInView(0.3);
  const [quoteComplete, setQuoteComplete] = useState(false);

  return (
    <MarketingLayout>
      <PageMeta
        title="Built for Creators Who Show Up"
        description="Learn why we built Quirk — AI-powered LinkedIn content that sounds like you."
        canonicalPath="/about"
      />
      <main>
        {/* Hero — The Problem */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div ref={heroRef.ref}>
              <p className={`font-mono text-sm uppercase text-coral mb-4 tracking-wider ${heroRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                WHY WE BUILT THIS
              </p>
              <h1 className={`font-mono text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal mb-6 tracking-tight leading-tight ${heroRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
                BUILT FOR CREATORS
                <br />
                WHO SHOW UP
              </h1>
              <p className={`font-serif text-xl text-warm-gray max-w-lg leading-relaxed ${heroRef.inView ? 'animate-fade-in-up stagger-2' : 'opacity-0'}`}>
                The gap between knowing you should post on LinkedIn and actually
                doing it is massive. We built Quirk to close it.
              </p>
            </div>

            <div className={`relative ${heroRef.inView ? 'animate-fade-in-up stagger-3' : 'opacity-0'}`}>
              <div className="absolute -top-4 -right-4 w-full h-full bg-coral/10 rounded-card border-2 border-coral/20 -z-10" />
              <Card className="p-8">
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                      <span className="font-mono text-lg font-bold text-coral">1</span>
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase text-warm-gray tracking-wider mb-1">The Problem</p>
                      <p className="font-serif text-charcoal">You know you should be posting on LinkedIn.</p>
                    </div>
                  </div>
                  <div className="h-px bg-deep-black/10" />
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-mint/10 flex items-center justify-center shrink-0">
                      <span className="font-mono text-lg font-bold text-mint">2</span>
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase text-warm-gray tracking-wider mb-1">The Reality</p>
                      <p className="font-serif text-charcoal">It takes time, consistency is hard, and generic AI content doesn't sound like you.</p>
                    </div>
                  </div>
                  <div className="h-px bg-deep-black/10" />
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                      <span className="font-mono text-lg font-bold text-coral">3</span>
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase text-warm-gray tracking-wider mb-1">Our Answer</p>
                      <p className="font-serif text-charcoal">Show up consistently with content that sounds like you.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Founding Story */}
        <section className="border-y-3 border-deep-black bg-soft-white">
          <div ref={storyRef.ref} className="max-w-4xl mx-auto px-5 md:px-8 py-8">
            <blockquote className="font-serif text-2xl lg:text-3xl text-charcoal leading-relaxed italic max-w-4xl min-h-[3.5rem]">
              {storyRef.inView && (
                <TypewriterText
                  text={`"Everyone deserves a voice on LinkedIn — not just those who can afford ghostwriters or have hours to craft each post."`}
                  speed={25}
                  delay={300}
                  onComplete={() => setQuoteComplete(true)}
                />
              )}
            </blockquote>
            <div className="mt-6 min-h-[1.5rem]">
              {quoteComplete && (
                <TypewriterText
                  text="— The Quirk Mission"
                  speed={35}
                  className="font-mono text-sm uppercase text-warm-gray tracking-wider"
                />
              )}
            </div>
          </div>
        </section>

        {/* What We Believe */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 py-20">
          <div ref={beliefsRef.ref}>
            <div className="text-center mb-16">
              <p className={`font-mono text-sm uppercase text-coral mb-4 tracking-wider ${beliefsRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                OUR PHILOSOPHY
              </p>
              <h2 className={`font-mono text-3xl font-bold text-charcoal mb-4 ${beliefsRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
                WHAT WE BELIEVE
              </h2>
              <p className={`font-serif text-xl text-warm-gray max-w-2xl mx-auto ${beliefsRef.inView ? 'animate-fade-in-up stagger-2' : 'opacity-0'}`}>
                These principles guide every decision we make — from product design to AI model selection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {beliefs.map(({ icon: Icon, accent, title, description }, i) => (
                <Card
                  key={title}
                  hover
                  className={`${accent === 'coral' ? 'border-coral bg-coral/5 relative' : ''} ${beliefsRef.inView ? (i === 0 ? 'animate-fade-in-up stagger-2' : i === 1 ? 'animate-fade-in-up stagger-3' : 'animate-fade-in-up stagger-4') : 'opacity-0'}`}
                >
                  {accent === 'coral' && (
                    <span className="absolute -top-3 left-4 font-mono text-xs uppercase tracking-wider bg-coral text-soft-white px-2 py-0.5 rounded">
                      Core
                    </span>
                  )}
                  <Icon size={28} className={`mb-4 ${accent === 'coral' ? 'text-coral' : 'text-mint'}`} />
                  <h3 className="font-mono text-lg font-bold text-charcoal mb-2">
                    {title}
                  </h3>
                  <p className="font-serif text-warm-gray">{description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Where We're Headed */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
          <div ref={roadmapRef.ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Headline + Roadmap */}
            <div>
              <div className="mb-12">
                <p className={`font-mono text-sm uppercase text-coral mb-4 tracking-wider ${roadmapRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                  LOOKING AHEAD
                </p>
                <h2 className={`font-mono text-3xl font-bold text-charcoal ${roadmapRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
                  WHAT'S NEXT
                </h2>
              </div>

              <div className="space-y-4">
                {roadmap.map(({ title, description }, i) => (
                  <div
                    key={title}
                    className={`flex items-start gap-4 ${roadmapRef.inView ? `animate-fade-in-up stagger-${Math.min(i + 2, 4)}` : 'opacity-0'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-coral/10 flex items-center justify-center shrink-0 mt-1">
                      <Clock size={16} className="text-coral" />
                    </div>
                    <div>
                      <h3 className="font-mono text-lg font-bold text-charcoal mb-1">
                        {title}
                      </h3>
                      <p className="font-serif text-warm-gray">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual Card */}
            <div className={`${roadmapRef.inView ? 'animate-fade-in-up stagger-3' : 'opacity-0'}`}>
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-full h-full bg-mint/10 rounded-card border-2 border-mint/20 -z-10" />
                <Card className="p-6 md:p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center">
                        <span className="font-mono text-xl font-bold text-coral">Q2</span>
                      </div>
                      <div>
                        <p className="font-mono text-xs uppercase text-warm-gray tracking-wider">Phase</p>
                        <p className="font-mono text-lg font-bold text-charcoal">Phase 2</p>
                      </div>
                    </div>
                    <div className="h-px bg-deep-black/10" />
                    <div>
                      <p className="font-mono text-xs uppercase text-warm-gray tracking-wider mb-2">Coming Soon</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-coral" />
                          <span className="font-serif text-sm text-charcoal">LinkedIn OAuth</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-mint" />
                          <span className="font-serif text-sm text-charcoal">Team Plans</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-coral" />
                          <span className="font-serif text-sm text-charcoal">More AI Models</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-mint" />
                          <span className="font-serif text-sm text-charcoal">Analytics</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div ref={ctaRef.ref} className="max-w-4xl mx-auto px-5 md:px-8 py-20 text-center">
            <h2 className={`font-mono text-3xl sm:text-4xl font-bold text-charcoal mb-4 ${ctaRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              READY TO FIND YOUR QUIRK?
            </h2>
            <p className={`font-serif text-xl text-warm-gray mb-8 max-w-xl mx-auto ${ctaRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
              Join the beta and start creating LinkedIn content that actually
              sounds like you.
            </p>
            <div className={`flex flex-wrap justify-center gap-4 ${ctaRef.inView ? 'animate-fade-in-up stagger-2' : 'opacity-0'}`}>
              <Button className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4" onClick={openSignup}>
                START CREATING <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
