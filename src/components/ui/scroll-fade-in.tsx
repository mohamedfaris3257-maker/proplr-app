'use client';

import { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';

interface ScrollFadeInProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  distance?: number;
}

const directionMap = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { y: 0, x: -40 },
  right: { y: 0, x: 40 },
  scale: { y: 0, x: 0 },
  none: { y: 0, x: 0 },
};

export function ScrollFadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  className = '',
  once = true,
  distance = 40,
}: ScrollFadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-40px' });

  const dir = directionMap[direction];
  const scaleMult = direction === 'scale' ? 0.92 : 1;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: dir.y !== 0 ? (dir.y > 0 ? distance : -distance) : 0,
        x: dir.x !== 0 ? (dir.x > 0 ? distance : -distance) : 0,
        scale: scaleMult,
      }}
      animate={isInView ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
      transition={{
        duration,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
