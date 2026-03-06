'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PILLARS } from '@/lib/types';

interface EventsFilterProps {
  currentFilters: { pillar?: string; audience?: string; type?: string };
  userType?: string;
}

export function EventsFilter({ currentFilters }: EventsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/events?${params.toString()}`);
  };

  const btnClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
      active
        ? 'bg-gold/10 border-gold text-gold'
        : 'bg-surface-2 border-border text-text-secondary hover:border-border hover:text-text-primary'
    }`;

  return (
    <div className="space-y-3">
      {/* Pillar filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-muted w-16 flex-shrink-0">Pillar:</span>
        <button onClick={() => setFilter('pillar', null)} className={btnClass(!currentFilters.pillar)}>
          All
        </button>
        {PILLARS.map((p) => (
          <button key={p} onClick={() => setFilter('pillar', p)} className={btnClass(currentFilters.pillar === p)}>
            {p}
          </button>
        ))}
      </div>

      {/* Audience filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-muted w-16 flex-shrink-0">Audience:</span>
        {['all', 'school', 'uni'].map((a) => (
          <button
            key={a}
            onClick={() => setFilter('audience', a)}
            className={btnClass((currentFilters.audience || 'all') === a)}
          >
            {a === 'all' ? 'All' : a === 'school' ? 'School' : 'University'}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-muted w-16 flex-shrink-0">Type:</span>
        {['Workshop', 'Webinar', 'Panel', 'Networking', 'Competition'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter('type', currentFilters.type === t ? null : t)}
            className={btnClass(currentFilters.type === t)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
