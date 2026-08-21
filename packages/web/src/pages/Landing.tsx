import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Mail, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const features = [
  {
    icon: TrendingUp,
    title: 'TREND DETECTION',
    description: 'Auto-discover trending topics from GitHub and Hacker News every hour.',
  },
  {
    icon: Sparkles,
    title: 'AI GHOSTWRITING',
    description: 'Generate text posts, carousels, and image prompts in your personal brand voice.',
  },
  {
    icon: Mail,
    title: 'DAILY DIGEST',
    description: 'Wake up to ready-to-post content delivered to your inbox every morning.',
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      <nav className="flex items-center justify-between px-8 py-6">
        <span className="font-mono text-2xl font-bold text-coral">QUIRK</span>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">LOG IN</Button>
          </Link>
          <Link to="/signup">
            <Button>GET STARTED</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="font-mono text-5xl font-bold text-charcoal mb-4 tracking-tight">
            YOUR LINKEDIN, YOUR QUIRK
          </h1>
          <p className="font-serif text-xl text-warm-gray max-w-2xl mx-auto">
            AI-powered content generation from trending topics. Train your voice, generate posts, grow your presence.
          </p>
          <div className="mt-8">
            <Link to="/signup">
              <Button className="text-lg px-8 py-4">
                START CREATING <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} hover>
              <Icon size={32} className="text-coral mb-4" />
              <h3 className="font-mono text-lg font-bold text-charcoal mb-2">{title}</h3>
              <p className="font-serif text-warm-gray">{description}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
