'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Tag,
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PricingPlan {
  id: string;
  name: string;
  description: string | null;
  price_aed: number;
  billing_type: 'flat' | 'monthly';
  duration_months: number | null;
  features: string[];
  stripe_price_id: string | null;
  is_active: boolean;
  sort_order: number | null;
  created_at: string;
}

interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  usage_count: number;
  usage_limit: number | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

// ─── Plan Edit Form State ─────────────────────────────────────────────────────

interface PlanFormState {
  name: string;
  description: string;
  price_aed: string;
  billing_type: 'flat' | 'monthly';
  duration_months: string;
  features: string;
  stripe_price_id: string;
  is_active: boolean;
}

const defaultPlanForm: PlanFormState = {
  name: '',
  description: '',
  price_aed: '',
  billing_type: 'flat',
  duration_months: '',
  features: '',
  stripe_price_id: '',
  is_active: true,
};

// ─── Promo Code Form State ────────────────────────────────────────────────────

interface PromoFormState {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  usage_limit: string;
  expires_at: string;
  is_active: boolean;
}

const defaultPromoForm: PromoFormState = {
  code: '',
  discount_type: 'percentage',
  discount_value: '',
  usage_limit: '',
  expires_at: '',
  is_active: true,
};

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = 'plans' | 'promo_codes';

export function PricingManager() {
  const [tab, setTab] = useState<Tab>('plans');
  const supabase = createClient();

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-surface-2 rounded-xl mb-6 w-fit">
        {(['plans', 'promo_codes'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === t
                ? 'bg-surface text-text-primary shadow-card'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {t === 'plans' ? 'Plans' : 'Promo Codes'}
          </button>
        ))}
      </div>

      {tab === 'plans' && <PlansTab supabase={supabase} />}
      {tab === 'promo_codes' && <PromoCodesTab supabase={supabase} />}
    </div>
  );
}

// ─── Plans Tab ────────────────────────────────────────────────────────────────

function PlansTab({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPlan, setEditPlan] = useState<PricingPlan | null>(null);
  const [form, setForm] = useState<PlanFormState>(defaultPlanForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pricing_plans')
      .select('*')
      .order('sort_order', { ascending: true });
    setPlans((data as PricingPlan[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);

  function openEdit(plan: PricingPlan) {
    setEditPlan(plan);
    setForm({
      name: plan.name,
      description: plan.description || '',
      price_aed: String(plan.price_aed),
      billing_type: plan.billing_type,
      duration_months: plan.duration_months != null ? String(plan.duration_months) : '',
      features: (plan.features || []).join('\n'),
      stripe_price_id: plan.stripe_price_id || '',
      is_active: plan.is_active,
    });
    setSaveError('');
  }

  function closeEdit() {
    setEditPlan(null);
    setForm(defaultPlanForm);
    setSaveError('');
  }

  async function handleSave() {
    if (!editPlan) return;
    setSaving(true);
    setSaveError('');

    const price = parseFloat(form.price_aed);
    if (isNaN(price) || price < 0) {
      setSaveError('Price must be a valid positive number.');
      setSaving(false);
      return;
    }

    const featuresArray = form.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from('pricing_plans')
      .update({
        name: form.name.trim(),
        description: form.description.trim() || null,
        price_aed: price,
        billing_type: form.billing_type,
        duration_months: form.duration_months ? parseInt(form.duration_months, 10) : null,
        features: featuresArray,
        stripe_price_id: form.stripe_price_id.trim() || null,
        is_active: form.is_active,
      })
      .eq('id', editPlan.id);

    if (error) {
      setSaveError(error.message);
    } else {
      closeEdit();
      void fetchPlans();
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Pricing Plans</h3>
        <button
          onClick={() => void fetchPlans()}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="card p-8 text-center">
          <Tag className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-text-muted text-sm">No pricing plans found in the database.</p>
          <p className="text-text-muted text-xs mt-1">
            Insert rows into the <code className="text-blue">pricing_plans</code> table to manage them here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="card p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-text-primary">{plan.name}</p>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                      plan.is_active
                        ? 'bg-green/10 text-green'
                        : 'bg-red/10 text-red'
                    }`}
                  >
                    {plan.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  AED {Number(plan.price_aed).toLocaleString()} ·{' '}
                  {plan.billing_type === 'monthly'
                    ? `Monthly × ${plan.duration_months ?? '?'}mo`
                    : 'Flat fee'}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openEdit(plan)}
                className="flex-shrink-0"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        open={editPlan !== null}
        onClose={closeEdit}
        title={`Edit Plan: ${editPlan?.name ?? ''}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Plan Name">
              <input
                type="text"
                className="input-field text-sm"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Foundation"
              />
            </Field>
            <Field label="Price (AED)">
              <input
                type="number"
                min={0}
                step={0.01}
                className="input-field text-sm"
                value={form.price_aed}
                onChange={(e) => setForm((p) => ({ ...p, price_aed: e.target.value }))}
                placeholder="e.g. 400"
              />
            </Field>
          </div>

          <Field label="Description">
            <input
              type="text"
              className="input-field text-sm"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Short plan description"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Billing Type">
              <select
                className="input-field text-sm"
                value={form.billing_type}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    billing_type: e.target.value as 'flat' | 'monthly',
                  }))
                }
              >
                <option value="flat">Flat (one-time)</option>
                <option value="monthly">Monthly</option>
              </select>
            </Field>
            <Field label="Duration (months)">
              <input
                type="number"
                min={1}
                className="input-field text-sm"
                value={form.duration_months}
                onChange={(e) =>
                  setForm((p) => ({ ...p, duration_months: e.target.value }))
                }
                placeholder="e.g. 8 (leave blank for flat)"
                disabled={form.billing_type === 'flat'}
              />
            </Field>
          </div>

          <Field label="Features (one per line)">
            <textarea
              className="input-field text-sm resize-none"
              rows={6}
              value={form.features}
              onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))}
              placeholder={`Access to all 6 pillar modules\nEvent attendance & RSVP\nPortfolio builder`}
            />
          </Field>

          <Field label="Stripe Price ID (optional)">
            <input
              type="text"
              className="input-field text-sm font-mono"
              value={form.stripe_price_id}
              onChange={(e) =>
                setForm((p) => ({ ...p, stripe_price_id: e.target.value }))
              }
              placeholder="price_xxxxxxxxxxxxxxxxxxxx"
            />
          </Field>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, is_active: !p.is_active }))}
              className="flex items-center gap-2 text-sm"
            >
              {form.is_active ? (
                <ToggleRight className="w-6 h-6 text-green" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-text-muted" />
              )}
              <span className={form.is_active ? 'text-green' : 'text-text-muted'}>
                {form.is_active ? 'Active' : 'Inactive'}
              </span>
            </button>
          </div>

          {saveError && (
            <div className="flex items-center gap-2 bg-red/10 border border-red/20 rounded-lg px-3 py-2">
              <XCircle className="w-4 h-4 text-red flex-shrink-0" />
              <p className="text-sm text-red">{saveError}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={closeEdit}>
              Cancel
            </Button>
            <Button size="sm" loading={saving} onClick={() => void handleSave()}>
              <CheckCircle2 className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// ─── Promo Codes Tab ──────────────────────────────────────────────────────────

function PromoCodesTab({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<PromoFormState>({ ...defaultPromoForm, code: randomCode() });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });
    setCodes((data as PromoCode[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchCodes();
  }, [fetchCodes]);

  function openCreate() {
    setForm({ ...defaultPromoForm, code: randomCode() });
    setSaveError('');
    setCreateOpen(true);
  }

  function closeCreate() {
    setCreateOpen(false);
    setSaveError('');
  }

  async function handleCreate() {
    setSaving(true);
    setSaveError('');

    const codeVal = form.code.trim().toUpperCase();
    if (!codeVal) {
      setSaveError('Code is required.');
      setSaving(false);
      return;
    }
    const discountVal = parseFloat(form.discount_value);
    if (isNaN(discountVal) || discountVal <= 0) {
      setSaveError('Discount value must be a positive number.');
      setSaving(false);
      return;
    }
    if (form.discount_type === 'percentage' && discountVal > 100) {
      setSaveError('Percentage discount cannot exceed 100.');
      setSaving(false);
      return;
    }

    const { error } = await supabase.from('promo_codes').insert({
      code: codeVal,
      discount_type: form.discount_type,
      discount_value: discountVal,
      usage_limit: form.usage_limit ? parseInt(form.usage_limit, 10) : null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
      usage_count: 0,
    });

    if (error) {
      setSaveError(error.message);
    } else {
      closeCreate();
      void fetchCodes();
    }
    setSaving(false);
  }

  async function handleDeactivate(id: string) {
    setTogglingId(id);
    await supabase.from('promo_codes').update({ is_active: false }).eq('id', id);
    setCodes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: false } : c))
    );
    setTogglingId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Promo Codes{' '}
          <span className="text-text-muted font-normal">({codes.length})</span>
        </h3>
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Create Code
        </Button>
      </div>

      {codes.length === 0 ? (
        <div className="card p-8 text-center">
          <Tag className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-text-muted text-sm">No promo codes yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Code</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Discount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden sm:table-cell">
                  Usage
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden md:table-cell">
                  Expires
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {codes.map((c) => (
                <tr key={c.id} className="hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-text-primary">
                    {c.code}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">
                    {c.discount_type === 'percentage'
                      ? `${c.discount_value}%`
                      : `AED ${c.discount_value}`}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted hidden sm:table-cell">
                    {c.usage_count}
                    {c.usage_limit != null ? ` / ${c.usage_limit}` : ''}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-muted hidden md:table-cell">
                    {c.expires_at ? formatDate(c.expires_at) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                        c.is_active ? 'bg-green/10 text-green' : 'bg-red/10 text-red'
                      }`}
                    >
                      {c.is_active ? 'ACTIVE' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.is_active && (
                      <button
                        onClick={() => void handleDeactivate(c.id)}
                        disabled={togglingId === c.id}
                        className="text-xs text-red hover:underline disabled:opacity-50"
                      >
                        {togglingId === c.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          'Deactivate'
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={closeCreate}
        title="Create Promo Code"
        size="md"
      >
        <div className="space-y-4">
          <Field label="Code (auto-generated if left empty)">
            <div className="flex gap-2">
              <input
                type="text"
                className="input-field text-sm font-mono tracking-widest uppercase flex-1"
                value={form.code}
                maxLength={24}
                onChange={(e) =>
                  setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                }
                placeholder="e.g. PROPLR20"
              />
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, code: randomCode() }))}
                className="px-3 py-2 rounded-lg bg-surface-2 border border-border text-text-muted hover:text-text-primary hover:border-blue transition-colors text-xs"
                title="Generate random code"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Discount Type">
              <select
                className="input-field text-sm"
                value={form.discount_type}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    discount_type: e.target.value as 'percentage' | 'fixed',
                  }))
                }
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (AED)</option>
              </select>
            </Field>
            <Field label="Discount Value">
              <input
                type="number"
                min={0}
                step={0.01}
                className="input-field text-sm"
                value={form.discount_value}
                onChange={(e) =>
                  setForm((p) => ({ ...p, discount_value: e.target.value }))
                }
                placeholder={form.discount_type === 'percentage' ? '20' : '50'}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Usage Limit (blank = unlimited)">
              <input
                type="number"
                min={1}
                className="input-field text-sm"
                value={form.usage_limit}
                onChange={(e) =>
                  setForm((p) => ({ ...p, usage_limit: e.target.value }))
                }
                placeholder="e.g. 50"
              />
            </Field>
            <Field label="Expires At (optional)">
              <input
                type="date"
                className="input-field text-sm"
                value={form.expires_at}
                onChange={(e) =>
                  setForm((p) => ({ ...p, expires_at: e.target.value }))
                }
              />
            </Field>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, is_active: !p.is_active }))}
              className="flex items-center gap-2 text-sm"
            >
              {form.is_active ? (
                <ToggleRight className="w-6 h-6 text-green" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-text-muted" />
              )}
              <span className={form.is_active ? 'text-green' : 'text-text-muted'}>
                {form.is_active ? 'Active on creation' : 'Inactive'}
              </span>
            </button>
          </div>

          {saveError && (
            <div className="flex items-center gap-2 bg-red/10 border border-red/20 rounded-lg px-3 py-2">
              <XCircle className="w-4 h-4 text-red flex-shrink-0" />
              <p className="text-sm text-red">{saveError}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={closeCreate}>
              Cancel
            </Button>
            <Button size="sm" loading={saving} onClick={() => void handleCreate()}>
              <Plus className="w-4 h-4" />
              Create Code
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// ─── Shared Field ─────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
