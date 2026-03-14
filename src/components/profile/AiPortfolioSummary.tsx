'use client';

import { useState } from 'react';

export function AiPortfolioSummary() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const res = await fetch('/api/ai/portfolio', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to generate summary.');
        return;
      }

      setSummary(data.summary);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = summary;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
      <div className="flex items-center gap-2 mb-4">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#E8A838"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z" />
        </svg>
        <h2
          className="text-base font-semibold"
          style={{ color: '#071629', fontFamily: "'DM Sans', sans-serif" }}
        >
          AI Portfolio Summary
        </h2>
      </div>

      <p
        style={{
          fontSize: 13,
          color: '#6e7591',
          marginBottom: 16,
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.5,
        }}
      >
        Generate a professional summary of your portfolio, achievements, and pillar hours
        using AI. Perfect for university applications or professional profiles.
      </p>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: loading ? '#a0c8ee' : '#3d9be9',
          color: '#fff',
          borderRadius: 10,
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s ease',
        }}
      >
        {loading ? (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              style={{
                animation: 'spin 1s linear infinite',
              }}
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M14 8a6 6 0 00-6-6"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z" />
            </svg>
            Generate Portfolio Summary with AI
          </>
        )}
      </button>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {error && (
        <div
          style={{
            marginTop: 16,
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            background: 'rgba(224,92,58,0.08)',
            color: '#E05C3A',
          }}
        >
          {error}
        </div>
      )}

      {summary && (
        <div
          style={{
            marginTop: 16,
            padding: 20,
            borderRadius: 12,
            background: '#f5f5f7',
            border: '0.5px solid rgba(7,22,41,0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#6e7591',
                fontFamily: "'DM Sans', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Your Portfolio Summary
            </span>
            <button
              onClick={handleCopy}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: copied ? 'rgba(39,174,96,0.08)' : 'rgba(7,22,41,0.04)',
                color: copied ? '#27AE60' : '#6e7591',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {copied ? (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <div
            style={{
              fontSize: 14,
              color: '#071629',
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}
          >
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}
