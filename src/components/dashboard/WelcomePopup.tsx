'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function WelcomePopup({ name }: { name: string }) {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get('welcome') === 'true') {
      setShow(true);
      // Remove the query param from URL without reload
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(7,22,41,0.6)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={() => setShow(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: '48px 40px',
          maxWidth: 480,
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
          animation: 'scaleIn 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        {/* Confetti-style dots */}
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#127881;</div>
        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: 28,
            color: '#071629',
            marginBottom: 8,
          }}
        >
          Welcome to Proplr{name ? `, ${name}` : ''}!
        </h2>
        <p
          style={{
            color: '#5a5f7a',
            fontSize: 15,
            lineHeight: 1.65,
            marginBottom: 28,
            maxWidth: 360,
            margin: '0 auto 28px',
          }}
        >
          Your account is ready. This is your dashboard - explore your courses, track your progress, and start building your career portfolio.
        </p>
        <button
          onClick={() => setShow(false)}
          style={{
            background: 'linear-gradient(135deg, #3d9be9, #2b7cc9)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 100,
            padding: '14px 40px',
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(61,155,233,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Let&apos;s Go
        </button>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
