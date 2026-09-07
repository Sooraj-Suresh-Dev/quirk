import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BlueprintGridBg } from '@/components/layout/BlueprintGridBg';
import { TrendFilters } from '@/components/trends/TrendFilters';
import { TrendGridFetcher } from '@/components/trends/TrendGridFetcher';
import { Input } from '@/components/ui/Input';
import { Search, ArrowUp, X } from 'lucide-react';

export const Discover = memo(function Discover() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [globalMouse, setGlobalMouse] = useState({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setGlobalMouse({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY && currentScrollY > 1000) {
        setShowScrollTop(true);
      } else if (currentScrollY <= 1000) {
        setShowScrollTop(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cream relative" onMouseMove={handleMouseMove}>
      <BlueprintGridBg mouse={globalMouse} />
      <div className="relative z-10">
        <Sidebar />
        <main className="ml-[60px] p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="font-mono text-3xl font-bold text-charcoal">TRENDS</h1>
              <p className="font-serif text-warm-gray mt-1">Find trending topics and generate content</p>
            </div>

            <div className="relative mb-6" data-walkthrough="search">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
              <Input
                placeholder="Search trends..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div data-walkthrough="trend-filters">
              <TrendFilters active={activeFilter} onChange={setActiveFilter} />
            </div>

            <div className="mt-6" data-walkthrough="trend-grid">
              <TrendGridFetcher
                activeFilter={activeFilter}
                search={search}
                onClearSearch={() => setSearch('')}
                onResetFilter={() => setActiveFilter('all')}
              />
            </div>
          </div>
        </main>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 w-10 h-10 rounded-full bg-coral text-soft-white shadow-button border-2 border-deep-black flex items-center justify-center hover:shadow-button-hover active:shadow-button-active transition-all duration-150 cursor-pointer z-50"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
});
