'use client';

import { useState } from 'react';

const GRADES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

export function SummerCampForm() {
  const [form, setForm] = useState({
    student_name: '', email: '', phone: '', dob: '', school: '', grade: '',
    parent_name: '', parent_email: '', parent_phone: '', promo_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.student_name || !form.email) { setError('Please fill in required fields.'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/public/summer-camp-register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Submission failed');
      setSuccess(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="text-center py-8">
      <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>☀️</span>
      <h3 className="pub-heading" style={{ fontSize: 20, color: '#071629', marginBottom: 6 }}>You&apos;re registered!</h3>
      <p style={{ color: '#6e6e73', fontSize: 14 }}>We&apos;ll send you camp details and pricing as soon as they&apos;re confirmed.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Student Name <span style={{ color: '#e05c3a' }}>*</span></label>
          <input className="pub-input" placeholder="Full name" value={form.student_name} onChange={(e) => set('student_name', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Email <span style={{ color: '#e05c3a' }}>*</span></label>
          <input type="email" className="pub-input" placeholder="student@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} required />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Phone</label>
          <input type="tel" className="pub-input" placeholder="+971 50 000 0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Date of Birth</label>
          <input type="date" className="pub-input" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>School</label>
          <input className="pub-input" placeholder="School name" value={form.school} onChange={(e) => set('school', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Grade</label>
          <select className="pub-input" value={form.grade} onChange={(e) => set('grade', e.target.value)}>
            <option value="">Select grade</option>
            {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 16 }}>
        <p className="text-sm font-semibold mb-3" style={{ color: '#6e6e73' }}>Parent / Guardian</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Parent Name</label>
            <input className="pub-input" placeholder="Full name" value={form.parent_name} onChange={(e) => set('parent_name', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Parent Email</label>
            <input type="email" className="pub-input" placeholder="parent@example.com" value={form.parent_email} onChange={(e) => set('parent_email', e.target.value)} />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Promo / Referral Code</label>
        <input className="pub-input" placeholder="Optional" value={form.promo_code} onChange={(e) => set('promo_code', e.target.value)} />
      </div>
      {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(224,92,58,0.08)', border: '1px solid rgba(224,92,58,0.2)', color: '#c04020' }}>{error}</div>}
      <button type="submit" disabled={loading} className="pub-btn-primary w-full">
        {loading ? 'Registering...' : 'Secure My Spot →'}
      </button>
    </form>
  );
}
