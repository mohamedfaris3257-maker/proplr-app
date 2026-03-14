'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, Users, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  subscribed: boolean;
  created_at: string;
}

export function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }: { data: Subscriber[] | null }) => {
        setSubscribers(data ?? []);
        setLoading(false);
      });
  }, []);

  async function handleSend() {
    if (!subject.trim() || !html.trim()) return;
    setSending(true);
    setSendResult('');
    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, html }),
      });
      const data = await res.json() as { sent?: number; error?: string };
      if (res.ok) {
        setSendResult(`Sent to ${data.sent} subscriber${data.sent !== 1 ? 's' : ''}.`);
      } else {
        setSendResult(`Error: ${data.error}`);
      }
    } finally {
      setSending(false);
    }
  }

  async function handleUnsubscribe(id: string) {
    const supabase = createClient();
    await supabase.from('newsletter_subscribers').update({ subscribed: false }).eq('id', id);
    setSubscribers((prev) => prev.map((s) => s.id === id ? { ...s, subscribed: false } : s));
  }

  const activeCount = subscribers.filter((s) => s.subscribed).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-blue" />
          </div>
          <div>
            <p className="text-xl font-bold text-text-primary">{activeCount}</p>
            <p className="text-xs text-text-muted">Active Subscribers</p>
          </div>
        </div>
      </div>

      {/* Compose */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4 text-blue" />
          <h3 className="text-sm font-semibold text-text-primary">Send Newsletter</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Newsletter subject..."
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">HTML Body</label>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="<p>Your newsletter content here...</p>"
              rows={8}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors resize-y font-mono"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleSend}
              disabled={sending || !subject.trim() || !html.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue hover:bg-blue/90 text-white text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : `Send to ${activeCount} subscriber${activeCount !== 1 ? 's' : ''}`}
            </button>
            {sendResult && (
              <p className="text-sm text-text-secondary">{sendResult}</p>
            )}
          </div>
        </div>
      </div>

      {/* Subscriber list */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary">Subscribers ({subscribers.length})</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-text-muted text-sm">Loading...</div>
        ) : subscribers.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">No subscribers yet.</div>
        ) : (
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {subscribers.map((sub) => (
              <div key={sub.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{sub.email}</p>
                  {sub.name && <p className="text-xs text-text-muted truncate">{sub.name}</p>}
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  sub.subscribed ? 'bg-green/10 text-green' : 'bg-surface-2 text-text-muted'
                }`}>
                  {sub.subscribed ? 'Active' : 'Unsubscribed'}
                </span>
                {sub.subscribed && (
                  <button
                    onClick={() => handleUnsubscribe(sub.id)}
                    className="p-1.5 hover:bg-red/10 text-text-muted hover:text-red rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
