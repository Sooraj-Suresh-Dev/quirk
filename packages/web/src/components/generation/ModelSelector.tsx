import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { api } from '@/lib/api';
import { Settings, Check, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Model {
  id: string;
  name: string;
  defaultTemperature: number;
}

interface Provider {
  id: string;
  name: string;
  hasApiKey: boolean;
  models: Model[];
}

interface ModelSelectorProps {
  onConfigChange: (config: { provider: string; model: string; temperature: number; hasApiKey: boolean }) => void;
}

const TEMPERATURE_PRESETS = [
  { value: 0.3, label: 'Precise', description: 'Factual, focused' },
  { value: 0.7, label: 'Balanced', description: 'Default' },
  { value: 1.2, label: 'Creative', description: 'Viral, bold' },
];

export function ModelSelector({ onConfigChange }: ModelSelectorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [customTemp, setCustomTemp] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    api.get<{ providers: Provider[]; defaults: { provider: string; model: string; temperature: number } }>('/posts/models')
      .then(res => {
        setProviders(res.providers);
        const savedProvider = user?.preferences?.preferredProvider || res.defaults.provider;
        const savedModel = user?.preferences?.preferredModel || res.defaults.model;
        const savedTemp = user?.preferences?.preferredTemperature ?? res.defaults.temperature;
        setSelectedProvider(savedProvider);
        setSelectedModel(savedModel || getFirstModel(res.providers, savedProvider));
        setTemperature(savedTemp);
      })
      .catch(() => {
        toast('error', 'Failed to load model options');
      });
  }, [user]);

  useEffect(() => {
    if (selectedProvider && selectedModel) {
      const provider = providers.find(p => p.id === selectedProvider);
      onConfigChange({ provider: selectedProvider, model: selectedModel, temperature, hasApiKey: provider?.hasApiKey ?? false });
    }
  }, [selectedProvider, selectedModel, temperature, providers]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFirstModel = (provs: Provider[], providerId: string) => {
    const p = provs.find(p => p.id === providerId);
    return p?.models[0]?.id || '';
  };

  const currentProvider = providers.find(p => p.id === selectedProvider);
  const currentModel = currentProvider?.models.find(m => m.id === selectedModel);
  const activeProviderHasKey = currentProvider?.hasApiKey ?? false;
  const isNotOpenRouter = selectedProvider !== 'openrouter' && selectedProvider !== '';

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    const provider = providers.find(p => p.id === providerId);
    if (provider?.models[0]) {
      setSelectedModel(provider.models[0].id);
      setTemperature(provider.models[0].defaultTemperature);
      setCustomTemp(false);
    }
    setIsDropdownOpen(false);
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setIsDropdownOpen(false);
    const model = currentProvider?.models.find(m => m.id === modelId);
    if (model && !customTemp) {
      setTemperature(model.defaultTemperature);
    }
  };

  const handlePresetTemp = (preset: typeof TEMPERATURE_PRESETS[number]) => {
    setTemperature(preset.value);
    setCustomTemp(false);
  };

  const dropdownDisabled = isNotOpenRouter && !activeProviderHasKey;

  return (
    <div className="bg-soft-white rounded-card border-3 border-deep-black shadow-card p-6 transition-all duration-150">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p className="font-mono text-xs text-warm-gray tracking-wider">GENERATION SETTINGS</p>
        {dropdownDisabled && (
          <Link
            to="/settings"
            className="inline-flex items-center gap-1 text-xs font-mono text-coral hover:text-coral-hover transition-colors"
          >
            <Settings size={12} /> Add API Key
          </Link>
        )}
      </div>

      {/* Provider Row */}
      <div className="mb-5">
        <p className="font-mono text-xs text-charcoal font-bold mb-2 tracking-wider">PROVIDER</p>
        <div className="grid grid-cols-3 gap-2">
          {providers.map((provider) => {
            const isSelected = selectedProvider === provider.id;
            const showNoKey = !provider.hasApiKey && provider.id !== 'openrouter';
            return (
              <button
                key={provider.id}
                onClick={() => handleProviderChange(provider.id)}
                className={`relative p-2.5 rounded-pill border-2 border-deep-black font-mono text-xs transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-coral text-soft-white shadow-button'
                    : 'bg-soft-white text-charcoal hover:bg-cream'
                }`}
              >
                <div className="font-bold">{provider.name}</div>
                {showNoKey && (
                  <div className={`text-[11px] mt-0.5 font-bold ${isSelected ? 'text-soft-white' : 'text-coral'}`}>
                    NO KEY
                  </div>
                )}
                {!showNoKey && provider.id !== 'openrouter' && (
                  <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-soft-white' : 'text-warm-gray'}`}>
                    <Check size={10} className="inline" /> Key set
                  </div>
                )}
                {provider.id === 'openrouter' && (
                  <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-soft-white' : 'text-warm-gray'}`}>
                    App key
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Row */}
      <div className="mb-5" ref={dropdownRef}>
        <p className="font-mono text-xs text-charcoal font-bold mb-2 tracking-wider">MODEL</p>
        <div className="relative">
          <button
            onClick={() => !dropdownDisabled && setIsDropdownOpen(!isDropdownOpen)}
            disabled={dropdownDisabled}
            className={`w-full font-mono text-sm px-4 py-3 rounded-button border-2 border-deep-black transition-all duration-150 text-left flex items-center justify-between ${
              dropdownDisabled
                ? 'bg-cream text-warm-gray cursor-not-allowed border-warm-gray/30'
                : 'bg-soft-white text-charcoal shadow-input hover:shadow-button-hover focus:border-coral focus:outline-none cursor-pointer'
            }`}
          >
            <span>{dropdownDisabled ? 'Add API key to use this provider' : currentModel?.name || 'Select model'}</span>
            {!dropdownDisabled && (
              <ChevronDown size={16} className={`text-warm-gray transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          {isDropdownOpen && !dropdownDisabled && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-soft-white rounded-card border-3 border-deep-black shadow-card overflow-hidden">
              {currentProvider?.models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`w-full px-4 py-2.5 font-mono text-sm text-left transition-all duration-100 cursor-pointer flex items-center justify-between ${
                    selectedModel === model.id
                      ? 'bg-coral text-soft-white'
                      : 'text-charcoal hover:bg-cream'
                  }`}
                >
                  <span>{model.name}</span>
                  {selectedModel === model.id && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Creativity Row */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-xs text-charcoal font-bold tracking-wider">CREATIVITY</p>
          <span className="font-mono text-xs text-charcoal font-bold">{temperature.toFixed(1)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TEMPERATURE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetTemp(preset)}
              className={`p-2.5 rounded-pill border-2 border-deep-black font-mono text-xs transition-all duration-150 cursor-pointer ${
                !customTemp && temperature === preset.value
                  ? 'bg-coral text-soft-white shadow-button'
                  : 'bg-soft-white text-charcoal hover:bg-cream'
              }`}
            >
              <div className="font-bold">{preset.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
