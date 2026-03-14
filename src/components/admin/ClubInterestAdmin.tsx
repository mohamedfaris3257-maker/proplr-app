'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ClubInterest {
  id: string;
  school_name: string;
  contact_name: string;
  role: string | null;
  email: string;
  phone: string | null;
  grade_range: string | null;
  estimated_students: string | null;
  start_timeframe: string | null;
  how_heard: string | null;
  notes: string | null;
  status: string | null;
  created_at: string;
}

export function ClubInterestAdmin() {
  const [items, setItems] = useState<ClubInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ClubInterest | null>(null);
  const [note, setNote] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<ClubInterest | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('club_interest_forms')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }: { data: ClubInterest[] | null }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    await supabase.from('club_interest_forms').update({ status }).eq('id', id);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  }

  async function saveNote(id: string) {
    const supabase = createClient();
    await supabase.from('club_interest_forms').update({ notes: note }).eq('id', id);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, notes: note } : i));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, notes: note } : null);
  }

  function selectItem(item: ClubInterest) {
    setSelected(item);
    setNote(item.notes ?? '');
  }

  function openEdit(item: ClubInterest) {
    setEditItem({ ...item });
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!editItem) return;
    setEditSaving(true);
    const supabase = createClient();
    const { id, created_at, ...updates } = editItem;
    await supabase.from('club_interest_forms').update(updates).eq('id', id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, ...updates } : null));
      setNote(updates.notes ?? '');
    }
    setEditSaving(false);
    setEditOpen(false);
  }

  const statusColor = (s: string | null) =>
    s === 'contacted' ? 'bg-green/10 text-green' :
    s === 'rejected' ? 'bg-red/10 text-red' :
    'bg-gold/10 text-gold';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-text-muted text-sm">{items.length} submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* List */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-text-muted text-sm">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">No submissions yet.</div>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectItem(item)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-2 transition-colors ${selected?.id === item.id ? 'bg-blue/5' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{item.school_name}</p>
                    <p className="text-xs text-text-muted truncate">{item.contact_name} · {item.email}</p>
                    <p className="text-xs text-text-muted">{formatDate(item.created_at)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${statusColor(item.status)}`}>
                    {item.status ?? 'new'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="card p-5 space-y-4 overflow-y-auto max-h-[600px]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">{selected.school_name}</h3>
                <p className="text-xs text-text-muted">{selected.contact_name} · {selected.role}</p>
                <p className="text-xs text-text-muted">{selected.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(selected)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-blue hover:bg-blue/10 transition-colors"
                  title="Edit submission"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor(selected.status)}`}>
                  {selected.status ?? 'new'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {selected.phone && (
                <div>
                  <p className="text-text-muted mb-0.5">Phone</p>
                  <p className="text-text-primary font-medium">{selected.phone}</p>
                </div>
              )}
              {selected.grade_range && (
                <div>
                  <p className="text-text-muted mb-0.5">Grade Range</p>
                  <p className="text-text-primary font-medium">{selected.grade_range}</p>
                </div>
              )}
              {selected.estimated_students && (
                <div>
                  <p className="text-text-muted mb-0.5">Est. Students</p>
                  <p className="text-text-primary font-medium">{selected.estimated_students}</p>
                </div>
              )}
              {selected.start_timeframe && (
                <div>
                  <p className="text-text-muted mb-0.5">Start Timeframe</p>
                  <p className="text-text-primary font-medium">{selected.start_timeframe}</p>
                </div>
              )}
              {selected.how_heard && (
                <div className="col-span-2">
                  <p className="text-text-muted mb-0.5">How Heard</p>
                  <p className="text-text-primary font-medium">{selected.how_heard}</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <p className="text-xs font-medium text-text-muted mb-1">Internal Notes</p>
              <textarea
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary resize-none focus:outline-none focus:ring-1 focus:ring-blue/50"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add internal notes…"
              />
              <button
                onClick={() => saveNote(selected.id)}
                className="mt-1 text-xs font-semibold text-blue hover:text-blue/80 transition-colors"
              >
                Save note
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => updateStatus(selected.id, 'contacted')}
                disabled={selected.status === 'contacted'}
                className="flex-1 py-2 bg-green/10 hover:bg-green/20 text-green text-sm font-semibold rounded-lg disabled:opacity-40 transition-colors"
              >
                Mark Contacted
              </button>
              <button
                onClick={() => updateStatus(selected.id, 'rejected')}
                disabled={selected.status === 'rejected'}
                className="flex-1 py-2 bg-red/10 hover:bg-red/20 text-red text-sm font-semibold rounded-lg disabled:opacity-40 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-8 flex items-center justify-center text-text-muted text-sm">
            Select a submission to view details
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Submission" size="lg">
        {editItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">School Name</label>
                <input
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  value={editItem.school_name}
                  onChange={(e) => setEditItem({ ...editItem, school_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Contact Name</label>
                <input
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  value={editItem.contact_name}
                  onChange={(e) => setEditItem({ ...editItem, contact_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Contact Role</label>
                <input
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  value={editItem.role ?? ''}
                  onChange={(e) => setEditItem({ ...editItem, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Email</label>
                <input
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  type="email"
                  value={editItem.email}
                  onChange={(e) => setEditItem({ ...editItem, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Phone</label>
                <input
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  value={editItem.phone ?? ''}
                  onChange={(e) => setEditItem({ ...editItem, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Grade Range</label>
                <input
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  value={editItem.grade_range ?? ''}
                  onChange={(e) => setEditItem({ ...editItem, grade_range: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Estimated Students</label>
                <input
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  value={editItem.estimated_students ?? ''}
                  onChange={(e) => setEditItem({ ...editItem, estimated_students: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Start Timeframe</label>
                <input
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  value={editItem.start_timeframe ?? ''}
                  onChange={(e) => setEditItem({ ...editItem, start_timeframe: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Referral Source</label>
                <input
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  value={editItem.how_heard ?? ''}
                  onChange={(e) => setEditItem({ ...editItem, how_heard: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Status</label>
                <select
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  value={editItem.status ?? 'new'}
                  onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="converted">Converted</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Notes</label>
              <textarea
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary resize-none focus:outline-none focus:ring-1 focus:ring-blue/50"
                rows={3}
                value={editItem.notes ?? ''}
                onChange={(e) => setEditItem({ ...editItem, notes: e.target.value })}
                placeholder="Add internal notes..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" loading={editSaving} onClick={saveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
