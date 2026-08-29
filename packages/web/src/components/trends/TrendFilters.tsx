import { Pill } from '@/components/ui/Pill';

interface TrendFiltersProps {
  active: string;
  onChange: (filter: string) => void;
}

const filters = [
  { value: 'all', label: 'ALL' },
  { value: 'github', label: 'GITHUB' },
  { value: 'producthunt', label: 'PRODUCT HUNT' },
];

export function TrendFilters({ active, onChange }: TrendFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(({ value, label }) => (
        <Pill
          key={value}
          active={active === value}
          onClick={() => onChange(value)}
        >
          {label}
        </Pill>
      ))}
    </div>
  );
}
