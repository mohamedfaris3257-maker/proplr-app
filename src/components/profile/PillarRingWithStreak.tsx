'use client';

import { PILLAR_COLORS, type PillarName } from '@/lib/types';

interface PillarRingWithStreakProps {
  pillar: PillarName;
  hours: number;
  maxHours?: number;
  size?: number;
  streak?: number;
}

export function PillarRingWithStreak({
  pillar,
  hours,
  maxHours = 50,
  size = 80,
  streak = 0,
}: PillarRingWithStreakProps) {
  const color = PILLAR_COLORS[pillar];
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(hours / maxHours, 1);
  const dashOffset = circumference * (1 - progress);
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#1e2f45"
            strokeWidth={6}
          />
          {/* Progress */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="pillar-ring-progress"
            style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
          />
        </svg>
        {/* Hours label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-text-primary leading-none">{hours}</span>
          <span className="text-[9px] text-text-muted leading-none mt-0.5">hrs</span>
        </div>
        {/* Streak flame badge */}
        {streak > 0 && (
          <div className="absolute bottom-0 right-0 bg-surface text-[10px] px-1 rounded-full text-gold flex items-center gap-0.5 leading-tight border border-border">
            <span role="img" aria-label="streak fire">↯</span>
            <span>{streak}</span>
          </div>
        )}
      </div>
      <p className="text-[10px] text-text-secondary text-center leading-tight max-w-[72px]">
        {pillar}
      </p>
    </div>
  );
}
