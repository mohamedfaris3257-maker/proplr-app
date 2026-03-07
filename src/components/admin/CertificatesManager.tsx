'use client';

import { useState, useEffect } from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PillarBadge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import type { PillarName, Certificate } from '@/lib/types';

interface EligibleStudent {
  user_id: string;
  pillar_name: PillarName;
  total_hours: number;
  name: string;
  email: string;
  school_name: string | null;
  certificate: Certificate | null;
}

export function CertificatesManager() {
  const [students, setStudents] = useState<EligibleStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState<string | null>(null);

  useEffect(() => {
    fetchEligibleStudents();
  }, []);

  async function fetchEligibleStudents() {
    const supabase = createClient();

    // Fetch aggregated approved hours >= 20
    const { data: hoursData } = await supabase
      .from('pillar_hours')
      .select('user_id, pillar_name, hours')
      .eq('status', 'approved');

    if (!hoursData || hoursData.length === 0) {
      setLoading(false);
      return;
    }

    // Aggregate hours per user+pillar in JS
    const aggregated: Record<string, { user_id: string; pillar_name: PillarName; total_hours: number }> = {};
    for (const row of hoursData) {
      const key = `${row.user_id}__${row.pillar_name}`;
      if (!aggregated[key]) {
        aggregated[key] = { user_id: row.user_id, pillar_name: row.pillar_name as PillarName, total_hours: 0 };
      }
      aggregated[key].total_hours += row.hours;
    }

    // Filter to those with >= 20 hours
    const eligible = Object.values(aggregated).filter((r) => r.total_hours >= 20);

    if (eligible.length === 0) {
      setLoading(false);
      return;
    }

    // Get unique user IDs
    const userIds = Array.from(new Set(eligible.map((e) => e.user_id)));

    // Fetch profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, name, email, school_name')
      .in('user_id', userIds);

    // Fetch existing certificates
    const { data: certs } = await supabase
      .from('certificates')
      .select('*')
      .in('user_id', userIds);

    const profileMap: Record<string, { name: string; email: string; school_name: string | null }> = {};
    for (const p of profiles || []) {
      profileMap[p.user_id] = { name: p.name, email: p.email, school_name: p.school_name };
    }

    const certMap: Record<string, Certificate> = {};
    for (const c of certs || []) {
      certMap[`${c.user_id}__${c.pillar_name}`] = c;
    }

    const result: EligibleStudent[] = eligible.map((e) => ({
      ...e,
      name: profileMap[e.user_id]?.name || 'Unknown',
      email: profileMap[e.user_id]?.email || '',
      school_name: profileMap[e.user_id]?.school_name || null,
      certificate: certMap[`${e.user_id}__${e.pillar_name}`] || null,
    }));

    // Sort: eligible first, then issued
    result.sort((a, b) => {
      if (!a.certificate && b.certificate) return -1;
      if (a.certificate && !b.certificate) return 1;
      return 0;
    });

    setStudents(result);
    setLoading(false);
  }

  async function issueCertificate(student: EligibleStudent) {
    const key = `${student.user_id}__${student.pillar_name}`;
    setIssuing(key);
    const supabase = createClient();

    const { data: newCert } = await supabase
      .from('certificates')
      .insert({
        user_id: student.user_id,
        pillar_name: student.pillar_name,
        issued_at: new Date().toISOString(),
        khda_attested: false,
      })
      .select()
      .single();

    // Insert notification
    await supabase.from('notifications').insert({
      user_id: student.user_id,
      type: 'certificate',
      title: 'Certificate Issued!',
      message: `You've earned your ${student.pillar_name} certificate!`,
      link: '/profile',
    });

    if (newCert) {
      setStudents((prev) =>
        prev.map((s) =>
          s.user_id === student.user_id && s.pillar_name === student.pillar_name
            ? { ...s, certificate: newCert }
            : s
        )
      );
    }

    setIssuing(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-text-primary">Certificates</h2>
        <span className="text-xs text-text-muted">
          {students.filter((s) => !s.certificate).length} eligible, {students.filter((s) => s.certificate).length} issued
        </span>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-text-muted text-sm">Loading certificate data...</div>
      ) : students.length === 0 ? (
        <div className="card p-8 text-center">
          <Award className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-text-muted text-sm">No students have reached 20 hours in any pillar yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">School</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Pillar</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Hours</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => {
                  const key = `${student.user_id}__${student.pillar_name}`;
                  return (
                    <tr key={key} className="hover:bg-surface-2 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-text-primary font-medium">{student.name}</p>
                        <p className="text-xs text-text-muted">{student.email}</p>
                      </td>
                      <td className="px-4 py-3 text-text-secondary text-xs">
                        {student.school_name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <PillarBadge pillar={student.pillar_name} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-text-primary font-semibold">{student.total_hours}</span>
                        <span className="text-text-muted text-xs"> hrs</span>
                      </td>
                      <td className="px-4 py-3">
                        {student.certificate ? (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green" />
                            <span className="text-xs text-green font-medium">Issued</span>
                            <span className="text-xs text-text-muted">
                              {formatDate(student.certificate.issued_at)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gold font-medium bg-gold/10 px-2 py-0.5 rounded-full">
                            Eligible
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {!student.certificate && (
                          <Button
                            size="sm"
                            onClick={() => issueCertificate(student)}
                            loading={issuing === key}
                            className="text-xs"
                          >
                            <Award className="w-3.5 h-3.5" />
                            Issue
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
