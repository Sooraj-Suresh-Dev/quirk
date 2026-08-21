import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Key, Clock, Bell, Save } from 'lucide-react';

export function Settings() {
  const { user } = useAuth();
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [digestTime, setDigestTime] = useState('09:00');
  const [emailDigest, setEmailDigest] = useState(false);
  const [sources, setSources] = useState<string[]>(['github', 'hackernews']);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      setDigestTime(user.preferences.digestTime || '09:00');
      setEmailDigest(user.preferences.emailDigest || false);
      setSources(user.preferences.sources || ['github', 'hackernews']);
    }
  }, [user]);

  const toggleSource = (source: string) => {
    setSources(prev =>
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
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
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-[60px] p-8">
        <div className="max-w-2xl mx-auto">
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
          </div>
        </div>
      </main>
    </div>
  );
}
