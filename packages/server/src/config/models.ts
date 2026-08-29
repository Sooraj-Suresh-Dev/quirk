export interface ModelInfo {
  id: string;
  name: string;
  defaultTemperature: number;
}

export interface ProviderInfo {
  id: string;
  name: string;
  models: ModelInfo[];
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', defaultTemperature: 0.7 },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', defaultTemperature: 0.7 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', defaultTemperature: 0.7 },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', defaultTemperature: 0.7 },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', defaultTemperature: 0.7 },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    models: [
      { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', defaultTemperature: 0.7 },
      { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', defaultTemperature: 0.7 },
      { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B', defaultTemperature: 0.7 },
      { id: 'google/gemma-2-9b-it', name: 'Gemma 2 9B', defaultTemperature: 0.7 },
    ],
  },
];

export const DEFAULT_PROVIDER = 'openrouter';
export const DEFAULT_MODEL = 'meta-llama/llama-3.1-70b-instruct';
export const DEFAULT_TEMPERATURE = 0.7;

export function getProvider(id: string): ProviderInfo | undefined {
  return PROVIDERS.find(p => p.id === id);
}

export function getModel(providerId: string, modelId: string): ModelInfo | undefined {
  const provider = getProvider(providerId);
  return provider?.models.find(m => m.id === modelId);
}
