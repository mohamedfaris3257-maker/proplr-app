'use client';

import { useState } from 'react';
import {
  Users, Calendar, Briefcase, FileText, Clock, Shield,
  CheckCircle2, XCircle, TrendingUp, School, GraduationCap,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { PillarBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Profile, PillarHour } from '@/lib/types';

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

type ActiveTab = 'overview' | 'users' | 'hours';

export function AdminDashboard({ stats, recentUsers, pendingHours: initialPendingHours }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [pendingHours, setPendingHours] = useState(initialPendingHours);
  const supabase = createClient();

  const handleApproveHour = async (id: string, approve: boolean) => {
    await supabase
      .from('pillar_hours')
      .update({ status: approve ? 'approved' : 'rejected' })
      .eq('id', id);
    setPendingHours((prev) => prev.filter((h) => h.id !== id));
  };

  const statCards = [
    { label: 'Total Students', value: stats.totalUsers, icon: Users, color: 'text-blue', bg: 'bg-blue/10' },
    { label: 'School Students', value: stats.schoolStudents, icon: School, color: 'text-gold', bg: 'bg-gold/10' },
    { label: 'University Students', value: stats.uniStudents, icon: GraduationCap, color: 'text-teal', bg: 'bg-teal/10' },
    { label: 'Events', value: stats.totalEvents, icon: Calendar, color: 'text-purple', bg: 'bg-purple/10' },
    { label: 'Opportunities', value: stats.totalOpportunities, icon: Briefcase, color: 'text-green', bg: 'bg-green/10' },
    { label: 'Applications', value: stats.totalApplications, icon: FileText, color: 'text-red', bg: 'bg-red/10' },
  ];

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Recent Users', icon: Users },
    { id: 'hours', label: `Pending Hours ${pendingHours.length > 0 ? `(${pendingHours.length})` : ''}`, icon: Clock },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{value}</p>
              <p className="text-xs text-text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-2 rounded-xl mb-6 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === id
                ? 'bg-surface text-text-primary shadow-card'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
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
        </div>
      )}

      {/* Users tab */}
      {activeTab === 'users' && (
        <div className="card overflow-hidden">
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
      )}

      {/* Pending hours tab */}
      {activeTab === 'hours' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">
              Pending Pillar Hour Approvals
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
                      onClick={() => handleApproveHour(ph.id, false)}
                      className="text-red hover:bg-red/10 p-2"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApproveHour(ph.id, true)}
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
    </div>
  );
}
