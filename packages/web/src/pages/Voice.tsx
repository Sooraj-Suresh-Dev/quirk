import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BlueprintGridBg } from '@/components/layout/BlueprintGridBg';
import { VoiceSamples } from '@/components/voice/VoiceSamples';
import { VoiceProfile, VoiceProfileData } from '@/components/voice/VoiceProfile';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { Sparkles, Loader2, AlertTriangle, Check, X, Info, ArrowRight, ChevronDown } from 'lucide-react';
import { PageMeta } from '@/components/seo/PageMeta';

interface Voice {
  samples: string[];
  profile: VoiceProfileData;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const MIN_SAMPLES = 3;
const MAX_SAMPLES = 5;
const INITIAL_SAMPLES = 3;

const ANALYZING_MESSAGES = [
  'Reading your writing style...',
  'Analyzing tone and patterns...',
  'Building your voice profile...',
  'Almost there...',
];

export function Voice() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [samples, setSamples] = useState<string[]>(['', '', '']);
  const [savedVoice, setSavedVoice] = useState<Voice | null>(null);
  const [previewVoice, setPreviewVoice] = useState<{ samples: string[]; profile: VoiceProfileData } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(true);
  const [showRetrainModal, setShowRetrainModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [globalMouse, setGlobalMouse] = useState({ x: -999, y: -999 });
  const [samplesOpen, setSamplesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [extractingIndex, setExtractingIndex] = useState<number | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setGlobalMouse({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    loadVoice();
  }, []);

  useEffect(() => {
    const hasUnsavedWork = samples.some(s => s.trim().length >= 10) || !!previewVoice;
    if (!hasUnsavedWork) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [samples, previewVoice]);

  useEffect(() => {
    if (!isAnalyzing) {
      setMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % ANALYZING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const loadVoice = async () => {
    setIsLoadingVoice(true);
    try {
      const result = await api.get<{ voice: Voice | null }>('/users/voice');
      setSavedVoice(result.voice);
      if (result.voice) {
        setSamples(result.voice.samples);
      }
    } catch (err) {
      console.error('Failed to load voice:', err);
      toast('error', 'Could not load your voice profile. Please refresh the page.');
    } finally {
      setIsLoadingVoice(false);
    }
  };

  const validSamples = samples.filter(s => s.trim().length >= 10);
  const readyCount = validSamples.length;
  const canAnalyze = readyCount >= MIN_SAMPLES && !previewVoice && !savedVoice;
  const isLocked = !!previewVoice || !!savedVoice;

  const hasSavedVoice = !!savedVoice && !previewVoice;
  const hasPreview = !!previewVoice;

  useEffect(() => {
    if (hasPreview || hasSavedVoice) setProfileOpen(true);
  }, [hasPreview, hasSavedVoice]);

  const progressPercent = hasSavedVoice || hasPreview
    ? 100
    : Math.min(100, Math.round((readyCount / MIN_SAMPLES) * 100));

  const progressColor = hasSavedVoice || hasPreview
    ? 'bg-mint'
    : readyCount >= MIN_SAMPLES
      ? 'bg-mint'
      : 'bg-coral';

  const handleAddSample = () => {
    if (samples.length >= MAX_SAMPLES) return;
    setSamples([...samples, '']);
  };

  const handleRemoveSample = (index: number) => {
    if (samples.length <= INITIAL_SAMPLES) return;
    setSamples(samples.filter((_, i) => i !== index));
  };

  const handleExtractUrl = async (index: number, url: string) => {
    setExtractingIndex(index);
    try {
      const result = await api.post<{ text: string; title?: string }>(
        '/users/voice/extract-url',
        { url }
      );
      const updated = [...samples];
      updated[index] = result.text;
      setSamples(updated);
      const titlePreview = result.title ? `: ${result.title.slice(0, 60)}` : '';
      toast('success', `Post imported${titlePreview}`);
    } catch (err: any) {
      const msg = err?.message || 'Failed to fetch post from URL';
      toast('error', msg);
    } finally {
      setExtractingIndex(null);
    }
  };

  const handleAnalyze = async () => {
    if (readyCount < MIN_SAMPLES) return;

    if (savedVoice) {
      setShowRetrainModal(true);
      return;
    }

    await analyzeVoice();
  };

  const analyzeVoice = async () => {
    setIsAnalyzing(true);
    setPreviewVoice(null);

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
      setIsAnalyzing(false);
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
      toast('success', 'Voice profile saved! Your future posts will match your style.');
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

  const renderProfile = (
    profile: VoiceProfileData,
    sampleTexts: string[],
    mode: 'saved' | 'preview' | 'readonly'
  ) => (
    <VoiceProfile
      profile={profile}
      samples={sampleTexts}
      isPreview={mode === 'preview'}
      isReadOnly={mode === 'readonly'}
      onDelete={mode === 'saved' ? () => setShowDeleteModal(true) : undefined}
    />
  );

  return (
    <>
      <PageMeta
        title="Voice Training"
        description="Train your personal brand voice by pasting 3-5 sample LinkedIn posts. Quirk analyzes your tone, sentence structure, and CTA style to generate content that sounds like you."
        canonicalPath="/voice-training"
      />
      <DashboardLayout>
      <div className="h-screen flex flex-col bg-cream relative" onMouseMove={handleMouseMove}>
        <BlueprintGridBg mouse={globalMouse} />
        <div className="relative z-10 flex flex-col h-full">
        <div className="md:ml-[60px] pb-20 md:pb-0 flex flex-col h-full">
          <header className="h-auto md:h-16 shrink-0 flex flex-wrap items-center gap-3 md:gap-6 px-4 md:px-6 py-3 md:py-0 border-b-2 border-deep-black/10 bg-cream/80 backdrop-blur-sm z-10">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="font-mono text-lg font-bold text-charcoal whitespace-nowrap">VOICE TRAINING</h1>
              {hasSavedVoice && (
                <span className="font-mono text-[10px] text-mint bg-mint/10 px-2 py-0.5 rounded border border-mint shrink-0">
                  TRAINED
                </span>
              )}
            </div>
            <div className="flex-1 max-w-md hidden md:block">
              <div
                className="w-full h-1 bg-deep-black/10 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Voice training progress"
              >
                <div
                  className={`h-full ${progressColor} transition-all duration-500 ease-out`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasSavedVoice && (
                <Button variant="ghost" onClick={() => setShowDeleteModal(true)} className="text-xs">
                  DELETE
                </Button>
              )}
            </div>
          </header>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <aside className="w-full md:w-[340px] md:shrink-0 flex flex-col min-h-0 border-b-2 md:border-b-0 md:border-r-2 border-deep-black/10 bg-cream">
              {/* Mobile toggle header */}
              <button
                type="button"
                onClick={() => setSamplesOpen(!samplesOpen)}
                className="md:hidden flex items-center justify-between w-full p-4 border-b-2 border-deep-black/10 bg-cream/80 hover:bg-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-inset"
                aria-expanded={samplesOpen}
                aria-controls="voice-samples-content"
              >
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-sm font-bold text-charcoal">YOUR SAMPLES</h2>
                  {!hasPreview && !hasSavedVoice && (
                    <span className="font-mono text-[10px] text-coral">*REQUIRED</span>
                  )}
                </div>
                <ChevronDown
                  size={18}
                  className={`text-charcoal transition-transform duration-200 ${samplesOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Samples content */}
              <div
                id="voice-samples-content"
                className={`${samplesOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 overflow-y-auto`}
              >
                <div className="p-4 md:p-5" data-walkthrough="voice-samples">
                  <p className="font-serif text-xs text-warm-gray mb-3">
                    {hasSavedVoice
                      ? 'Your analyzed samples.'
                      : 'Pick posts that show the voice you want to keep.'}
                  </p>
                  <VoiceSamples
                    samples={samples}
                    onChange={setSamples}
                    disabled={isLocked}
                    compact={hasSavedVoice}
                    onAdd={handleAddSample}
                    onRemove={handleRemoveSample}
                    canRemove={samples.length > INITIAL_SAMPLES}
                    canAdd={samples.length < MAX_SAMPLES}
                    minSamples={MIN_SAMPLES}
                    onExtractUrl={handleExtractUrl}
                    extractingIndex={extractingIndex}
                  />
                </div>
                <div className="shrink-0 p-4 md:p-5 border-t-2 border-deep-black/10" data-walkthrough="analyze-button">
                  {!hasPreview && !hasSavedVoice && (
                    <>
                      <Button
                        onClick={handleAnalyze}
                        disabled={!canAnalyze}
                        isLoading={isAnalyzing}
                        className="w-full"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            ANALYZING...
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} />
                            ANALYZE VOICE
                          </>
                        )}
                      </Button>
                      <p
                        className="font-serif text-xs text-warm-gray mt-2 text-center"
                        aria-live="polite"
                      >
                        {readyCount < MIN_SAMPLES
                          ? `Add ${MIN_SAMPLES - readyCount} more sample${MIN_SAMPLES - readyCount > 1 ? 's' : ''}`
                          : `${readyCount}/${samples.length} samples ready`}
                      </p>
                    </>
                  )}
                  {hasPreview && (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveVoice} isLoading={isSaving} className="flex-1">
                        <Check size={14} />
                        SAVE
                      </Button>
                      <Button variant="secondary" onClick={handleDiscardPreview}>
                        <X size={14} />
                        DISCARD
                      </Button>
                    </div>
                  )}
                  {hasSavedVoice && (
                    <Button onClick={handleAnalyze} className="w-full">
                      <Sparkles size={14} />
                      RE-ANALYZE
                    </Button>
                  )}
                  {isAnalyzing && (
                    <p
                      className="font-mono text-[10px] text-coral mt-2 text-center"
                      role="status"
                      aria-live="polite"
                    >
                      Analyzing your voice — 10-20 seconds
                    </p>
                  )}
                </div>
              </div>
            </aside>

            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-4 md:p-6">
                {!hasPreview && !hasSavedVoice && !isAnalyzing && !isLoadingVoice && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Card className="max-w-sm">
                      <div className="flex items-start gap-3 p-2">
                        <Info size={20} className="text-coral shrink-0 mt-0.5" />
                        <div>
                          <p className="font-mono text-sm font-bold text-charcoal mb-1">WHAT MAKES A GOOD SAMPLE?</p>
                          <ul className="font-serif text-sm text-warm-gray space-y-1 list-disc list-inside">
                            <li>Posts you&apos;d be proud to share again</li>
                            <li>Posts that feel like &ldquo;you&rdquo; at your best</li>
                            <li>Mix of lengths so we learn your range</li>
                            <li>Avoid posts you wrote for a brand or client</li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="animate-fade-in-up">
                    <Card className="overflow-hidden">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-coral animate-dot-bounce" style={{ animationDelay: '0s' }} />
                          <span className="w-2 h-2 rounded-full bg-coral animate-dot-bounce" style={{ animationDelay: '0.2s' }} />
                          <span className="w-2 h-2 rounded-full bg-coral animate-dot-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                        <span className="font-mono text-xs text-warm-gray tracking-wider">
                          {ANALYZING_MESSAGES[messageIndex]}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 rounded-full animate-shimmer w-3/4" />
                        <div className="h-4 rounded-full animate-shimmer w-full" />
                        <div className="h-4 rounded-full animate-shimmer w-5/6" />
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="h-16 rounded-card animate-shimmer" />
                          <div className="h-16 rounded-card animate-shimmer" />
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {(hasPreview || hasSavedVoice) && !isAnalyzing && !isLoadingVoice && (
                  <section className="mb-8 animate-fade-in-up" data-walkthrough="voice-profile">
                    {/* Mobile toggle header */}
                    <button
                      type="button"
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="md:hidden flex items-center justify-between w-full mb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-inset rounded px-1 py-0.5"
                      aria-expanded={profileOpen}
                      aria-controls="voice-profile-content"
                    >
                      <div className="flex items-center gap-2">
                        <h2 className="font-mono text-lg font-bold text-charcoal">YOUR VOICE PROFILE</h2>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-charcoal transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {/* Desktop header */}
                    <h2 className="hidden md:block font-mono text-lg font-bold text-charcoal mb-1">YOUR VOICE PROFILE</h2>
                    <p className="font-serif text-sm text-warm-gray mb-4">
                      How Quirk sees your writing.
                    </p>
                    <div
                      id="voice-profile-content"
                      className={`${profileOpen ? 'block' : 'hidden'} md:block`}
                    >
                      {hasPreview && savedVoice ? (
                      <div className="space-y-6">
                        <div>
                          <span className="font-mono text-xs text-warm-gray uppercase tracking-wider">
                            Current (will be replaced)
                          </span>
                          {renderProfile(savedVoice.profile, savedVoice.samples, 'readonly')}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 border-t-2 border-dashed border-deep-black/20" />
                          <span className="font-mono text-xs text-coral">NEW PROFILE</span>
                          <div className="flex-1 border-t-2 border-t-2 border-dashed border-coral" />
                        </div>
                        <div>
                          {renderProfile(previewVoice.profile, previewVoice.samples, 'preview')}
                        </div>
                      </div>
                    ) : hasPreview ? (
                      renderProfile(previewVoice.profile, previewVoice.samples, 'preview')
                    ) : (
                      savedVoice && renderProfile(savedVoice.profile, savedVoice.samples, 'saved')
                      )}
                    </div>
                  </section>
                )}

                {isLoadingVoice && !hasPreview && !hasSavedVoice && (
                  <Card>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-16 w-full" />
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <Skeleton className="h-16" />
                        <Skeleton className="h-16" />
                      </div>
                    </div>
                  </Card>
                )}

                {hasSavedVoice && !hasPreview && !isLoadingVoice && (
                  <div className="mt-8 p-4 bg-soft-white rounded-card border-3 border-deep-black shadow-card flex items-center justify-between gap-4" data-walkthrough="generate-cta">
                    <div>
                      <p className="font-mono text-sm font-bold text-charcoal">READY TO WRITE?</p>
                      <p className="font-serif text-xs text-warm-gray">Generate a post in your voice.</p>
                    </div>
                    <Button onClick={() => navigate('/discover')} className="shrink-0">
                      <Sparkles size={14} />
                      GENERATE POST
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showRetrainModal}
        onClose={() => setShowRetrainModal(false)}
        ariaLabelledBy="retrain-modal-title"
      >
        <div className="p-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-[#F5A623]" size={24} />
            <h3 id="retrain-modal-title" className="font-mono text-lg font-bold text-charcoal">Re-analyze Voice Profile?</h3>
          </div>
          <p className="font-serif text-warm-gray mb-2">
            This will replace your current voice profile with a new analysis.
          </p>
          <p className="font-serif text-warm-gray mb-6">
            You&apos;ll see both versions side by side before deciding.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowRetrainModal(false)}>
              CANCEL
            </Button>
            <Button onClick={confirmRetrain}>
              <Sparkles size={14} /> CONTINUE
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        ariaLabelledBy="delete-modal-title"
      >
        <div className="p-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-[#D94848]" size={24} />
            <h3 id="delete-modal-title" className="font-mono text-lg font-bold text-charcoal">Delete Voice Profile?</h3>
          </div>
          <p className="font-serif text-warm-gray mb-6">
            This will permanently delete your voice profile. Quirk will generate in default voice until you train again.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              CANCEL
            </Button>
            <Button onClick={handleDeleteVoice} className="bg-[#D94848] hover:bg-[#B83A3A]">
              DELETE
            </Button>
          </div>
        </div>
      </Modal>
    </div>
    </DashboardLayout>
    </>
  );
}
