'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Save, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { PillarBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { Profile, PillarHour, Certificate } from '@/lib/types';

interface StudentDetailProps {
  student: Profile & { created_at: string };
  hours: PillarHour[];
  certificates: Certificate[];
}

export function StudentDetailPage({ student: initial, hours, certificates }: StudentDetailProps) {
  const router = useRouter();
  const [student, setStudent] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/profile/${student.user_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: student.name,
        school_name: student.school_name,
        grade: student.grade,
        type: student.type,
        is_ambassador: student.is_ambassador,
        subscription_status: student.subscription_status,
        dibz_discount_active: student.dibz_discount_active,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const totalApprovedHours = hours.filter((h) => h.status === 'approved').reduce((acc, h) => acc + h.hours, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/students')}
          className="p-2 hover:bg-surface-2 rounded-lg transition-colors text-text-muted hover:text-text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-text-primary truncate">{student.name}</h1>
          <p className="text-sm text-text-muted">{student.email}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue hover:bg-blue/90 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stats */}
        <div className="card p-5 flex flex-col items-center gap-3">
          <Avatar name={student.name} photoUrl={student.photo_url} size="xl" />
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <p className="font-semibold text-text-primary">{student.name}</p>
              {student.is_ambassador && <Crown className="w-4 h-4 text-gold" />}
            </div>
            <p className="text-xs text-text-muted">Joined {formatDate(student.created_at)}</p>
          </div>
          <div className="flex gap-4 mt-1">
            <div className="text-center">
              <p className="text-xl font-bold text-gold">{totalApprovedHours}</p>
              <p className="text-xs text-text-muted">Hours</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue">{certificates.length}</p>
              <p className="text-xs text-text-muted">Certs</p>
            </div>
          </div>
        </div>

        {/* Edit fields */}
        <div className="md:col-span-2 card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Edit Profile</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Full Name</label>
              <input
                type="text"
                value={student.name}
                onChange={(e) => setStudent((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">School</label>
              <input
                type="text"
                value={student.school_name ?? ''}
                onChange={(e) => setStudent((prev) => ({ ...prev, school_name: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Grade</label>
              <input
                type="text"
                value={student.grade ?? ''}
                onChange={(e) => setStudent((prev) => ({ ...prev, grade: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Account Type</label>
              <select
                value={student.type}
                onChange={(e) => setStudent((prev) => ({ ...prev, type: e.target.value as Profile['type'] }))}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors"
              >
                <option value="school_student">School Student</option>
                <option value="uni_student">University Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Subscription</label>
              <select
                value={student.subscription_status ?? 'free'}
                onChange={(e) => setStudent((prev) => ({ ...prev, subscription_status: e.target.value as Profile['subscription_status'] }))}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={student.is_ambassador ?? false}
                onChange={(e) => setStudent((prev) => ({ ...prev, is_ambassador: e.target.checked }))}
                className="w-4 h-4 rounded border-border text-gold accent-gold"
              />
              <span className="text-sm text-text-secondary">Ambassador</span>
              <Crown className="w-3.5 h-3.5 text-gold" />
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={student.dibz_discount_active ?? false}
                onChange={(e) => setStudent((prev) => ({ ...prev, dibz_discount_active: e.target.checked }))}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm text-text-secondary">Dibz Discount Active</span>
            </label>
          </div>
        </div>
      </div>

      {/* Hours log */}
      {hours.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Hours Log ({hours.length})</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {hours.map((h) => (
              <div key={h.id} className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
                <PillarBadge pillar={h.pillar_name} />
                <span className="text-xs text-text-secondary flex-1 truncate">{h.source}</span>
                <span className="text-xs font-semibold text-text-primary">{h.hours}h</span>
                {h.status === 'approved' ? (
                  <CheckCircle2 className="w-4 h-4 text-green flex-shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Certificates ({certificates.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-3 bg-surface-2 rounded-lg border border-border">
                <p className="text-sm font-medium text-text-primary">{cert.pillar_name}</p>
                <p className="text-xs text-text-muted mt-0.5">{formatDate(cert.issued_at)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
