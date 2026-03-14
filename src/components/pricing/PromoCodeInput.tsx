'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Tag, Loader2, CheckCircle2, XCircle } from 'lucide-react';

type ApplyState = 'idle' | 'loading' | 'success' | 'error';

interface PromoResult {
  valid: boolean;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  message?: string;
}

export function PromoCodeInput() {
  const [expanded, setExpanded] = useState(false);
  const [code, setCode] = useState('');
  const [state, setState] = useState<ApplyState>('idle');
  const [result, setResult] = useState<PromoResult | null>(null);

  async function handleApply() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setState('loading');
    setResult(null);

    try {
      const res = await fetch(
        `/api/register/validate-promo?code=${encodeURIComponent(trimmed)}`
      );
      const data = (await res.json()) as PromoResult;

      if (res.ok && data.valid) {
        setState('success');
        setResult(data);
      } else {
        setState('error');
        setResult({ valid: false, message: data.message || 'Invalid or expired promo code.' });
      }
    } catch {
      setState('error');
      setResult({ valid: false, message: 'Network error. Please try again.' });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      void handleApply();
    }
  }

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value.toUpperCase());
    if (state !== 'idle') {
      setState('idle');
      setResult(null);
    }
  }

  const savingsLabel =
    result?.valid && result.discount_type
      ? result.discount_type === 'percentage'
        ? `Code applied! You save ${result.discount_value}%`
        : `Code applied! You save AED ${result.discount_value}`
      : null;

  return (
    <div className="max-w-md mx-auto">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors mx-auto"
      >
        <Tag className="w-4 h-4" />
        Have a promo code?
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 bg-surface border border-border rounded-xl p-5 animate-slide-up">
          <p className="text-xs text-text-muted mb-3 text-center">
            Enter your promo code below to unlock a discount.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g. PROPLR20"
              maxLength={24}
              className="flex-1 bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors font-mono tracking-widest uppercase"
            />
            <button
              type="button"
              onClick={() => void handleApply()}
              disabled={state === 'loading' || !code.trim()}
              className="flex items-center gap-1.5 bg-gold text-background text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {state === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Apply'
              )}
            </button>
          </div>

          {state === 'success' && savingsLabel && (
            <div className="flex items-center gap-2 mt-3 bg-green/10 border border-green/20 rounded-lg px-3 py-2">
              <CheckCircle2 className="w-4 h-4 text-green flex-shrink-0" />
              <p className="text-sm font-semibold text-green">{savingsLabel}</p>
            </div>
          )}

          {state === 'error' && result && (
            <div className="flex items-center gap-2 mt-3 bg-red/10 border border-red/20 rounded-lg px-3 py-2">
              <XCircle className="w-4 h-4 text-red flex-shrink-0" />
              <p className="text-sm font-medium text-red">{result.message || 'Invalid code.'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
