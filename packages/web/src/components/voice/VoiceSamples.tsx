import { useState } from 'react';
import { X, Plus, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface VoiceSamplesProps {
  samples: string[];
  onChange: (samples: string[]) => void;
  disabled?: boolean;
  compact?: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  canAdd: boolean;
  minSamples: number;
}

const MAX_CHARS = 2000;

function getCharCountStatus(charCount: number): { text: string; color: string; tone: 'muted' | 'warn' | 'ok' } {
  if (charCount === 0) return { text: 'Empty', color: 'text-warm-gray', tone: 'muted' };
  if (charCount < 10) return { text: `${charCount} chars — min 10 needed`, color: 'text-coral', tone: 'warn' };
  if (charCount < 100) return { text: `${charCount} chars — a bit short`, color: 'text-coral', tone: 'warn' };
  if (charCount > MAX_CHARS) return { text: `${charCount} chars — over limit`, color: 'text-coral', tone: 'warn' };
  if (charCount > 1500) return { text: `${charCount} / ${MAX_CHARS}`, color: 'text-charcoal', tone: 'ok' };
  return { text: `${charCount} chars`, color: 'text-mint', tone: 'ok' };
}

export function VoiceSamples({
  samples,
  onChange,
  disabled,
  compact,
  onAdd,
  onRemove,
  canRemove,
  canAdd,
  minSamples,
}: VoiceSamplesProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const updateSample = (index: number, value: string) => {
    const truncated = value.length > MAX_CHARS ? value.slice(0, MAX_CHARS) : value;
    const updated = [...samples];
    updated[index] = truncated;
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {samples.map((sample, i) => {
        const status = getCharCountStatus(sample.length);
        const isRequired = i < minSamples;

        if (compact) {
          const isExpanded = expandedIndex === i;
          const PREVIEW_LEN = 50;
          const preview = sample.trim().slice(0, PREVIEW_LEN);
          const hasMore = sample.trim().length > PREVIEW_LEN;
          return (
            <div
              key={i}
              className="bg-cream rounded-card border-2 border-deep-black/10 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                aria-expanded={isExpanded}
                aria-controls={`sample-compact-content-${i}`}
                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} sample ${i + 1}`}
                className="w-full px-3 py-2 text-left hover:bg-cream/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-inset"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[10px] text-warm-gray uppercase tracking-wider">
                    SAMPLE {i + 1}
                  </span>
                  {isRequired && <span className="font-mono text-[10px] text-coral" aria-label="required">*</span>}
                  <span className="ml-auto font-mono text-[10px] text-warm-gray">
                    {sample.length} chars
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={14} className="text-warm-gray shrink-0" />
                  ) : (
                    <ChevronDown size={14} className="text-warm-gray shrink-0" />
                  )}
                </div>
                <p
                  id={`sample-compact-content-${i}`}
                  className={`font-serif text-xs text-charcoal leading-snug whitespace-pre-wrap ${
                    isExpanded ? 'max-h-48 overflow-y-auto' : 'truncate'
                  }`}
                >
                  {isExpanded ? sample : (preview + (hasMore ? '…' : ''))}
                </p>
              </button>
            </div>
          );
        }

        return (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor={`voice-sample-${i}`}
                className="font-mono text-xs text-warm-gray"
              >
                SAMPLE {i + 1}
                {isRequired && (
                  <span className="text-coral ml-1" aria-label="required">
                    *
                  </span>
                )}
              </label>
              {canRemove && !disabled && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  aria-label={`Remove sample ${i + 1}`}
                  className="text-warm-gray hover:text-coral transition-colors p-1 -m-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="relative">
              <textarea
                id={`voice-sample-${i}`}
                value={sample}
                onChange={(e) => updateSample(i, e.target.value)}
                placeholder={`Paste your LinkedIn post #${i + 1} here…`}
                rows={4}
                disabled={disabled}
                aria-label={`LinkedIn post sample ${i + 1}${isRequired ? ' (required)' : ''}`}
                aria-describedby={`voice-sample-status-${i}`}
                className={`bg-soft-white text-charcoal font-mono text-sm leading-relaxed px-4 py-3 pr-20 rounded-card border-2 border-deep-black shadow-input focus:border-coral focus:outline-none focus:shadow-card focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 transition-all duration-150 w-full resize-none max-h-36 overflow-y-auto ${
                  disabled ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
              <div className="absolute bottom-2 right-3 flex items-center gap-1.5">
                {status.tone === 'warn' && (
                  <AlertCircle size={12} className="text-coral shrink-0" />
                )}
                <span
                  id={`voice-sample-status-${i}`}
                  className={`text-xs font-mono ${status.color}`}
                  aria-live="polite"
                >
                  {status.text}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {canAdd && !disabled && !compact && (
        <button
          type="button"
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-card border-2 border-dashed border-deep-black/30 bg-transparent font-mono text-sm text-warm-gray hover:border-coral hover:text-coral hover:bg-coral/5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 mt-4"
        >
          <Plus size={16} />
          ADD ANOTHER SAMPLE
        </button>
      )}

      {!canAdd && !disabled && samples.length === 5 && !compact && (
        <p className="font-mono text-xs text-warm-gray text-center py-2">
          MAX 5 SAMPLES
        </p>
      )}
    </div>
  );
}
