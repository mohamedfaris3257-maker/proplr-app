'use client';

import { useState } from 'react';

export function ShowcaseRegisterForm() {
  const [form, setForm] = useState({ school_name: '', contact_name: '', email: '', student_count: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.school_name || !form.contact_name || !form.email) { setError('Please fill in required fields.'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/public/showcase-registration', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Submission failed');
      setSuccess(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="text-center py-8">
      <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🏆</span>
      <h3 className="pub-heading" style={{ fontSize: 20, color: '#071629', marginBottom: 6 }}>Registered!</h3>
      <p style={{ color: '#6e6e73', fontSize: 14 }}>We&apos;ll be in touch with Showcase details as they&apos;re confirmed.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>School Name <span style={{ color: '#e05c3a' }}>*</span></label>
        <input className="pub-input" placeholder="e.g. Dubai College" value={form.school_name} onChange={(e) => set('school_name', e.target.value)} required />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Contact Name <span style={{ color: '#e05c3a' }}>*</span></label>
          <input className="pub-input" placeholder="Full name" value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Email <span style={{ color: '#e05c3a' }}>*</span></label>
          <input type="email" className="pub-input" placeholder="you@school.ae" value={form.email} onChange={(e) => set('email', e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Estimated Number of Students</label>
        <input type="number" className="pub-input" placeholder="e.g. 20" value={form.student_count} onChange={(e) => set('student_count', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Notes (optional)</label>
        <textarea className="pub-input resize-none" rows={3} placeholder="Any questions or details..." value={form.notes} onChange={(e) => set('notes', e.target.value)} />
      </div>
      {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(224,92,58,0.08)', border: '1px solid rgba(224,92,58,0.2)', color: '#c04020' }}>{error}</div>}
      <button type="submit" disabled={loading} className="pub-btn-primary w-full">
        {loading ? 'Registering...' : 'Register for Showcase →'}
      </button>
    </form>
  );
}
