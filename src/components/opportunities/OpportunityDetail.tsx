'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Clock,
  Bookmark,
  CheckCircle2,
  Share2,
  Users,
  CalendarDays,
} from 'lucide-react';
import { PillarBadge, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ApplicationModal } from '@/components/opportunities/ApplicationModal';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Opportunity, ApplicationStatus, Profile } from '@/lib/types';

const TYPE_LABELS: Record<string, string> = {
  internship: 'Internship',
  job: 'Job',
  challenge: 'Challenge',
  job_shadowing: 'Job Shadowing',
  volunteering: 'Volunteering',
  micro_placement: 'Micro-Placement',
};

const TYPE_VARIANTS: Record<string, 'blue' | 'purple' | 'gold' | 'teal' | 'green' | 'red' | 'default'> = {
  internship: 'blue',
  job: 'purple',
  challenge: 'gold',
  job_shadowing: 'teal',
  volunteering: 'green',
  micro_placement: 'red',
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: 'bg-blue/10 text-blue border-blue/20',
  reviewing: 'bg-gold/10 text-gold border-gold/20',
  interview: 'bg-purple/10 text-purple border-purple/20',
  accepted: 'bg-green/10 text-green border-green/20',
  rejected: 'bg-red/10 text-red border-red/20',
};

function isNewOpportunity(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

interface OpportunityDetailProps {
  opportunity: Opportunity;
  currentUserId: string;
  profile: Profile;
  portfolioItems: { id: string; title: string }[];
  applicationStatus: ApplicationStatus | null;
  isSaved: boolean;
}

export function OpportunityDetail({
  opportunity,
  currentUserId,
  profile,
  portfolioItems,
  applicationStatus: initialAppStatus,
  isSaved: initialSaved,
}: OpportunityDetailProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [appStatus, setAppStatus] = useState<ApplicationStatus | null>(initialAppStatus);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const isExpired = opportunity.deadline
    ? new Date(opportunity.deadline) < new Date()
    : false;

  const isNew = isNewOpportunity(opportunity.created_at);

  const handleSave = async () => {
    const newSaved = !saved;
    setSaved(newSaved);
    const supabase = createClient();
    if (newSaved) {
      await supabase.from('saved_items').insert({
        user_id: currentUserId,
        item_id: opportunity.id,
        item_type: 'opportunity',
      });
    } else {
      await supabase
        .from('saved_items')
        .delete()
        .eq('user_id', currentUserId)
        .eq('item_id', opportunity.id)
        .eq('item_type', 'opportunity');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing silently
    }
  };

  const handleApplicationSuccess = () => {
    setAppStatus('applied');
    setShowModal(false);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Back link */}
        <Link
          href="/dashboard/opportunities"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-5 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Opportunities
        </Link>

        {/* Header card */}
        <div className="card p-5 mb-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-text-primary leading-tight">
                  {opportunity.title}
                </h1>
                {isNew && (
                  <span className="bg-green text-white text-[10px] px-1.5 py-0.5 rounded-sm animate-pulse flex-shrink-0">
                    New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-text-muted mb-4">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{opportunity.company}</span>
              </div>

              {/* Badge row */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={TYPE_VARIANTS[opportunity.type] || 'default'}>
                  {TYPE_LABELS[opportunity.type] || opportunity.type}
                </Badge>
                <Badge
                  variant={
                    opportunity.audience === 'school'
                      ? 'gold'
                      : opportunity.audience === 'uni'
                      ? 'blue'
                      : 'teal'
                  }
                >
                  {opportunity.audience === 'both'
                    ? 'All Students'
                    : opportunity.audience === 'school'
                    ? 'School Students'
                    : 'University Students'}
                </Badge>
                {opportunity.pillar_tags?.map((p) => (
                  <PillarBadge key={p} pillar={p} />
                ))}
                {opportunity.deadline && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm ${
                      isExpired ? 'bg-red/10 text-red' : 'bg-border text-text-secondary'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {isExpired ? 'Expired' : `Due ${formatDate(opportunity.deadline)}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* LEFT: Main content */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* About section */}
            <div className="card p-5">
              <h2 className="text-base font-semibold text-text-primary mb-3">
                About this opportunity
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {opportunity.description}
              </p>
            </div>

            {/* Required Pillars */}
            {opportunity.pillar_tags && opportunity.pillar_tags.length > 0 && (
              <div className="card p-5">
                <h2 className="text-base font-semibold text-text-primary mb-3">
                  Required Pillars
                </h2>
                <div className="flex flex-wrap gap-2">
                  {opportunity.pillar_tags.map((p) => (
                    <PillarBadge key={p} pillar={p} className="text-sm px-3 py-1" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Sticky sidebar */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0">
            <div className="card p-5 lg:sticky lg:top-6 space-y-4">
              {/* Details rows */}
              <div className="space-y-3">
                <DetailRow
                  icon={<Building2 className="w-4 h-4" />}
                  label="Type"
                  value={TYPE_LABELS[opportunity.type] || opportunity.type}
                />
                <DetailRow
                  icon={<Users className="w-4 h-4" />}
                  label="Audience"
                  value={
                    opportunity.audience === 'both'
                      ? 'All Students'
                      : opportunity.audience === 'school'
                      ? 'School Students'
                      : 'University Students'
                  }
                />
                {opportunity.deadline && (
                  <DetailRow
                    icon={<CalendarDays className="w-4 h-4" />}
                    label="Deadline"
                    value={isExpired ? 'Expired' : formatDate(opportunity.deadline)}
                    valueClassName={isExpired ? 'text-red' : undefined}
                  />
                )}
              </div>

              <div className="h-px bg-border" />

              {/* Apply button */}
              {appStatus ? (
                <div
                  className={`flex items-center justify-center gap-2 text-sm font-medium py-2.5 px-4 rounded-lg border ${STATUS_COLORS[appStatus]}`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Applied
                </div>
              ) : (
                <Button
                  size="md"
                  onClick={() => setShowModal(true)}
                  disabled={isExpired || !opportunity.is_active}
                  className="w-full"
                >
                  Apply Now
                </Button>
              )}

              {/* Save button */}
              <button
                onClick={handleSave}
                className={`w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 px-4 rounded-lg border transition-all duration-200 ${
                  saved
                    ? 'bg-gold/10 border-gold/40 text-gold'
                    : 'bg-surface-2 border-border text-text-secondary hover:border-blue hover:text-text-primary'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-gold' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 px-4 rounded-lg border border-border bg-surface-2 text-text-secondary hover:border-blue hover:text-text-primary transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <ApplicationModal
          opportunity={opportunity}
          currentUserId={currentUserId}
          profile={{
            name: profile.name,
            email: profile.email,
            school_name: profile.school_name,
            grade: profile.grade,
            type: profile.type,
          }}
          portfolioItems={portfolioItems}
          onSuccess={handleApplicationSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-text-muted flex-shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-text-muted uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-medium ${valueClassName ?? 'text-text-primary'}`}>{value}</p>
      </div>
    </div>
  );
}
