'use client';

import { ExternalLink, Compass, Copy, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import type { Profile } from '@/lib/types';

interface IntegrationCardsProps {
  profile: Profile & { dibz_discount_active?: boolean };
}

function generateDibzCode(userId: string): string {
  const short = userId.replace(/-/g, '').slice(0, 8).toUpperCase();
  return `PROPLR-${short}`;
}

export function IntegrationCards({ profile }: IntegrationCardsProps) {
  return (
    <div className="space-y-4">
      {profile.dibz_discount_active && <DibzCard profile={profile} />}
      <CompassCard profile={profile} />
    </div>
  );
}

// ─── Dibz Card ────────────────────────────────────────────────────────────────

function DibzCard({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState(false);
  const discountCode = generateDibzCode(profile.user_id);

  function handleCopy() {
    void navigator.clipboard.writeText(discountCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        background: 'linear-gradient(135deg, rgba(232,168,56,0.08) 0%, rgba(17,29,46,0) 70%)',
        borderColor: 'rgba(232,168,56,0.35)',
      }}
    >
      <div className="flex items-start gap-4">
        {/* Dibz logo */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border"
          style={{ backgroundColor: 'rgba(232,168,56,0.12)', borderColor: 'rgba(232,168,56,0.3)' }}
        >
          <span className="text-lg font-black text-gold leading-none tracking-tighter">
            d<span style={{ color: '#E8A838' }}>.</span>
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-text-primary">Your Dibz Discount is Active!</p>
            <span className="text-[10px] font-bold bg-gold/15 text-gold px-1.5 py-0.5 rounded-sm border border-gold/20">
              LIVE
            </span>
          </div>
          <p className="text-xs text-text-muted mb-3">
            Enjoy exclusive discounts as a Proplr student on thousands of products.
          </p>

          {/* Discount code display */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-surface-2 border border-border rounded-lg px-3 py-2">
              <span className="text-xs font-mono font-bold text-gold tracking-widest flex-1">
                {discountCode}
              </span>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 text-text-muted hover:text-gold transition-colors"
                title="Copy discount code"
              >
                {copied ? (
                  <CheckCheck className="w-4 h-4 text-green" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <a
              href="https://dibz.ae"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-gold text-background text-xs font-bold px-3 py-2 rounded-lg hover:bg-gold-dim transition-colors whitespace-nowrap active:scale-[0.97]"
            >
              Shop on Dibz
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {copied && (
            <p className="text-xs text-green mt-1.5">Code copied to clipboard!</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Compass Card ─────────────────────────────────────────────────────────────

function CompassCard({ profile }: { profile: Profile }) {
  const compassUrl = `https://compass.proplr.ae?email=${encodeURIComponent(profile.email)}`;

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        background: 'linear-gradient(135deg, rgba(74,144,217,0.08) 0%, rgba(17,29,46,0) 70%)',
        borderColor: 'rgba(74,144,217,0.35)',
      }}
    >
      <div className="flex items-start gap-4">
        {/* Compass icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border"
          style={{ backgroundColor: 'rgba(74,144,217,0.12)', borderColor: 'rgba(74,144,217,0.3)' }}
        >
          <Compass className="w-5 h-5 text-blue" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text-primary mb-0.5">Explore Your Career Path</p>
          <p className="text-xs text-text-muted mb-3">
            Access your personalized Compass dashboard — career assessments, path recommendations,
            and industry insights tailored to you.
          </p>
          <a
            href={compassUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-blue/10 text-blue border border-blue/25 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue/20 transition-colors active:scale-[0.97]"
          >
            <Compass className="w-3.5 h-3.5" />
            Open Compass
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
