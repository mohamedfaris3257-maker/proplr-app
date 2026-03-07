import type { Certificate, Profile } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export async function generateCertificatePDF(cert: Certificate, profile: Profile): Promise<void> {
  // Dynamically import jsPDF to avoid SSR issues
  const { jsPDF } = await import('jspdf');

  // A4 landscape: 297 x 210 mm
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const W = 297;
  const H = 210;

  // ── Background ──────────────────────────────────────────────────────────────
  doc.setFillColor('#0d1624');
  doc.rect(0, 0, W, H, 'F');

  // ── Gold border lines ────────────────────────────────────────────────────────
  doc.setFillColor('#E8A838');
  doc.rect(0, 0, W, 2, 'F');       // top
  doc.rect(0, H - 2, W, 2, 'F');   // bottom

  // Thin inner accent lines
  doc.setDrawColor('#E8A838');
  doc.setLineWidth(0.3);
  doc.line(8, 8, W - 8, 8);
  doc.line(8, H - 8, W - 8, H - 8);

  // ── Logo ────────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor('#E8A838');
  doc.text('\u2726 PROPLR', 16, 22);

  // ── Main heading ─────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor('#E8A838');
  doc.text('CERTIFICATE OF ACHIEVEMENT', W / 2, 60, { align: 'center' });

  // ── Sub-text ──────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor('#f0f4f8');
  doc.text('This certifies that', W / 2, 80, { align: 'center' });

  // ── Student name ─────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor('#E8A838');
  doc.text(profile.name, W / 2, 100, { align: 'center' });

  // ── "has successfully completed" ─────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor('#f0f4f8');
  doc.text('has successfully completed the', W / 2, 120, { align: 'center' });

  // ── Pillar name ───────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor('#E8A838');
  doc.text(cert.pillar_name, W / 2, 140, { align: 'center' });

  // ── "Pillar Programme" ────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor('#f0f4f8');
  doc.text('Pillar Programme', W / 2, 155, { align: 'center' });

  // ── Issue date ────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor('#8ca3be');
  doc.text(`Issued on ${formatDate(cert.issued_at)}`, W / 2, 175, { align: 'center' });

  // ── Footer ────────────────────────────────────────────────────────────────────
  doc.setFontSize(10);
  doc.setTextColor('#8ca3be');
  doc.text('Certified by Proplr | KHDA Permit #633441', W / 2, H - 12, { align: 'center' });

  // ── Save ─────────────────────────────────────────────────────────────────────
  doc.save(`proplr-certificate-${cert.pillar_name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}
