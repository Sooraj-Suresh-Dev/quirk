import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp, Sparkles, ArrowRight, Trash2 } from 'lucide-react';

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
  onDelete?: () => void;
}

function QualityBadge({ score, consistency }: { score: number; consistency: string }) {
  const percentage = Math.round(score * 100);
  const label = percentage >= 80 ? 'High' : percentage >= 60 ? 'Good' : percentage >= 40 ? 'Moderate' : 'Low';
  const color = percentage >= 80 ? 'bg-green-100 text-green-700' : percentage >= 60 ? 'bg-blue-100 text-blue-700' : percentage >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600';
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${color}`}>
        {label} ({percentage}%)
      </span>
      <span className="text-xs text-warm-gray">
        {consistency} consistency
      </span>
    </div>
  );
}

function EnumBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    None: 'bg-gray-100 text-gray-600',
    Soft: 'bg-blue-100 text-blue-700',
    Direct: 'bg-green-100 text-green-700',
    Rare: 'bg-gray-100 text-gray-600',
    Occasional: 'bg-yellow-100 text-yellow-700',
    Frequent: 'bg-orange-100 text-orange-700',
    Low: 'bg-gray-100 text-gray-600',
    Medium: 'bg-yellow-100 text-yellow-700',
    High: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono ${colors[value] || 'bg-gray-100 text-gray-600'}`}>
      {value}
    </span>
  );
}

export function VoiceProfile({ profile, samples, isPreview, onDelete }: VoiceProfileProps) {
  const navigate = useNavigate();
  const [expandedSample, setExpandedSample] = useState<number | null>(null);

  const toneDisplay = profile.tone.secondary.length > 0
    ? `${profile.tone.primary} (${profile.tone.secondary.join(', ')})`
    : profile.tone.primary;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-coral" />
            <h3 className="font-mono text-sm font-bold text-charcoal">YOUR VOICE PROFILE</h3>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <QualityBadge score={profile.trainingQuality.score} consistency={profile.trainingQuality.consistency} />
            {profile.trainingQuality.limitations.length > 0 && (
              <span className="text-xs text-warm-gray">
                ({profile.trainingQuality.limitations.join(', ')})
              </span>
            )}
          </div>

          <div className="bg-cream rounded-card p-4">
            <p className="font-mono text-xs text-warm-gray mb-2">BRAND VOICE</p>
            <p className="font-serif text-charcoal leading-relaxed">{profile.brandSummary}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-cream rounded-card p-3">
              <p className="font-mono text-xs text-warm-gray mb-1">TONE</p>
              <p className="font-serif text-charcoal text-sm">{toneDisplay}</p>
            </div>
            <div className="bg-cream rounded-card p-3">
              <p className="font-mono text-xs text-warm-gray mb-1">CTA</p>
              <EnumBadge value={profile.engagement.cta} />
            </div>
            <div className="bg-cream rounded-card p-3">
              <p className="font-mono text-xs text-warm-gray mb-1">QUESTIONS</p>
              <EnumBadge value={profile.engagement.questions} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cream rounded-card p-3">
              <p className="font-mono text-xs text-warm-gray mb-1">EMOJI</p>
              <EnumBadge value={profile.engagement.emoji} />
            </div>
            <div className="bg-cream rounded-card p-3">
              <p className="font-mono text-xs text-warm-gray mb-1">PERSONALITY</p>
              <div className="flex flex-wrap gap-1">
                {profile.personality.traits.slice(0, 3).map((trait, i) => (
                  <span key={i} className="text-xs font-serif text-charcoal">{trait}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-cream rounded-card p-3">
            <p className="font-mono text-xs text-warm-gray mb-1">WRITING STYLE</p>
            <p className="font-serif text-sm text-charcoal">{profile.writingStyle.description}</p>
            <p className="text-xs text-warm-gray mt-1">
              Avg sentence: {profile.writingStyle.avgSentenceLength} words | Avg paragraph: {profile.writingStyle.avgParagraphLength} words
            </p>
          </div>

          <div className="bg-cream rounded-card p-3">
            <p className="font-mono text-xs text-warm-gray mb-1">STRUCTURE</p>
            <p className="font-serif text-sm text-charcoal">{profile.structure.description}</p>
            {profile.structure.pattern.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {profile.structure.pattern.map((p, i) => (
                  <span key={i} className="text-xs bg-white px-2 py-0.5 rounded text-warm-gray">• {p}</span>
                ))}
              </div>
            )}
          </div>

          {profile.signaturePatterns.length > 0 && (
            <div className="bg-cream rounded-card p-3">
              <p className="font-mono text-xs text-warm-gray mb-1">SIGNATURE PATTERNS</p>
              <div className="flex flex-wrap gap-1">
                {profile.signaturePatterns.map((p, i) => (
                  <span key={i} className="text-xs font-serif text-charcoal">• {p}</span>
                ))}
              </div>
            </div>
          )}

          {!isPreview && (
            <div className="flex gap-3">
              <Button onClick={() => navigate('/generate')} className="flex-1">
                <Sparkles size={16} /> START GENERATING
                <ArrowRight size={16} />
              </Button>
              {onDelete && (
                <Button variant="ghost" onClick={onDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {!isPreview && samples.length > 0 && (
        <Card>
          <h3 className="font-mono text-sm font-bold text-charcoal mb-3">YOUR SAMPLES</h3>
          <div className="space-y-2">
            {samples.map((sample, i) => (
              <div key={i} className="bg-cream rounded-card p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-mono text-xs text-warm-gray">SAMPLE {i + 1}</p>
                  <button
                    onClick={() => setExpandedSample(expandedSample === i ? null : i)}
                    className="text-warm-gray hover:text-charcoal transition-colors"
                  >
                    {expandedSample === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
                <p className={`font-serif text-sm text-charcoal ${expandedSample === i ? '' : 'line-clamp-3'}`}>
                  {sample}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
