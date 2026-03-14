'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';

interface ShowcaseReg {
  id: string;
  school_name: string;
  contact_name: string;
  email: string;
  student_count: string | null;
  notes: string | null;
  status: string | null;
  created_at: string;
}

export function ShowcaseAdmin() {
  const [items, setItems] = useState<ShowcaseReg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ShowcaseReg | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('showcase_registrations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }: { data: ShowcaseReg[] | null }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    await supabase.from('showcase_registrations').update({ status }).eq('id', id);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  }

  const statusColor = (s: string | null) =>
    s === 'confirmed' ? 'bg-green/10 text-green' :
    s === 'rejected' ? 'bg-red/10 text-red' :
    'bg-gold/10 text-gold';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-text-muted text-sm">{items.length} registrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* List */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-text-muted text-sm">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">No registrations yet.</div>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
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
          <div className="card p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">{selected.school_name}</h3>
                <p className="text-xs text-text-muted">{selected.contact_name}</p>
                <p className="text-xs text-text-muted">{selected.email}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${statusColor(selected.status)}`}>
                {selected.status ?? 'new'}
              </span>
            </div>

            {selected.student_count && (
              <div>
                <p className="text-xs font-medium text-text-muted mb-0.5">Estimated Students</p>
                <p className="text-sm text-text-primary">{selected.student_count}</p>
              </div>
            )}
            {selected.notes && (
              <div>
                <p className="text-xs font-medium text-text-muted mb-0.5">Notes</p>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{selected.notes}</p>
              </div>
            )}
            <p className="text-xs text-text-muted">Submitted {formatDate(selected.created_at)}</p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => updateStatus(selected.id, 'confirmed')}
                disabled={selected.status === 'confirmed'}
                className="flex-1 py-2 bg-green/10 hover:bg-green/20 text-green text-sm font-semibold rounded-lg disabled:opacity-40 transition-colors"
              >
                Confirm
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
            Select a registration to view details
          </div>
        )}
      </div>
    </div>
  );
}
