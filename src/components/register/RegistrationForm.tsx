'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DEV NOTE: Email confirmation is DISABLED for testing.
// Before going live: Supabase Dashboard → Authentication → Email →
// enable "Confirm email". Also remove the immediate redirect below.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, ChangeEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, Upload, X, ChevronRight, ChevronLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
  nationality: string;
  school_name: string;
  grade: string;
  class_name: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  parental_consent: boolean;
  photo_file: File | null;
  photo_url: string;
  interests: string[];
  extracurriculars: string;
  how_heard: string;
  promo_code: string;
}

const INTEREST_OPTIONS = [
  'Leadership', 'Entrepreneurship', 'Digital Literacy',
  'Personal Branding', 'Communication', 'Project Management',
];

const GRADE_OPTIONS = [
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Grade 11', 'Grade 12', 'Year 1', 'Year 2', 'Year 3', 'Year 4',
];

const HOW_HEARD_OPTIONS = [
  'Social media', 'School event', 'Friend/family',
  'Teacher/counsellor', 'Online search', 'Other',
];

const STEP_LABELS = ['Personal Info', 'Parent/Guardian', 'Profile & Interests', 'Review & Submit'];

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEP_LABELS.map((label, i) => {
          const idx = i + 1;
          const isComplete = step > idx;
          const isActive = step === idx;
          return (
            <div key={label} className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                isComplete ? 'bg-gold text-background' : isActive ? 'bg-gold/20 border-2 border-gold text-gold' : 'bg-surface-2 border border-border text-text-muted'
              }`}>
                {isComplete ? <CheckCircle className="w-4 h-4" /> : idx}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-gold' : isComplete ? 'text-text-secondary' : 'text-text-muted'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative h-1 bg-border rounded-full overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
      </div>
      <p className="text-text-muted text-xs mt-2 text-right">Step {step} of 4</p>
    </div>
  );
}

export default function RegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    full_name: '', email: '', password: '', confirm_password: '',
    date_of_birth: '', nationality: '', school_name: '', grade: '', class_name: '',
    parent_name: '', parent_email: '', parent_phone: '', parental_consent: false,
    photo_file: null, photo_url: '', interests: [],
    extracurriculars: '', how_heard: '', promo_code: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState<{ valid: boolean; discount_type?: 'percentage' | 'fixed'; discount_value?: number; checked: boolean } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormData, value: unknown) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set('photo_file', file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const toggleInterest = (interest: string) =>
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));

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

  const validateStep = (): string | null => {
    if (step === 1) {
      if (!formData.full_name.trim()) return 'Full name is required.';
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'A valid email is required.';
      if (!formData.password || formData.password.length < 8) return 'Password must be at least 8 characters.';
      if (formData.password !== formData.confirm_password) return 'Passwords do not match.';
      if (!formData.school_name.trim()) return 'School name is required.';
    }
    if (step === 2) {
      if (!formData.parent_name.trim()) return 'Parent/guardian name is required.';
      if (!formData.parent_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parent_email)) return 'A valid parent email is required.';
      if (!formData.parental_consent) return 'Parental consent is required to proceed.';
    }
    if (step === 3) {
      if (formData.interests.length === 0) return 'Select at least one interest.';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);
    setStep((s) => s + 1);
  };

  const handleBack = () => { setError(null); setStep((s) => s - 1); };

  const uploadPhoto = async (): Promise<string> => {
    if (!formData.photo_file) return '';
    const supabase = createClient();
    const ext = formData.photo_file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('profile-photos').upload(fileName, formData.photo_file, { contentType: formData.photo_file.type, upsert: false });
    if (uploadError) throw new Error('Photo upload failed: ' + uploadError.message);
    const { data: publicData } = supabase.storage.from('profile-photos').getPublicUrl(fileName);
    return publicData.publicUrl ?? '';
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();

      // Upload photo first if provided
      let photoUrl = '';
      if (formData.photo_file) photoUrl = await uploadPhoto();

      // Create auth account immediately — no email verification (dev mode)
      // TODO: Re-enable "Confirm email" in Supabase Dashboard → Authentication → Email before going live
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error('Account creation failed. Please try again.');

      // Create profile immediately (user is now authenticated)
      await supabase.from('profiles').insert({
        user_id: authData.user.id,
        name: formData.full_name.trim(),
        type: 'school_student',
        photo_url: photoUrl || null,
        school: formData.school_name.trim(),
        grade: formData.grade || null,
        interests: formData.interests,
      });

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
          class_name: formData.class_name || null,
          parent_name: formData.parent_name,
          parent_email: formData.parent_email,
          parent_phone: formData.parent_phone || null,
          parental_consent: true,
          photo_url: photoUrl || null,
          interests: formData.interests,
          extracurriculars: formData.extracurriculars || null,
          how_heard: formData.how_heard || null,
          promo_code: formData.promo_code || null,
        }),
      }).catch(() => {}); // non-fatal

      // Redirect to dashboard with welcome popup
      router.push('/dashboard?welcome=true');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  // ── Step renders ──────────────────────────────────────────────────────────
  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name <span className="text-red">*</span></label>
        <input type="text" className="input-field" placeholder="Jane Smith" value={formData.full_name} onChange={(e) => set('full_name', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Email Address <span className="text-red">*</span></label>
        <input type="email" className="input-field" placeholder="jane@example.com" value={formData.email} onChange={(e) => set('email', e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Password <span className="text-red">*</span></label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} className="input-field pr-10" placeholder="Min. 8 characters" value={formData.password} onChange={(e) => set('password', e.target.value)} />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirm Password <span className="text-red">*</span></label>
          <div className="relative">
            <input type={showConfirm ? 'text' : 'password'} className="input-field pr-10" placeholder="Repeat password" value={formData.confirm_password} onChange={(e) => set('confirm_password', e.target.value)} />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Date of Birth</label>
          <input type="date" className="input-field" value={formData.date_of_birth} onChange={(e) => set('date_of_birth', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Nationality</label>
          <input type="text" className="input-field" placeholder="e.g. Emirati" value={formData.nationality} onChange={(e) => set('nationality', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">School Name <span className="text-red">*</span></label>
        <input type="text" className="input-field" placeholder="e.g. Dubai College" value={formData.school_name} onChange={(e) => set('school_name', e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Grade</label>
          <select className="input-field" value={formData.grade} onChange={(e) => set('grade', e.target.value)}>
            <option value="">Select grade</option>
            {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Class</label>
          <input type="text" className="input-field" placeholder="e.g. 11A" value={formData.class_name} onChange={(e) => set('class_name', e.target.value)} />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Parent/Guardian Full Name <span className="text-red">*</span></label>
        <input type="text" className="input-field" placeholder="John Smith" value={formData.parent_name} onChange={(e) => set('parent_name', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Parent Email <span className="text-red">*</span></label>
        <input type="email" className="input-field" placeholder="parent@example.com" value={formData.parent_email} onChange={(e) => set('parent_email', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Parent Phone</label>
        <input type="tel" className="input-field" placeholder="+971 50 000 0000" value={formData.parent_phone} onChange={(e) => set('parent_phone', e.target.value)} />
      </div>
      <div className="bg-surface-2 border border-border rounded-xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-0.5 w-5 h-5 accent-gold flex-shrink-0 cursor-pointer" checked={formData.parental_consent} onChange={(e) => set('parental_consent', e.target.checked)} />
          <span className="text-sm text-text-secondary leading-relaxed">I confirm I have parental consent to register this student on Proplr <span className="text-red">*</span></span>
        </label>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-3">Profile Photo (optional)</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-surface-2 border-2 border-dashed border-border flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:border-gold transition-colors" onClick={() => fileInputRef.current?.click()}>
            {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <Upload className="w-6 h-6 text-text-muted" />}
          </div>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary text-sm px-3 py-1.5">Choose Photo</button>
            {photoPreview && (
              <button type="button" className="flex items-center gap-1 text-xs text-red hover:text-red/80 transition-colors" onClick={() => { setPhotoPreview(null); set('photo_file', null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                <X className="w-3 h-3" /> Remove
              </button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Interests <span className="text-red">*</span> <span className="text-text-muted font-normal">(select at least one)</span></label>
        <div className="flex flex-wrap gap-2 mt-2">
          {INTEREST_OPTIONS.map((interest) => {
            const active = formData.interests.includes(interest);
            return (
              <button key={interest} type="button" onClick={() => toggleInterest(interest)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${active ? 'bg-gold/20 border-gold text-gold' : 'bg-surface-2 border-border text-text-secondary hover:border-gold/50'}`}>
                {interest}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Extracurricular Activities (optional)</label>
        <textarea className="input-field resize-none" rows={3} placeholder="e.g. Debate club, robotics team, football..." value={formData.extracurriculars} onChange={(e) => set('extracurriculars', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">How did you hear about Proplr?</label>
        <select className="input-field" value={formData.how_heard} onChange={(e) => set('how_heard', e.target.value)}>
          <option value="">Select an option</option>
          {HOW_HEARD_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Promo / Referral Code (optional)</label>
        <div className="flex gap-2">
          <input type="text" className="input-field" placeholder="Enter code" value={formData.promo_code} onChange={(e) => { set('promo_code', e.target.value); setPromoResult(null); }} />
          <button type="button" onClick={validatePromo} disabled={promoLoading || !formData.promo_code.trim()} className="btn-secondary whitespace-nowrap px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validate'}
          </button>
        </div>
        {promoResult?.checked && (
          <p className={`text-sm mt-2 font-medium ${promoResult.valid ? 'text-green' : 'text-red'}`}>
            {promoResult.valid ? `Valid! ${promoResult.discount_type === 'percentage' ? `${promoResult.discount_value}% off` : `${promoResult.discount_value} AED off`}` : 'Invalid code. Please check and try again.'}
          </p>
        )}
      </div>
    </div>
  );

  const ReviewRow = ({ label, value }: { label: string; value?: string | null }) =>
    value ? (
      <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 border-b border-border last:border-0">
        <span className="text-text-muted text-sm w-40 flex-shrink-0">{label}</span>
        <span className="text-text-primary text-sm">{value}</span>
      </div>
    ) : null;

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">Personal Information</h3>
        <div className="bg-surface-2 rounded-xl border border-border px-4 py-1">
          <ReviewRow label="Full Name" value={formData.full_name} />
          <ReviewRow label="Email" value={formData.email} />
          <ReviewRow label="Date of Birth" value={formData.date_of_birth} />
          <ReviewRow label="Nationality" value={formData.nationality} />
          <ReviewRow label="School" value={formData.school_name} />
          <ReviewRow label="Grade" value={formData.grade} />
          <ReviewRow label="Class" value={formData.class_name} />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">Parent / Guardian</h3>
        <div className="bg-surface-2 rounded-xl border border-border px-4 py-1">
          <ReviewRow label="Name" value={formData.parent_name} />
          <ReviewRow label="Email" value={formData.parent_email} />
          <ReviewRow label="Phone" value={formData.parent_phone} />
          <div className="flex items-center gap-2 py-2.5"><span className="text-text-muted text-sm w-40 flex-shrink-0">Consent</span><span className="text-green text-sm font-medium">Confirmed</span></div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">Profile & Interests</h3>
        <div className="bg-surface-2 rounded-xl border border-border px-4 py-1">
          {photoPreview && (
            <div className="flex items-center gap-3 py-2.5 border-b border-border">
              <span className="text-text-muted text-sm w-40 flex-shrink-0">Photo</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Profile preview" className="w-10 h-10 rounded-full object-cover border border-border" />
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 border-b border-border">
            <span className="text-text-muted text-sm w-40 flex-shrink-0">Interests</span>
            <div className="flex flex-wrap gap-1.5">
              {formData.interests.map((i) => <span key={i} className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-medium border border-gold/30">{i}</span>)}
            </div>
          </div>
          <ReviewRow label="Extracurriculars" value={formData.extracurriculars} />
          <ReviewRow label="How Heard" value={formData.how_heard} />
          <ReviewRow label="Promo Code" value={formData.promo_code || undefined} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="card p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Join Proplr</h2>
        <p className="text-text-muted text-sm mt-1">Create your account and start building your future.</p>
      </div>
      <ProgressBar step={step} />
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary">{STEP_LABELS[step - 1]}</h3>
      </div>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {error && <div className="mt-4 bg-red/10 border border-red/30 rounded-xl px-4 py-3 text-red text-sm">{error}</div>}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <button type="button" onClick={handleBack} disabled={step === 1} className="btn-ghost flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        {step < 4 ? (
          <button type="button" onClick={handleNext} className="btn-primary flex items-center gap-2">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2 min-w-[160px] justify-center disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : 'Create Account →'}
          </button>
        )}
      </div>
    </div>
  );
}
