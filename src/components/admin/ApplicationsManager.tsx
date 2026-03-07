'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import type { Application, ApplicationStatus } from '@/lib/types';

type ApplicationWithJoins = Application & {
  profiles: { name: string; email: string; school_name: string | null } | null;
  opportunities: { title: string; company: string } | null;
};

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'applied', label: 'Applied' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'interview', label: 'Interview' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  applied: 'bg-surface-2 text-text-secondary border-border',
  reviewing: 'bg-blue/10 text-blue border-blue/30',
  interview: 'bg-purple/10 text-purple border-purple/30',
  accepted: 'bg-green/10 text-green border-green/30',
  rejected: 'bg-red/10 text-red border-red/30',
};

export function ApplicationsManager() {
  const [applications, setApplications] = useState<ApplicationWithJoins[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    const supabase = createClient();
    const { data } = await supabase
      .from('applications')
      .select('*, profiles(name, email, school_name), opportunities(title, company)')
      .order('created_at', { ascending: false });
    setApplications((data as ApplicationWithJoins[]) || []);
    setLoading(false);
  }

  async function handleStatusChange(application: ApplicationWithJoins, newStatus: ApplicationStatus) {
    if (newStatus === application.status) return;
    setUpdating(application.id);
    const supabase = createClient();

    await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', application.id);

    // Insert notification
    const opportunityTitle = application.opportunities?.title || 'the opportunity';
    await supabase.from('notifications').insert({
      user_id: application.user_id,
      type: 'application',
      title: 'Application Update',
      message: `Your application for ${opportunityTitle} is now: ${newStatus}`,
      link: '/profile',
    });

    setApplications((prev) =>
      prev.map((a) => a.id === application.id ? { ...a, status: newStatus } : a)
    );
    setUpdating(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-text-primary">Applications</h2>
        <span className="text-xs text-text-muted">{applications.length} total</span>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-text-muted text-sm">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="card p-8 text-center text-text-muted text-sm">No applications yet.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Opportunity</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Company</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Applied</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-text-primary font-medium">{app.profiles?.name || 'Unknown'}</p>
                      <p className="text-xs text-text-muted">{app.profiles?.email || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-text-secondary max-w-[160px] truncate">
                      {app.opportunities?.title || '—'}
                    </td>
                    <td className="px-4 py-3 text-text-secondary max-w-[120px] truncate">
                      {app.opportunities?.company || '—'}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {formatDate(app.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={app.status}
                        disabled={updating === app.id}
                        onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border appearance-none cursor-pointer transition-colors disabled:opacity-50 bg-transparent ${STATUS_STYLES[app.status]}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-surface text-text-primary">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
