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
            background: 'rgba(7,22,41,0.5)',
            backdropFilter: 'blur(6px)',
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
              background: '#fff',
              borderRadius: 24,
              padding: '48px 40px 36px',
              maxWidth: 440,
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 24px 80px rgba(7,22,41,0.2)',
              position: 'relative',
            }}
          >
            {/* Confetti dots */}
            <div style={{ position: 'absolute', top: 16, left: 24, fontSize: 20 }}>★</div>
            <div style={{ position: 'absolute', top: 16, right: 24, fontSize: 20 }}>↗</div>

            {/* Logo */}
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: '#071629', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
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
              color: '#071629',
              margin: '0 0 8px',
            }}>
              Welcome, {firstName}!
            </h2>

            <p style={{
              fontSize: 14,
              color: '#6e7591',
              lineHeight: 1.6,
              margin: '0 0 24px',
            }}>
              You&apos;re all set. This is your Proplr dashboard - your hub for courses,
              events, communities, and building your career portfolio.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 28,
            }}>
              {[
                { icon: '▤', label: 'Explore courses' },
                { icon: '●', label: 'Join communities' },
                { icon: '◎', label: 'Complete tasks' },
                { icon: '★', label: 'Earn certificates' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: '#f0f2f8',
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 12.5,
                    color: '#071629',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
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
                background: '#3d9be9',
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#2b8ad8')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#3d9be9')}
            >
              Let&apos;s Go
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
