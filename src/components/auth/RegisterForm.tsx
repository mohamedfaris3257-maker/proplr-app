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

    // 1. Create the auth account (email + password only)
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

    // 2. Create a minimal profile so the user can access /dashboard immediately
    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: data.user.id,
      name: email.split('@')[0],
      email: email.toLowerCase().trim(),
      type: 'school_student',
      career_interests: [],
      subscription_status: 'free',
      is_ambassador: false,
      dibz_discount_active: false,
    });

    if (profileError) {
      // Profile might already exist (e.g. duplicate signup) — continue anyway
      console.warn('Profile insert warning:', profileError.message);
    }

    // 3. Redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <p style={s.toggleText}>
        Already have an account?{' '}
        <Link href="/login" style={s.toggleLink}>Sign in</Link>
      </p>
    </form>
  );
}

// ── STYLES ──────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '11px 12px 11px 38px',
    border: '1px solid rgba(7,22,41,.1)',
    borderRadius: 12,
    fontSize: 13.5,
    color: '#071629',
    background: '#f7f8fb',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border-color .2s',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6e7591',
    display: 'flex',
    padding: 0,
  },
  errorBox: {
    fontSize: 12,
    color: '#c0392b',
    background: 'rgba(255,71,87,.08)',
    border: '1px solid rgba(255,71,87,.15)',
    borderRadius: 10,
    padding: '8px 12px',
  },
  submitBtn: {
    width: '100%',
    padding: '12px 16px',
    background: '#3d9be9',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    marginTop: 4,
    transition: 'opacity .2s',
  },
  toggleText: {
    fontSize: 13,
    color: '#6e7591',
    textAlign: 'center',
    margin: '4px 0 0',
  },
  toggleLink: {
    color: '#3d9be9',
    fontWeight: 600,
    textDecoration: 'none',
  },
};

// ── ICONS ────────────────────────────────────────────────────────────────────

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6e7591" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 6L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6e7591" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
