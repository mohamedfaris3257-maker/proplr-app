'use client';

import { useState, useEffect } from 'react';
import { Gift, Copy, CheckCircle2 } from 'lucide-react';

interface ReferralStats {
  referral_code: string | null;
  referral_count: number;
  points: number;
}

export function ReferralCard() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/profile/referral-stats')
      .then((r) => r.json())
      .then((d: ReferralStats) => setStats(d))
      .catch(() => null);
  }, []);

  if (!stats?.referral_code) return null;

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${stats.referral_code}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-4 h-4 text-purple" />
        <h2 className="text-base font-semibold text-text-primary">Referral Program</h2>
      </div>

      <p className="text-sm text-text-secondary mb-4">
        Invite friends to Proplr! Every approved registration using your link earns you points.
      </p>

      {/* Stats row */}
      <div className="flex gap-4 mb-4">
        <div className="bg-surface-2 rounded-lg px-4 py-3 text-center flex-1">
          <p className="text-xl font-bold text-purple">{stats.referral_count}</p>
          <p className="text-xs text-text-muted mt-0.5">Referrals</p>
        </div>
        <div className="bg-surface-2 rounded-lg px-4 py-3 text-center flex-1">
          <p className="text-xl font-bold text-gold">{stats.points}</p>
          <p className="text-xs text-text-muted mt-0.5">Total Points</p>
        </div>
      </div>

      {/* Referral link */}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 px-3 py-2 bg-surface-2 border border-border rounded-lg text-xs text-text-secondary truncate">
          {referralLink}
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-purple/10 hover:bg-purple/20 text-purple text-xs font-semibold rounded-lg transition-colors"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <p className="text-xs text-text-muted mt-3">
        Your referral code: <span className="font-mono font-semibold text-text-secondary">{stats.referral_code}</span>
      </p>
    </div>
  );
}
