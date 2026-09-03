import { Card } from '@/components/ui/Card';
import { Type, Layers } from 'lucide-react';

interface PostTypeSelectorProps {
  selected: 'text' | 'carousel' | 'image-prompt';
  onChange: (type: 'text' | 'carousel' | 'image-prompt') => void;
}

const types = [
  { value: 'text' as const, label: 'TEXT POST', icon: Type, description: 'Hook + body + CTA' },
  { value: 'carousel' as const, label: 'CAROUSEL', icon: Layers, description: '5-slide framework' },
];

export function PostTypeSelector({ selected, onChange }: PostTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {types.map(({ value, label, icon: Icon, description }) => (
        <Card
          key={value}
          hover
          className={`text-center cursor-pointer transition-all ${
            selected === value ? 'ring-2 ring-coral shadow-card-hover' : ''
          }`}
          onClick={() => onChange(value)}
        >
          <Icon size={24} className={`mx-auto mb-2 ${selected === value ? 'text-coral' : 'text-warm-gray'}`} />
          <p className="font-mono text-xs font-bold text-charcoal">{label}</p>
          <p className="font-serif text-xs text-warm-gray mt-1">{description}</p>
        </Card>
      ))}
    </div>
  );
}
