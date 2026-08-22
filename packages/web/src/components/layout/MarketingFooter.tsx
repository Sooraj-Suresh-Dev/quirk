import { Link } from 'react-router-dom';

export function MarketingFooter() {
  return (
    <footer className="border-t-3 border-deep-black bg-cream">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="font-mono text-2xl font-bold text-coral">QUIRK</span>
            <p className="font-serif text-warm-gray mt-2">
              Your LinkedIn, your quirk
            </p>
          </div>

          <div>
            <h4 className="font-mono text-sm uppercase text-charcoal mb-4">
              Product
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/features"
                className="font-serif text-warm-gray hover:text-charcoal transition-colors"
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="font-serif text-warm-gray hover:text-charcoal transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/faq"
                className="font-serif text-warm-gray hover:text-charcoal transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-sm uppercase text-charcoal mb-4">
              Company
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/about"
                className="font-serif text-warm-gray hover:text-charcoal transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-sm uppercase text-charcoal mb-4">
              Legal
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/privacy"
                className="font-serif text-warm-gray hover:text-charcoal transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="font-serif text-warm-gray hover:text-charcoal transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-deep-black/10">
          <p className="font-serif text-sm text-warm-gray">
            &copy; 2026 Quirk. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
