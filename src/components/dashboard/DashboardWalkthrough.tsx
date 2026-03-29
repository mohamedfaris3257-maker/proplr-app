'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  {
    title: 'Your Dashboard',
    description: 'This is your home base. Track your progress, view upcoming events, and manage your learning journey all in one place.',
    icon: '◎',
    color: '#0ea5e9',
  },
  {
    title: 'Courses & Pillars',
    description: '6 industry-aligned pillars to complete. Each comes with modules, quizzes, and hands-on projects to build real skills.',
    icon: '▤',
    color: '#22c55e',
  },
  {
    title: 'Community Feed',
    description: 'Connect with peers, share updates, and collaborate with students across schools and programs worldwide.',
    icon: '◆',
    color: '#a855f7',
  },
  {
    title: 'Opportunities',
    description: 'Browse internships, challenges, job shadowing, and volunteering opportunities curated for students like you.',
    icon: '★',
    color: '#f59e0b',
  },
  {
    title: 'Events & Workshops',
    description: 'Join live workshops, hackathons, and industry events. Build connections and earn extra hours toward your certificate.',
    icon: '▣',
    color: '#ef4444',
  },
  {
    title: 'Leaderboard & Badges',
    description: 'Earn badges, climb the leaderboard, and showcase your achievements. Top performers get special recognition!',
    icon: '↯',
    color: '#f97316',
  },
];

export function DashboardWalkthrough() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('proplr_walkthrough_done');
    if (!seen) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('proplr_walkthrough_done', '1');
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleClose();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(10px)',
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 24,
              maxWidth: 480,
              width: '92%',
              boxShadow: '0 32px 100px rgba(0,0,0,0.5)',
              border: '1px solid rgba(0,0,0,0.08)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Progress bar */}
            <div style={{ height: 4, background: 'rgba(0,0,0,0.06)' }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${current.color}, ${current.color}99)`,
                  borderRadius: 10,
                  boxShadow: `0 0 10px ${current.color}40`,
                }}
              />
            </div>

            {/* Skip */}
            <button
              onClick={handleClose}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'none', border: 'none', fontSize: 12,
                color: '#64748b', cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: 600, zIndex: 2,
              }}
            >
              Skip tour
            </button>

            <div style={{ padding: '40px 36px 32px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: 18,
                    background: `${current.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, marginBottom: 20, color: current.color,
                    border: `2px solid ${current.color}30`,
                    boxShadow: `0 0 20px ${current.color}15`,
                  }}>
                    {current.icon}
                  </div>

                  <h3 style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 22, fontWeight: 800, color: '#071629',
                    margin: '0 0 10px', letterSpacing: -0.3,
                  }}>
                    {current.title}
                  </h3>

                  <p style={{
                    fontSize: 14, color: '#64748b',
                    lineHeight: 1.7, margin: '0 0 28px',
                  }}>
                    {current.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Step dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{
                    width: i === step ? 20 : 8, height: 8, borderRadius: 100,
                    background: i === step ? current.color : i < step ? `${current.color}40` : 'rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    boxShadow: i === step ? `0 0 8px ${current.color}40` : 'none',
                  }} />
                ))}
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                  {step + 1} / {STEPS.length}
                </span>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                {step > 0 && (
                  <button onClick={handleBack} style={{
                    padding: '12px 24px', borderRadius: 100,
                    background: 'rgba(0,0,0,0.05)', color: '#334155',
                    border: '1px solid rgba(0,0,0,0.08)',
                    fontSize: 13, fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                  }}>
                    Back
                  </button>
                )}
                <button onClick={handleNext} style={{
                  flex: 1, padding: '12px 24px', borderRadius: 100,
                  background: current.color, color: '#fff', border: 'none',
                  fontSize: 13, fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                  boxShadow: `0 4px 16px ${current.color}40`,
                }}>
                  {step === STEPS.length - 1 ? "Let's Get Started!" : 'Next →'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
