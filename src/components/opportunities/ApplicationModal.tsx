'use client';

import { useState } from 'react';
import { Building2, User, Mail, School, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import type { Opportunity } from '@/lib/types';

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

interface ApplicationModalProps {
  opportunity: Opportunity;
  currentUserId: string;
  profile: {
    name: string;
    email: string;
    school_name: string | null;
    grade: string | null;
    type: string;
  };
  portfolioItems: { id: string; title: string }[];
  onSuccess: () => void;
  onClose: () => void;
}

export function ApplicationModal({
  opportunity,
  currentUserId,
  profile,
  portfolioItems,
  onSuccess,
  onClose,
}: ApplicationModalProps) {
  const [coverText, setCoverText] = useState('');
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = coverText.trim() === '' ? 0 : coverText.trim().split(/\s+/).length;
  const charCount = coverText.length;
  const isUniStudent = profile.type === 'uni_student';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (coverText.trim().length < 20) {
      setError('Please write at least 20 characters explaining your interest.');
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error: appError } = await supabase.from('applications').insert({
      user_id: currentUserId,
      opportunity_id: opportunity.id,
      status: 'applied',
      cover_text: coverText.trim(),
      portfolio_item_id: selectedPortfolioItem || null,
    });

    if (appError) {
      setError(appError.message || 'Failed to submit application. Please try again.');
      setLoading(false);
      return;
    }

    await supabase.from('notifications').insert({
      user_id: currentUserId,
      type: 'application',
      title: 'Application Submitted',
      message: `Your application for ${opportunity.title} at ${opportunity.company} has been submitted.`,
      link: '/profile',
    });

    setLoading(false);
    onSuccess();
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Apply to ${opportunity.title}`}
      size="lg"
    >
      <div className="space-y-5">
        {/* Opportunity summary */}
        <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg border border-border">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-sm text-text-muted">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{opportunity.company}</span>
            </div>
          </div>
          <Badge variant={TYPE_VARIANTS[opportunity.type] || 'default'}>
            {TYPE_LABELS[opportunity.type] || opportunity.type}
          </Badge>
        </div>

        {/* Pre-filled read-only profile info */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Your Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <InfoBlock icon={<User className="w-3.5 h-3.5" />} label="Name" value={profile.name} />
            <InfoBlock icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={profile.email} />
            {profile.school_name && (
              <InfoBlock
                icon={<School className="w-3.5 h-3.5" />}
                label={isUniStudent ? 'University' : 'School'}
                value={profile.school_name}
              />
            )}
            {profile.grade && (
              <InfoBlock
                icon={<GraduationCap className="w-3.5 h-3.5" />}
                label={isUniStudent ? 'Year' : 'Grade'}
                value={profile.grade}
              />
            )}
          </div>
        </div>

        {/* Cover text */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">
            Why are you interested in this opportunity?
            <span className="text-red ml-1">*</span>
          </label>
          <div className="relative">
            <textarea
              value={coverText}
              onChange={(e) => {
                if (e.target.value.length <= 800) {
                  setCoverText(e.target.value);
                }
              }}
              placeholder="Tell the company why you're a great fit, what excites you about this opportunity, and what you hope to learn..."
              rows={5}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue transition-colors resize-none"
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className={charCount < 20 ? 'text-text-muted' : 'text-green'}>
              {charCount < 20 ? `${20 - charCount} more characters needed` : `${wordCount} words`}
            </span>
            <span className={charCount >= 760 ? 'text-gold' : 'text-text-muted'}>
              {charCount}/800
            </span>
          </div>
        </div>

        {/* Portfolio item select — uni students only */}
        {isUniStudent && portfolioItems.length > 0 && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">
              Attach a portfolio item
              <span className="text-text-muted text-xs font-normal ml-1">(optional)</span>
            </label>
            <select
              value={selectedPortfolioItem}
              onChange={(e) => setSelectedPortfolioItem(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-blue transition-colors appearance-none"
            >
              <option value="">No portfolio item</option>
              {portfolioItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red/10 border border-red/20 rounded-lg text-sm text-red">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-lg border border-border text-text-secondary text-sm font-medium hover:border-blue hover:text-text-primary bg-surface-2 transition-colors"
          >
            Cancel
          </button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={coverText.trim().length < 20}
            className="flex-1"
          >
            {loading ? 'Submitting...' : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Submit Application
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function InfoBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 p-2.5 bg-background rounded-lg border border-border">
      <span className="text-text-muted mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-text-muted uppercase tracking-wider">{label}</p>
        <p className="text-sm text-text-primary font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
