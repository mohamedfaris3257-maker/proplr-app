'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PILLARS } from '@/lib/types';

interface OpportunitiesFilterProps {
  currentFilters: { type?: string; pillar?: string; audience?: string };
  isSchoolStudent: boolean;
}

const OPPORTUNITY_TYPES = [
  { value: 'internship', label: 'Internship' },
  { value: 'job', label: 'Job' },
  { value: 'challenge', label: 'Challenge' },
  { value: 'job_shadowing', label: 'Job Shadowing' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'micro_placement', label: 'Micro-Placement' },
];

export function OpportunitiesFilter({ currentFilters, isSchoolStudent }: OpportunitiesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/opportunities?${params.toString()}`);
  };

  const btn = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
      active
        ? 'bg-gold/10 border-gold text-gold'
        : 'bg-surface-2 border-border text-text-secondary hover:border-border hover:text-text-primary'
    }`;

  const visibleTypes = isSchoolStudent
    ? OPPORTUNITY_TYPES.filter((t) => t.value !== 'job')
    : OPPORTUNITY_TYPES;

  return (
    <div className="space-y-3">
      {/* Type */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-muted w-14 flex-shrink-0">Type:</span>
        <button onClick={() => setFilter('type', null)} className={btn(!currentFilters.type)}>All</button>
        {visibleTypes.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter('type', currentFilters.type === t.value ? null : t.value)}
            className={btn(currentFilters.type === t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Pillar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-muted w-14 flex-shrink-0">Pillar:</span>
        <button onClick={() => setFilter('pillar', null)} className={btn(!currentFilters.pillar)}>All</button>
        {PILLARS.map((p) => (
          <button key={p} onClick={() => setFilter('pillar', currentFilters.pillar === p ? null : p)} className={btn(currentFilters.pillar === p)}>
            {p}
          </button>
        ))}
      </div>

      {/* Audience */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-muted w-14 flex-shrink-0">For:</span>
        {['all', 'school', 'uni'].map((a) => (
          <button
            key={a}
            onClick={() => setFilter('audience', a === 'all' ? null : a)}
            className={btn((currentFilters.audience || 'all') === a)}
          >
            {a === 'all' ? 'Everyone' : a === 'school' ? 'School' : 'University'}
          </button>
        ))}
      </div>
    </div>
  );
}
