'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { ProplrIcon } from '@/components/ProplrLogo';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth/callback?next=/update-password',
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
    }}>
      <AuthBackground />

      <div style={{
        width: '100%',
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 6,
          animation: 'authFloat 4s ease-in-out infinite',
        }}>
          <ProplrIcon size={52} variant="light" />
        </div>
        <p style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.4)',
          marginTop: 2,
          marginBottom: 32,
        }}>UAE Student Career Development</p>

        {/* Card */}
        <div style={{
          width: '100%',
          background: 'rgba(17,31,54,0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 24,
          padding: '32px 28px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: '#fff',
            margin: 0,
            letterSpacing: -0.3,
          }}>Reset your password</h2>
          <p style={{
            fontSize: 13.5,
            color: '#64748b',
            margin: '6px 0 24px',
          }}>Enter your email and we&apos;ll send you a reset link.</p>

          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                fontSize: 13,
                color: '#4ade80',
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: 12,
                padding: '12px 14px',
                textAlign: 'center',
              }}>
                Check your email for a reset link.
              </div>
              <p style={{
                fontSize: 13,
                color: '#64748b',
                textAlign: 'center',
                margin: '4px 0 0',
              }}>
                <Link href="/login" style={{ color: '#0ea5e9', fontWeight: 700, textDecoration: 'none' }}>
                  Back to Sign In
                </Link>
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={s.inputWrap}>
                  <MailIcon />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={s.input}
                    required
                  />
                </div>

                {error && <div style={s.errorBox}>{error}</div>}

                <button type="submit" disabled={loading} style={{
                  ...s.submitBtn,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p style={{
                fontSize: 13,
                color: '#64748b',
                textAlign: 'center',
                margin: '4px 0 0',
              }}>
                <Link href="/login" style={{ color: '#0ea5e9', fontWeight: 700, textDecoration: 'none' }}>
                  Back to Sign In
                </Link>
              </p>
            </div>
          )}
        </div>

        <p style={{
          fontSize: 11.5,
          color: 'rgba(255,255,255,0.25)',
          textAlign: 'center',
          marginTop: 24,
        }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '13px 14px 13px 42px',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    fontSize: 14,
    color: '#e2e8f0',
    background: 'rgba(255,255,255,0.04)',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border-color .2s, box-shadow .2s',
  },
  errorBox: {
    fontSize: 12,
    color: '#f87171',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 12,
    padding: '10px 14px',
  },
  submitBtn: {
    width: '100%',
    padding: '14px 16px',
    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    marginTop: 4,
    transition: 'all .2s',
    boxShadow: '0 4px 20px rgba(14,165,233,0.3)',
  },
};

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 6L2 7" />
    </svg>
  );
}
