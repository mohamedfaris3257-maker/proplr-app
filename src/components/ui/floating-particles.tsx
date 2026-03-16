'use client';

import { motion } from 'framer-motion';

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
  className?: string;
}

export function FloatingParticles({
  count = 12,
  colors = ['#3d9be9', '#ffcb5d', '#2ed573'],
  className = '',
}: FloatingParticlesProps) {
  // Generate deterministic positions based on index
  const particles = Array.from({ length: count }, (_, i) => ({
    x: ((i * 37) % 100),
    y: ((i * 53 + 17) % 100),
    size: 3 + (i % 4) * 2,
    color: colors[i % colors.length],
    duration: 4 + (i % 3) * 2,
    delay: (i * 0.3) % 2,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: 0.15,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, i % 2 === 0 ? 10 : -10, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
