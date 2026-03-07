'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PILLARS } from '@/lib/types';
import type { PortfolioItem, PillarName } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface AddProjectModalProps {
  userId: string;
  onClose: () => void;
  onSaved: (item: PortfolioItem) => void;
  editItem?: PortfolioItem;
}

export function AddProjectModal({ userId, onClose, onSaved, editItem }: AddProjectModalProps) {
  const [title, setTitle] = useState(editItem?.title ?? '');
  const [description, setDescription] = useState(editItem?.description ?? '');
  const [pillarTag, setPillarTag] = useState<PillarName | ''>(editItem?.pillar_tag ?? '');
  const [mediaUrl, setMediaUrl] = useState(editItem?.media_url ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    setError(null);
    setSaving(true);

    try {
      const supabase = createClient();
      const payload = {
        title: title.trim(),
        description: description.trim(),
        pillar_tag: pillarTag || null,
        media_url: mediaUrl.trim() || null,
      };

      if (editItem) {
        const { data, error: dbError } = await supabase
          .from('portfolio_items')
          .update(payload)
          .eq('id', editItem.id)
          .select()
          .single();

        if (dbError) throw dbError;
        onSaved(data as PortfolioItem);
      } else {
        const { data, error: dbError } = await supabase
          .from('portfolio_items')
          .insert({ ...payload, user_id: userId, is_pinned: false })
          .select()
          .single();

        if (dbError) throw dbError;
        onSaved(data as PortfolioItem);
      }

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={editItem ? 'Edit Project' : 'Add Project'}
      size="md"
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Title <span className="text-red">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. App I built at hackathon"
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Description <span className="text-red">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you built, your role, and the outcome..."
            rows={4}
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors resize-none"
          />
        </div>

        {/* Pillar tag */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Pillar Tag
          </label>
          <select
            value={pillarTag}
            onChange={(e) => setPillarTag(e.target.value as PillarName | '')}
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors appearance-none"
          >
            <option value="">Select pillar (optional)</option>
            {PILLARS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Media URL */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Media URL (image, YouTube, Vimeo link)
          </label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red bg-red/10 border border-red/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
            {editItem ? 'Save Changes' : 'Add Project'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
