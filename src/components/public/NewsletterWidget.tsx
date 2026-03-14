'use client';

import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export function NewsletterWidget() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
      } else {
        setDone(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex items-center gap-3 text-green">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">You&apos;re subscribed! We&apos;ll keep you updated.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
      <div className="relative flex-1 min-w-48">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full pl-9 pr-3 py-2.5 bg-surface-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 bg-blue hover:bg-blue/90 text-white text-sm font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
      {error && <p className="w-full text-xs text-red mt-1">{error}</p>}
    </form>
  );
}
