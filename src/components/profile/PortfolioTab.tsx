'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Pin, Pencil, Trash2, Link2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PillarBadge } from '@/components/ui/Badge';
import { AddProjectModal } from '@/components/profile/AddProjectModal';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { PortfolioItem } from '@/lib/types';

interface PortfolioTabProps {
  userId: string;
  initialItems: PortfolioItem[];
  isOwner: boolean;
}

function isVideoUrl(url: string): boolean {
  return url.includes('youtube') || url.includes('vimeo');
}

function Toast({ message, type }: { message: string; type: 'error' | 'success' }) {
  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg border animate-slide-up',
        type === 'error'
          ? 'bg-red/10 border-red/30 text-red'
          : 'bg-green/10 border-green/30 text-green'
      )}
    >
      {message}
    </div>
  );
}

export function PortfolioTab({ userId, initialItems, isOwner }: PortfolioTabProps) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<PortfolioItem | undefined>(undefined);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function showToast(message: string, type: 'error' | 'success' = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

  const sortedItems = [...items].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleSaved = useCallback((saved: PortfolioItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === saved.id);
      if (exists) return prev.map((i) => (i.id === saved.id ? saved : i));
      return [saved, ...prev];
    });
    setEditItem(undefined);
  }, []);

  async function handleTogglePin(item: PortfolioItem) {
    if (!item.is_pinned) {
      const pinnedCount = items.filter((i) => i.is_pinned).length;
      if (pinnedCount >= 3) {
        showToast('You can pin a maximum of 3 projects.', 'error');
        return;
      }
    }

    setTogglingId(item.id);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('portfolio_items')
        .update({ is_pinned: !item.is_pinned })
        .eq('id', item.id)
        .select()
        .single();

      if (error) throw error;
      setItems((prev) => prev.map((i) => (i.id === item.id ? (data as PortfolioItem) : i)));
    } catch {
      showToast('Failed to update pin status.', 'error');
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast('Project deleted.');
    } catch {
      showToast('Failed to delete project.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {isOwner && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            {items.length} project{items.length !== 1 ? 's' : ''} &middot; {items.filter((i) => i.is_pinned).length}/3 pinned
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditItem(undefined);
              setShowAddModal(true);
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Project
          </Button>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="card p-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center">
            <Link2 className="w-5 h-5 text-text-muted" />
          </div>
          <p className="text-text-secondary text-sm">No portfolio projects yet.</p>
          {isOwner && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setEditItem(undefined);
                setShowAddModal(true);
              }}
            >
              Add your first project
            </Button>
          )}
        </div>
      )}

      {/* Grid */}
      {sortedItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                'card p-4 flex flex-col gap-3 transition-all duration-200',
                item.is_pinned && 'border-gold/40 shadow-[0_0_0_1px_rgba(232,168,56,0.25)]'
              )}
            >
              {/* Media thumbnail */}
              {item.media_url && (
                <div className="relative w-full h-36 rounded-lg overflow-hidden bg-surface-2 border border-border">
                  {isVideoUrl(item.media_url) ? (
                    <a
                      href={item.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2 hover:bg-surface-2/60 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                        <Link2 className="w-4 h-4 text-gold" />
                      </div>
                      <span className="text-xs text-text-muted">
                        {item.media_url.includes('youtube') ? 'YouTube' : 'Vimeo'} Video
                      </span>
                    </a>
                  ) : (
                    <Image
                      src={item.media_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start gap-2">
                  <h3 className="font-semibold text-text-primary text-sm flex-1 min-w-0 leading-snug">
                    {item.title}
                  </h3>
                  {item.is_pinned && (
                    <span className="text-[10px] font-semibold text-gold bg-gold/10 px-1.5 py-0.5 rounded-sm flex-shrink-0">
                      Pinned
                    </span>
                  )}
                </div>

                {item.pillar_tag && <PillarBadge pillar={item.pillar_tag} />}

                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Actions (owner only) */}
              {isOwner && (
                <div className="flex items-center gap-1.5 pt-1 border-t border-border">
                  {/* Pin toggle */}
                  <button
                    onClick={() => handleTogglePin(item)}
                    disabled={togglingId === item.id}
                    title={item.is_pinned ? 'Unpin' : 'Pin to top'}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors text-xs',
                      item.is_pinned
                        ? 'text-gold bg-gold/10 hover:bg-gold/20'
                        : 'text-text-muted hover:text-text-secondary hover:bg-surface-2'
                    )}
                  >
                    <Pin className="w-3.5 h-3.5" fill={item.is_pinned ? 'currentColor' : 'none'} />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditItem(item);
                      setShowAddModal(true);
                    }}
                    title="Edit"
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    title="Delete"
                    className="p-1.5 rounded-lg text-text-muted hover:text-red hover:bg-red/10 transition-colors ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      {showAddModal && (
        <AddProjectModal
          userId={userId}
          onClose={() => {
            setShowAddModal(false);
            setEditItem(undefined);
          }}
          onSaved={handleSaved}
          editItem={editItem}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
