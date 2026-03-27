'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StagingOpportunity {
  id: string;
  title: string;
  company: string;
  description: string;
  type: string;
  external_url: string | null;
  source: string;
  source_id: string;
  salary_min: number | null;
  salary_max: number | null;
  location: string | null;
  created_at: string;
  status: string;
}

export default function ImportOpportunitiesPage() {
  const [staging, setStaging] = useState<StagingOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<any>(null);

  useEffect(() => {
    fetchStaging();
  }, []);

  async function fetchStaging() {
    try {
      const res = await fetch('/api/admin/opportunities/staging');
      const data = await res.json();
      setStaging(data.opportunities || []);
    } catch {
      console.error('Failed to fetch staging');
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/admin/sync-opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      console.log('Sync result:', data);
      setSyncResult(data);
      await fetchStaging();
    } catch (err) {
      setSyncResult({ error: 'Network error' });
    } finally {
      setSyncing(false);
    }
  }

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/opportunities/staging', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        setStaging((prev) => prev.filter((o) => o.id !== id));
      }
    } catch {
      console.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleBulkApprove() {
    const res = await fetch('/api/admin/opportunities/staging', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve_all' }),
    });
    const data = await res.json();
    console.log('Approve all result:', data);
    await fetchStaging();
  }

  async function handleBulkReject() {
    for (const opp of staging) {
      await handleAction(opp.id, 'reject');
    }
  }

  function formatSalary(min: number | null, max: number | null) {
    if (!min && !max) return null;
    const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  }

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <Link href="/admin/opportunities" style={{ color: '#3d9be9', fontSize: 14, textDecoration: 'none' }}>
              ← Back to Opportunities
            </Link>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#071629', margin: 0 }}>
            Import from Adzuna
          </h1>
          <p style={{ fontSize: 14, color: '#6e7591', margin: '4px 0 0' }}>
            Fetch and review external opportunities before publishing
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              background: '#3d9be9',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: syncing ? 'not-allowed' : 'pointer',
              opacity: syncing ? 0.6 : 1,
            }}
          >
            {syncing ? 'Syncing...' : '⬇ Fetch from Adzuna'}
          </button>
        </div>
      </div>

      {syncResult && (
        <div style={{
          background: syncResult.error ? 'rgba(255,71,87,0.08)' : 'rgba(46,213,115,0.08)',
          border: `0.5px solid ${syncResult.error ? 'rgba(255,71,87,0.3)' : 'rgba(46,213,115,0.3)'}`,
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 16,
          fontSize: 13,
        }}>
          {syncResult.error
            ? `❌ ${syncResult.error}`
            : `✅ Sync complete — ${syncResult.new ?? 0} new jobs added to staging, ${syncResult.skipped ?? 0} skipped, ${syncResult.fetched ?? 0} fetched total`
          }
        </div>
      )}

      {/* Bulk actions */}
      {staging.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: '#f8f9fa',
          borderRadius: 8,
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#071629' }}>
            {staging.length} opportunities awaiting review
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleBulkApprove}
              style={{
                background: '#27ae60',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ✓ Approve All
            </button>
            <button
              onClick={handleBulkReject}
              style={{
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ✗ Reject All
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6e7591' }}>Loading staging opportunities...</div>
      ) : staging.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 60,
          background: '#fff',
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>▤</div>
          <p style={{ fontWeight: 600, color: '#071629', margin: '0 0 4px' }}>No opportunities in staging</p>
          <p style={{ fontSize: 14, color: '#6e7591', margin: 0 }}>
            Click &quot;Fetch from Adzuna&quot; to import new opportunities for review
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {staging.map((opp) => (
            <div
              key={opp.id}
              style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '20px 24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, marginRight: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#071629', margin: 0 }}>
                      {opp.title}
                    </h3>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: '#e8f4fd',
                      color: '#3d9be9',
                      textTransform: 'uppercase',
                    }}>
                      {opp.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: '#3d9be9', fontWeight: 600, margin: '0 0 6px' }}>
                    {opp.company}
                  </p>
                  {opp.location && (
                    <p style={{ fontSize: 13, color: '#6e7591', margin: '0 0 4px' }}>
                      {opp.location}
                    </p>
                  )}
                  {formatSalary(opp.salary_min, opp.salary_max) && (
                    <p style={{ fontSize: 13, color: '#27ae60', fontWeight: 600, margin: '0 0 4px' }}>
                      $ {formatSalary(opp.salary_min, opp.salary_max)}
                    </p>
                  )}
                  <p style={{ fontSize: 13, color: '#666', margin: '8px 0 0', lineHeight: 1.5 }}>
                    {opp.description.length > 200 ? opp.description.slice(0, 200) + '...' : opp.description}
                  </p>
                  {opp.external_url && (
                    <a
                      href={opp.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 13, color: '#3d9be9', marginTop: 6, display: 'inline-block' }}
                    >
                      View original listing →
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => handleAction(opp.id, 'approve')}
                    disabled={actionLoading === opp.id}
                    style={{
                      background: '#27ae60',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 16px',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      opacity: actionLoading === opp.id ? 0.6 : 1,
                      minWidth: 90,
                    }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleAction(opp.id, 'reject')}
                    disabled={actionLoading === opp.id}
                    style={{
                      background: '#fff',
                      color: '#e74c3c',
                      border: '1.5px solid #e74c3c',
                      borderRadius: 8,
                      padding: '8px 16px',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      opacity: actionLoading === opp.id ? 0.6 : 1,
                      minWidth: 90,
                    }}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
