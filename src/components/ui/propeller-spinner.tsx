'use client';

import { motion } from 'framer-motion';

interface PropellerSpinnerProps {
  size?: number;
  color1?: string;
  color2?: string;
  className?: string;
  speed?: number;
}

export function PropellerSpinner({
  size = 120,
  color1 = '#3d9be9',
  color2 = '#ffcb5d',
  className = '',
  speed = 20,
}: PropellerSpinnerProps) {
  const bladeWidth = size * 0.38;
  const bladeHeight = size * 0.12;

  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        position: 'relative',
        pointerEvents: 'none',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
    >
      {/* 4 blades */}
      {[0, 90, 180, 270].map((angle, i) => (
        <div
          key={angle}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: bladeWidth,
            height: bladeHeight,
            borderRadius: bladeHeight,
            background: i % 2 === 0 ? color1 : color2,
            opacity: 0.15,
            transformOrigin: '0% 50%',
            transform: `translate(0%, -50%) rotate(${angle}deg)`,
          }}
        />
      ))}
      {/* Center hub */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size * 0.08,
          height: size * 0.08,
          borderRadius: '50%',
          background: color1,
          opacity: 0.2,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </motion.div>
  );
}
