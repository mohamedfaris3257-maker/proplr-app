'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PillarBadge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { PILLARS } from '@/lib/types';
import type { Event, PillarName, AudienceType } from '@/lib/types';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  online_link: string;
  pillar_tag: PillarName | '';
  event_type: string;
  audience: AudienceType;
  capacity: string;
  is_paid: boolean;
  price: string;
}

const defaultForm: EventFormData = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  online_link: '',
  pillar_tag: '',
  event_type: 'Workshop',
  audience: 'both',
  capacity: '',
  is_paid: false,
  price: '',
};

const EVENT_TYPES = ['Workshop', 'Webinar', 'Panel', 'Networking', 'Competition'];

export function EventsManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<EventFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const supabase = createClient();
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    setEvents(data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditingEvent(null);
    setForm(defaultForm);
    setModalOpen(true);
  }

  function openEdit(event: Event) {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location || '',
      online_link: event.online_link || '',
      pillar_tag: event.pillar_tag || '',
      event_type: event.event_type,
      audience: event.audience,
      capacity: event.capacity != null ? String(event.capacity) : '',
      is_paid: event.is_paid,
      price: event.price != null ? String(event.price) : '',
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingEvent(null);
    setForm(defaultForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    const payload = {
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      location: form.location || null,
      online_link: form.online_link || null,
      pillar_tag: form.pillar_tag || null,
      event_type: form.event_type,
      audience: form.audience,
      capacity: form.capacity ? parseInt(form.capacity) : null,
      spots_remaining: form.capacity ? parseInt(form.capacity) : null,
      is_paid: form.is_paid,
      price: form.is_paid && form.price ? parseFloat(form.price) : null,
    };

    if (editingEvent) {
      await supabase.from('events').update(payload).eq('id', editingEvent.id);
    } else {
      await supabase.from('events').insert({ ...payload, is_featured: false });
    }

    await fetchEvents();
    setSaving(false);
    closeModal();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from('events').delete().eq('id', id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeleteId(null);
  }

  async function toggleFeatured(event: Event) {
    const supabase = createClient();
    const newVal = !event.is_featured;
    await supabase.from('events').update({ is_featured: newVal }).eq('id', event.id);
    setEvents((prev) => prev.map((e) => e.id === event.id ? { ...e, is_featured: newVal } : e));
  }

  const inputClass = 'w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors';
  const labelClass = 'block text-xs font-medium text-text-secondary mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-text-primary">Events</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-text-muted text-sm">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="card p-8 text-center text-text-muted text-sm">No events yet.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Pillar</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Audience</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Capacity</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Spots</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Paid</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Featured</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-3 text-text-primary font-medium max-w-[180px] truncate">{event.title}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDate(event.date)}</td>
                    <td className="px-4 py-3">
                      {event.pillar_tag ? <PillarBadge pillar={event.pillar_tag} /> : <span className="text-text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        event.audience === 'school' ? 'bg-gold/10 text-gold' :
                        event.audience === 'uni' ? 'bg-blue/10 text-blue' :
                        'bg-teal/10 text-teal'
                      }`}>
                        {event.audience}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{event.capacity ?? '∞'}</td>
                    <td className="px-4 py-3 text-text-secondary">{event.spots_remaining ?? '∞'}</td>
                    <td className="px-4 py-3">
                      {event.is_paid ? (
                        <span className="text-xs text-green font-medium">AED {event.price}</span>
                      ) : (
                        <span className="text-xs text-text-muted">Free</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(event)}
                        className={`transition-colors ${event.is_featured ? 'text-gold' : 'text-text-muted hover:text-gold'}`}
                        title={event.is_featured ? 'Unfeature' : 'Feature'}
                      >
                        <Star className={`w-4 h-4 ${event.is_featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(event)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-blue hover:bg-blue/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(event.id)}
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
        title={editingEvent ? 'Edit Event' : 'Create Event'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Title *</label>
              <input
                className={inputClass}
                placeholder="Event title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Description *</label>
              <textarea
                className={`${inputClass} resize-none`}
                placeholder="Event description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Date *</label>
              <input
                type="date"
                className={inputClass}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Time *</label>
              <input
                type="time"
                className={inputClass}
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Location</label>
              <input
                className={inputClass}
                placeholder="Venue or address"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClass}>Online Link</label>
              <input
                className={inputClass}
                placeholder="https://..."
                value={form.online_link}
                onChange={(e) => setForm({ ...form, online_link: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClass}>Pillar</label>
              <select
                className={inputClass}
                value={form.pillar_tag}
                onChange={(e) => setForm({ ...form, pillar_tag: e.target.value as PillarName | '' })}
              >
                <option value="">No pillar</option>
                {PILLARS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Event Type</label>
              <select
                className={inputClass}
                value={form.event_type}
                onChange={(e) => setForm({ ...form, event_type: e.target.value })}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
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
              <label className={labelClass}>Capacity</label>
              <input
                type="number"
                min="1"
                className={inputClass}
                placeholder="Leave empty for unlimited"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.is_paid ? 'bg-gold' : 'bg-surface-2 border border-border'}`}
                  onClick={() => setForm({ ...form, is_paid: !form.is_paid })}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.is_paid ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-sm text-text-secondary">Paid Event</span>
              </label>
            </div>

            {form.is_paid && (
              <div>
                <label className={labelClass}>Price (AED)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="secondary" size="sm" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button size="sm" type="submit" loading={saving}>
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Event"
        size="sm"
      >
        <p className="text-sm text-text-secondary mb-4">
          Are you sure you want to delete this event? This action cannot be undone.
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
