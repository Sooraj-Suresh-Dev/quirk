import { useState } from 'react';
import { Plus, Mail, Zap, Shield, Users, Globe } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { PageMeta } from '@/components/seo/PageMeta';
import { useInView } from '@/hooks/useInView';

const faqCategories = [
  {
    label: 'GETTING STARTED',
    icon: Zap,
    faqs: [
      {
        question: 'What is Quirk?',
        answer:
          'Quirk is an AI-powered content generation platform that helps you create LinkedIn posts from trending tech topics. It combines trend detection with personal voice training, so every post sounds like you — not generic AI content.',
      },
      {
        question: 'How do I get started?',
        answer:
          'Sign up with your email (no credit card required), paste 3-5 of your best LinkedIn posts to train your voice, and start generating content from trending topics. The whole process takes about 2 minutes.',
      },
      {
        question: 'How does voice training work?',
        answer:
          'Paste 3-5 of your best LinkedIn posts into Quirk. The system analyzes your tone, sentence length, CTA style, and emoji frequency to create a voice profile. All subsequent content generation uses this profile to match your writing style.',
      },
      {
        question: 'How long does it take to see results?',
        answer:
          'Most users generate their first LinkedIn post within 2 minutes of signing up. Voice training takes about 30 seconds, and content generation is instant.',
      },
    ],
  },
  {
    label: 'FEATURES',
    icon: Users,
    faqs: [
      {
        question: 'What trend sources do you support?',
        answer:
          'Quirk currently tracks GitHub Trending, Product Hunt, Hacker News, and TechCrunch. Trends are updated every hour and cached for efficiency.',
      },
      {
        question: 'What AI models do you use?',
        answer:
          'Quirk uses OpenAI GPT-4o for content generation by default, with Llama available as an alternative. We plan to add Anthropic Claude as a premium option in a future release.',
      },
      {
        question: 'How many posts can I generate?',
        answer:
          'There is a rate limit of 20 post generations per hour. This ensures fair usage and prevents abuse. Most users find this more than sufficient for daily content creation.',
      },
      {
        question: 'Can I auto-post to LinkedIn?',
        answer:
          'Not yet. In v1, you copy generated content and post manually on LinkedIn. We plan to add LinkedIn OAuth and auto-posting in a future release.',
      },
    ],
  },
  {
    label: 'PRICING & ACCOUNT',
    icon: Shield,
    faqs: [
      {
        question: 'Is Quirk free?',
        answer:
          'Yes, Quirk is completely free. All features — trend detection, AI generation, voice training, and daily digest — are included at no cost. No trial, no credit card, no hidden fees.',
      },
      {
        question: 'Can I export my data?',
        answer:
          'Yes. Your posts, voice profile, and generated content are always yours. Export or delete anything from your account settings.',
      },
      {
        question: 'How do I cancel my account?',
        answer:
          'You can delete your account from the Settings page. This will permanently remove all your data from our systems, including your voice profile and generated content. This action cannot be undone.',
      },
    ],
  },
  {
    label: 'TECHNICAL',
    icon: Globe,
    faqs: [
      {
        question: 'What browsers are supported?',
        answer:
          'Quirk works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.',
      },
      {
        question: 'Is my data secure?',
        answer:
          'Yes. We use industry-standard encryption for all data in transit and at rest. Your voice profile and generated content are stored securely and never shared with third parties.',
      },
      {
        question: 'Do you offer team plans?',
        answer:
          'Not yet. Currently, Quirk is designed for individual creators. We plan to add team and enterprise features in a future release.',
      },
    ],
  },
];

export function FAQ() {
  const [openFaqs, setOpenFaqs] = useState<Set<string>>(new Set());
  const [searchQuery] = useState('');
  const heroRef = useInView(0.3);
  const faqRef = useInView(0.2);
  const ctaRef = useInView(0.3);

  const toggleFaq = (faqKey: string) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(faqKey)) {
        next.delete(faqKey);
      } else {
        next.add(faqKey);
      }
      return next;
    });
  };

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  return (
    <MarketingLayout>
      <PageMeta
        title="Frequently Asked Questions"
        description="Everything you need to know about Quirk — features, pricing, voice training, and more."
        canonicalPath="/faq"
      />
      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 py-10 md:px-8 md:pt-16 md:pb-8 text-center">
          <div ref={heroRef.ref}>
            <p className={`font-mono text-sm uppercase text-coral mb-4 tracking-wider ${heroRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Support
            </p>
            <h1 className={`font-mono text-2xl md:text-4xl font-bold text-charcoal mb-4 tracking-tight ${heroRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
              FREQUENTLY ASKED QUESTIONS
            </h1>
            <p className={`font-serif text-base md:text-xl text-warm-gray mb-8 ${heroRef.inView ? 'animate-fade-in-up stagger-2' : 'opacity-0'}`}>
              Everything you need to know about Quirk
            </p>
            <div className={`flex items-center justify-center gap-6 font-mono text-xs text-warm-gray ${heroRef.inView ? 'animate-fade-in-up stagger-3' : 'opacity-0'}`}>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-coral" />
                14 FAQs
              </span>
            </div>
          </div>
        </section>

       

        {/* FAQ 2x2 Grid */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <div ref={faqRef.ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {filteredCategories.map((category, catIdx) => {
              const CategoryIcon = category.icon;
              return (
                <Card
                  key={category.label}
                  className={faqRef.inView ? 'animate-fade-in-up' : 'opacity-0'}
                  style={{ animationDelay: `${catIdx * 0.15}s` }}
                >
                  <div role="group" aria-labelledby={`category-${category.label}`}>
                    <div className="flex items-center gap-3 mb-1">
                      <CategoryIcon size={20} className="text-coral" />
                      <h2 id={`category-${category.label}`} className="font-mono text-lg uppercase tracking-wider text-charcoal font-bold">
                        {category.label}
                      </h2>
                    </div>
                    <p className="font-mono text-xs uppercase tracking-wider text-coral mb-4">
                      {category.faqs.length} {category.faqs.length === 1 ? 'question' : 'questions'}
                    </p>

                    <div className="divide-y divide-deep-black/10">
                      {category.faqs.map((faq) => {
                        const faqKey = `${category.label}-${faq.question}`;
                        const isOpen = openFaqs.has(faqKey);
                        return (
                          <div key={faqKey}>
                            <button
                              onClick={() => toggleFaq(faqKey)}
                              aria-expanded={isOpen}
                              aria-controls={`faq-answer-${faqKey}`}
                              className="w-full flex items-center justify-between py-4 text-left cursor-pointer hover:translate-x-1 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-coral focus-visible:outline-offset-2 rounded"
                            >
                              <span
                                id={`faq-question-${faqKey}`}
                                className="font-mono text-sm font-bold text-charcoal pr-4"
                              >
                                {faq.question}
                              </span>
                              <Plus
                                size={16}
                                className={`shrink-0 text-warm-gray transition-all duration-300 ${
                                  isOpen ? 'rotate-45 scale-110' : ''
                                }`}
                              />
                            </button>
                            <div
                              id={`faq-answer-${faqKey}`}
                              role="region"
                              aria-labelledby={`faq-question-${faqKey}`}
                              className={`overflow-hidden transition-all duration-300 ease-out ${
                                isOpen ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'
                              }`}
                            >
                              <p className="font-serif text-sm text-warm-gray leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="font-mono text-sm text-warm-gray">No FAQs match your search.</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section>
          <div ref={ctaRef.ref} className="max-w-4xl mx-auto px-4 py-12 md:px-8 md:py-20 text-center">
            <h2 className={`font-mono text-2xl md:text-4xl font-bold text-charcoal mb-4 ${ctaRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              STILL HAVE QUESTIONS?
            </h2>
            <p className={`font-serif text-base md:text-xl text-charcoal mb-8 max-w-xl mx-auto ${ctaRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
              We're here to help. Reach out directly or get started and see for yourself.
            </p>
            <div className={`flex flex-wrap justify-center gap-4 ${ctaRef.inView ? 'animate-fade-in-up stagger-2' : 'opacity-0'}`}>
               <Button
                variant="secondary"
                className="text-sm md:text-lg px-5 py-3 md:px-8 md:py-4"
              >
                <Mail size={16}/>
                 <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=soorajsuresh9597@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                >EMAIL SUPPORT</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </MarketingLayout>
  );
}
