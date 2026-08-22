import { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { useAuthModal } from '@/lib/auth-modal';

const faqs = [
  {
    question: 'What is Quirk?',
    answer:
      'Quirk is an AI-powered content generation platform that helps you create LinkedIn posts from trending tech topics. It combines trend detection with personal voice training, so every post sounds like you — not generic AI content.',
  },
  {
    question: 'How does voice training work?',
    answer:
      'Paste 3-5 of your best LinkedIn posts into Quirk. The system analyzes your tone, sentence length, CTA style, and emoji frequency to create a voice profile. All subsequent content generation uses this profile to match your writing style.',
  },
  {
    question: 'What AI models do you use?',
    answer:
      'Quirk uses OpenAI GPT-4o mini for content generation by default. We plan to add Anthropic Claude as a premium option in a future release.',
  },
  {
    question: 'Is Quirk free?',
    answer:
      'Yes, Quirk is completely free during our current phase. All features — trend detection, AI generation, voice training, and daily digest — are included at no cost.',
  },
  {
    question: 'Can I auto-post to LinkedIn?',
    answer:
      'Not yet. In v1, you copy generated content and post manually on LinkedIn. We plan to add LinkedIn OAuth and auto-posting in a future release.',
  },
  {
    question: 'How do I cancel my account?',
    answer:
      'You can delete your account from the Settings page. This will remove all your data from our systems, including your voice profile and generated content.',
  },
  {
    question: 'What trend sources do you support?',
    answer:
      'Quirk currently tracks GitHub Trending, Product Hunt, Hacker News, and TechCrunch. Trends are updated every hour and cached for efficiency.',
  },
  {
    question: 'How many posts can I generate?',
    answer:
      'There is a rate limit of 20 post generations per hour. This ensures fair usage and prevents abuse. Most users find this more than sufficient for daily content creation.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { openSignup } = useAuthModal();

  return (
    <MarketingLayout>
      <main className="max-w-3xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="font-mono text-4xl font-bold text-charcoal mb-4">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="font-serif text-xl text-warm-gray">
            Everything you need to know about Quirk
          </p>
        </div>

        <div className="space-y-4 mb-16">
          {faqs.map((faq, idx) => (
            <Card key={idx}>
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <h3 className="font-mono text-lg font-bold text-charcoal pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  size={20}
                  className={`text-warm-gray shrink-0 transition-transform duration-200 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="mt-4 pt-4 border-t border-deep-black/10">
                  <p className="font-serif text-warm-gray">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h2 className="font-mono text-2xl font-bold text-charcoal mb-4">
            STILL HAVE QUESTIONS?
          </h2>
          <p className="font-serif text-warm-gray mb-8">
            We're here to help. Reach out and we'll get back to you.
          </p>
          <Button className="text-lg px-8 py-4" onClick={openSignup}>
              GET STARTED <ArrowRight size={20} />
            </Button>
        </div>
      </main>
    </MarketingLayout>
  );
}
