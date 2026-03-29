'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const FEATURES = [
  {
    title: 'KHDA-Certified Courses',
    subtitle: 'Build real-world skills',
    description: 'Complete 6 pillars covering Leadership, Entrepreneurship, Digital Literacy, and more.',
    cta: 'Start Learning',
    href: '/dashboard/courses',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 40%, #0369a1 100%)',
    glow: 'rgba(14,165,233,0.15)',
    accent: '#0ea5e9',
  },
  {
    title: 'Community Hub',
    subtitle: 'Connect & collaborate',
    description: 'Join school cohorts, interest groups, and program communities. Build your network.',
    cta: 'Explore Communities',
    href: '/dashboard/community',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 40%, #6d28d9 100%)',
    glow: 'rgba(168,85,247,0.15)',
    accent: '#a855f7',
  },
  {
    title: 'Career Opportunities',
    subtitle: 'Launch your career early',
    description: 'Discover internships, job shadowing, volunteering, and micro-placements curated for you.',
    cta: 'Browse Opportunities',
    href: '/dashboard/opportunities',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 40%, #15803d 100%)',
    glow: 'rgba(34,197,94,0.15)',
    accent: '#22c55e',
  },
  {
    title: 'Events & Workshops',
    subtitle: 'Learn from industry leaders',
    description: 'Attend live workshops, hackathons, and networking events with top professionals.',
    cta: 'View Events',
    href: '/dashboard/events',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 40%, #c2410c 100%)',
    glow: 'rgba(249,115,22,0.15)',
    accent: '#f97316',
  },
];

export function FeatureCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % FEATURES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const feature = FEATURES[current];

  return (
    <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 22 }}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -50 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          style={{
            background: feature.gradient,
            borderRadius: 20,
            padding: '30px 34px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: 170,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Atmospheric circles */}
          <div style={{ position: 'absolute', right: -50, top: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', right: 100, bottom: -80, width: 180, height: 180, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', left: -30, bottom: -30, width: 120, height: 120, background: 'rgba(0,0,0,0.1)', borderRadius: '50%' }} />

          {/* Grid pattern overlay */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
            <div style={{
              fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 700,
              letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase',
            }}>
              {feature.subtitle}
            </div>
            <h2 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: '#fff',
              margin: '0 0 8px',
              letterSpacing: -0.5,
            }}>
              {feature.title}
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 20px', maxWidth: 400, lineHeight: 1.6 }}>
              {feature.description}
            </p>
            <Link href={feature.href} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              borderRadius: 100,
              padding: '10px 24px',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'inherit',
              border: '1px solid rgba(255,255,255,0.25)',
              transition: 'all 0.2s',
            }}>
              {feature.cta} →
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div style={{
        position: 'absolute',
        bottom: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 6,
        zIndex: 2,
      }}>
        {FEATURES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              borderRadius: 100,
              border: 'none',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
