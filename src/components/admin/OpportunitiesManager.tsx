'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { PILLARS } from '@/lib/types';
import type { Opportunity, PillarName, AudienceType, OpportunityType } from '@/lib/types';

interface OpportunityFormData {
  title: string;
  company: string;
  description: string;
  type: OpportunityType;
  pillar_tags: PillarName[];
  audience: AudienceType;
  deadline: string;
  is_active: boolean;
  external_url: string;
}

const defaultForm: OpportunityFormData = {
  title: '',
  company: '',
  description: '',
  type: 'internship',
  pillar_tags: [],
  audience: 'both',
  deadline: '',
  is_active: true,
  external_url: '',
};

const OPPORTUNITY_TYPES: { value: OpportunityType; label: string }[] = [
  { value: 'internship', label: 'Internship' },
  { value: 'job', label: 'Job' },
  { value: 'challenge', label: 'Challenge' },
  { value: 'job_shadowing', label: 'Job Shadowing' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'micro_placement', label: 'Micro Placement' },
];

export function OpportunitiesManager() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [form, setForm] = useState<OpportunityFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    const supabase = createClient();
    const { data } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });
    setOpportunities(data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditingOpp(null);
    setForm(defaultForm);
    setModalOpen(true);
  }

  function openEdit(opp: Opportunity) {
    setEditingOpp(opp);
    setForm({
      title: opp.title,
      company: opp.company,
      description: opp.description,
      type: opp.type,
      pillar_tags: opp.pillar_tags || [],
      audience: opp.audience,
      deadline: opp.deadline || '',
      is_active: opp.is_active,
      external_url: opp.external_url || '',
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingOpp(null);
    setForm(defaultForm);
  }

  function togglePillar(pillar: PillarName) {
    setForm((prev) => ({
      ...prev,
      pillar_tags: prev.pillar_tags.includes(pillar)
        ? prev.pillar_tags.filter((p) => p !== pillar)
        : [...prev.pillar_tags, pillar],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    const payload = {
      title: form.title,
      company: form.company,
      description: form.description,
      type: form.type,
      pillar_tags: form.pillar_tags,
      audience: form.audience,
      deadline: form.deadline || null,
      is_active: form.is_active,
      external_url: form.external_url.trim() || null,
    };

    if (editingOpp) {
      await supabase.from('opportunities').update(payload).eq('id', editingOpp.id);
    } else {
      await supabase.from('opportunities').insert(payload);
    }

    await fetchOpportunities();
    setSaving(false);
    closeModal();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from('opportunities').delete().eq('id', id);
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
    setDeleteId(null);
  }

  const inputClass = 'w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors';
  const labelClass = 'block text-xs font-medium text-text-secondary mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-text-primary">Opportunities</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Create Opportunity
        </Button>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-text-muted text-sm">Loading opportunities...</div>
      ) : opportunities.length === 0 ? (
        <div className="card p-8 text-center text-text-muted text-sm">No opportunities yet.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Company</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Audience</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Deadline</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Active</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">URL</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-3 text-text-primary font-medium max-w-[160px] truncate">{opp.title}</td>
                    <td className="px-4 py-3 text-text-secondary max-w-[120px] truncate">{opp.company}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-2 text-text-secondary border border-border capitalize">
                        {opp.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        opp.audience === 'school' ? 'bg-gold/10 text-gold' :
                        opp.audience === 'uni' ? 'bg-blue/10 text-blue' :
                        'bg-teal/10 text-teal'
                      }`}>
                        {opp.audience}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      {opp.deadline ? formatDate(opp.deadline) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${opp.is_active ? 'text-green' : 'text-text-muted'}`}>
                        {opp.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[140px] truncate">
                      {opp.external_url ? (
                        <a
                          href={opp.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue hover:underline"
                        >
                          {opp.external_url}
                        </a>
                      ) : (
                        <span className="text-xs text-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(opp)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-blue hover:bg-blue/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(opp.id)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-red hover:bg-red/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingOpp ? 'Edit Opportunity' : 'Create Opportunity'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                className={inputClass}
                placeholder="Opportunity title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Company *</label>
              <input
                className={inputClass}
                placeholder="Company name"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Description *</label>
              <textarea
                className={`${inputClass} resize-none`}
                placeholder="Opportunity description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Type</label>
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as OpportunityType })}
              >
                {OPPORTUNITY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Audience</label>
              <select
                className={inputClass}
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value as AudienceType })}
              >
                <option value="both">Both</option>
                <option value="school">School</option>
                <option value="uni">University</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Deadline</label>
              <input
                type="date"
                className={inputClass}
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>External URL</label>
              <input
                type="url"
                className={inputClass}
                placeholder="https://example.com/apply"
                value={form.external_url}
                onChange={(e) => setForm({ ...form, external_url: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-3 pt-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.is_active ? 'bg-green' : 'bg-surface-2 border border-border'}`}
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.is_active ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-sm text-text-secondary">Active</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Pillar Tags</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {PILLARS.map((pillar) => (
                  <button
                    key={pillar}
                    type="button"
                    onClick={() => togglePillar(pillar)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      form.pillar_tags.includes(pillar)
                        ? 'bg-blue/10 text-blue border-blue/40'
                        : 'border-border text-text-muted hover:border-blue/40 hover:text-blue'
                    }`}
                  >
                    {pillar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="secondary" size="sm" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button size="sm" type="submit" loading={saving}>
              {editingOpp ? 'Save Changes' : 'Create Opportunity'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Opportunity"
        size="sm"
      >
        <p className="text-sm text-text-secondary mb-4">
          Are you sure you want to delete this opportunity? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={() => deleteId && handleDelete(deleteId)}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
