'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PILLARS, PILLAR_TAGS_BG, type PillarName } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FeedFiltersProps {
  activePillar?: string;
}

export function FeedFilters({ activePillar }: FeedFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (pillar: PillarName | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pillar) {
      params.set('pillar', pillar);
    } else {
      params.delete('pillar');
    }
    router.push(`/feed?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <span className="text-xs text-text-muted flex-shrink-0">Filter:</span>

      {/* All button */}
      <button
        onClick={() => handleFilter(null)}
        className={cn(
          'flex-shrink-0 inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-sm transition-all duration-150',
          !activePillar
            ? 'bg-gold/20 text-gold ring-1 ring-gold/40'
            : 'bg-border text-text-muted hover:bg-surface-2 hover:text-text-primary'
        )}
      >
        All
      </button>

      {/* Pillar buttons */}
      {PILLARS.map((pillar) => {
        const isActive = activePillar === pillar;
        return (
          <button
            key={pillar}
            onClick={() => handleFilter(pillar as PillarName)}
            className={cn(
              'flex-shrink-0 inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-sm transition-all duration-150',
              isActive
                ? cn(PILLAR_TAGS_BG[pillar as PillarName], 'ring-1 ring-current/40 opacity-100')
                : cn(PILLAR_TAGS_BG[pillar as PillarName], 'opacity-50 hover:opacity-100')
            )}
          >
            {pillar}
          </button>
        );
      })}
    </div>
  );
}
