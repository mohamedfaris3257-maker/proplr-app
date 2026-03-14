'use client';

import { useState, useEffect } from 'react';
import { Plus, Users2, CheckCircle2, XCircle, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';

type CommunityType = 'cohort' | 'school' | 'interest';

interface Community {
  id: string;
  name: string;
  description: string | null;
  type: CommunityType;
  cover_url: string | null;
  created_by: string;
  is_active: boolean;
  created_at: string;
  memberCount?: number;
}

interface CommunityMember {
  id: string;
  user_id: string;
  role: 'member' | 'moderator' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  joined_at: string;
  profiles: {
    name: string;
    email: string;
    photo_url: string | null;
  } | null;
}

interface CreateForm {
  name: string;
  description: string;
  type: CommunityType;
  is_active: boolean;
}

const defaultForm: CreateForm = {
  name: '',
  description: '',
  type: 'interest',
  is_active: true,
};

const TYPE_BADGE: Record<CommunityType, { label: string; className: string }> = {
  cohort: { label: 'Cohort', className: 'bg-gold/10 text-gold' },
  school: { label: 'School', className: 'bg-blue/10 text-blue' },
  interest: { label: 'Interest', className: 'bg-teal/10 text-teal' },
};

export function CommunitiesManager() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateForm>(defaultForm);
  const [saving, setSaving] = useState(false);

  const [managingCommunity, setManagingCommunity] = useState<Community | null>(null);
  const [membersLoading, setMembersLoading] = useState(false);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  async function fetchCommunities() {
    const supabase = createClient();
    const { data } = await supabase
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false });

    if (!data) {
      setLoading(false);
      return;
    }

    // Fetch member counts
    const ids = (data as unknown as Community[]).map((c) => c.id);
    const counts: Record<string, number> = {};
    if (ids.length > 0) {
      const { data: countData } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('status', 'approved')
        .in('community_id', ids);
      (countData as unknown as { community_id: string }[] || []).forEach((row) => {
        counts[row.community_id] = (counts[row.community_id] || 0) + 1;
      });
    }

    setCommunities(
      (data as unknown as Community[]).map((c) => ({ ...c, memberCount: counts[c.id] || 0 }))
    );
    setLoading(false);
  }

  async function handleCreate() {
    if (!form.name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('communities').insert({
      name: form.name.trim(),
      description: form.description.trim() || null,
      type: form.type,
      is_active: form.is_active,
      created_by: user!.id,
    });

    if (!error) {
      setCreateOpen(false);
      setForm(defaultForm);
      await fetchCommunities();
    }
    setSaving(false);
  }

  async function handleToggleActive(community: Community) {
    const supabase = createClient();
    await supabase
      .from('communities')
      .update({ is_active: !community.is_active })
      .eq('id', community.id);
    await fetchCommunities();
  }

  async function openManageMembers(community: Community) {
    setManagingCommunity(community);
    setMembersLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('community_members')
      .select('id, user_id, role, status, joined_at, profiles(name, email, photo_url)')
      .eq('community_id', community.id)
      .order('joined_at', { ascending: true });
    setMembers((data || []) as unknown as CommunityMember[]);
    setMembersLoading(false);
  }

  async function handleApproveMember(memberId: string) {
    setActionInProgress(memberId);
    const supabase = createClient();
    await supabase
      .from('community_members')
      .update({ status: 'approved' })
      .eq('id', memberId);
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: 'approved' } : m))
    );
    setActionInProgress(null);
  }

  async function handleRejectMember(memberId: string) {
    setActionInProgress(memberId);
    const supabase = createClient();
    await supabase
      .from('community_members')
      .update({ status: 'rejected' })
      .eq('id', memberId);
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: 'rejected' } : m))
    );
    setActionInProgress(null);
  }

  async function handleRemoveMember(memberId: string) {
    setActionInProgress(memberId);
    const supabase = createClient();
    await supabase.from('community_members').delete().eq('id', memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setActionInProgress(null);
    // Refresh counts
    if (managingCommunity) {
      await fetchCommunities();
    }
  }

  const pendingMembers = members.filter((m) => m.status === 'pending');
  const approvedMembers = members.filter((m) => m.status === 'approved');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Communities</h3>
          <p className="text-xs text-text-muted mt-0.5">{communities.length} total</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Community
        </Button>
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-text-muted text-sm">Loading...</div>
        ) : communities.length === 0 ? (
          <div className="p-10 text-center">
            <Globe className="w-8 h-8 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary text-sm">No communities yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {communities.map((community) => {
              const badge = TYPE_BADGE[community.type];
              return (
                <div
                  key={community.id}
                  className="flex items-center gap-3 p-4 hover:bg-surface-2 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-text-primary truncate">{community.name}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                      {!community.is_active && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red/10 text-red">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted">
                      {community.memberCount} members · Created {formatDate(community.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openManageMembers(community)}
                    >
                      <Users2 className="w-4 h-4" />
                      Members
                    </Button>
                    <button
                      onClick={() => handleToggleActive(community)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                        community.is_active
                          ? 'bg-green/10 text-green border-green/20 hover:bg-green/20'
                          : 'bg-surface-2 text-text-muted border-border hover:border-green/20 hover:text-green'
                      }`}
                    >
                      {community.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); setForm(defaultForm); }}
        title="Create Community"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Community Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              className="input-field w-full"
              placeholder="e.g. Dubai Cohort 2025"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Description
            </label>
            <textarea
              className="input-field w-full resize-none"
              rows={3}
              placeholder="What is this community about?"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Type <span className="text-red">*</span>
            </label>
            <select
              className="input-field w-full"
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as CommunityType }))}
            >
              <option value="cohort">Cohort (invite/approve to join)</option>
              <option value="school">School (invite/approve to join)</option>
              <option value="interest">Interest (open to all)</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
              className="w-4 h-4 accent-gold"
            />
            <label htmlFor="is_active" className="text-sm text-text-secondary">
              Active (visible to students)
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => { setCreateOpen(false); setForm(defaultForm); }}>
              Cancel
            </Button>
            <Button size="sm" loading={saving} onClick={handleCreate} disabled={!form.name.trim()}>
              Create Community
            </Button>
          </div>
        </div>
      </Modal>

      {/* Manage Members Modal */}
      <Modal
        open={!!managingCommunity}
        onClose={() => setManagingCommunity(null)}
        title={`Members — ${managingCommunity?.name ?? ''}`}
        size="lg"
      >
        {membersLoading ? (
          <div className="py-8 text-center text-text-muted text-sm">Loading members...</div>
        ) : (
          <div className="space-y-4">
            {pendingMembers.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">
                  Pending Requests ({pendingMembers.length})
                </h4>
                <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
                  {pendingMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3">
                      <Avatar
                        name={member.profiles?.name ?? 'User'}
                        photoUrl={member.profiles?.photo_url}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {member.profiles?.name ?? 'Unknown'}
                        </p>
                        <p className="text-xs text-text-muted truncate">{member.profiles?.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectMember(member.id)}
                          disabled={actionInProgress === member.id}
                          className="p-1.5 rounded-lg text-red hover:bg-red/10 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApproveMember(member.id)}
                          disabled={actionInProgress === member.id}
                          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-green/10 text-green hover:bg-green/20 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Approved Members ({approvedMembers.length})
              </h4>
              {approvedMembers.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No approved members.</p>
              ) : (
                <div className="divide-y divide-border border border-border rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                  {approvedMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3">
                      <Avatar
                        name={member.profiles?.name ?? 'User'}
                        photoUrl={member.profiles?.photo_url}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {member.profiles?.name ?? 'Unknown'}
                        </p>
                        <p className="text-xs text-text-muted truncate">{member.profiles?.email}</p>
                      </div>
                      <span className="text-[10px] font-medium text-text-muted capitalize mr-2">
                        {member.role}
                      </span>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={actionInProgress === member.id}
                        className="p-1.5 rounded-lg text-red hover:bg-red/10 transition-colors disabled:opacity-50"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
