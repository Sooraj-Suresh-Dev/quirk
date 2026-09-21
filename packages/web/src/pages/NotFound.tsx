import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { PageMeta } from '@/components/seo/PageMeta';
import { useInView } from '@/hooks/useInView';

export function NotFound() {
  const heroRef = useInView(0.3);
  const ctaRef = useInView(0.3);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') window.history.back();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <MarketingLayout>
      <>
        <PageMeta
          title="Page Not Found"
          description="The page you're looking for doesn't exist or has been moved."
          canonicalPath="/404"
        />
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
      </>
      <main className="min-h-[60vh] flex items-center justify-center px-5 md:px-8 pb-16 md:pb-24">
        <div className="text-center max-w-md mx-auto">
          <div ref={heroRef.ref} className={heroRef.inView ? 'animate-fade-in-up' : 'opacity-0'}>
            <p className="font-mono text-sm uppercase text-coral mb-4 tracking-wider">404</p>
            <h1 className="font-mono text-5xl sm:text-7xl lg:text-8xl font-bold text-charcoal mb-6 leading-tight tracking-tight">
              PAGE NOT FOUND
            </h1>
            <p className="font-serif text-xl text-warm-gray mb-10 max-w-lg mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
              No worries — it happens to the best of us.
            </p>
          </div>

          <div ref={ctaRef.ref} className={ctaRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}>
            <Button onClick={() => window.location.href = '/'}>
              <ArrowLeft size={20} className="mr-2" />
              BACK TO HOMEPAGE
            </Button>
          </div>
        </div>
      </main>
    </MarketingLayout>
  );
}