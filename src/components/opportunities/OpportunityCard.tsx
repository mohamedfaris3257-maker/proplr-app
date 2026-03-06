'use client';

import { useState } from 'react';
import { Building2, Clock, Bookmark, ExternalLink, CheckCircle2 } from 'lucide-react';
import { PillarBadge, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Opportunity, ApplicationStatus } from '@/lib/types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  currentUserId: string;
  isSaved?: boolean;
  applicationStatus?: ApplicationStatus | null;
}

const TYPE_LABELS: Record<string, string> = {
  internship: 'Internship',
  job: 'Job',
  challenge: 'Challenge',
  job_shadowing: 'Job Shadowing',
  volunteering: 'Volunteering',
  micro_placement: 'Micro-Placement',
};

const TYPE_COLORS: Record<string, string> = {
  internship: 'bg-blue/10 text-blue',
  job: 'bg-purple/10 text-purple',
  challenge: 'bg-gold/10 text-gold',
  job_shadowing: 'bg-teal/10 text-teal',
  volunteering: 'bg-green/10 text-green',
  micro_placement: 'bg-red/10 text-red',
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: 'bg-blue/10 text-blue',
  reviewing: 'bg-gold/10 text-gold',
  interview: 'bg-purple/10 text-purple',
  accepted: 'bg-green/10 text-green',
  rejected: 'bg-red/10 text-red',
};

export function OpportunityCard({
  opportunity,
  currentUserId,
  isSaved: initialSaved = false,
  applicationStatus: initialStatus = null,
}: OpportunityCardProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [appStatus, setAppStatus] = useState<ApplicationStatus | null>(initialStatus);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSave = async () => {
    const newSaved = !saved;
    setSaved(newSaved);
    if (newSaved) {
      await supabase.from('saved_items').insert({
        user_id: currentUserId,
        item_id: opportunity.id,
        item_type: 'opportunity',
      });
    } else {
      await supabase.from('saved_items')
        .delete()
        .eq('user_id', currentUserId)
        .eq('item_id', opportunity.id)
        .eq('item_type', 'opportunity');
    }
  };

  const handleApply = async () => {
    if (appStatus) return;
    setLoading(true);
    const { error } = await supabase.from('applications').insert({
      user_id: currentUserId,
      opportunity_id: opportunity.id,
      status: 'applied',
    });
    if (!error) setAppStatus('applied');
    setLoading(false);
  };

  const isExpired = opportunity.deadline
    ? new Date(opportunity.deadline) < new Date()
    : false;

  return (
    <div className="card p-4 hover:shadow-card-hover transition-all duration-200 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-text-primary leading-tight truncate">{opportunity.title}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Building2 className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
            <span className="text-xs text-text-muted truncate">{opportunity.company}</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`p-1.5 rounded-lg transition-all duration-200 flex-shrink-0 ${
            saved ? 'text-gold bg-gold/10' : 'text-text-muted hover:bg-surface-2 hover:text-text-primary'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-gold' : ''}`} />
        </button>
      </div>

      {/* Type + audience badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${TYPE_COLORS[opportunity.type] || 'bg-border text-text-secondary'}`}>
          {TYPE_LABELS[opportunity.type] || opportunity.type}
        </span>
        <Badge variant={opportunity.audience === 'school' ? 'gold' : opportunity.audience === 'uni' ? 'blue' : 'teal'}>
          {opportunity.audience === 'both' ? 'All Students' : opportunity.audience === 'school' ? 'School' : 'University'}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-3 flex-1">
        {opportunity.description}
      </p>

      {/* Pillar tags */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        {opportunity.pillar_tags?.map((p) => (
          <PillarBadge key={p} pillar={p} />
        ))}
      </div>

      {/* Deadline */}
      {opportunity.deadline && (
        <div className={`flex items-center gap-1.5 text-xs mb-3 ${isExpired ? 'text-red' : 'text-text-muted'}`}>
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          {isExpired ? 'Expired' : `Deadline: ${formatDate(opportunity.deadline)}`}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        {appStatus ? (
          <div className={`flex-1 flex items-center justify-center gap-2 text-xs font-medium py-2 rounded-lg ${STATUS_COLORS[appStatus]}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {appStatus.charAt(0).toUpperCase() + appStatus.slice(1)}
          </div>
        ) : (
          <Button
            size="sm"
            onClick={handleApply}
            loading={loading}
            disabled={isExpired || !opportunity.is_active}
            className="flex-1"
          >
            Apply Now
          </Button>
        )}
        <button className="p-2 rounded-lg bg-surface-2 border border-border text-text-muted hover:text-text-primary hover:border-blue transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
