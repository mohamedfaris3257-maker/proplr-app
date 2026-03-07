'use client';

import { useState } from 'react';
import {
  Users, Calendar, Briefcase, FileText, Clock, Shield,
  CheckCircle2, XCircle, TrendingUp, School, GraduationCap,
  Award,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { PillarBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Profile, PillarHour } from '@/lib/types';
import { EventsManager } from './EventsManager';
import { OpportunitiesManager } from './OpportunitiesManager';
import { PostsModeration } from './PostsModeration';
import { CertificatesManager } from './CertificatesManager';
import { ApplicationsManager } from './ApplicationsManager';

interface AdminStats {
  totalUsers: number;
  schoolStudents: number;
  uniStudents: number;
  totalEvents: number;
  totalOpportunities: number;
  totalApplications: number;
}

interface AdminDashboardProps {
  stats: AdminStats;
  recentUsers: (Profile & { created_at: string })[];
  pendingHours: (PillarHour & { profiles: { name: string; email: string } })[];
}

type ActiveTab =
  | 'overview'
  | 'events'
  | 'opportunities'
  | 'posts'
  | 'hours'
  | 'certificates'
  | 'applications';

interface RejectModalState {
  open: boolean;
  hourId: string | null;
  note: string;
}

export function AdminDashboard({ stats, recentUsers, pendingHours: initialPendingHours }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [pendingHours, setPendingHours] = useState(initialPendingHours);
  const [rejectModal, setRejectModal] = useState<RejectModalState>({ open: false, hourId: null, note: '' });
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);

  async function handleApproveHour(id: string) {
    setApproving(id);
    const supabase = createClient();
    await supabase.from('pillar_hours').update({ status: 'approved' }).eq('id', id);
    setPendingHours((prev) => prev.filter((h) => h.id !== id));
    setApproving(null);
  }

  function openRejectModal(id: string) {
    setRejectModal({ open: true, hourId: id, note: '' });
  }

  async function handleRejectConfirm() {
    if (!rejectModal.hourId) return;
    setRejecting(true);
    const supabase = createClient();
    await supabase
      .from('pillar_hours')
      .update({ status: 'rejected', rejection_note: rejectModal.note || null })
      .eq('id', rejectModal.hourId);
    setPendingHours((prev) => prev.filter((h) => h.id !== rejectModal.hourId));
    setRejecting(false);
    setRejectModal({ open: false, hourId: null, note: '' });
  }

  const statCards = [
    { label: 'Total Students', value: stats.totalUsers, icon: Users, color: 'text-blue', bg: 'bg-blue/10' },
    { label: 'School Students', value: stats.schoolStudents, icon: School, color: 'text-gold', bg: 'bg-gold/10' },
    { label: 'University Students', value: stats.uniStudents, icon: GraduationCap, color: 'text-teal', bg: 'bg-teal/10' },
    { label: 'Events', value: stats.totalEvents, icon: Calendar, color: 'text-purple', bg: 'bg-purple/10' },
    { label: 'Opportunities', value: stats.totalOpportunities, icon: Briefcase, color: 'text-green', bg: 'bg-green/10' },
    { label: 'Applications', value: stats.totalApplications, icon: FileText, color: 'text-red', bg: 'bg-red/10' },
  ];

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'hours', label: 'Hours', icon: Clock, badge: pendingHours.length > 0 ? pendingHours.length : undefined },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'applications', label: 'Applications', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-purple" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Panel</h1>
          <p className="text-text-muted text-sm">Proplr platform management</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">{value}</p>
              <p className="text-xs text-text-muted leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-surface-2 rounded-xl mb-6 w-fit">
        {tabs.map(({ id, label, icon: Icon, badge }) => (
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
            {badge !== undefined && (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gold text-background text-[10px] font-bold">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* User distribution */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">User Distribution</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">School Students</span>
                  <span className="text-gold font-medium">{stats.schoolStudents}</span>
                </div>
                <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full"
                    style={{ width: stats.totalUsers > 0 ? `${(stats.schoolStudents / stats.totalUsers) * 100}%` : '0%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">University Students</span>
                  <span className="text-blue font-medium">{stats.uniStudents}</span>
                </div>
                <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue rounded-full"
                    style={{ width: stats.totalUsers > 0 ? `${(stats.uniStudents / stats.totalUsers) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Platform Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Pending hour approvals</span>
                <span className={`font-semibold ${pendingHours.length > 0 ? 'text-gold' : 'text-green'}`}>
                  {pendingHours.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Active opportunities</span>
                <span className="text-text-primary font-semibold">{stats.totalOpportunities}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Total applications</span>
                <span className="text-text-primary font-semibold">{stats.totalApplications}</span>
              </div>
            </div>
          </div>

          {/* Recent users */}
          <div className="card overflow-hidden sm:col-span-2">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">Recently Joined Students</h3>
            </div>
            <div className="divide-y divide-border">
              {recentUsers.length === 0 ? (
                <p className="p-6 text-center text-text-muted text-sm">No users yet</p>
              ) : (
                recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-4 hover:bg-surface-2 transition-colors">
                    <Avatar name={u.name} photoUrl={u.photo_url} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{u.name}</p>
                      <p className="text-xs text-text-muted truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${
                        u.type === 'school_student' ? 'bg-gold/10 text-gold' :
                        u.type === 'uni_student' ? 'bg-blue/10 text-blue' : 'bg-purple/10 text-purple'
                      }`}>
                        {u.type === 'school_student' ? 'School' : u.type === 'uni_student' ? 'Uni' : 'Admin'}
                      </span>
                      <span className="text-xs text-text-muted hidden sm:block">{formatDate(u.created_at)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && <EventsManager />}

      {activeTab === 'opportunities' && <OpportunitiesManager />}

      {activeTab === 'posts' && <PostsModeration />}

      {activeTab === 'hours' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">
              Pending Pillar Hour Approvals
              {pendingHours.length > 0 && (
                <span className="ml-2 text-xs text-gold">({pendingHours.length})</span>
              )}
            </h3>
          </div>
          {pendingHours.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-green mx-auto mb-2" />
              <p className="text-text-secondary text-sm">All caught up! No pending hours.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {pendingHours.map((ph) => (
                <div key={ph.id} className="flex items-center gap-3 p-4 hover:bg-surface-2 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {ph.profiles?.name || 'Student'}
                      </p>
                      <PillarBadge pillar={ph.pillar_name} />
                    </div>
                    <p className="text-xs text-text-muted truncate">{ph.source}</p>
                    <p className="text-xs text-text-muted">{ph.hours} hours · {formatDate(ph.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openRejectModal(ph.id)}
                      className="text-red hover:bg-red/10 p-2"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      loading={approving === ph.id}
                      onClick={() => handleApproveHour(ph.id)}
                      className="bg-green/10 text-green hover:bg-green/20 border-0"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'certificates' && <CertificatesManager />}

      {activeTab === 'applications' && <ApplicationsManager />}

      {/* Reject Hour Modal */}
      <Modal
        open={rejectModal.open}
        onClose={() => setRejectModal({ open: false, hourId: null, note: '' })}
        title="Reject Hours"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Optionally add a note explaining why these hours are being rejected.
          </p>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Rejection Note (optional)
            </label>
            <textarea
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors resize-none"
              placeholder="e.g. Insufficient evidence provided..."
              rows={3}
              value={rejectModal.note}
              onChange={(e) => setRejectModal((prev) => ({ ...prev, note: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRejectModal({ open: false, hourId: null, note: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={rejecting}
              onClick={handleRejectConfirm}
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
