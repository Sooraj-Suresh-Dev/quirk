import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { VoiceSamples } from '@/components/voice/VoiceSamples';
import { VoiceProfile, VoiceProfileData } from '@/components/voice/VoiceProfile';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { Sparkles, Loader2, AlertTriangle, Check, X } from 'lucide-react';

interface Voice {
  samples: string[];
  profile: VoiceProfileData;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ANALYZE_STEPS = [
  'Analyzing your writing style...',
  'Extracting tone patterns...',
  'Measuring sentence structure...',
  'Detecting engagement style...',
  'Building your voice profile...',
];

export function Voice() {
  const { toast } = useToast();
  const [samples, setSamples] = useState<string[]>(['', '', '', '', '']);
  const [savedVoice, setSavedVoice] = useState<Voice | null>(null);
  const [previewVoice, setPreviewVoice] = useState<{ samples: string[]; profile: VoiceProfileData } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState('');
  const [showRetrainModal, setShowRetrainModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadVoice();
  }, []);

  const loadVoice = async () => {
    try {
      const result = await api.get<{ voice: Voice | null }>('/users/voice');
      setSavedVoice(result.voice);
    } catch (err) {
      console.error('Failed to load voice:', err);
    }
  };

  const validSamples = samples.filter(s => s.trim().length >= 10);
  const readyCount = validSamples.length;

  const handleAnalyze = async () => {
    if (readyCount < 3) return;

    if (savedVoice) {
      setShowRetrainModal(true);
      return;
    }

    await analyzeVoice();
  };

  const analyzeVoice = async () => {
    setIsAnalyzing(true);
    setAnalyzeStep(ANALYZE_STEPS[0]);
    setPreviewVoice(null);

    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < ANALYZE_STEPS.length) {
        setAnalyzeStep(ANALYZE_STEPS[stepIndex]);
      }
    }, 2000);

    try {
      const result = await api.post<{ preview: { samples: string[]; profile: VoiceProfileData } }>(
        '/users/voice/analyze',
        { samples: validSamples }
      );
      setPreviewVoice(result.preview);
    } catch (err: any) {
      console.error('Failed to analyze voice:', err);
      const errorMessage = err?.message || 'Failed to analyze voice. Please try again.';
      toast('error', errorMessage);
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setAnalyzeStep('');
      setShowRetrainModal(false);
    }
  };

  const handleSaveVoice = async () => {
    if (!previewVoice) return;

    setIsSaving(true);
    try {
      const result = await api.post<{ voice: Voice; message: string }>(
        '/users/voice',
        previewVoice
      );
      setSavedVoice(result.voice);
      setPreviewVoice(null);
      setSamples(['', '', '', '', '']);
      toast('success', 'Voice profile saved successfully!');
    } catch (err: any) {
      console.error('Failed to save voice:', err);
      toast('error', 'Failed to save voice profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardPreview = () => {
    setPreviewVoice(null);
  };

  const handleDeleteVoice = async () => {
    try {
      await api.delete('/users/voice');
      setSavedVoice(null);
      setShowDeleteModal(false);
      toast('success', 'Voice profile deleted.');
    } catch (err) {
      console.error('Failed to delete voice:', err);
      toast('error', 'Failed to delete voice profile. Please try again.');
    }
  };

  const confirmRetrain = () => {
    setShowRetrainModal(false);
    analyzeVoice();
  };

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-[60px] p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-mono text-3xl font-bold text-charcoal mb-2">VOICE TRAINING</h1>
          <p className="font-serif text-warm-gray mb-8">
            Paste 3-5 of your best LinkedIn posts. We&apos;ll analyze your writing style and use it for all future generations.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="font-mono text-lg font-bold text-charcoal mb-4">YOUR SAMPLES</h2>
              <VoiceSamples samples={samples} onChange={setSamples} disabled={!!previewVoice || !!savedVoice} />
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleAnalyze}
                    disabled={readyCount < 3 || !!previewVoice || !!savedVoice}
                    isLoading={isAnalyzing}
                  >
                    {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {isAnalyzing ? 'ANALYZING...' : savedVoice ? 'RE-ANALYZE' : previewVoice ? 'ANALYZING...' : 'ANALYZE VOICE'}
                  </Button>
                  <span className={`font-serif text-sm ${readyCount < 3 ? 'text-warm-gray' : 'text-green-600'}`}>
                    {readyCount < 3
                      ? `Add ${3 - readyCount} more sample${3 - readyCount > 1 ? 's' : ''} to analyze`
                      : `${readyCount}/5 samples ready`
                    }
                  </span>
                </div>
                {isAnalyzing && analyzeStep && (
                  <p className="font-mono text-xs text-coral animate-pulse">
                    {analyzeStep}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="font-mono text-lg font-bold text-charcoal mb-4">VOICE PROFILE</h2>

              {previewVoice ? (
                <div className="space-y-4">
                  
                  <VoiceProfile
                    profile={previewVoice.profile}
                    samples={previewVoice.samples}
                    isPreview
                  />
                  <div className="flex gap-3">
                    <Button onClick={handleSaveVoice} isLoading={isSaving}>
                      <Check size={16} /> SAVE VOICE
                    </Button>
                    <Button variant="ghost" onClick={handleDiscardPreview}>
                      <X size={16} /> DISCARD
                    </Button>
                  </div>
                </div>
              ) : savedVoice ? (
                <div className="space-y-4">
                  <VoiceProfile
                    profile={savedVoice.profile}
                    samples={savedVoice.samples}
                    onDelete={() => setShowDeleteModal(true)}
                  />
                </div>
              ) : (
                <div className="bg-soft-white rounded-card border-3 border-deep-black shadow-card p-6">
                  <p className="font-serif text-warm-gray text-center py-8">
                    Add at least 3 samples and click &quot;Analyze Voice&quot; to see your profile
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={showRetrainModal} onClose={() => setShowRetrainModal(false)}>
        <div className="p-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-orange-500" size={24} />
            <h3 className="font-mono text-lg font-bold text-charcoal">Re-analyze Voice Profile?</h3>
          </div>
          <p className="font-serif text-warm-gray mb-6">
            This will replace your current voice profile with a new analysis. Your previous profile will be lost.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowRetrainModal(false)}>
              CANCEL
            </Button>
            <Button onClick={confirmRetrain}>
              <Sparkles size={14} /> RE-ANALYZE
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-500" size={24} />
            <h3 className="font-mono text-lg font-bold text-charcoal">Delete Voice Profile?</h3>
          </div>
          <p className="font-serif text-warm-gray mb-6">
            This will permanently delete your voice profile. You can create a new one later.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              CANCEL
            </Button>
            <Button onClick={handleDeleteVoice} className="bg-red-500 hover:bg-red-600">
              DELETE
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
