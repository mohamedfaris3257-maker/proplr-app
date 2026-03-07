'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { CAREER_INTERESTS, type CareerInterest, type UserType } from '@/lib/types';
import { Camera, GraduationCap, School, Check, Upload } from 'lucide-react';
import Image from 'next/image';

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

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>(1);
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

      const { error: profileError } = await supabase.from('profiles').insert({
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
      });

      if (profileError) throw profileError;

      // Hard-navigate to /feed so the middleware sees the new profile cleanly.
      // Using window.location avoids a router.refresh() race condition where the
      // middleware redirect response gets caught as a non-Error and shows the
      // "Something went wrong" message.
      window.location.href = '/feed';
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ?? 'Something went wrong. Please try again.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 animate-slide-up">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted">Step {step} of {totalSteps}</span>
          <span className="text-xs text-text-muted">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-dim rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step 1: Choose type */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">What describes you?</h2>
            <p className="text-sm text-text-muted mt-1">This helps us personalise your experience</p>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-4">
            <button
              onClick={() => setForm((f) => ({ ...f, type: 'school_student' }))}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                form.type === 'school_student'
                  ? 'border-gold bg-gold/10'
                  : 'border-border bg-surface-2 hover:border-border hover:bg-surface-2/80'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${form.type === 'school_student' ? 'bg-gold/20' : 'bg-border'}`}>
                <School className={`w-6 h-6 ${form.type === 'school_student' ? 'text-gold' : 'text-text-muted'}`} />
              </div>
              <div>
                <p className="font-semibold text-text-primary">School Student</p>
                <p className="text-xs text-text-muted mt-0.5">Grades K–12 · Proplr Foundation Track</p>
              </div>
              {form.type === 'school_student' && <Check className="w-5 h-5 text-gold ml-auto" />}
            </button>

            <button
              onClick={() => setForm((f) => ({ ...f, type: 'uni_student' }))}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                form.type === 'uni_student'
                  ? 'border-blue bg-blue/10'
                  : 'border-border bg-surface-2 hover:border-border hover:bg-surface-2/80'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${form.type === 'uni_student' ? 'bg-blue/20' : 'bg-border'}`}>
                <GraduationCap className={`w-6 h-6 ${form.type === 'uni_student' ? 'text-blue' : 'text-text-muted'}`} />
              </div>
              <div>
                <p className="font-semibold text-text-primary">University Student</p>
                <p className="text-xs text-text-muted mt-0.5">Years 1–4 · Proplr Impact Track</p>
              </div>
              {form.type === 'uni_student' && <Check className="w-5 h-5 text-blue ml-auto" />}
            </button>
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={!form.type}
            className="w-full mt-2"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: School/University name */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {form.type === 'school_student' ? 'Your School' : 'Your University'}
            </h2>
            <p className="text-sm text-text-muted mt-1">
              {form.type === 'school_student' ? 'Enter your school name' : 'Enter your university name'}
            </p>
          </div>

          <input
            type="text"
            placeholder={form.type === 'school_student' ? 'e.g. Dubai English Speaking School' : 'e.g. American University of Sharjah'}
            value={form.schoolName}
            onChange={(e) => setForm((f) => ({ ...f, schoolName: e.target.value }))}
            className="input-field"
            autoFocus
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
            <Button onClick={() => setStep(3)} disabled={!form.schoolName.trim()} className="flex-1">Continue</Button>
          </div>
        </div>
      )}

      {/* Step 3: Grade / Year */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {form.type === 'school_student' ? 'Your Grade' : 'Year of Study'}
            </h2>
            <p className="text-sm text-text-muted mt-1">Select your current level</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(form.type === 'school_student' ? GRADE_OPTIONS : YEAR_OPTIONS).map((opt) => (
              <button
                key={opt}
                onClick={() => setForm((f) => ({ ...f, gradeOrYear: opt }))}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  form.gradeOrYear === opt
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border bg-surface-2 text-text-secondary hover:border-border hover:text-text-primary'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">Back</Button>
            <Button onClick={() => setStep(4)} disabled={!form.gradeOrYear} className="flex-1">Continue</Button>
          </div>
        </div>
      )}

      {/* Step 4: Profile photo */}
      {step === 4 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Profile Photo</h2>
            <p className="text-sm text-text-muted mt-1">Optional — you can always add one later</p>
          </div>

          <div className="flex flex-col items-center gap-4 py-4">
            {form.photoPreview ? (
              <div className="relative">
                <Image
                  src={form.photoPreview}
                  alt="Preview"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gold"
                />
                <button
                  onClick={() => setForm((f) => ({ ...f, photoFile: null, photoPreview: null }))}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red rounded-full flex items-center justify-center text-white text-xs"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-surface-2 border-2 border-dashed border-border flex items-center justify-center">
                <Camera className="w-8 h-8 text-text-muted" />
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload className="w-4 h-4" />
              {form.photoPreview ? 'Change Photo' : 'Upload Photo'}
            </Button>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(3)} className="flex-1">Back</Button>
            <Button onClick={() => setStep(5)} className="flex-1">
              {form.photoFile ? 'Continue' : 'Skip'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Career interests */}
      {step === 5 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Career Interests</h2>
            <p className="text-sm text-text-muted mt-1">Pick up to 5 areas you&apos;re interested in</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CAREER_INTERESTS.map((interest) => {
              const selected = form.careerInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  disabled={!selected && form.careerInterests.length >= 5}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                    selected
                      ? 'bg-gold/10 border-gold text-gold'
                      : 'bg-surface-2 border-border text-text-secondary hover:border-border hover:text-text-primary disabled:opacity-40'
                  }`}
                >
                  {selected && '✓ '}{interest}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-text-muted">
            {form.careerInterests.length}/5 selected
          </p>

          {error && (
            <div className="text-xs text-red bg-red/10 border border-red/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(4)} className="flex-1">Back</Button>
            <Button onClick={handleSubmit} loading={loading} className="flex-1">
              Complete Setup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
