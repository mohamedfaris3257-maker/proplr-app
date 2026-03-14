'use client';

import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Search, UserCheck, UserX, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export interface StudentRegistration {
  id: string;
  full_name: string;
  email: string;
  date_of_birth: string | null;
  nationality: string | null;
  school_name: string | null;
  grade: string | null;
  class_name: string | null;
  parent_name: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  parental_consent: boolean;
  photo_url: string | null;
  interests: string[];
  extracurriculars: string | null;
  how_heard: string | null;
  promo_code: string | null;
  referred_by: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  created_at: string;
}

type StatusTab = 'pending' | 'approved' | 'rejected';

interface RowAction {
  loading: boolean;
  rejectFormOpen: boolean;
  rejectReason: string;
}

interface StudentsManagerProps {
  initialRegistrations: StudentRegistration[];
}

export function StudentsManager({ initialRegistrations }: StudentsManagerProps) {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>(initialRegistrations);
  const [activeTab, setActiveTab] = useState<StatusTab>('pending');
  const [search, setSearch] = useState('');
  const [rowActions, setRowActions] = useState<Record<string, RowAction>>({});

  // Per-tab counts based on current state
  const counts = useMemo(
    () => ({
      pending: registrations.filter((r) => r.status === 'pending').length,
      approved: registrations.filter((r) => r.status === 'approved').length,
      rejected: registrations.filter((r) => r.status === 'rejected').length,
    }),
    [registrations]
  );

  // Filtered list for the active tab
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registrations.filter((r) => {
      if (r.status !== activeTab) return false;
      if (!q) return true;
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      );
    });
  }, [registrations, activeTab, search]);

  function getRowAction(id: string): RowAction {
    return rowActions[id] ?? { loading: false, rejectFormOpen: false, rejectReason: '' };
  }

  function setRowAction(id: string, patch: Partial<RowAction>) {
    setRowActions((prev) => ({
      ...prev,
      [id]: { ...getRowAction(id), ...patch },
    }));
  }

  async function handleApprove(id: string) {
    setRowAction(id, { loading: true });
    try {
      const res = await fetch('/api/admin/approve-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_id: id }),
      });
      const json = await res.json();
      if (!res.ok) {
        console.error('Approve error:', json.error);
        alert(json.error ?? 'Failed to approve student');
        setRowAction(id, { loading: false });
        return;
      }
      // Move registration to approved state
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r))
      );
    } catch (err) {
      console.error('Approve fetch error:', err);
      alert('Network error. Please try again.');
      setRowAction(id, { loading: false });
    }
  }

  function openRejectForm(id: string) {
    setRowAction(id, { rejectFormOpen: true, rejectReason: '' });
  }

  function closeRejectForm(id: string) {
    setRowAction(id, { rejectFormOpen: false, rejectReason: '' });
  }

  async function handleRejectConfirm(id: string) {
    const action = getRowAction(id);
    setRowAction(id, { loading: true });
    try {
      const res = await fetch('/api/admin/reject-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_id: id, reason: action.rejectReason || undefined }),
      });
      const json = await res.json();
      if (!res.ok) {
        console.error('Reject error:', json.error);
        alert(json.error ?? 'Failed to reject student');
        setRowAction(id, { loading: false });
        return;
      }
      // Move registration to rejected state
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: 'rejected' as const, rejection_reason: action.rejectReason || null }
            : r
        )
      );
    } catch (err) {
      console.error('Reject fetch error:', err);
      alert('Network error. Please try again.');
      setRowAction(id, { loading: false });
    }
  }

  const tabs: { id: StatusTab; label: string; icon: React.ElementType }[] = [
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'approved', label: 'Approved', icon: UserCheck },
    { id: 'rejected', label: 'Rejected', icon: UserX },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Status tabs */}
        <div className="flex gap-1 p-1 bg-surface-2 rounded-xl">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-surface text-text-primary shadow-card'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span
                className={`flex items-center justify-center min-w-[1.1rem] h-[1.1rem] rounded-full text-[10px] font-bold px-1 ${
                  id === 'pending'
                    ? 'bg-gold text-background'
                    : id === 'approved'
                    ? 'bg-green/20 text-green'
                    : 'bg-red/20 text-red'
                }`}
              >
                {counts[id] > 99 ? '99+' : counts[id]}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
          />
        </div>
      </div>

      {/* Table card */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            {activeTab === 'pending' ? (
              <>
                <CheckCircle2 className="w-9 h-9 text-green mx-auto mb-2" />
                <p className="text-text-secondary text-sm font-medium">
                  {search ? 'No pending registrations match your search.' : 'No pending registrations.'}
                </p>
              </>
            ) : activeTab === 'approved' ? (
              <>
                <UserCheck className="w-9 h-9 text-text-muted mx-auto mb-2" />
                <p className="text-text-secondary text-sm font-medium">
                  {search ? 'No approved registrations match your search.' : 'No approved registrations yet.'}
                </p>
              </>
            ) : (
              <>
                <UserX className="w-9 h-9 text-text-muted mx-auto mb-2" />
                <p className="text-text-secondary text-sm font-medium">
                  {search ? 'No rejected registrations match your search.' : 'No rejected registrations.'}
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((reg) => {
              const action = getRowAction(reg.id);
              return (
                <div key={reg.id} className="hover:bg-surface-2 transition-colors">
                  {/* Main row */}
                  <div className="flex items-start gap-3 p-4">
                    {/* Info block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {reg.full_name}
                        </p>
                        {reg.promo_code && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gold/10 text-gold uppercase tracking-wide">
                            {reg.promo_code}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted truncate mb-1">{reg.email}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-text-muted">
                        {reg.school_name && (
                          <span>
                            <span className="text-text-secondary">{reg.school_name}</span>
                          </span>
                        )}
                        {reg.grade && <span>Grade {reg.grade}</span>}
                        {reg.parent_email && (
                          <span>
                            Parent:{' '}
                            <span className="text-text-secondary">{reg.parent_email}</span>
                          </span>
                        )}
                        <span className="text-text-muted">{formatDate(reg.created_at)}</span>
                      </div>
                      {reg.status === 'rejected' && reg.rejection_reason && (
                        <p className="mt-1 text-xs text-red/80 italic">
                          Reason: {reg.rejection_reason}
                        </p>
                      )}
                    </div>

                    {/* Actions — only for pending */}
                    {reg.status === 'pending' && (
                      <div className="flex items-center gap-2 flex-shrink-0 self-start pt-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            action.rejectFormOpen ? closeRejectForm(reg.id) : openRejectForm(reg.id)
                          }
                          disabled={action.loading}
                          className="text-red hover:bg-red/10 p-2"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          loading={action.loading && !action.rejectFormOpen}
                          disabled={action.loading}
                          onClick={() => handleApprove(reg.id)}
                          className="bg-green/10 text-green hover:bg-green/20 border-0"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Inline reject form */}
                  {reg.status === 'pending' && action.rejectFormOpen && (
                    <div className="px-4 pb-4 bg-red/5 border-t border-red/10">
                      <p className="text-xs font-medium text-text-secondary mb-2 pt-3">
                        Rejection reason (optional)
                      </p>
                      <textarea
                        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red transition-colors resize-none"
                        placeholder="e.g. Missing parental consent, incomplete information..."
                        rows={2}
                        value={action.rejectReason}
                        onChange={(e) => setRowAction(reg.id, { rejectReason: e.target.value })}
                        disabled={action.loading}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => closeRejectForm(reg.id)}
                          disabled={action.loading}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          loading={action.loading}
                          onClick={() => handleRejectConfirm(reg.id)}
                        >
                          <XCircle className="w-4 h-4" />
                          Confirm Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
