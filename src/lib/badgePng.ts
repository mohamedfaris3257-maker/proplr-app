import type { Certificate, Profile } from '@/lib/types';
import { PILLAR_COLORS } from '@/lib/types';

export async function generateBadgePNG(cert: Certificate, profile: Profile): Promise<void> {
  const SIZE = 400;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const pillarColor = PILLAR_COLORS[cert.pillar_name] ?? '#E8A838';

  // ── Dark navy background ───────────────────────────────────────────────────
  ctx.fillStyle = '#0d1624';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── Subtle background circle (outer glow) ─────────────────────────────────
  const glowGradient = ctx.createRadialGradient(cx, cy, SIZE * 0.25, cx, cy, SIZE * 0.55);
  glowGradient.addColorStop(0, `${pillarColor}18`);
  glowGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(cx, cy, SIZE * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // ── Gold outer ring border ────────────────────────────────────────────────
  ctx.strokeStyle = '#E8A838';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, SIZE * 0.45, 0, Math.PI * 2);
  ctx.stroke();

  // ── Inner pillar-colored ring ─────────────────────────────────────────────
  ctx.strokeStyle = pillarColor;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(cx, cy, SIZE * 0.38, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // ── Pillar initial letter (large icon) ───────────────────────────────────
  const initial = cert.pillar_name.charAt(0).toUpperCase();
  ctx.fillStyle = pillarColor;
  ctx.font = `bold ${SIZE * 0.22}px DM Sans, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, cx, cy - SIZE * 0.07);

  // ── Pillar name ───────────────────────────────────────────────────────────
  ctx.fillStyle = '#E8A838';
  ctx.font = `bold ${SIZE * 0.055}px DM Sans, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(cert.pillar_name.toUpperCase(), cx, cy + SIZE * 0.14);

  // ── Divider line ─────────────────────────────────────────────────────────
  const lineHalfW = SIZE * 0.25;
  ctx.strokeStyle = '#1e2f45';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - lineHalfW, cy + SIZE * 0.2);
  ctx.lineTo(cx + lineHalfW, cy + SIZE * 0.2);
  ctx.stroke();

  // ── Student name ─────────────────────────────────────────────────────────
  ctx.fillStyle = '#f0f4f8';
  ctx.font = `600 ${SIZE * 0.048}px DM Sans, sans-serif`;
  ctx.textAlign = 'center';
  // Truncate name if too long
  const maxNameWidth = SIZE * 0.72;
  let displayName = profile.name;
  while (ctx.measureText(displayName).width > maxNameWidth && displayName.length > 3) {
    displayName = displayName.slice(0, -1);
  }
  if (displayName !== profile.name) displayName += '…';
  ctx.fillText(displayName, cx, cy + SIZE * 0.31);

  // ── "Certified by Proplr" footer ─────────────────────────────────────────
  ctx.fillStyle = '#4a6785';
  ctx.font = `${SIZE * 0.038}px DM Sans, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Certified by Proplr', cx, cy + SIZE * 0.41);

  // ── "✦ PROPLR" watermark at top ──────────────────────────────────────────
  ctx.fillStyle = '#E8A838';
  ctx.font = `bold ${SIZE * 0.04}px DM Sans, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('\u2726 PROPLR', cx, SIZE * 0.1);

  // ── Download trick ───────────────────────────────────────────────────────
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `proplr-badge-${cert.pillar_name.replace(/\s+/g, '-').toLowerCase()}.png`;
  a.click();
}
