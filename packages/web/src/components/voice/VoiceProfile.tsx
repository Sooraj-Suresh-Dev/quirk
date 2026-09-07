import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp, Sparkles, Trash2 } from 'lucide-react';

export interface VoiceProfileData {
  tone: {
    primary: string;
    secondary: string[];
    confidence: number;
  };
  writingStyle: {
    description: string;
    avgSentenceLength: number;
    avgParagraphLength: number;
  };
  personality: {
    traits: string[];
    description: string;
  };
  structure: {
    description: string;
    pattern: string[];
  };
  engagement: {
    cta: 'None' | 'Soft' | 'Direct';
    questions: 'None' | 'Rare' | 'Occasional' | 'Frequent';
    emoji: 'None' | 'Low' | 'Medium' | 'High';
    emojiFrequency: number;
  };
  signaturePatterns: string[];
  brandSummary: string;
  trainingQuality: {
    score: number;
    consistency: string;
    limitations: string[];
  };
}

interface VoiceProfileProps {
  profile: VoiceProfileData;
  samples: string[];
  isPreview?: boolean;
  isReadOnly?: boolean;
  onDelete?: () => void;
}

function ConfidenceBadge({ score, consistency }: { score: number; consistency: string }) {
  const percentage = Math.round(score * 100);
  const label = percentage >= 80 ? 'High' : percentage >= 60 ? 'Good' : percentage >= 40 ? 'Moderate' : 'Low';
  const color =
    percentage >= 80
      ? 'bg-mint text-soft-white'
      : percentage >= 60
        ? 'bg-coral text-soft-white'
        : percentage >= 40
          ? 'bg-[#F5A623] text-soft-white'
          : 'bg-charcoal text-soft-white';

  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider">Confidence Level</p>
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono border-2 border-deep-black ${color}`}
        >
          {label} ({percentage}%)
        </span>
        <span className="font-mono text-xs text-warm-gray">{consistency} consistency</span>
      </div>
      <p className="font-serif text-xs text-warm-gray leading-relaxed">
        How well we can replicate your voice when generating new posts.
      </p>
      {percentage < 60 && (
        <div className="mt-2 p-3 bg-cream rounded-card border-2 border-deep-black/10">
          <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider mb-1">Try this</p>
          <p className="font-serif text-xs text-charcoal leading-relaxed">
            {percentage < 40
              ? 'Add 2 more posts that feel like your natural writing voice. The more consistent your samples, the better we can match you.'
              : 'For a stronger match, add posts that all sound like your natural voice — not different styles for different audiences.'}
          </p>
        </div>
      )}
    </div>
  );
}

function EnumBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    None: 'bg-cream text-warm-gray border border-deep-black/20',
    Soft: 'bg-cream text-charcoal border border-deep-black/20',
    Direct: 'bg-coral text-soft-white border-2 border-deep-black',
    Rare: 'bg-cream text-warm-gray border border-deep-black/20',
    Occasional: 'bg-cream text-charcoal border border-deep-black/20',
    Frequent: 'bg-mint text-soft-white border-2 border-deep-black',
    Low: 'bg-cream text-warm-gray border border-deep-black/20',
    Medium: 'bg-cream text-charcoal border border-deep-black/20',
    High: 'bg-mint text-soft-white border-2 border-deep-black',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono ${colors[value] || 'bg-cream text-warm-gray'}`}
    >
      {value}
    </span>
  );
}

export function VoiceProfile({ profile, isPreview, isReadOnly, onDelete }: VoiceProfileProps) {
  const [showMore, setShowMore] = useState(false);

  const toneDisplay =
    profile.tone.secondary.length > 0
      ? `${profile.tone.primary} (${profile.tone.secondary.join(', ')})`
      : profile.tone.primary;

  const borderAccent = isPreview ? 'border-coral' : 'border-deep-black';

  return (
    <div className="space-y-4">
      <Card className={`border-3 ${borderAccent}`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-coral" />
            <h3 className="font-mono text-sm font-bold text-charcoal">YOUR VOICE PROFILE</h3>
            {isPreview && (
              <span className="font-mono text-[10px] text-coral bg-coral/10 px-2 py-0.5 rounded border border-coral">
                PREVIEW
              </span>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <ConfidenceBadge
            score={profile.trainingQuality.score}
            consistency={profile.trainingQuality.consistency}
          />

          {profile.trainingQuality.limitations.length > 0 && (
            <p className="font-mono text-[10px] text-warm-gray italic">
              Note: {profile.trainingQuality.limitations.join(', ')}
            </p>
          )}

          <div className="bg-cream rounded-card p-4 border-2 border-deep-black/10">
            <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider mb-2">
              Brand Voice
            </p>
            <p className="font-serif text-charcoal leading-relaxed">{profile.brandSummary}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cream rounded-card p-4 border-2 border-deep-black/10">
              <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider mb-1.5">Tone</p>
              <p className="font-serif text-charcoal text-sm leading-snug">{toneDisplay}</p>
            </div>
            <div className="bg-cream rounded-card p-4 border-2 border-deep-black/10">
              <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider mb-1.5">CTA</p>
              <EnumBadge value={profile.engagement.cta} />
            </div>
            <div className="bg-cream rounded-card p-4 border-2 border-deep-black/10">
              <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider mb-1.5">
                Questions
              </p>
              <EnumBadge value={profile.engagement.questions} />
            </div>
            <div className="bg-cream rounded-card p-4 border-2 border-deep-black/10">
              <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider mb-1.5">Emoji</p>
              <EnumBadge value={profile.engagement.emoji} />
            </div>
          </div>

          {showMore && (
            <div className="space-y-3 animate-slide-up">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-cream rounded-card p-3 border-2 border-deep-black/10">
                  <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider mb-1.5">
                    Emoji
                  </p>
                  <EnumBadge value={profile.engagement.emoji} />
                </div>
                <div className="bg-cream rounded-card p-3 border-2 border-deep-black/10">
                  <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider mb-1.5">
                    Personality
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {profile.personality.traits.slice(0, 3).map((trait, i) => (
                      <span key={i} className="text-xs font-serif text-charcoal">
                        {trait}
                        {i < Math.min(profile.personality.traits.length, 3) - 1 && ','}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-cream rounded-card p-3 border-2 border-deep-black/10">
                <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider mb-1.5">
                  Writing Style
                </p>
                <p className="font-serif text-sm text-charcoal">{profile.writingStyle.description}</p>
                <p className="text-xs text-warm-gray mt-1.5 font-mono">
                  Avg sentence: {profile.writingStyle.avgSentenceLength} words · Avg paragraph:{' '}
                  {profile.writingStyle.avgParagraphLength} words
                </p>
              </div>

              {profile.structure.pattern.length > 0 && (
                <div className="bg-cream rounded-card p-3 border-2 border-deep-black/10">
                  <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider mb-1.5">
                    Structure
                  </p>
                  <p className="font-serif text-sm text-charcoal mb-2">{profile.structure.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.structure.pattern.map((p, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono bg-soft-white px-2 py-0.5 rounded border border-deep-black/20 text-charcoal"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.signaturePatterns.length > 0 && (
                <div className="bg-cream rounded-card p-3 border-2 border-deep-black/10">
                  <p className="font-mono text-[10px] text-warm-gray uppercase tracking-wider mb-1.5">
                    Signature Patterns
                  </p>
                  <ul className="space-y-1">
                    {profile.signaturePatterns.map((p, i) => (
                      <li key={i} className="text-xs font-serif text-charcoal">
                        · {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            aria-expanded={showMore}
            aria-controls="voice-profile-details"
            className="font-mono text-xs text-coral hover:text-charcoal inline-flex items-center gap-1.5 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 px-1 py-0.5"
          >
            {showMore ? (
              <>
                <ChevronUp size={14} /> SHOW LESS
              </>
            ) : (
              <>
                <ChevronDown size={14} /> SHOW MORE DETAILS
              </>
            )}
          </button>

          {!isPreview && !isReadOnly && onDelete && (
            <div className="flex justify-end pt-2">
              <Button
                variant="ghost"
                onClick={onDelete}
                className="text-charcoal hover:text-coral hover:bg-coral/10"
              >
                <Trash2 size={16} />
                DELETE VOICE
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
