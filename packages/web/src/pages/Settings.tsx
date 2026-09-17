import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BlueprintGridBg } from '@/components/layout/BlueprintGridBg';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { Checkbox } from '@/components/ui/Checkbox';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { Key, Clock, Bell, Save, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type KeyStatus = 'idle' | 'verifying' | 'valid' | 'invalid';

interface FormState {
  openaiKey: string;
  anthropicKey: string;
  digestTime: string;
  emailDigest: boolean;
  sources: string[];
}

function equalState(a: FormState, b: FormState) {
  return (
    a.openaiKey === b.openaiKey &&
    a.anthropicKey === b.anthropicKey &&
    a.digestTime === b.digestTime &&
    a.emailDigest === b.emailDigest &&
    a.sources.length === b.sources.length &&
    a.sources.every((s) => b.sources.includes(s))
  );
}

export function Settings() {
  const { user, logout, updatePreferences } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [digestTime, setDigestTime] = useState('09:00');
  const [emailDigest, setEmailDigest] = useState(false);
  const [sources, setSources] = useState<string[]>(['github', 'producthunt']);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [globalMouse, setGlobalMouse] = useState({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);

  const [openaiKeyStatus, setOpenaiKeyStatus] = useState<KeyStatus>('idle');
  const [anthropicKeyStatus, setAnthropicKeyStatus] = useState<KeyStatus>('idle');
  const verifyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const snapshotRef = useRef<FormState>({
    openaiKey: '',
    anthropicKey: '',
    digestTime: '09:00',
    emailDigest: false,
    sources: ['github', 'producthunt'],
  });

  const isDirty = !equalState(
    { openaiKey, anthropicKey, digestTime, emailDigest, sources },
    snapshotRef.current
  );

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setGlobalMouse({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    if (user?.preferences) {
      const snapshot: FormState = {
        openaiKey: '',
        anthropicKey: '',
        digestTime: user.preferences.digestTime || '09:00',
        emailDigest: user.preferences.emailDigest || false,
        sources: user.preferences.sources || ['github', 'producthunt'],
      };
      snapshotRef.current = snapshot;
      setDigestTime(snapshot.digestTime);
      setEmailDigest(snapshot.emailDigest);
      setSources(snapshot.sources);
    }
  }, [user]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const verifyKey = useCallback(async (provider: 'openai' | 'anthropic', key: string) => {
    const setStatus = provider === 'openai' ? setOpenaiKeyStatus : setAnthropicKeyStatus;
    if (!key) {
      setStatus('idle');
      return;
    }
    setStatus('verifying');
    try {
      const res = await api.post<{ valid: boolean; error?: string }>('/users/verify-key', { provider, key });
      setStatus(res.valid ? 'valid' : 'invalid');
    } catch {
      setStatus('invalid');
    }
  }, []);

  const debouncedVerify = useCallback((provider: 'openai' | 'anthropic', key: string) => {
    if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current);
    verifyTimerRef.current = setTimeout(() => verifyKey(provider, key), 800);
  }, [verifyKey]);

  const handleOpenaiKeyChange = (value: string) => {
    setOpenaiKey(value);
    setOpenaiKeyStatus('idle');
    debouncedVerify('openai', value);
  };

  const handleAnthropicKeyChange = (value: string) => {
    setAnthropicKey(value);
    setAnthropicKeyStatus('idle');
    debouncedVerify('anthropic', value);
  };

  const toggleSource = (source: string) => {
    setSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/users/preferences', {
        sources,
        digestTime,
        emailDigest,
        openaiKey: openaiKey || undefined,
        anthropicKey: anthropicKey || undefined,
      });
      snapshotRef.current = { openaiKey, anthropicKey, digestTime, emailDigest, sources };
      updatePreferences({ sources, digestTime, emailDigest });
      toast('success', 'Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast('error', 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    const s = snapshotRef.current;
    setOpenaiKey(s.openaiKey);
    setAnthropicKey(s.anthropicKey);
    setDigestTime(s.digestTime);
    setEmailDigest(s.emailDigest);
    setSources(s.sources);
    setOpenaiKeyStatus('idle');
    setAnthropicKeyStatus('idle');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete('/users/account');
      await logout();
      navigate('/');
      toast('success', 'Account deleted successfully.');
    } catch (err) {
      console.error('Failed to delete account:', err);
      toast('error', 'Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  const canDelete = deleteConfirmText === 'DELETE';

  const KeyStatusIndicator = ({ status }: { status: KeyStatus }) => {
    if (status === 'idle') return null;
    if (status === 'verifying') {
      return <span className="flex items-center gap-1 text-xs font-mono text-warm-gray"><Loader2 size={12} className="animate-spin" /> Verifying...</span>;
    }
    if (status === 'valid') {
      return <span className="flex items-center gap-1 text-xs font-mono text-mint"><CheckCircle size={12} /> Key verified</span>;
    }
    return <span className="flex items-center gap-1 text-xs font-mono text-red-500"><AlertCircle size={12} /> Key invalid</span>;
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-cream flex flex-col relative" onMouseMove={handleMouseMove}>
      <BlueprintGridBg mouse={globalMouse} />
      <div className="relative z-10 flex flex-col flex-1">

      <main className="md:ml-[60px] pb-20 md:pb-0 flex-1 flex flex-col">
        {/* Header */}
        <header className="shrink-0 px-4 md:px-8 pt-8 pb-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="font-mono text-2xl md:text-3xl font-bold text-charcoal">SETTINGS</h1>
              {isDirty && (
                <span className="font-mono text-xs text-coral bg-coral/10 px-2 py-0.5 rounded border border-coral/30">
                  UNSAVED CHANGES
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isDirty && (
                <Button variant="ghost" onClick={handleDiscard}>
                  DISCARD
                </Button>
              )}
              <Button onClick={handleSave} isLoading={isSaving} disabled={!isSaving && !isDirty}>
                <Save size={16} /> SAVE
              </Button>
            </div>
          </div>
        </header>

        {/* Grid */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* API Keys */}
              <Card data-walkthrough="api-keys">
                <div className="flex items-center gap-3 mb-2">
                  <Key size={20} className="text-coral" />
                  <h2 className="font-mono text-lg font-bold text-charcoal">API KEYS</h2>
                </div>
                <p className="font-serif text-sm text-warm-gray mb-5">
                  Bring your own key for better generation quality. Without one, we use our default model.
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="openai-key" className="font-mono text-xs text-charcoal tracking-wide">OPENAI</label>
                      <KeyStatusIndicator status={openaiKeyStatus} />
                    </div>
                    <Input
                      id="openai-key"
                      type="password"
                      placeholder="sk-..."
                      value={openaiKey}
                      onChange={(e) => handleOpenaiKeyChange(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="anthropic-key" className="font-mono text-xs text-charcoal tracking-wide">ANTHROPIC</label>
                      <KeyStatusIndicator status={anthropicKeyStatus} />
                    </div>
                    <Input
                      id="anthropic-key"
                      type="password"
                      placeholder="sk-ant-..."
                      value={anthropicKey}
                      onChange={(e) => handleAnthropicKeyChange(e.target.value)}
                    />
                  </div>
                </div>
              </Card>

              {/* Daily Digest */}
              <Card data-walkthrough="daily-digest">
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={20} className="text-coral" />
                  <h2 className="font-mono text-lg font-bold text-charcoal">DAILY DIGEST</h2>
                </div>
                <p className="font-serif text-sm text-warm-gray mb-5">
                  Get a morning email with trending topics ready to post.
                </p>
                <div className="space-y-4">
                  <Checkbox
                    id="emailDigest"
                    checked={emailDigest}
                    onChange={setEmailDigest}
                    label="Send me a daily digest email"
                  />
                  {emailDigest && (
                    <div>
                      <label htmlFor="digest-time" className="font-mono text-xs text-charcoal mb-1.5 block tracking-wide">DELIVERY TIME</label>
                      <Input
                        id="digest-time"
                        type="time"
                        value={digestTime}
                        onChange={(e) => setDigestTime(e.target.value)}
                        className="w-40"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Trend Sources */}
              <Card data-walkthrough="trend-sources">
                <div className="flex items-center gap-3 mb-2">
                  <Bell size={20} className="text-coral" />
                  <h2 className="font-mono text-lg font-bold text-charcoal">TREND SOURCES</h2>
                </div>
                <p className="font-serif text-sm text-warm-gray mb-5">
                  Choose where we find trending topics for your posts.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Pill active={sources.includes('github')} onClick={() => toggleSource('github')}>
                    GITHUB
                  </Pill>
                  <Pill active={sources.includes('producthunt')} onClick={() => toggleSource('producthunt')}>
                    PRODUCT HUNT
                  </Pill>
                  <Pill active={sources.includes('hackernews')} onClick={() => toggleSource('hackernews')}>
                    HACKER NEWS
                  </Pill>
                </div>
              </Card>

              {/* Account / Danger Zone */}
              <Card className="border-red-500">
                <div className="flex items-center gap-3 mb-2">
                  <Trash2 size={20} className="text-red-500" />
                  <h2 className="font-mono text-lg font-bold text-charcoal">ACCOUNT</h2>
                </div>
                <p className="font-serif text-sm text-warm-gray mb-5">
                  Delete your account and all associated data permanently. This action cannot be undone.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(''); }}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-soft-white"
                >
                  <Trash2 size={16} /> DELETE ACCOUNT
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }} ariaLabelledBy="delete-modal-title">
        <div className="p-6">
          <h2 id="delete-modal-title" className="font-mono text-xl font-bold text-charcoal mb-2">DELETE ACCOUNT?</h2>
          <p className="font-serif text-warm-gray mb-4">
            This will permanently delete your account, all your posts, voice profile, and settings. This cannot be undone.
          </p>
          <div className="mb-6">
            <label htmlFor="delete-confirm" className="font-mono text-sm text-charcoal mb-1 block">
              Type <span className="font-bold">DELETE</span> to confirm
            </label>
            <Input
              id="delete-confirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className={deleteConfirmText && !canDelete ? 'border-red-500' : ''}
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
              className="flex-1"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
              disabled={!canDelete}
              className="flex-1 bg-red-500 border-red-500 hover:bg-red-600"
            >
              YES, DELETE
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
    </DashboardLayout>
  );
}
