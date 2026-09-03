import { memo } from 'react';
import { Pill } from '@/components/ui/Pill';
import { SOURCES } from '@/config/sources';
import { useAuth } from '@/lib/auth';

interface TrendFiltersProps {
  active: string;
  onChange: (filter: string) => void;
}

export const TrendFilters = memo(function TrendFilters({ active, onChange }: TrendFiltersProps) {
  const { user } = useAuth();
  const userSources = user?.preferences?.sources ?? Object.keys(SOURCES);

  return (
    <div className="flex flex-wrap gap-2">
      <Pill active={active === 'all'} onClick={() => onChange('all')}>
        ALL
      </Pill>
      {userSources.map(key => {
        const source = SOURCES[key];
        if (!source) return null;
        return (
          <Pill
            key={key}
            active={active === key}
            onClick={() => onChange(key)}
          >
            {source.filterLabel}
          </Pill>
        );
      })}
    </div>
  );
});
