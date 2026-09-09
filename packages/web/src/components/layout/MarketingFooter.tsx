import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin } from 'lucide-react';

export function MarketingFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const reveal = (stagger?: number) => {
    if (!isVisible) return 'opacity-0';
    const base = 'animate-footer-reveal';
    if (stagger === 1) return `${base} stagger-1`;
    if (stagger === 2) return `${base} stagger-2`;
    return base;
  };

  const links = [
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
    { to: '/privacy', label: 'Privacy' },
    { to: '/terms', label: 'Terms' },
  ];

  return (
    <footer ref={footerRef} className="border-t-3 border-deep-black bg-cream">
      <noscript>
        <style>{`.animate-footer-reveal { opacity: 1 !important; }`}</style>
      </noscript>
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className={`mb-6 ${reveal()}`}>
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Quirk" className="h-12 w-auto" />
            <span className="font-mono text-3xl font-bold text-coral">QUIRK</span>
          </div>
          <p className="font-serif text-charcoal mt-2 text-sm">
            Your LinkedIn, your quirk
          </p>
        </div>

        <div className={`flex flex-col gap-4 mb-8 ${reveal(1)}`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-x-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
              {links.map((link, i) => (
                <span key={link.to} className="flex items-center gap-2">
                  <Link
                    to={link.to}
                    className="font-mono text-xs sm:text-sm text-charcoal hover:text-coral focus:outline-none focus:text-coral focus:ring-2 focus:ring-coral/50 rounded transition-colors"
                  >
                    {link.label}
                  </Link>
                  {i < links.length - 1 && (
                    <span className="text-deep-black/40 select-none">·</span>
                  )}
                </span>
              ))}
            </div>
            <div className="flex gap-2 sm:ml-auto">
              <a
                href="https://github.com/Sooraj-Suresh-Dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-pill border-2 border-deep-black bg-soft-white text-warm-gray shadow-button hover:shadow-button-hover hover:text-[#24292E] hover:border-[#24292E] focus:outline-none focus:text-charcoal focus:ring-2 focus:ring-coral/50 transition-all duration-150"
                title="GitHub"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="https://linkedin.com/in/sooraj2004"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-pill border-2 border-deep-black bg-soft-white text-warm-gray shadow-button hover:shadow-button-hover hover:text-[#0A66C2] hover:border-[#0A66C2] focus:outline-none focus:text-charcoal focus:ring-2 focus:ring-coral/50 transition-all duration-150"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className={`pt-6 border-t-2 border-deep-black/20 ${reveal(2)}`}>
          <p className="font-mono text-xs text-charcoal">
            &copy; 2026 Quirk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
