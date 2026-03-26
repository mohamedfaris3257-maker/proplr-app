'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CAREER_INTERESTS } from '@/lib/types';

interface Props {
  userId: string;
  existingName: string;
  existingSchool: string;
  existingGrade: string;
  existingInterests: string[];
}

export function OnboardingWizard({ userId, existingName, existingSchool, existingGrade, existingInterests }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(existingName);
  const [school, setSchool] = useState(existingSchool);
  const [grade, setGrade] = useState(existingGrade);
  const [interests, setInterests] = useState<string[]>(existingInterests);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  async function handleComplete() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, school_name: school, grade, career_interests: interests }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save profile');
        setSaving(false);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong');
      setSaving(false);
    }
  }

  const canNext = () => {
    if (step === 1) return name.trim().length >= 2;
    if (step === 2) return school.trim().length >= 2;
    if (step === 3) return interests.length >= 1;
    return true;
  };

  return (
    <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, padding: '36px 32px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
        {[1, 2, 3, 4].map((s) => (
          <div key={s} style={{
            width: s === step ? 24 : 8, height: 8, borderRadius: 4,
            background: s <= step ? '#3d9be9' : '#e0e0e0',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* Step 1: Name */}
      {step === 1 && (
        <div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#000', margin: '0 0 6px', textAlign: 'center' }}>
            Welcome to Proplr!
          </h2>
          <p style={{ fontSize: 14, color: '#666', textAlign: 'center', margin: '0 0 24px' }}>
            Let&apos;s set up your profile. What&apos;s your name?
          </p>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            style={inputStyle}
          />
        </div>
      )}

      {/* Step 2: School & Grade */}
      {step === 2 && (
        <div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#000', margin: '0 0 6px', textAlign: 'center' }}>
            Tell us about yourself
          </h2>
          <p style={{ fontSize: 14, color: '#666', textAlign: 'center', margin: '0 0 24px' }}>
            Which school are you from?
          </p>
          <input
            autoFocus
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="Your school name"
            style={{ ...inputStyle, marginBottom: 12 }}
          />
          <input
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Grade / Year (e.g. Grade 11)"
            style={inputStyle}
          />
        </div>
      )}

      {/* Step 3: Interests */}
      {step === 3 && (
        <div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#000', margin: '0 0 6px', textAlign: 'center' }}>
            What are you interested in?
          </h2>
          <p style={{ fontSize: 14, color: '#666', textAlign: 'center', margin: '0 0 20px' }}>
            Pick at least one. You can change these later.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {CAREER_INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                style={{
                  padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  border: interests.includes(interest) ? '1.5px solid #3d9be9' : '1.5px solid rgba(0,0,0,0.15)',
                  background: interests.includes(interest) ? 'rgba(61,155,233,0.1)' : '#fff',
                  color: interests.includes(interest) ? '#3d9be9' : '#666',
                }}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Done */}
      {step === 4 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#000', margin: '0 0 6px' }}>
            You&apos;re all set!
          </h2>
          <p style={{ fontSize: 14, color: '#666', margin: '0 0 4px' }}>
            Welcome to Proplr, {name}!
          </p>
          <p style={{ fontSize: 13, color: '#999' }}>
            Start exploring communities, events, and opportunities.
          </p>
        </div>
      )}

      {error && (
        <div style={{ color: '#e34a4a', fontSize: 13, textAlign: 'center', marginTop: 12 }}>{error}</div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
        {step > 1 && step < 4 ? (
          <button onClick={() => setStep((s) => s - 1)} style={backBtnStyle}>
            Back
          </button>
        ) : <div />}

        {step < 3 && (
          <button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} style={{ ...nextBtnStyle, opacity: canNext() ? 1 : 0.5 }}>
            Next
          </button>
        )}

        {step === 3 && (
          <button onClick={() => { setStep(4); handleComplete(); }} disabled={!canNext() || saving} style={{ ...nextBtnStyle, opacity: canNext() && !saving ? 1 : 0.5 }}>
            {saving ? 'Saving...' : 'Complete'}
          </button>
        )}

        {step === 4 && (
          <button onClick={() => { router.push('/dashboard'); router.refresh(); }} style={nextBtnStyle}>
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1.5px solid rgba(0,0,0,0.15)',
  borderRadius: 12,
  fontSize: 15,
  fontFamily: 'inherit',
  outline: 'none',
  color: '#000',
};

const nextBtnStyle: React.CSSProperties = {
  background: '#3d9be9',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  padding: '10px 28px',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const backBtnStyle: React.CSSProperties = {
  background: 'transparent',
  color: '#666',
  border: '1.5px solid rgba(0,0,0,0.15)',
  borderRadius: 12,
  padding: '10px 24px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};
