import { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, TrendingUp, Mail, ArrowRight, Github, Zap, Star, ArrowUp, Pause, Play, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { PageMeta } from '@/components/seo/PageMeta';
import { useAuthModal } from '@/lib/auth-modal';
import { TrendsSection } from '@/components/trends/TrendsSection';

const sampleTrends = [
  {
    source: 'GITHUB',
    sourceIcon: Github,
    time: '2h ago',
    title: 'prompt-engineering-guide',
    summary: 'A comprehensive guide to prompt engineering techniques for LLMs',
    metric: '★ 12.4k',
    lang: 'Python',
  },
  {
    source: 'PRODUCT HUNT',
    sourceIcon: ArrowUp,
    time: '4h ago',
    title: 'DesignAI — Turn wireframes into code',
    summary: 'Upload a sketch and get production-ready React components in seconds',
    metric: '▲ 892',
    lang: 'SaaS',
  },
  {
    source: 'HACKER NEWS',
    sourceIcon: Star,
    time: '1h ago',
    title: 'Why Rust is the future of backend',
    summary: 'A deep dive into memory safety, concurrency, and the growing ecosystem',
    metric: '▲ 341',
    lang: 'Rust',
  },
];

const samplePosts = [
  {
    hook: "Just discovered an incredible prompt engineering guide with 12k+ stars.",
    body: " Here's the thing most people get wrong about prompts — it's not about being fancy. It's about being specific.",
    label: 'Hook + Body + CTA',
  },
  {
    hook: "DesignAI just launched and it's genuinely impressive.",
    body: " Uploaded a rough wireframe and got back production-ready React. The gap between idea and implementation just got a lot smaller.",
    label: 'Observation + Insight',
  },
  {
    hook: "Hot take: Rust isn't just for systems programmers anymore.",
    body: " The memory safety guarantees make it perfect for any backend service where reliability matters. The ecosystem has caught up.",
    label: 'Hook + Take + Evidence',
  },
];

const marqueeSources = [
  { label: 'GitHub', icon: Github, color: 'text-coral' },
  { label: 'Product Hunt', icon: Rocket, color: 'text-mint' },
  { label: 'Hacker News', icon: ArrowUp, color: 'text-[#F5A623]' },
];

const features = [
  {
    icon: TrendingUp,
    title: 'TREND DETECTION',
    description:
      'Auto-discover trending topics from GitHub, Product Hunt, Hacker News, and TechCrunch every hour.',
    accent: false,
  },
  {
    icon: Sparkles,
    title: 'AI GHOSTWRITING',
    description:
      'Generate text posts, carousels, and image prompts in your personal brand voice.',
    accent: true,
  },
  {
    icon: Mail,
    title: 'DAILY DIGEST',
    description:
      'Wake up to ready-to-post content delivered to your inbox every morning.',
    accent: false,
  },
];

function DemoCard({ idx }: { idx: number }) {
  const trend = sampleTrends[idx];
  const post = samplePosts[idx];
  const SourceIcon = trend.sourceIcon;

  return (
    <>
      <Card className="mb-4 min-h-[200px] flex flex-col justify-between overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono border border-deep-black bg-coral text-soft-white">
            <SourceIcon size={12} className="mr-1" />
            {trend.source}
          </span>
          <span className="font-mono text-xs text-warm-gray">{trend.time}</span>
        </div>
        <h3 className="font-mono text-lg font-bold text-charcoal mb-2">
          {trend.title}
        </h3>
        <p className="font-serif text-sm text-warm-gray mb-3">
          {trend.summary}
        </p>
        <div className="flex items-center gap-4 text-xs text-warm-gray font-mono">
          <span>{trend.metric}</span>
          <span>{trend.lang}</span>
        </div>
      </Card>

      <div className="flex justify-center my-3">
        <div className="flex items-center gap-2 font-mono text-sm text-coral animate-pulse-coral">
          <Zap size={16} />
          <span>GENERATE</span>
          <ArrowRight size={16} />
        </div>
      </div>

      <Card className="border-mint min-h-[240px] flex flex-col justify-between overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-xs text-warm-gray">YOUR VOICE</span>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono border border-deep-black bg-mint text-soft-white">
            TEXT POST
          </span>
        </div>
        <span className="font-serif text-charcoal leading-relaxed">
          <span className="text-coral">{post.hook}</span>
          {post.body}
        </span>
        <div className="mt-3 pt-3 border-t border-deep-black/10 flex items-center gap-4">
          <span className="font-mono text-xs text-warm-gray">{post.label}</span>
          <span className="font-mono text-xs text-mint">✓ Voice-matched</span>
        </div>
      </Card>
    </>
  );
}

function HeroDemo() {
  const [currIdx, setCurrIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isCrossfading, setIsCrossfading] = useState(false);

  const goToSample = useCallback((idx: number) => {
    if (idx === currIdx || isCrossfading) return;
    setPrevIdx(currIdx);
    setCurrIdx(idx);
    setIsCrossfading(true);
    setTimeout(() => {
      setPrevIdx(null);
      setIsCrossfading(false);
    }, 600);
  }, [currIdx, isCrossfading]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      goToSample((currIdx + 1) % sampleTrends.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isPaused, currIdx, goToSample]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      goToSample((currIdx + 1) % sampleTrends.length);
    } else if (e.key === 'ArrowLeft') {
      goToSample((currIdx - 1 + sampleTrends.length) % sampleTrends.length);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsPaused((p) => !p);
    }
  }, [currIdx, goToSample]);

  return (
    <div
      className="relative animate-slide-in-right"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Product preview carousel"
      aria-live="polite"
    >
      <div className="absolute -top-4 -right-4 w-full h-full bg-coral/10 rounded-card border-2 border-coral/20 -z-10" />

      <div className="relative">
        {prevIdx !== null && (
          <div className="absolute inset-0 animate-fade-out-down">
            <DemoCard idx={prevIdx} />
          </div>
        )}
        <div className={prevIdx !== null ? 'animate-fade-in-up' : ''}>
          <DemoCard idx={currIdx} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={() => setIsPaused((p) => !p)}
          className="flex items-center gap-1.5 font-mono text-xs text-warm-gray hover:text-charcoal transition-colors cursor-pointer"
          aria-label={isPaused ? 'Resume carousel' : 'Pause carousel'}
        >
          {isPaused ? <Play size={12} /> : <Pause size={12} />}
          {isPaused ? 'PLAY' : 'PAUSE'}
        </button>
        <div className="flex gap-1.5">
          {sampleTrends.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSample(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === currIdx ? 'bg-coral w-4' : 'bg-warm-gray/30'
              }`}
              aria-label={`Show example ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function Landing() {
  const { openSignup } = useAuthModal();
  const featuresRef = useInView(0.4);
  const ctaRef = useInView(0.4);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    let animId: number;
    let pos = 0;

    const tick = () => {
      pos -= 1;
      const oneSetWidth = el.scrollWidth / 3;
      if (Math.abs(pos) >= oneSetWidth) pos += oneSetWidth;
      el.style.transform = `translateX(${pos}px)`;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <MarketingLayout>
      <PageMeta
        title="Your LinkedIn, Your Quirk"
        description="AI-powered LinkedIn content from trending topics. Train your voice, grow your presence."
        canonicalPath="/"
      />
      <main>
        <noscript>
          <style>{`.animate-fade-in-up { opacity: 1 !important; }`}</style>
        </noscript>
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-10 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <h1 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal mb-6 tracking-tight leading-tight animate-slide-up">
                YOUR LINKEDIN,
                <br />
                YOUR QUIRK
              </h1>
              <p className="font-serif text-lg sm:text-xl text-warm-gray max-w-lg mb-8 leading-relaxed animate-slide-up-delay-1">
                AI-powered content generation from trending topics. Train your
                voice, grow your presence.
              </p>
              <div className="flex flex-wrap gap-4 animate-slide-up-delay-2">
                <Button className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4" onClick={openSignup}>
                  START CREATING <ArrowRight size={20} />
                </Button>
                <Button
                  variant="secondary"
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
                  onClick={() => document.getElementById('trends')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  SEE IT IN ACTION
                </Button>
              </div>
            </div>

            {/* Right: Product Preview */}
            <HeroDemo />
          </div>
        </section>

        {/* Trend Sources Marquee */}
        <section className="border-y-3 border-deep-black bg-soft-white py-6 overflow-hidden">
            <div ref={marqueeRef} className="flex whitespace-nowrap">
              {[...marqueeSources, ...marqueeSources, ...marqueeSources].map((source, i) => (
                <span key={i} className="mx-8 font-mono text-base flex items-center gap-2">
                  <source.icon size={18} className={source.color} />
                  <span className="text-warm-gray">{source.label}</span>
                </span>
              ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-6xl mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-12">
          <div ref={featuresRef.ref}>
            <div className="text-center mb-16">
              <h2 className={`font-mono text-3xl font-bold text-charcoal mb-4 ${featuresRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                FROM TREND TO POST IN SECONDS
              </h2>
              <p className={`font-serif text-xl text-warm-gray max-w-2xl mx-auto ${featuresRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
                Stop scrolling through feeds. Quirk finds what matters and
                generates content in your voice — ready to post.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map(({ icon: Icon, title, description, accent }, i) => (
                <Card
                  key={title}
                  hover
                  className={`${accent ? 'border-coral bg-coral/5 relative' : ''} ${featuresRef.inView ? (i === 0 ? 'animate-fade-in-up stagger-2' : i === 1 ? 'animate-fade-in-up stagger-3' : 'animate-fade-in-up stagger-4') : 'opacity-0'}`}
                >
                  {accent && (
                    <span className="absolute -top-3 left-4 font-mono text-xs uppercase tracking-wider bg-coral text-soft-white px-2 py-0.5 rounded">
                      Core
                    </span>
                  )}
                  <Icon size={32} className={`mb-4 ${accent ? 'text-coral' : 'text-warm-gray'}`} />
                  <h3 className="font-mono text-lg font-bold text-charcoal mb-2">
                    {title}
                  </h3>
                  <p className="font-serif text-warm-gray">{description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trends Section */}
       <div id="trends">
          <TrendsSection showFilters={false} />
        </div>

        {/* Final CTA */}
        <section id="cta" className="py-16">
          <div ref={ctaRef.ref} className="max-w-4xl mx-auto px-5 md:px-8 text-center">
            <h2 className={`font-mono text-3xl sm:text-4xl font-bold text-charcoal mb-4 ${ctaRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              READY TO FIND YOUR QUIRK?
            </h2>
            <p className={`font-serif text-xl text-charcoal mb-8 max-w-xl mx-auto ${ctaRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
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
