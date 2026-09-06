import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { BlueprintGridBg } from '@/components/layout/BlueprintGridBg';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { Key, Clock, Bell, Save, Trash2 } from 'lucide-react';

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
  const [globalMouse, setGlobalMouse] = useState({ x: -999, y: -999 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setGlobalMouse({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    if (user?.preferences) {
      setDigestTime(user.preferences.digestTime || '09:00');
      setEmailDigest(user.preferences.emailDigest || false);
      setSources(user.preferences.sources || ['github', 'producthunt']);
    }
  }, [user]);

  const toggleSource = (source: string) => {
    setSources(prev => {
      const newSources = prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source];
      
      api.put('/users/preferences', {
        sources: newSources,
        digestTime,
        emailDigest,
        openaiKey: openaiKey || undefined,
        anthropicKey: anthropicKey || undefined,
      }).then(() => {
        updatePreferences({ sources: newSources, digestTime, emailDigest });
      }).catch(err => {
        console.error('Failed to auto-save source preferences:', err);
        toast('error', 'Failed to save preferences.');
      });

      return newSources;
    });
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
      updatePreferences({ sources, digestTime, emailDigest });
      toast('success', 'Settings saved successfully!');
    } catch (err) {
      console.error('Failed to save settings:', err);
      toast('error', 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
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

  return (
    <div className="min-h-screen bg-cream relative" onMouseMove={handleMouseMove}>
      <BlueprintGridBg mouse={globalMouse} />
      <div className="relative z-10">
        <Sidebar />
        <main className="ml-[60px] p-8">
            <div className="max-w-3xl mx-auto">
            <h1 className="font-mono text-3xl font-bold text-charcoal mb-8">SETTINGS</h1>

            <div className="space-y-6">
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <Key size={20} className="text-coral" />
                  <h2 className="font-mono text-lg font-bold text-charcoal">API KEYS</h2>
                </div>
                <p className="font-serif text-sm text-warm-gray mb-4">
                  Bring your own API key for better generation quality. If you don't have one, we'll use our default model.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="font-mono text-sm text-charcoal mb-1 block">OPENAI API KEY</label>
                    <Input
                      type="password"
                      placeholder="sk-..."
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-sm text-charcoal mb-1 block">ANTHROPIC API KEY</label>
                    <Input
                      type="password"
                      placeholder="sk-ant-..."
                      value={anthropicKey}
                      onChange={(e) => setAnthropicKey(e.target.value)}
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <Bell size={20} className="text-coral" />
                  <h2 className="font-mono text-lg font-bold text-charcoal">TREND SOURCES</h2>
                </div>
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

              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={20} className="text-coral" />
                  <h2 className="font-mono text-lg font-bold text-charcoal">DAILY DIGEST</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="emailDigest"
                      checked={emailDigest}
                      onChange={(e) => setEmailDigest(e.target.checked)}
                      className="w-5 h-5 accent-coral"
                    />
                    <label htmlFor="emailDigest" className="font-serif text-charcoal">
                      Send me a daily digest email
                    </label>
                  </div>
                  {emailDigest && (
                    <div>
                      <label className="font-mono text-sm text-charcoal mb-1 block">DELIVERY TIME</label>
                      <Input
                        type="time"
                        value={digestTime}
                        onChange={(e) => setDigestTime(e.target.value)}
                        className="w-40"
                      />
                    </div>
                  )}
                </div>
              </Card>

              <Button onClick={handleSave} isLoading={isSaving} className="w-full">
                <Save size={16} /> SAVE SETTINGS
              </Button>

              <Card className="border-red-500">
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 size={20} className="text-red-500" />
                  <h2 className="font-mono text-lg font-bold text-charcoal">DANGER ZONE</h2>
                </div>
                <p className="font-serif text-sm text-warm-gray mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(true)}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-soft-white"
                >
                  <Trash2 size={16} /> DELETE ACCOUNT
                </Button>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h2 className="font-mono text-xl font-bold text-charcoal mb-2">DELETE ACCOUNT?</h2>
          <p className="font-serif text-warm-gray mb-6">
            This will permanently delete your account, all your posts, voice profile, and settings. This cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
              className="flex-1 bg-red-500 border-red-500 hover:bg-red-600"
            >
              YES, DELETE
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
