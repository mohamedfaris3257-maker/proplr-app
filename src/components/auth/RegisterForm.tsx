'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError('Account creation failed. Please try again.');
      setLoading(false);
      return;
    }

    window.location.href = '/dashboard';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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

        <div style={s.inputWrap}>
          <LockIcon />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        {error && <div style={s.errorBox}>{error}</div>}

        <button type="submit" disabled={loading} style={{
          ...s.submitBtn,
          opacity: loading ? 0.6 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? 'Creating account...' : 'Join for Free'}
        </button>
      </form>

      <p style={s.toggleText}>
        Already have an account?{' '}
        <Link href="/login" style={s.toggleLink}>Sign in</Link>
      </p>
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
  toggleText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    margin: '4px 0 0',
  },
  toggleLink: {
    color: '#0ea5e9',
    fontWeight: 700,
    textDecoration: 'none',
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
