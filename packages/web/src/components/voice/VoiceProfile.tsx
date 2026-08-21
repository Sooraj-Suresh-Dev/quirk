import { Card } from '@/components/ui/Card';

interface VoiceProfileProps {
  profile: {
    tone: string;
    avgSentenceLength: number;
    ctaStyle: string;
    emojiFrequency: number;
  };
  samples: string[];
}

export function VoiceProfile({ profile, samples }: VoiceProfileProps) {
  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-mono text-sm font-bold text-charcoal mb-4">ANALYZED PROFILE</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-mono text-xs text-warm-gray">TONE</p>
            <p className="font-serif text-charcoal capitalize">{profile.tone}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-warm-gray">AVG SENTENCE LENGTH</p>
            <p className="font-serif text-charcoal">{profile.avgSentenceLength} words</p>
          </div>
          <div>
            <p className="font-mono text-xs text-warm-gray">CTA STYLE</p>
            <p className="font-serif text-charcoal capitalize">{profile.ctaStyle}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-warm-gray">EMOJI FREQUENCY</p>
            <p className="font-serif text-charcoal">
              {profile.emojiFrequency > 0.5 ? 'High' : profile.emojiFrequency > 0.2 ? 'Medium' : 'Low'}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-mono text-sm font-bold text-charcoal mb-3">YOUR SAMPLES</h3>
        <div className="space-y-3">
          {samples.map((sample, i) => (
            <div key={i} className="bg-cream rounded-card p-3">
              <p className="font-mono text-xs text-warm-gray mb-1">SAMPLE {i + 1}</p>
              <p className="font-serif text-sm text-charcoal line-clamp-3">{sample}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
