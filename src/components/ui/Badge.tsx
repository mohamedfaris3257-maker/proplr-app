'use client';

import { cn } from '@/lib/utils';
import { PILLAR_TAGS_BG, type PillarName } from '@/lib/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'blue' | 'green' | 'red' | 'purple' | 'teal';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-border text-text-secondary',
    gold: 'bg-gold/10 text-gold',
    blue: 'bg-blue/10 text-blue',
    green: 'bg-green/10 text-green',
    red: 'bg-red/10 text-red',
    purple: 'bg-purple/10 text-purple',
    teal: 'bg-teal/10 text-teal',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface PillarBadgeProps {
  pillar: PillarName;
  className?: string;
}

export function PillarBadge({ pillar, className }: PillarBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-sm',
        PILLAR_TAGS_BG[pillar],
        className
      )}
    >
      {pillar}
    </span>
  );
}
