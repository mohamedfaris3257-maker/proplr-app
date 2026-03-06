'use client';

import { PILLAR_COLORS, type PillarName } from '@/lib/types';

interface PillarRingProps {
  pillar: PillarName;
  hours: number;
  maxHours?: number;
  size?: number;
}

export function PillarRing({ pillar, hours, maxHours = 50, size = 80 }: PillarRingProps) {
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
      </div>
      <p className="text-[10px] text-text-secondary text-center leading-tight max-w-[72px]">{pillar}</p>
    </div>
  );
}
