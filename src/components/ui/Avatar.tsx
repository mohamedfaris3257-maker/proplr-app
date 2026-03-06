'use client';

import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

const pixelSizes = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };

export function Avatar({ name, photoUrl, size = 'md', className }: AvatarProps) {
  if (photoUrl) {
    return (
      <div className={cn('rounded-full overflow-hidden flex-shrink-0 bg-surface-2', sizes[size], className)}>
        <Image
          src={photoUrl}
          alt={name}
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex-shrink-0 flex items-center justify-center font-semibold bg-gradient-to-br from-gold/30 to-blue/30 text-gold border border-gold/20',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
