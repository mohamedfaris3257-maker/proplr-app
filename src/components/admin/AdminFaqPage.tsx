'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order_index: number;
  is_published: boolean;
}

type Mode = 'list' | 'edit';

export function AdminFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('list');
  const [editing, setEditing] = useState<Partial<Faq> | null>(null);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true })
      .then(({ data }: { data: Faq[] | null }) => {
        setFaqs(data ?? []);
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleNew() {
    setEditing({ question: '', answer: '', category: '', is_published: true, order_index: faqs.length });
    setMode('edit');
  }

  function handleEdit(faq: Faq) {
    setEditing({ ...faq });
    setMode('edit');
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    const payload = {
      question: editing.question?.trim() ?? '',
      answer: editing.answer?.trim() ?? '',
      category: editing.category?.trim() || null,
      is_published: editing.is_published ?? true,
      order_index: editing.order_index ?? 0,
    };

    if (editing.id) {
      const { data } = await supabase.from('faqs').update(payload).eq('id', editing.id).select().single() as { data: Faq | null };
      if (data) setFaqs((prev) => prev.map((f) => f.id === data.id ? data : f));
    } else {
      const { data } = await supabase.from('faqs').insert(payload).select().single() as { data: Faq | null };
      if (data) setFaqs((prev) => [...prev, data]);
    }
    setSaving(false);
    setMode('list');
    setEditing(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return;
    await supabase.from('faqs').delete().eq('id', id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  if (mode === 'edit' && editing !== null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">{editing.id ? 'Edit FAQ' : 'New FAQ'}</h2>
          <div className="flex gap-2">
            <button onClick={() => { setMode('list'); setEditing(null); }}
              className="px-3 py-1.5 bg-surface-2 hover:bg-border text-text-secondary text-sm rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !editing.question?.trim() || !editing.answer?.trim()}
              className="px-4 py-1.5 bg-blue hover:bg-blue/90 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Question</label>
            <input type="text" value={editing.question ?? ''} onChange={(e) => setEditing((p) => ({ ...p, question: e.target.value }))}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Answer</label>
            <textarea value={editing.answer ?? ''} onChange={(e) => setEditing((p) => ({ ...p, answer: e.target.value }))}
              rows={6} className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors resize-y" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Category (optional)</label>
              <input type="text" value={editing.category ?? ''} onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value }))}
                placeholder="e.g. General, Registration..."
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Order Index</label>
              <input type="number" value={editing.order_index ?? 0} onChange={(e) => setEditing((p) => ({ ...p, order_index: parseInt(e.target.value) || 0 }))}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={editing.is_published ?? true} onChange={(e) => setEditing((p) => ({ ...p, is_published: e.target.checked }))}
              className="w-4 h-4 rounded border-border" />
            <span className="text-sm text-text-secondary">Published</span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">FAQ Management</h1>
        <button onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue hover:bg-blue/90 text-white text-sm font-semibold rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          New FAQ
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-muted text-sm">Loading...</div>
        ) : faqs.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">No FAQs yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {faqs.map((faq) => (
              <div key={faq.id}>
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors cursor-pointer"
                  onClick={() => toggleExpand(faq.id)}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{faq.question}</p>
                    {faq.category && <p className="text-xs text-text-muted">{faq.category}</p>}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    faq.is_published ? 'bg-green/10 text-green' : 'bg-surface-2 text-text-muted'
                  }`}>
                    {faq.is_published ? 'Published' : 'Draft'}
                  </span>
                  <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleEdit(faq)}
                      className="p-1.5 hover:bg-surface-2 rounded-lg text-text-muted hover:text-blue transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(faq.id)}
                      className="p-1.5 hover:bg-red/10 rounded-lg text-text-muted hover:text-red transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {expanded.has(faq.id) ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                </div>
                {expanded.has(faq.id) && (
                  <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed bg-surface-2/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
