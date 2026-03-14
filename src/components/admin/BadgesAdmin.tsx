'use client';

import { useState, useEffect } from 'react';
import { Award, Plus, Trash2, Gift } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';

interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  criteria_type: string;
  criteria_value: number;
  created_at: string;
}

interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
  badges: { name: string } | null;
  profiles: { name: string; email: string } | null;
}

export function BadgesAdmin() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'badges' | 'awarded'>('badges');
  const [newBadge, setNewBadge] = useState({ name: '', description: '', icon_url: '', criteria_type: 'hours', criteria_value: 50 });
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    Promise.all([
      supabase.from('badges').select('*').order('created_at', { ascending: false }),
      supabase.from('user_badges').select('*, badges(name), profiles(name, email)').order('awarded_at', { ascending: false }).limit(50),
    ]).then(([{ data: b }, { data: ub }]) => {
      setBadges((b ?? []) as Badge[]);
      setUserBadges((ub ?? []) as unknown as UserBadge[]);
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreate() {
    if (!newBadge.name.trim()) return;
    setSaving(true);
    const { data } = await supabase.from('badges').insert({
      name: newBadge.name.trim(),
      description: newBadge.description.trim() || null,
      icon_url: newBadge.icon_url.trim() || null,
      criteria_type: newBadge.criteria_type,
      criteria_value: newBadge.criteria_value,
    }).select().single() as { data: Badge | null };
    if (data) setBadges((prev) => [data, ...prev]);
    setNewBadge({ name: '', description: '', icon_url: '', criteria_type: 'hours', criteria_value: 50 });
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this badge?')) return;
    await supabase.from('badges').delete().eq('id', id);
    setBadges((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-2 rounded-xl w-fit">
        {(['badges', 'awarded'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === t ? 'bg-surface text-text-primary shadow-card' : 'text-text-muted hover:text-text-secondary'
            }`}>
            {t === 'badges' ? 'Badge Definitions' : 'Awarded Badges'}
          </button>
        ))}
      </div>

      {tab === 'badges' && (
        <div className="space-y-4">
          {/* Create new */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Create Badge</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Name</label>
                <input type="text" value={newBadge.name} onChange={(e) => setNewBadge((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. First 50 Hours"
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Description</label>
                <input type="text" value={newBadge.description} onChange={(e) => setNewBadge((p) => ({ ...p, description: e.target.value }))}
                  placeholder="What earns this badge?"
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Criteria Type</label>
                <select value={newBadge.criteria_type} onChange={(e) => setNewBadge((p) => ({ ...p, criteria_type: e.target.value }))}
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors">
                  <option value="hours">Total Hours</option>
                  <option value="streak">Day Streak</option>
                  <option value="posts">Post Count</option>
                  <option value="events">Events Attended</option>
                  <option value="manual">Manual Award</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Criteria Value</label>
                <input type="number" value={newBadge.criteria_value} onChange={(e) => setNewBadge((p) => ({ ...p, criteria_value: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors" />
              </div>
            </div>
            <button onClick={handleCreate} disabled={saving || !newBadge.name.trim()}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue hover:bg-blue/90 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors">
              <Plus className="w-4 h-4" />
              {saving ? 'Creating...' : 'Create Badge'}
            </button>
          </div>

          {/* Badge list */}
          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-text-muted text-sm">Loading...</div>
            ) : badges.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm">No badges defined yet.</div>
            ) : (
              <div className="divide-y divide-border">
                {badges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{badge.name}</p>
                      <p className="text-xs text-text-muted">{badge.criteria_type} ≥ {badge.criteria_value}</p>
                    </div>
                    <button onClick={() => handleDelete(badge.id)}
                      className="p-1.5 hover:bg-red/10 rounded-lg text-text-muted hover:text-red transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'awarded' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Gift className="w-4 h-4 text-gold" />
            <h3 className="text-sm font-semibold text-text-primary">Recently Awarded ({userBadges.length})</h3>
          </div>
          {userBadges.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">No badges awarded yet.</div>
          ) : (
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {userBadges.map((ub) => (
                <div key={ub.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {(ub.profiles as { name: string; email: string } | null)?.name ?? 'Unknown'}
                    </p>
                    <p className="text-xs text-text-muted">
                      {(ub.badges as { name: string } | null)?.name ?? 'Badge'} · {formatDate(ub.awarded_at)}
                    </p>
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
