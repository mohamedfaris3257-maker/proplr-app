'use client';

import { useState } from 'react';

const ROLES = ['Teacher', 'School Administrator', 'Student', 'Parent', 'Other'];
const TIMEFRAMES = ['September 2026', 'Later'];
const HOW_HEARD = ['Social media', 'Word of mouth', 'Google search', 'Another school', 'Proplr event', 'Other'];

export function ClubInterestForm() {
  const [form, setForm] = useState({
    school_name: '', contact_name: '', contact_role: '', email: '',
    phone: '', grade_range: '', estimated_students: '', start_timeframe: '', referral_source: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.school_name || !form.contact_name || !form.email) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/public/club-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Submission failed');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>✅</span>
        <h3 className="pub-heading" style={{ fontSize: 24, color: '#071629', marginBottom: 8 }}>We&apos;ve received your request!</h3>
        <p style={{ color: '#6e6e73', fontSize: 15 }}>Alina or Faris will be in touch within 48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>School / Institution Name <span style={{ color: '#e05c3a' }}>*</span></label>
          <input className="pub-input" placeholder="e.g. Dubai College" value={form.school_name} onChange={(e) => set('school_name', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Your Name <span style={{ color: '#e05c3a' }}>*</span></label>
          <input className="pub-input" placeholder="Full name" value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Your Role <span style={{ color: '#e05c3a' }}>*</span></label>
          <select className="pub-input" value={form.contact_role} onChange={(e) => set('contact_role', e.target.value)} required>
            <option value="">Select your role</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Email Address <span style={{ color: '#e05c3a' }}>*</span></label>
          <input type="email" className="pub-input" placeholder="you@school.ae" value={form.email} onChange={(e) => set('email', e.target.value)} required />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Phone</label>
          <input type="tel" className="pub-input" placeholder="+971 50 000 0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Grade Range</label>
          <input className="pub-input" placeholder="e.g. Grades 9-12" value={form.grade_range} onChange={(e) => set('grade_range', e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Estimated Number of Students</label>
          <input type="number" className="pub-input" placeholder="e.g. 30" value={form.estimated_students} onChange={(e) => set('estimated_students', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>When would you like to start?</label>
          <select className="pub-input" value={form.start_timeframe} onChange={(e) => set('start_timeframe', e.target.value)}>
            <option value="">Select</option>
            {TIMEFRAMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>How did you hear about us?</label>
        <select className="pub-input" value={form.referral_source} onChange={(e) => set('referral_source', e.target.value)}>
          <option value="">Select</option>
          {HOW_HEARD.map((h) => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(224,92,58,0.08)', border: '1px solid rgba(224,92,58,0.2)', color: '#c04020' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="pub-btn-primary w-full" style={{ marginTop: 8 }}>
        {loading ? 'Submitting...' : 'Submit Interest Form →'}
      </button>
    </form>
  );
}
