'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CAREER_INTERESTS, type CareerInterest, type UserType } from '@/lib/types';
import { Camera, GraduationCap, School, Check, Upload, User, Sparkles, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  type: UserType | null;
  schoolName: string;
  gradeOrYear: string;
  photoFile: File | null;
  photoPreview: string | null;
  careerInterests: CareerInterest[];
}

const GRADE_OPTIONS = ['KG1', 'KG2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const YEAR_OPTIONS = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];

const STEP_INFO = [
  { num: 1, label: 'Type', icon: User },
  { num: 2, label: 'School', icon: BookOpen },
  { num: 3, label: 'Grade', icon: GraduationCap },
  { num: 4, label: 'Photo', icon: Camera },
  { num: 5, label: 'Interests', icon: Sparkles },
];

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [form, setForm] = useState<FormData>({
    type: null,
    schoolName: '',
    gradeOrYear: '',
    photoFile: null,
    photoPreview: null,
    careerInterests: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const goTo = (next: Step) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((f) => ({ ...f, photoFile: file, photoPreview: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const toggleInterest = (interest: CareerInterest) => {
    setForm((f) => {
      const exists = f.careerInterests.includes(interest);
      if (exists) {
        return { ...f, careerInterests: f.careerInterests.filter((i) => i !== interest) };
      }
      if (f.careerInterests.length >= 5) return f;
      return { ...f, careerInterests: [...f.careerInterests, interest] };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let photoUrl: string | null = null;

      if (form.photoFile) {
        const ext = form.photoFile.name.split('.').pop();
        const path = `avatars/${user.id}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(path, form.photoFile, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);
          photoUrl = data.publicUrl;
        }
      }

      const { error: profileError } = await supabase.from('profiles').upsert({
        user_id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
        email: user.email,
        type: form.type,
        school_name: form.schoolName,
        grade: form.gradeOrYear,
        photo_url: photoUrl,
        career_interests: form.careerInterests,
        subscription_status: 'free',
        is_ambassador: false,
      }, { onConflict: 'user_id' });

      if (profileError) throw profileError;

      window.location.href = '/dashboard';
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? 'Something went wrong. Please try again.';
      setError(message);
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div style={s.card}>
      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ height: 3, background: 'rgba(7,22,41,0.06)', borderRadius: 10, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg, #3d9be9, #ffcb5d)', borderRadius: 10 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
        {STEP_INFO.map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 52 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDone ? '#3d9be9' : isActive ? '#071629' : 'rgba(7,22,41,0.06)',
                transition: 'all 0.3s ease',
              }}>
                {isDone ? (
                  <Check size={14} color="#fff" strokeWidth={3} />
                ) : (
                  <Icon size={14} color={isActive ? '#fff' : '#6e7591'} />
                )}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: isActive ? '#071629' : '#6e7591', letterSpacing: 0.3 }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step content with animation */}
      <div style={{ minHeight: 280, position: 'relative' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Step 1: Choose type */}
            {step === 1 && (
              <div>
                <h2 style={s.heading}>What describes you?</h2>
                <p style={s.sub}>This helps us personalise your experience</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  <button
                    onClick={() => setForm((f) => ({ ...f, type: 'school_student' }))}
                    style={{
                      ...s.typeCard,
                      borderColor: form.type === 'school_student' ? '#ffcb5d' : 'rgba(7,22,41,0.08)',
                      background: form.type === 'school_student' ? 'rgba(255,203,93,0.06)' : '#fff',
                    }}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: form.type === 'school_student' ? 'rgba(255,203,93,0.15)' : 'rgba(7,22,41,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <School size={20} color={form.type === 'school_student' ? '#E8A838' : '#6e7591'} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 14, color: '#071629', margin: 0 }}>School Student</p>
                      <p style={{ fontSize: 12, color: '#6e7591', margin: '2px 0 0' }}>Grades K–12 · Proplr Foundation Track</p>
                    </div>
                    {form.type === 'school_student' && <Check size={18} color="#E8A838" />}
                  </button>

                  <button
                    onClick={() => setForm((f) => ({ ...f, type: 'uni_student' }))}
                    style={{
                      ...s.typeCard,
                      borderColor: form.type === 'uni_student' ? '#3d9be9' : 'rgba(7,22,41,0.08)',
                      background: form.type === 'uni_student' ? 'rgba(61,155,233,0.05)' : '#fff',
                    }}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: form.type === 'uni_student' ? 'rgba(61,155,233,0.12)' : 'rgba(7,22,41,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <GraduationCap size={20} color={form.type === 'uni_student' ? '#3d9be9' : '#6e7591'} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 14, color: '#071629', margin: 0 }}>University Student</p>
                      <p style={{ fontSize: 12, color: '#6e7591', margin: '2px 0 0' }}>Years 1–4 · Proplr Impact Track</p>
                    </div>
                    {form.type === 'uni_student' && <Check size={18} color="#3d9be9" />}
                  </button>
                </div>

                <button onClick={() => goTo(2)} disabled={!form.type} style={{ ...s.btnPrimary, marginTop: 20, opacity: form.type ? 1 : 0.4 }}>
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: School/University name */}
            {step === 2 && (
              <div>
                <h2 style={s.heading}>{form.type === 'school_student' ? 'Your School' : 'Your University'}</h2>
                <p style={s.sub}>{form.type === 'school_student' ? 'Enter your school name' : 'Enter your university name'}</p>

                <input
                  type="text"
                  placeholder={form.type === 'school_student' ? 'e.g. Dubai English Speaking School' : 'e.g. American University of Sharjah'}
                  value={form.schoolName}
                  onChange={(e) => setForm((f) => ({ ...f, schoolName: e.target.value }))}
                  style={s.input}
                  autoFocus
                />

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button onClick={() => goTo(1)} style={s.btnSecondary}>Back</button>
                  <button onClick={() => goTo(3)} disabled={!form.schoolName.trim()} style={{ ...s.btnPrimary, flex: 1, opacity: form.schoolName.trim() ? 1 : 0.4 }}>
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Grade / Year */}
            {step === 3 && (
              <div>
                <h2 style={s.heading}>{form.type === 'school_student' ? 'Your Grade' : 'Year of Study'}</h2>
                <p style={s.sub}>Select your current level</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                  {(form.type === 'school_student' ? GRADE_OPTIONS : YEAR_OPTIONS).map((opt) => {
                    const selected = form.gradeOrYear === opt;
                    const accentColor = form.type === 'school_student' ? '#ffcb5d' : '#3d9be9';
                    return (
                      <button
                        key={opt}
                        onClick={() => setForm((f) => ({ ...f, gradeOrYear: opt }))}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 10,
                          border: `1.5px solid ${selected ? accentColor : 'rgba(7,22,41,0.08)'}`,
                          background: selected ? `${accentColor}10` : '#fff',
                          color: selected ? (form.type === 'school_student' ? '#a07800' : '#1a6fad') : '#071629',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button onClick={() => goTo(2)} style={s.btnSecondary}>Back</button>
                  <button onClick={() => goTo(4)} disabled={!form.gradeOrYear} style={{ ...s.btnPrimary, flex: 1, opacity: form.gradeOrYear ? 1 : 0.4 }}>
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Profile photo */}
            {step === 4 && (
              <div>
                <h2 style={s.heading}>Profile Photo</h2>
                <p style={s.sub}>Optional — you can always add one later</p>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0' }}>
                  {form.photoPreview ? (
                    <div style={{ position: 'relative' }}>
                      <Image
                        src={form.photoPreview}
                        alt="Preview"
                        width={96}
                        height={96}
                        style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '3px solid #3d9be9' }}
                      />
                      <button
                        onClick={() => setForm((f) => ({ ...f, photoFile: null, photoPreview: null }))}
                        style={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: '#E05C3A',
                          color: '#fff',
                          border: '2px solid #fff',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      width: 96,
                      height: 96,
                      borderRadius: '50%',
                      background: 'rgba(7,22,41,0.03)',
                      border: '2px dashed rgba(7,22,41,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Camera size={28} color="#6e7591" />
                    </div>
                  )}

                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />

                  <button onClick={() => fileRef.current?.click()} style={s.btnUpload}>
                    <Upload size={14} />
                    {form.photoPreview ? 'Change Photo' : 'Upload Photo'}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button onClick={() => goTo(3)} style={s.btnSecondary}>Back</button>
                  <button onClick={() => goTo(5)} style={{ ...s.btnPrimary, flex: 1 }}>
                    {form.photoFile ? 'Continue' : 'Skip'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Career interests */}
            {step === 5 && (
              <div>
                <h2 style={s.heading}>Career Interests</h2>
                <p style={s.sub}>Pick up to 5 areas you&apos;re interested in</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                  {CAREER_INTERESTS.map((interest) => {
                    const selected = form.careerInterests.includes(interest);
                    const disabled = !selected && form.careerInterests.length >= 5;
                    return (
                      <motion.button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        disabled={disabled}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 10,
                          border: `1.5px solid ${selected ? '#3d9be9' : 'rgba(7,22,41,0.08)'}`,
                          background: selected ? 'rgba(61,155,233,0.08)' : '#fff',
                          color: selected ? '#1a6fad' : disabled ? '#ccc' : '#071629',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: disabled ? 'default' : 'pointer',
                          transition: 'all 0.2s ease',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {selected && '✓ '}{interest}
                      </motion.button>
                    );
                  })}
                </div>

                <p style={{ fontSize: 12, color: '#6e7591', marginTop: 12 }}>
                  {form.careerInterests.length}/5 selected
                </p>

                {error && (
                  <div style={{
                    fontSize: 13,
                    color: '#E05C3A',
                    background: 'rgba(224,92,58,0.08)',
                    border: '1px solid rgba(224,92,58,0.15)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    marginTop: 8,
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button onClick={() => goTo(4)} style={s.btnSecondary}>Back</button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ ...s.btnPrimary, flex: 1, opacity: loading ? 0.6 : 1 }}
                  >
                    {loading ? 'Setting up...' : 'Complete Setup'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  card: {
    width: '100%',
    background: '#fff',
    borderRadius: 20,
    padding: '24px 24px 28px',
    border: '0.5px solid rgba(7,22,41,.08)',
  },
  heading: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: '#071629',
    margin: 0,
  },
  sub: {
    fontSize: 13.5,
    color: '#6e7591',
    margin: '4px 0 0',
  },
  typeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 16px',
    borderRadius: 14,
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    background: '#fff',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1.5px solid rgba(7,22,41,0.08)',
    background: '#f8f9fc',
    fontSize: 14,
    color: '#071629',
    outline: 'none',
    marginTop: 16,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s ease',
  },
  btnPrimary: {
    width: '100%',
    padding: '13px 20px',
    borderRadius: 12,
    border: 'none',
    background: '#3d9be9',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s ease',
  },
  btnSecondary: {
    padding: '13px 20px',
    borderRadius: 12,
    border: '1.5px solid rgba(7,22,41,0.08)',
    background: '#fff',
    color: '#071629',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s ease',
  },
  btnUpload: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '9px 18px',
    borderRadius: 10,
    border: '1.5px solid rgba(7,22,41,0.08)',
    background: '#fff',
    color: '#071629',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.2s ease',
  },
};
