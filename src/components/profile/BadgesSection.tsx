'use client';

import { BADGE_META } from '@/lib/types';
import type { Badge } from '@/lib/types';

interface BadgesSectionProps {
  badges: Badge[];
}

export function BadgesSection({ badges }: BadgesSectionProps) {
  if (badges.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-text-muted text-sm">
          No badges yet — keep posting and attending events!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((badge) => {
        const meta = BADGE_META[badge.badge_type];
        const earnedDate = new Date(badge.earned_at).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

        return (
          <div
            key={badge.id}
            className="bg-surface-2 border border-border rounded-xl p-3 flex flex-col items-center gap-1.5 w-[130px]"
          >
            <span className="text-3xl leading-none" role="img" aria-label={meta.label}>
              {meta.icon}
            </span>
            <p className="text-sm font-semibold text-text-primary text-center leading-tight">
              {meta.label}
            </p>
            <p className="text-xs text-text-muted text-center leading-tight">
              {meta.description}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{earnedDate}</p>
          </div>
        );
      })}
    </div>
  );
}
