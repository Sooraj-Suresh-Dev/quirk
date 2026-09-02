interface VoiceSamplesProps {
  samples: string[];
  onChange: (samples: string[]) => void;
  disabled?: boolean;
}

function getCharCountStatus(charCount: number): { text: string; color: string } {
  if (charCount === 0) return { text: 'Empty', color: 'text-gray-400' };
  if (charCount < 10) return { text: `${charCount} chars (min 10)`, color: 'text-orange-500' };
  if (charCount < 100) return { text: `${charCount} chars (too short)`, color: 'text-orange-500' };
  if (charCount > 2000) return { text: `${charCount} chars (will be truncated)`, color: 'text-orange-500' };
  return { text: `${charCount} chars`, color: 'text-green-600' };
}

export function VoiceSamples({ samples, onChange, disabled }: VoiceSamplesProps) {
  const updateSample = (index: number, value: string) => {
    const updated = [...samples];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {samples.map((sample, i) => {
        const status = getCharCountStatus(sample.length);
        return (
          <div key={i}>
            <label className="font-mono text-xs text-warm-gray mb-1 block">
              SAMPLE {i + 1} {i < 3 && <span className="text-coral">*</span>}
            </label>
            <div className="relative">
              <textarea
                value={sample}
                onChange={(e) => updateSample(i, e.target.value)}
                placeholder={`Paste your LinkedIn post #${i + 1} here...`}
                rows={4}
                disabled={disabled}
                className={`bg-soft-white text-charcoal font-serif px-4 py-3 pr-16 rounded-card border-2 border-deep-black shadow-input focus:border-coral focus:outline-none transition-all duration-150 w-full resize-none ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
              <span className={`absolute bottom-2 right-3 text-xs font-mono ${status.color}`}>
                {status.text}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
