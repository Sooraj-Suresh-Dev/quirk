interface VoiceSamplesProps {
  samples: string[];
  onChange: (samples: string[]) => void;
}

export function VoiceSamples({ samples, onChange }: VoiceSamplesProps) {
  const updateSample = (index: number, value: string) => {
    const updated = [...samples];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {samples.map((sample, i) => (
        <div key={i}>
          <label className="font-mono text-xs text-warm-gray mb-1 block">
            SAMPLE {i + 1} {i < 3 && <span className="text-coral">*</span>}
          </label>
          <textarea
            value={sample}
            onChange={(e) => updateSample(i, e.target.value)}
            placeholder={`Paste LinkedIn post #${i + 1}...`}
            rows={4}
            className="bg-soft-white text-charcoal font-serif px-4 py-3 rounded-card border-2 border-deep-black shadow-input focus:border-coral focus:outline-none transition-all duration-150 w-full resize-none"
          />
        </div>
      ))}
    </div>
  );
}
