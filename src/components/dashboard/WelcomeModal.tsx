'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeModalProps {
  name: string;
}

export function WelcomeModal({ name }: WelcomeModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('proplr_welcome_dismissed');
    if (!dismissed) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('proplr_welcome_dismissed', '1');
  };

  const firstName = name?.split(' ')[0] || 'there';

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
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#111f36',
              borderRadius: 24,
              padding: '48px 40px 36px',
              maxWidth: 440,
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 32px 100px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              position: 'relative',
            }}
          >
            {/* Decorative */}
            <div style={{ position: 'absolute', top: 16, left: 24, fontSize: 20, color: '#ffcb5d', opacity: 0.6 }}>★</div>
            <div style={{ position: 'absolute', top: 16, right: 24, fontSize: 20, color: '#0ea5e9', opacity: 0.6 }}>↗</div>

            {/* Logo */}
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, #0ea5e9, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(14,165,233,0.3)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="#ffcb5d" />
                <line x1="12" y1="2" x2="12" y2="9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="12" y1="15" x2="12" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="2" y1="12" x2="9" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="15" y1="12" x2="22" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            <h2 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontSize: 24,
              color: '#fff',
              margin: '0 0 8px',
            }}>
              Welcome, {firstName}!
            </h2>

            <p style={{
              fontSize: 14,
              color: '#64748b',
              lineHeight: 1.6,
              margin: '0 0 24px',
            }}>
              You&apos;re all set. This is your Proplr dashboard — your hub for courses,
              events, communities, and building your career portfolio.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 28,
            }}>
              {[
                { icon: '▤', label: 'Explore courses', color: '#0ea5e9' },
                { icon: '●', label: 'Join communities', color: '#a855f7' },
                { icon: '◎', label: 'Complete tasks', color: '#22c55e' },
                { icon: '★', label: 'Earn certificates', color: '#f59e0b' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: `${item.color}10`,
                    border: `1px solid ${item.color}20`,
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 12.5,
                    color: '#e2e8f0',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 16, color: item.color }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>

            <button
              onClick={handleClose}
              style={{
                width: '100%',
                padding: '14px 24px',
                borderRadius: 100,
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(14,165,233,0.3)',
                transition: 'all 0.2s',
              }}
            >
              Let&apos;s Go →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
