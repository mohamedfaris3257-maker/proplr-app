'use client';

import { useState } from 'react';

const INDUSTRY_PARTNERSHIP_TYPES = ['Mentorship', 'Challenges', 'Internships', 'Career Panels', 'Sponsorship', 'Other'];
const INSTITUTION_INTERESTS = ['Impact Chapter', 'Compass Pilot', 'Both'];

export function IndustryPartnerForm() {
  const [form, setForm] = useState({ org_name: '', contact_name: '', role: '', email: '', phone: '', partnership_types: [] as string[], notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const toggleType = (t: string) => setForm((p) => ({
    ...p,
    partnership_types: p.partnership_types.includes(t) ? p.partnership_types.filter((x) => x !== t) : [...p.partnership_types, t],
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.org_name || !form.email) { setError('Please fill in required fields.'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/public/partner-application', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, type: 'industry' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Submission failed');
      setSuccess(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="text-center py-8">
      <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>▣</span>
      <h3 className="pub-heading" style={{ fontSize: 18, color: '#071629', marginBottom: 6 }}>Application received!</h3>
      <p style={{ color: '#6e6e73', fontSize: 14 }}>Our team will be in touch within 48 hours.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Company Name <span style={{ color: '#e05c3a' }}>*</span></label>
          <input className="pub-input" placeholder="Company name" value={form.org_name} onChange={(e) => set('org_name', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Contact Name <span style={{ color: '#e05c3a' }}>*</span></label>
          <input className="pub-input" placeholder="Full name" value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Role</label>
          <input className="pub-input" placeholder="e.g. HR Manager" value={form.role} onChange={(e) => set('role', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Email <span style={{ color: '#e05c3a' }}>*</span></label>
          <input type="email" className="pub-input" placeholder="you@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#1d1d1f' }}>Partnership Type (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRY_PARTNERSHIP_TYPES.map((t) => {
            const active = form.partnership_types.includes(t);
            return (
              <button key={t} type="button" onClick={() => toggleType(t)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{ background: active ? '#3d9be9' : '#f5f5f7', color: active ? '#ffffff' : '#1d1d1f', border: `1px solid ${active ? '#3d9be9' : 'rgba(0,0,0,0.1)'}` }}>
                {t}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Notes</label>
        <textarea className="pub-input resize-none" rows={3} placeholder="Any questions or ideas..." value={form.notes} onChange={(e) => set('notes', e.target.value)} />
      </div>
      {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(224,92,58,0.08)', border: '1px solid rgba(224,92,58,0.2)', color: '#c04020' }}>{error}</div>}
      <button type="submit" disabled={loading} className="pub-btn-primary w-full">
        {loading ? 'Submitting...' : 'Become an Industry Partner →'}
      </button>
    </form>
  );
}

export function InstitutionPartnerForm() {
  const [form, setForm] = useState({ org_name: '', contact_name: '', role: '', email: '', institution_type: '', student_count: '', interests: [] as string[] });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const toggleInterest = (t: string) => setForm((p) => ({
    ...p,
    interests: p.interests.includes(t) ? p.interests.filter((x) => x !== t) : [...p.interests, t],
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.org_name || !form.email) { setError('Please fill in required fields.'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/public/partner-application', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, type: 'institution' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Submission failed');
      setSuccess(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="text-center py-8">
      <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>★</span>
      <h3 className="pub-heading" style={{ fontSize: 18, color: '#071629', marginBottom: 6 }}>Application received!</h3>
      <p style={{ color: '#6e6e73', fontSize: 14 }}>Our team will be in touch within 48 hours.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Institution Name <span style={{ color: '#e05c3a' }}>*</span></label>
          <input className="pub-input" placeholder="University / School name" value={form.org_name} onChange={(e) => set('org_name', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Contact Name <span style={{ color: '#e05c3a' }}>*</span></label>
          <input className="pub-input" placeholder="Full name" value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Email <span style={{ color: '#e05c3a' }}>*</span></label>
          <input type="email" className="pub-input" placeholder="you@institution.ae" value={form.email} onChange={(e) => set('email', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Institution Type</label>
          <select className="pub-input" value={form.institution_type} onChange={(e) => set('institution_type', e.target.value)}>
            <option value="">Select type</option>
            <option value="university">University</option>
            <option value="school">School</option>
            <option value="accelerator">Accelerator / Incubator</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1d1d1f' }}>Student Body Size</label>
        <input type="number" className="pub-input" placeholder="Approximate number of students" value={form.student_count} onChange={(e) => set('student_count', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#1d1d1f' }}>Interested in</label>
        <div className="flex flex-wrap gap-2">
          {INSTITUTION_INTERESTS.map((t) => {
            const active = form.interests.includes(t);
            return (
              <button key={t} type="button" onClick={() => toggleInterest(t)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{ background: active ? '#071629' : '#f5f5f7', color: active ? '#ffffff' : '#1d1d1f', border: `1px solid ${active ? '#071629' : 'rgba(0,0,0,0.1)'}` }}>
                {t}
              </button>
            );
          })}
        </div>
      </div>
      {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(224,92,58,0.08)', border: '1px solid rgba(224,92,58,0.2)', color: '#c04020' }}>{error}</div>}
      <button type="submit" disabled={loading} className="pub-btn-navy w-full">
        {loading ? 'Submitting...' : 'Launch a Chapter →'}
      </button>
    </form>
  );
}
