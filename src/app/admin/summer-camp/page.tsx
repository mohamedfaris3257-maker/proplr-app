'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Pencil } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface Registration {
  id: string;
  name: string;
  email: string;
  child_name: string;
  age: number;
  status: string | null;
  notes: string | null;
  created_at: string;
}

export default function AdminSummerCampRoute() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<Registration | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  function openEdit(item: Registration) {
    setEditItem({ ...item });
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!editItem) return;
    setEditSaving(true);
    const supabase = createClient();
    const { id, created_at, ...updates } = editItem;
    await supabase.from('summer_camp_registrations').update(updates).eq('id', id);
    setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    setEditSaving(false);
    setEditOpen(false);
  }

  useEffect(() => {
    const fetchRegistrations = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('summer_camp_registrations')
        .select('*')
        .order('created_at', { ascending: false });
      setRegistrations(data ?? []);
      setLoading(false);
    };
    fetchRegistrations();
  }, []);

  return (
    <div style={{ maxWidth: 1100 }}>
      <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: '#071629', marginBottom: 4 }}>
        Summer Camp Registrations
      </h1>
      <p style={{ color: '#6e7591', marginBottom: 24, fontSize: 14 }}>Families registered for summer camp</p>
      {loading ? (
        <p style={{ color: '#6e7591' }}>Loading...</p>
      ) : registrations.length === 0 ? (
        <p style={{ color: '#6e7591' }}>No registrations yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Child Name</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Age</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '8px 12px', color: '#071629', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{r.name}</td>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{r.email}</td>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{r.child_name}</td>
                <td style={{ padding: '8px 12px', color: '#1a1a2e' }}>{r.age}</td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    backgroundColor: r.status === 'confirmed' ? 'rgba(34,197,94,0.1)' : r.status === 'cancelled' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)',
                    color: r.status === 'confirmed' ? '#22c55e' : r.status === 'cancelled' ? '#ef4444' : '#eab308',
                  }}>
                    {r.status ?? 'registered'}
                  </span>
                </td>
                <td style={{ padding: '8px 12px', color: '#6e7591' }}>
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <button
                    onClick={() => openEdit(r)}
                    style={{ padding: 6, borderRadius: 8, color: '#6e7591', background: 'none', border: 'none', cursor: 'pointer' }}
                    title="Edit registration"
                  >
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Registration" size="md">
        {editItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Parent Name</label>
                <input
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
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
                <label className="block text-xs font-medium text-text-muted mb-1">Child Name</label>
                <input
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  value={editItem.child_name}
                  onChange={(e) => setEditItem({ ...editItem, child_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Age</label>
                <input
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  type="number"
                  value={editItem.age}
                  onChange={(e) => setEditItem({ ...editItem, age: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-text-muted mb-1">Status</label>
                <select
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50"
                  value={editItem.status ?? 'registered'}
                  onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}
                >
                  <option value="registered">Registered</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
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
                placeholder="Add notes..."
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
