'use client';

import { useState } from 'react';
import { Award, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PILLAR_COLORS } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import type { Certificate, Profile } from '@/lib/types';

interface CertificatesTabProps {
  certificates: Certificate[];
  profile: Profile;
}

export function CertificatesTab({ certificates, profile }: CertificatesTabProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);

  async function handleDownloadPDF(cert: Certificate) {
    setDownloadingId(cert.id);
    try {
      const { generateCertificatePDF } = await import('@/lib/certificatePdf');
      await generateCertificatePDF(cert, profile);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleShareBadge(cert: Certificate) {
    setSharingId(cert.id);
    try {
      const { generateBadgePNG } = await import('@/lib/badgePng');
      await generateBadgePNG(cert, profile);
    } catch (err) {
      console.error('Badge generation failed:', err);
    } finally {
      setSharingId(null);
    }
  }

  if (certificates.length === 0) {
    return (
      <div className="card p-10 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center">
          <Award className="w-5 h-5 text-text-muted" />
        </div>
        <p className="text-text-secondary text-sm">No certificates earned yet.</p>
        <p className="text-xs text-text-muted max-w-xs">
          Complete 50 hours in any pillar to earn your certificate.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {certificates.map((cert) => {
        const color = PILLAR_COLORS[cert.pillar_name] ?? '#E8A838';
        return (
          <div
            key={cert.id}
            className="card p-5 flex flex-col gap-4"
            style={{ borderColor: `${color}30` }}
          >
            {/* Top row: icon + pillar name */}
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                <Award className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-snug" style={{ color }}>
                  {cert.pillar_name}
                </p>
                <p className="text-xs text-text-muted mt-0.5">Pillar Programme</p>
              </div>
              {cert.khda_attested && (
                <span className="flex-shrink-0 text-[10px] font-bold bg-green/10 text-green border border-green/20 px-1.5 py-0.5 rounded-sm">
                  KHDA
                </span>
              )}
            </div>

            {/* Issue date */}
            <p className="text-xs text-text-muted">
              Issued on{' '}
              <span className="text-text-secondary font-medium">
                {formatDate(cert.issued_at)}
              </span>
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDownloadPDF(cert)}
                loading={downloadingId === cert.id}
                className="flex-1 text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShareBadge(cert)}
                loading={sharingId === cert.id}
                className="flex-1 text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Badge
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
