'use client';

import { useState } from 'react';
import { ChevronDown, Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PILLARS, type PillarName } from '@/lib/types';

interface PostComposerProps {
  currentUserId: string;
}

export function PostComposer({ currentUserId }: PostComposerProps) {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [pillar, setPillar] = useState<PillarName | ''>('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExpand = () => {
    setExpanded(true);
  };

  const handlePost = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    setPosting(true);
    setError(null);

    const supabase = createClient();

    const { error: insertError } = await supabase.from('posts').insert({
      user_id: currentUserId,
      content: trimmed,
      pillar_tag: pillar || null,
      likes_count: 0,
      is_pinned: false,
      comment_count: 0,
    });

    if (insertError) {
      setError('Failed to post. Please try again.');
      setPosting(false);
      return;
    }

    setContent('');
    setPillar('');
    setExpanded(false);
    setPosting(false);

    window.location.reload();
  };

  const handleCancel = () => {
    setContent('');
    setPillar('');
    setExpanded(false);
    setError(null);
  };

  return (
    <div className="card p-4 transition-all duration-200">
      {!expanded ? (
        /* Collapsed state — prompt button */
        <button
          onClick={handleExpand}
          className="w-full text-left flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-full bg-[#E8A838]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[#E8A838] text-sm font-bold">✦</span>
          </div>
          <span className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-muted group-hover:border-[#4A90D9] group-hover:text-text-secondary transition-colors cursor-text">
            Share what you&apos;re working on...
          </span>
        </button>
      ) : (
        /* Expanded state — composer */
        <div className="space-y-3">
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share what you're working on..."
            rows={4}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[#4A90D9] transition-colors resize-none"
          />

          {/* Bottom row: pillar selector + actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Pillar tag dropdown */}
            <div className="relative flex-shrink-0">
              <select
                value={pillar}
                onChange={(e) => setPillar(e.target.value as PillarName | '')}
                className="appearance-none bg-surface-2 border border-border rounded-lg pl-3 pr-7 py-1.5 text-xs text-text-secondary focus:outline-none focus:border-[#E8A838] transition-colors cursor-pointer"
              >
                <option value="">No pillar tag</option>
                {PILLARS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted pointer-events-none" />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Cancel */}
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
            >
              Cancel
            </button>

            {/* Post button */}
            <button
              onClick={handlePost}
              disabled={posting || !content.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#E8A838] hover:bg-[#E8A838]/90 disabled:opacity-40 disabled:cursor-not-allowed text-[#0d1624] rounded-lg text-xs font-semibold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-xs text-[#E05C3A] mt-1">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
