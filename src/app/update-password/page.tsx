'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { ProplrIcon } from '@/components/ProplrLogo';

export default function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/dashboard';
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
          }}>Set new password</h2>
          <p style={{
            fontSize: 13.5,
            color: '#64748b',
            margin: '6px 0 24px',
          }}>Enter your new password below.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={s.inputWrap}>
                <LockIcon />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ ...s.input, paddingRight: 38 }}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={s.eyeBtn}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              <div style={s.inputWrap}>
                <LockIcon />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={s.input}
                  required
                  minLength={6}
                />
              </div>

              {error && <div style={s.errorBox}>{error}</div>}

              <button type="submit" disabled={loading} style={{
                ...s.submitBtn,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
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
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#64748b',
    display: 'flex',
    padding: 0,
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

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
