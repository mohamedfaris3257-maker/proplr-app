'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';

type AppType = 'partner' | 'mentor' | 'innovation' | 'summer_camp' | 'job_posting';

interface ApplicationBase {
  id: string;
  created_at: string;
  status: string;
  full_name?: string;
  name?: string;
  email: string;
  organization?: string;
  company_name?: string;
  title?: string;
  description?: string;
  message?: string;
}

const APP_TYPES: { id: AppType; label: string; table: string }[] = [
  { id: 'partner', label: 'Partner Applications', table: 'partner_applications' },
  { id: 'mentor', label: 'Mentor Applications', table: 'mentor_applications' },
  { id: 'innovation', label: 'Innovation Submissions', table: 'innovation_applications' },
  { id: 'summer_camp', label: 'Summer Camp', table: 'summer_camp_registrations' },
  { id: 'job_posting', label: 'Job Postings', table: 'job_postings' },
];

export function ExternalApplicationsManager() {
  const [activeType, setActiveType] = useState<AppType>('partner');
  const [items, setItems] = useState<ApplicationBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ApplicationBase | null>(null);

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    const tableConf = APP_TYPES.find((t) => t.id === activeType)!;
    const supabase = createClient();
    supabase
      .from(tableConf.table)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }: { data: ApplicationBase[] | null }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, [activeType]);

  async function updateStatus(id: string, status: string) {
    const tableConf = APP_TYPES.find((t) => t.id === activeType)!;
    const supabase = createClient();
    await supabase.from(tableConf.table).update({ status }).eq('id', id);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  }

  const displayName = (item: ApplicationBase) =>
    item.full_name ?? item.name ?? item.title ?? item.email;

  return (
    <div className="space-y-4">
      {/* Type tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-surface-2 rounded-xl w-fit">
        {APP_TYPES.map((t) => (
          <button key={t.id} onClick={() => setActiveType(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeType === t.id ? 'bg-surface text-text-primary shadow-card' : 'text-text-muted hover:text-text-secondary'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* List */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-text-muted text-sm">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-sm">No submissions yet.</div>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {items.map((item) => (
                <button key={item.id} onClick={() => setSelected(item)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-2 transition-colors ${selected?.id === item.id ? 'bg-blue/5' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{displayName(item)}</p>
                    <p className="text-xs text-text-muted truncate">{item.email}</p>
                    <p className="text-xs text-text-muted">{formatDate(item.created_at)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                    item.status === 'approved' ? 'bg-green/10 text-green' :
                    item.status === 'rejected' ? 'bg-red/10 text-red' :
                    'bg-gold/10 text-gold'
                  }`}>
                    {item.status ?? 'pending'}
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
                <h3 className="text-sm font-semibold text-text-primary">{displayName(selected)}</h3>
                <p className="text-xs text-text-muted">{selected.email}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                selected.status === 'approved' ? 'bg-green/10 text-green' :
                selected.status === 'rejected' ? 'bg-red/10 text-red' :
                'bg-gold/10 text-gold'
              }`}>
                {selected.status ?? 'pending'}
              </span>
            </div>

            {selected.organization && (
              <div>
                <p className="text-xs font-medium text-text-muted mb-0.5">Organization</p>
                <p className="text-sm text-text-primary">{selected.organization}</p>
              </div>
            )}
            {selected.company_name && (
              <div>
                <p className="text-xs font-medium text-text-muted mb-0.5">Company</p>
                <p className="text-sm text-text-primary">{selected.company_name}</p>
              </div>
            )}
            {(selected.description ?? selected.message) && (
              <div>
                <p className="text-xs font-medium text-text-muted mb-0.5">Message</p>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {selected.description ?? selected.message}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button onClick={() => updateStatus(selected.id, 'approved')}
                disabled={selected.status === 'approved'}
                className="flex-1 py-2 bg-green/10 hover:bg-green/20 text-green text-sm font-semibold rounded-lg disabled:opacity-40 transition-colors">
                Approve
              </button>
              <button onClick={() => updateStatus(selected.id, 'rejected')}
                disabled={selected.status === 'rejected'}
                className="flex-1 py-2 bg-red/10 hover:bg-red/20 text-red text-sm font-semibold rounded-lg disabled:opacity-40 transition-colors">
                Reject
              </button>
            </div>
          </div>
        ) : (
          <div className="card p-8 flex items-center justify-center text-text-muted text-sm">
            Select an application to view details
          </div>
        )}
      </div>
    </div>
  );
}
