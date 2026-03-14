'use client';

import { useState } from 'react';

export function MentorApplicationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    expertise: '',
    availability: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const set = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/public/mentor-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
        <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 18, color: '#071629', marginBottom: 8 }}>
          Application received!
        </h3>
        <p style={{ color: '#6e6e73', fontSize: 14 }}>We&apos;ll be in touch shortly to discuss your mentorship role.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1d1d1f', marginBottom: 6 }}>Full Name *</label>
          <input
            className="pub-input"
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1d1d1f', marginBottom: 6 }}>Email *</label>
          <input
            className="pub-input"
            type="email"
            required
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="you@company.com"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1d1d1f', marginBottom: 6 }}>Phone</label>
          <input
            className="pub-input"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="+971 50 000 0000"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1d1d1f', marginBottom: 6 }}>Company / Organization</label>
          <input
            className="pub-input"
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            placeholder="Where you work"
          />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1d1d1f', marginBottom: 6 }}>Current Role / Title</label>
        <input
          className="pub-input"
          value={form.role}
          onChange={(e) => set('role', e.target.value)}
          placeholder="e.g. Senior Product Manager"
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1d1d1f', marginBottom: 6 }}>Area of Expertise *</label>
        <input
          className="pub-input"
          required
          value={form.expertise}
          onChange={(e) => set('expertise', e.target.value)}
          placeholder="e.g. Entrepreneurship, Engineering, Finance, Marketing"
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1d1d1f', marginBottom: 6 }}>Availability *</label>
        <select
          className="pub-input"
          required
          value={form.availability}
          onChange={(e) => set('availability', e.target.value)}
        >
          <option value="">Select availability</option>
          <option value="2hrs_month">2 hours/month (minimum)</option>
          <option value="4hrs_month">4 hours/month</option>
          <option value="flexible">Flexible / project-based</option>
        </select>
      </div>

      {status === 'error' && (
        <p style={{ color: '#ef4444', fontSize: 13 }}>Something went wrong. Please try again or email hello@proplr.ae</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="pub-btn-navy w-full"
        style={{ opacity: status === 'loading' ? 0.7 : 1 }}
      >
        {status === 'loading' ? 'Submitting…' : 'Apply as a Mentor →'}
      </button>
    </form>
  );
}
