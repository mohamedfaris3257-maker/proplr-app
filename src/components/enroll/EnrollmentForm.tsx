'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/* ── plan data ─────────────────────────────────────────────── */
const PLANS: Record<string, { name: string; tag: string; price: string; sub: string; color: string }> = {
  community: {
    name: 'Community',
    tag: 'Everyone Welcome',
    price: 'Free',
    sub: 'Join our community — upgrade anytime',
    color: '#22c55e',
  },
  foundation: {
    name: 'Foundation',
    tag: 'School Students · Grades 8-12',
    price: 'AED 400/mo',
    sub: '8 months · Upgrade later',
    color: '#ffcb5d',
  },
  impact: {
    name: 'Impact',
    tag: 'University Students',
    price: 'AED 999',
    sub: 'Full academic year · Upgrade later',
    color: '#3d9be9',
  },
};

/* ── options ──────────────────────────────────────────────── */
const GRADE_OPTIONS = [
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Grade 11', 'Grade 12',
];
const YEAR_OPTIONS = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];

const INTEREST_OPTIONS = [
  'Leadership', 'Entrepreneurship', 'Digital Literacy',
  'Personal Branding', 'Communication', 'Project Management',
];
const INDUSTRY_OPTIONS = [
  'Technology', 'Finance', 'Healthcare', 'Engineering',
  'Creative Arts', 'Marketing', 'Law', 'Education',
  'Real Estate', 'Hospitality', 'Energy', 'Consulting',
];
const SKILL_OPTIONS = [
  'Public Speaking', 'Critical Thinking', 'Teamwork',
  'Problem Solving', 'Data Analysis', 'Writing',
  'Coding', 'Design', 'Negotiation', 'Time Management',
];

const STEP_LABELS = ['Join', 'Personal Info', 'Parent/Guardian', 'Profile & Interests', 'Review'];
const STEP_ICONS = ['▤', '●', '◆', '◎', '✓'];

/* ── form data ───────────────────────────────────────────── */
interface FormData {
  plan: string;
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone: string;
  date_of_birth: string;
  nationality: string;
  school_name: string;
  grade: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  parental_consent: boolean;
  photo_file: File | null;
  photo_url: string;
  interests: string[];
  industries: string[];
  skills: string[];
  extracurriculars: string;
  promo_code: string;
}

/* ── animation variants ──────────────────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export function EnrollmentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPlan = searchParams.get('plan') || '';

  const [step, setStep] = useState(initialPlan && PLANS[initialPlan] ? 2 : 1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    plan: initialPlan && PLANS[initialPlan] ? initialPlan : 'community',
    full_name: '', email: '', password: '', confirm_password: '',
    phone: '', date_of_birth: '', nationality: '',
    school_name: '', grade: '',
    parent_name: '', parent_email: '', parent_phone: '', parental_consent: false,
    photo_file: null, photo_url: '',
    interests: [], industries: [], skills: [],
    extracurriculars: '', promo_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState<{ valid: boolean; discount_type?: string; discount_value?: number; checked: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormData, value: unknown) => setFormData(p => ({ ...p, [key]: value }));
  const toggleArr = (key: 'interests' | 'industries' | 'skills', val: string) =>
    setFormData(p => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val],
    }));

  const selectedPlan = PLANS[formData.plan];
  const accent = selectedPlan?.color || '#3d9be9';
  const gradeList = formData.plan === 'impact' ? YEAR_OPTIONS : GRADE_OPTIONS;

  /* ── handlers ──────────────────────────────────────────── */
  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set('photo_file', file);
    const reader = new FileReader();
    reader.onload = ev => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const validateStep = (): string | null => {
    if (step === 1 && !formData.plan) return 'Please select how you want to join.';
    if (step === 2) {
      if (!formData.full_name.trim()) return 'Full name is required.';
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'A valid email is required.';
      if (!formData.password || formData.password.length < 8) return 'Password must be at least 8 characters.';
      if (formData.password !== formData.confirm_password) return 'Passwords do not match.';
      if (!formData.school_name.trim()) return 'School/university name is required.';
    }
    if (step === 3) {
      // Parent/guardian info is optional — no validation required
    }
    if (step === 4 && formData.interests.length === 0) return 'Select at least one interest.';
    return null;
  };

  const goNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);
    setDirection(1);
    setStep(s => s + 1);
  };
  const goBack = () => { setError(null); setDirection(-1); setStep(s => s - 1); };

  const validatePromo = async () => {
    if (!formData.promo_code.trim()) return;
    setPromoLoading(true);
    setPromoResult(null);
    try {
      const res = await fetch(`/api/register/validate-promo?code=${encodeURIComponent(formData.promo_code.trim())}`);
      const data = await res.json();
      setPromoResult({ ...data, checked: true });
    } catch {
      setPromoResult({ valid: false, checked: true });
    } finally {
      setPromoLoading(false);
    }
  };

  const uploadPhoto = async (): Promise<string> => {
    if (!formData.photo_file) return '';
    const supabase = createClient();
    const ext = formData.photo_file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('profile-photos').upload(fileName, formData.photo_file, { contentType: formData.photo_file.type, upsert: false });
    if (uploadErr) throw new Error('Photo upload failed: ' + uploadErr.message);
    const { data: pubData } = supabase.storage.from('profile-photos').getPublicUrl(fileName);
    return pubData.publicUrl ?? '';
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      let photoUrl = '';
      if (formData.photo_file) photoUrl = await uploadPhoto();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });
      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error('Account creation failed. Please try again.');

      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        user_id: authData.user.id,
        name: formData.full_name.trim(),
        email: formData.email.toLowerCase().trim(),
        type: formData.plan === 'impact' ? 'university_student' : 'school_student',
        role: 'student',
        plan: 'free',
        photo_url: photoUrl || null,
        school_name: formData.school_name.trim(),
        grade: formData.grade || null,
        interests: formData.interests,
        onboarding_complete: false,
      });

      if (profileError) {
        console.error('Profile insert error:', {
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint,
        });
        // Don't block signup — dashboard layout creates a minimal profile if needed
      }

      // Save full registration record (non-blocking)
      fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          date_of_birth: formData.date_of_birth || null,
          nationality: formData.nationality || null,
          school_name: formData.school_name,
          grade: formData.grade || null,
          parent_name: formData.parent_name || null,
          parent_email: formData.parent_email || null,
          parent_phone: formData.parent_phone || null,
          parental_consent: formData.parental_consent || false,
          photo_url: photoUrl || null,
          interests: formData.interests,
          extracurriculars: formData.extracurriculars || null,
          promo_code: formData.promo_code || null,
        }),
      }).catch(() => {});

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  /* ── progress ──────────────────────────────────────────── */
  const progress = ((step - 1) / (STEP_LABELS.length - 1)) * 100;

  /* ── step renders ──────────────────────────────────────── */
  const renderPlanSelect = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p style={{ fontSize: 14, color: '#6e7591', marginBottom: 4 }}>Join for free today. You can upgrade to a paid program anytime.</p>
      {Object.entries(PLANS).map(([key, plan]) => {
        const selected = formData.plan === key;
        return (
          <motion.button
            key={key}
            whileTap={{ scale: 0.98 }}
            onClick={() => set('plan', key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '18px 20px', borderRadius: 16,
              background: selected ? `${plan.color}08` : '#fff',
              border: `2px solid ${selected ? plan.color : '#e8eaf0'}`,
              cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'all 0.2s ease',
              boxShadow: selected ? `0 0 0 3px ${plan.color}22` : 'none',
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: `${plan.color}18`, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: plan.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 17, color: '#071629', marginBottom: 2 }}>
                {plan.name}
              </div>
              <div style={{ fontSize: 12, color: '#6e7591', fontWeight: 500, marginBottom: 4 }}>{plan.tag}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: plan.price === 'Free' ? 22 : 20, color: plan.price === 'Free' ? '#22c55e' : '#071629' }}>{plan.price}</span>
                <span style={{ fontSize: 12, color: '#9ba3b8' }}>{plan.sub}</span>
              </div>
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              border: `2px solid ${selected ? plan.color : '#d1d5e0'}`,
              background: selected ? plan.color : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease', flexShrink: 0,
            }}>
              {selected && (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 12,
    border: '1.5px solid #e0e4ed', background: '#f8f9fc',
    fontSize: 14, color: '#071629', outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s ease',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600,
    color: '#3a3f54', marginBottom: 6,
  };
  const reqStar = <span style={{ color: '#e74c3c' }}>*</span>;

  const renderPersonalInfo = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {selectedPlan && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 10,
          background: `${accent}10`, border: `1px solid ${accent}30`,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#071629' }}>{selectedPlan.name}</span>
          <span style={{ fontSize: 12, color: '#6e7591' }}>
            {formData.plan === 'community' ? '— Free forever, upgrade anytime' : `— ${selectedPlan.price}`}
          </span>
        </div>
      )}
      <div>
        <label style={labelStyle}>Full Name {reqStar}</label>
        <input style={inputStyle} placeholder="Jane Smith" value={formData.full_name} onChange={e => set('full_name', e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>Email Address {reqStar}</label>
        <input style={inputStyle} type="email" placeholder="jane@example.com" value={formData.email} onChange={e => set('email', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Password {reqStar}</label>
          <div style={{ position: 'relative' }}>
            <input style={{ ...inputStyle, paddingRight: 38 }} type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" value={formData.password} onChange={e => set('password', e.target.value)} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ba3b8', fontSize: 12, fontWeight: 600 }}>
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Confirm Password {reqStar}</label>
          <div style={{ position: 'relative' }}>
            <input style={{ ...inputStyle, paddingRight: 38 }} type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" value={formData.confirm_password} onChange={e => set('confirm_password', e.target.value)} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ba3b8', fontSize: 12, fontWeight: 600 }}>
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Phone Number</label>
          <input style={inputStyle} type="tel" placeholder="+971 50 000 0000" value={formData.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Date of Birth</label>
          <input style={inputStyle} type="date" value={formData.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>School / University Name {reqStar}</label>
        <input style={inputStyle} placeholder="e.g. Dubai College, American University of Dubai" value={formData.school_name} onChange={e => set('school_name', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Grade / Year</label>
          <select style={inputStyle} value={formData.grade} onChange={e => set('grade', e.target.value)}>
            <option value="">Select grade or year</option>
            {[...GRADE_OPTIONS, ...YEAR_OPTIONS].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Nationality</label>
          <input style={inputStyle} placeholder="e.g. Emirati" value={formData.nationality} onChange={e => set('nationality', e.target.value)} />
        </div>
      </div>
    </div>
  );

  const renderParent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '12px 16px', borderRadius: 12, background: '#f0f2f8', border: '1px solid #e0e4ed' }}>
        <p style={{ fontSize: 13, color: '#6e7591', lineHeight: 1.6, margin: 0 }}>
          These fields are optional. You can skip this step if not applicable.
        </p>
      </div>
      <div>
        <label style={labelStyle}>Parent/Guardian Full Name</label>
        <input style={inputStyle} placeholder="John Smith" value={formData.parent_name} onChange={e => set('parent_name', e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>Parent Email</label>
        <input style={inputStyle} type="email" placeholder="parent@example.com" value={formData.parent_email} onChange={e => set('parent_email', e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>Parent Phone</label>
        <input style={inputStyle} type="tel" placeholder="+971 50 000 0000" value={formData.parent_phone} onChange={e => set('parent_phone', e.target.value)} />
      </div>
      <div style={{
        padding: '14px 16px', borderRadius: 12,
        background: formData.parental_consent ? `${accent}08` : '#f8f9fc',
        border: `1.5px solid ${formData.parental_consent ? accent : '#e0e4ed'}`,
        transition: 'all 0.2s ease',
      }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.parental_consent}
            onChange={e => set('parental_consent', e.target.checked)}
            style={{ width: 20, height: 20, accentColor: accent, marginTop: 1, flexShrink: 0, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 13, color: '#3a3f54', lineHeight: 1.6 }}>
            I, the parent/guardian, consent to this student enrolling in Proplr and confirm all information provided is accurate.
          </span>
        </label>
      </div>
    </div>
  );

  const chipStyle = (active: boolean, chipColor: string): React.CSSProperties => ({
    padding: '8px 14px', borderRadius: 100,
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    border: `1.5px solid ${active ? chipColor : '#e0e4ed'}`,
    background: active ? `${chipColor}12` : '#fff',
    color: active ? '#071629' : '#6e7591',
    transition: 'all 0.2s ease',
  });

  const renderProfileInterests = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Photo */}
      <div>
        <label style={labelStyle}>Profile Photo <span style={{ fontWeight: 400, color: '#9ba3b8' }}>(optional)</span></label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#f0f2f8', border: `2px dashed ${photoPreview ? accent : '#d1d5e0'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
              transition: 'border-color 0.2s ease',
            }}
          >
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ba3b8" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button type="button" onClick={() => fileInputRef.current?.click()} style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid #e0e4ed', background: '#fff', fontSize: 13, fontWeight: 600, color: '#3a3f54', cursor: 'pointer' }}>
              Choose Photo
            </button>
            {photoPreview && (
              <button type="button" onClick={() => { setPhotoPreview(null); set('photo_file', null); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{ fontSize: 12, color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}>
                Remove
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
        </div>
      </div>

      {/* Academic Interests */}
      <div>
        <label style={labelStyle}>Academic Interests {reqStar} <span style={{ fontWeight: 400, color: '#9ba3b8' }}>(select at least one)</span></label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {INTEREST_OPTIONS.map(i => (
            <motion.button key={i} type="button" whileTap={{ scale: 0.95 }} onClick={() => toggleArr('interests', i)} style={chipStyle(formData.interests.includes(i), accent)}>
              {i}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Industries */}
      <div>
        <label style={labelStyle}>Industries of Interest <span style={{ fontWeight: 400, color: '#9ba3b8' }}>(optional)</span></label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {INDUSTRY_OPTIONS.map(i => (
            <motion.button key={i} type="button" whileTap={{ scale: 0.95 }} onClick={() => toggleArr('industries', i)} style={chipStyle(formData.industries.includes(i), '#3d9be9')}>
              {i}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <label style={labelStyle}>Skills to Develop <span style={{ fontWeight: 400, color: '#9ba3b8' }}>(optional)</span></label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {SKILL_OPTIONS.map(s => (
            <motion.button key={s} type="button" whileTap={{ scale: 0.95 }} onClick={() => toggleArr('skills', s)} style={chipStyle(formData.skills.includes(s), '#ffcb5d')}>
              {s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Extracurriculars */}
      <div>
        <label style={labelStyle}>Extracurricular Activities <span style={{ fontWeight: 400, color: '#9ba3b8' }}>(optional)</span></label>
        <textarea
          style={{ ...inputStyle, resize: 'none', minHeight: 72 }}
          placeholder="e.g. Debate club, robotics team, football..."
          value={formData.extracurriculars}
          onChange={e => set('extracurriculars', e.target.value)}
        />
      </div>

      {/* Promo code */}
      <div>
        <label style={labelStyle}>Promo / Referral Code <span style={{ fontWeight: 400, color: '#9ba3b8' }}>(optional)</span></label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={inputStyle} placeholder="Enter code" value={formData.promo_code} onChange={e => { set('promo_code', e.target.value); setPromoResult(null); }} />
          <button type="button" onClick={validatePromo} disabled={promoLoading || !formData.promo_code.trim()} style={{
            padding: '10px 18px', borderRadius: 12, border: '1.5px solid #e0e4ed',
            background: '#fff', fontSize: 13, fontWeight: 600, color: '#3a3f54',
            cursor: promoLoading || !formData.promo_code.trim() ? 'not-allowed' : 'pointer',
            opacity: promoLoading || !formData.promo_code.trim() ? 0.5 : 1,
            whiteSpace: 'nowrap',
          }}>
            {promoLoading ? '...' : 'Apply'}
          </button>
        </div>
        {promoResult?.checked && (
          <p style={{ fontSize: 13, marginTop: 6, fontWeight: 600, color: promoResult.valid ? '#27ae60' : '#e74c3c' }}>
            {promoResult.valid ? `Valid! ${promoResult.discount_type === 'percentage' ? `${promoResult.discount_value}% off` : `AED ${promoResult.discount_value} off`}` : 'Invalid or expired code.'}
          </p>
        )}
      </div>
    </div>
  );

  const ReviewRow = ({ label, value }: { label: string; value?: string | null }) =>
    value ? (
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f2f8' }}>
        <span style={{ fontSize: 13, color: '#6e7591' }}>{label}</span>
        <span style={{ fontSize: 13, color: '#071629', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
      </div>
    ) : null;

  const renderReview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Plan */}
      {selectedPlan && (
        <div style={{ padding: '14px 18px', borderRadius: 14, background: `${accent}08`, border: `1.5px solid ${accent}30` }}>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 16, color: '#071629', marginBottom: 2 }}>{selectedPlan.name}{formData.plan === 'community' ? ' (Free)' : ''}</div>
          <div style={{ fontSize: 13, color: '#6e7591' }}>{formData.plan === 'community' ? 'Free community membership — upgrade anytime' : `${selectedPlan.price} — ${selectedPlan.sub}`}</div>
        </div>
      )}
      {/* Personal */}
      <div>
        <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, color: accent, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Personal Information</h4>
        <div style={{ padding: '4px 16px', borderRadius: 12, background: '#f8f9fc', border: '1px solid #e8eaf0' }}>
          <ReviewRow label="Full Name" value={formData.full_name} />
          <ReviewRow label="Email" value={formData.email} />
          <ReviewRow label="Phone" value={formData.phone} />
          <ReviewRow label="Date of Birth" value={formData.date_of_birth} />
          <ReviewRow label="Nationality" value={formData.nationality} />
          <ReviewRow label="School / University" value={formData.school_name} />
          <ReviewRow label="Grade / Year" value={formData.grade} />
        </div>
      </div>
      {/* Parent */}
      <div>
        <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, color: accent, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Parent / Guardian</h4>
        <div style={{ padding: '4px 16px', borderRadius: 12, background: '#f8f9fc', border: '1px solid #e8eaf0' }}>
          <ReviewRow label="Name" value={formData.parent_name} />
          <ReviewRow label="Email" value={formData.parent_email} />
          <ReviewRow label="Phone" value={formData.parent_phone} />
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ fontSize: 13, color: '#6e7591' }}>Consent</span>
            <span style={{ fontSize: 13, color: '#27ae60', fontWeight: 600 }}>Confirmed</span>
          </div>
        </div>
      </div>
      {/* Interests */}
      <div>
        <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, color: accent, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Profile & Interests</h4>
        <div style={{ padding: '10px 16px', borderRadius: 12, background: '#f8f9fc', border: '1px solid #e8eaf0' }}>
          {photoPreview && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 8, borderBottom: '1px solid #f0f2f8', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: '#6e7591' }}>Photo</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Preview" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginLeft: 'auto' }} />
            </div>
          )}
          {formData.interests.length > 0 && (
            <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f2f8' }}>
              <div style={{ fontSize: 13, color: '#6e7591', marginBottom: 6 }}>Interests</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {formData.interests.map(i => (
                  <span key={i} style={{ padding: '3px 10px', borderRadius: 100, background: `${accent}15`, color: '#071629', fontSize: 12, fontWeight: 600 }}>{i}</span>
                ))}
              </div>
            </div>
          )}
          {formData.industries.length > 0 && (
            <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f2f8' }}>
              <div style={{ fontSize: 13, color: '#6e7591', marginBottom: 6 }}>Industries</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {formData.industries.map(i => (
                  <span key={i} style={{ padding: '3px 10px', borderRadius: 100, background: 'rgba(61,155,233,0.12)', color: '#071629', fontSize: 12, fontWeight: 600 }}>{i}</span>
                ))}
              </div>
            </div>
          )}
          {formData.skills.length > 0 && (
            <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f2f8' }}>
              <div style={{ fontSize: 13, color: '#6e7591', marginBottom: 6 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {formData.skills.map(s => (
                  <span key={s} style={{ padding: '3px 10px', borderRadius: 100, background: 'rgba(255,203,93,0.15)', color: '#071629', fontSize: 12, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>
          )}
          <ReviewRow label="Extracurriculars" value={formData.extracurriculars} />
          <ReviewRow label="Promo Code" value={formData.promo_code || undefined} />
        </div>
      </div>
    </div>
  );

  const stepContent = [renderPlanSelect, renderPersonalInfo, renderParent, renderProfileInterests, renderReview];

  /* ── render ────────────────────────────────────────────── */
  return (
    <div style={{
      width: '100%', background: '#fff', borderRadius: 20,
      border: '1px solid rgba(0,0,0,0.06)', padding: '32px 28px',
      boxShadow: '0 2px 20px rgba(7,22,41,0.06)',
    }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 18 }}>
        {STEP_LABELS.map((label, i) => {
          const idx = i + 1;
          const isActive = step === idx;
          const isDone = step > idx;
          return (
            <React.Fragment key={label}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isDone ? 14 : 13,
                fontWeight: 700,
                background: isDone ? accent : isActive ? `${accent}15` : '#f0f2f8',
                color: isDone ? '#fff' : isActive ? accent : '#9ba3b8',
                border: isActive ? `2px solid ${accent}` : '2px solid transparent',
                transition: 'all 0.3s ease',
              }}>
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : STEP_ICONS[i]}
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div style={{ width: 24, height: 2, borderRadius: 1, background: step > idx ? accent : '#e0e4ed', transition: 'background 0.3s ease' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: '#f0f2f8', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ height: '100%', background: `linear-gradient(90deg, #3d9be9, ${accent})`, borderRadius: 10 }}
        />
      </div>

      {/* Step title */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 20, color: '#071629', margin: 0 }}>
          {STEP_LABELS[step - 1]}
        </h2>
        <p style={{ fontSize: 13, color: '#9ba3b8', marginTop: 4 }}>Step {step} of {STEP_LABELS.length}</p>
      </div>

      {/* Animated step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {stepContent[step - 1]()}
        </motion.div>
      </AnimatePresence>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, fontWeight: 500 }}
        >
          {error}
        </motion.div>
      )}

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, paddingTop: 20, borderTop: '1px solid #f0f2f8' }}>
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          style={{
            padding: '10px 20px', borderRadius: 12,
            border: '1.5px solid #e0e4ed', background: '#fff',
            fontSize: 14, fontWeight: 600, color: '#3a3f54',
            cursor: step === 1 ? 'not-allowed' : 'pointer',
            opacity: step === 1 ? 0.35 : 1,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12L6 8l4-4" />
          </svg>
          Back
        </button>

        {step < STEP_LABELS.length ? (
          <button
            type="button"
            onClick={goNext}
            style={{
              padding: '10px 24px', borderRadius: 12,
              border: 'none', background: accent,
              fontSize: 14, fontWeight: 700, color: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: `0 2px 8px ${accent}40`,
            }}
          >
            Continue
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '10px 28px', borderRadius: 12,
              border: 'none',
              background: loading ? '#9ba3b8' : '#071629',
              fontSize: 14, fontWeight: 700, color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              minWidth: 160, justifyContent: 'center',
            }}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <path d="M8 2a6 6 0 014.9 9.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Creating account...
              </>
            ) : (
              'Complete Enrollment'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
