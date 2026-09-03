import { useState, useEffect, memo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TrendFilters } from '@/components/trends/TrendFilters';
import { TrendGridFetcher } from '@/components/trends/TrendGridFetcher';
import { Input } from '@/components/ui/Input';
import { Search, ArrowUp } from 'lucide-react';

export const Discover = memo(function Discover() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

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
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-[60px] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="font-mono text-3xl font-bold text-charcoal">DISCOVER</h1>
            <p className="font-serif text-warm-gray mt-1">Find trending topics and generate content</p>
          </div>

          <div className="relative mb-6">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
            <Input
              placeholder="Search trends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
            />
          </div>

          <TrendFilters active={activeFilter} onChange={setActiveFilter} />

          <div className="mt-6">
            <TrendGridFetcher activeFilter={activeFilter} search={search} />
          </div>
        </div>
      </main>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-10 h-10 rounded-full bg-coral text-soft-white shadow-button border-2 border-deep-black flex items-center justify-center hover:shadow-button-hover active:shadow-button-active transition-all duration-150 cursor-pointer z-50"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
});
