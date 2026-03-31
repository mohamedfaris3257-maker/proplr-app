'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CAREER_INTERESTS } from '@/lib/types';
import type { Profile, CareerInterest } from '@/lib/types';

interface SettingsClientProps {
  profile: Profile;
}

export function SettingsClient({ profile }: SettingsClientProps) {
  const router = useRouter();
  const [name, setName] = useState(profile.name || '');
  const [schoolName, setSchoolName] = useState(profile.school_name || '');
  const [grade, setGrade] = useState(profile.grade || '');
  const [careerInterests, setCareerInterests] = useState<CareerInterest[]>(
    profile.career_interests || []
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const toggleInterest = (interest: CareerInterest) => {
    setCareerInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
          school_name: schoolName.trim() || null,
          grade: grade.trim() || null,
          career_interests: careerInterests,
        })
        .eq('user_id', profile.user_id);

      if (error) {
        setMessage({ type: 'error', text: 'Failed to save changes. Please try again.' });
      } else {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        router.refresh();
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid rgba(7,22,41,0.10)',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    color: '#071629',
    outline: 'none',
    background: '#fff',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#071629',
    marginBottom: 6,
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Profile Settings */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24 }}>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#071629',
            marginBottom: 20,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Profile Settings
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              style={inputStyle}
            />
          </div>

          {/* Email (disabled) */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              style={{
                ...inputStyle,
                background: '#f5f5f7',
                color: '#6e7591',
                cursor: 'not-allowed',
              }}
            />
            <p
              style={{
                fontSize: 12,
                color: '#6e7591',
                marginTop: 4,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Email cannot be changed here.
            </p>
          </div>

          {/* School Name */}
          <div>
            <label style={labelStyle}>School Name</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Enter your school name"
              style={inputStyle}
            />
          </div>

          {/* Grade */}
          <div>
            <label style={labelStyle}>Grade</label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g. Grade 10, Year 12"
              style={inputStyle}
            />
          </div>

          {/* Career Interests */}
          <div>
            <label style={labelStyle}>Career Interests</label>
            <p
              style={{
                fontSize: 12,
                color: '#6e7591',
                marginBottom: 10,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Select all that apply
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {CAREER_INTERESTS.map((interest) => {
                const isSelected = careerInterests.includes(interest);
                return (
                  <label
                    key={interest}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: isSelected
                        ? '1.5px solid #3d9be9'
                        : '1px solid rgba(7,22,41,0.10)',
                      background: isSelected ? 'rgba(61,155,233,0.06)' : '#fff',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif",
                      color: isSelected ? '#3d9be9' : '#071629',
                      fontWeight: isSelected ? 600 : 400,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleInterest(interest)}
                      style={{ display: 'none' }}
                    />
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        border: isSelected
                          ? '1.5px solid #3d9be9'
                          : '1.5px solid rgba(7,22,41,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isSelected ? '#3d9be9' : '#fff',
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="#fff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    {interest}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            style={{
              marginTop: 16,
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              background:
                message.type === 'success'
                  ? 'rgba(39,174,96,0.08)'
                  : 'rgba(224,92,58,0.08)',
              color: message.type === 'success' ? '#27AE60' : '#E05C3A',
            }}
          >
            {message.text}
          </div>
        )}

        {/* Save button */}
        <div style={{ marginTop: 20 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? '#a0c8ee' : '#3d9be9',
              color: '#fff',
              borderRadius: 10,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
