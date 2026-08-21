import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { VoiceSamples } from '@/components/voice/VoiceSamples';
import { VoiceProfile } from '@/components/voice/VoiceProfile';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Sparkles } from 'lucide-react';

interface VoiceProfile {
  tone: string;
  avgSentenceLength: number;
  ctaStyle: string;
  emojiFrequency: number;
}

export function Voice() {
  const { token } = useAuth();
  const [samples, setSamples] = useState<string[]>(['', '', '', '', '']);
  const [profile, setProfile] = useState<VoiceProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const validSamples = samples.filter(s => s.trim().length > 0);

  const handleAnalyze = async () => {
    if (validSamples.length < 3) return;
    setIsAnalyzing(true);
    try {
      const result = await api.post<{ voiceProfile: VoiceProfile }>(
        '/users/voice',
        { samples: validSamples },
        token || undefined
      );
      setProfile(result.voiceProfile);
    } catch (err) {
      console.error('Failed to analyze voice:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-[60px] p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-mono text-3xl font-bold text-charcoal mb-2">VOICE TRAINING</h1>
          <p className="font-serif text-warm-gray mb-8">
            Paste 3-5 of your best LinkedIn posts. We'll analyze your writing style and use it for all future generations.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="font-mono text-lg font-bold text-charcoal mb-4">YOUR SAMPLES</h2>
              <VoiceSamples samples={samples} onChange={setSamples} />
              <div className="mt-4 flex items-center gap-4">
                <Button
                  onClick={handleAnalyze}
                  disabled={validSamples.length < 3}
                  isLoading={isAnalyzing}
                >
                  <Sparkles size={16} /> ANALYZE VOICE
                </Button>
                <span className="font-serif text-sm text-warm-gray">
                  {validSamples.length}/5 samples ({validSamples.length < 3 ? 'min 3 required' : 'ready'})
                </span>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-lg font-bold text-charcoal mb-4">VOICE PROFILE</h2>
              {profile ? (
                <VoiceProfile profile={profile} samples={validSamples} />
              ) : (
                <div className="bg-soft-white rounded-card border-3 border-deep-black shadow-card p-6">
                  <p className="font-serif text-warm-gray text-center py-8">
                    Add at least 3 samples and click "Analyze Voice" to see your profile
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
