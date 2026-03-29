'use client';

import { useEffect, useRef } from 'react';

/**
 * Full-screen animated background for login/register pages.
 *
 * Three layers:
 * 1. Deep ocean gradient base
 * 2. Canvas — rising particles (bubbles of potential) + a slow-spinning propeller
 * 3. CSS undulating waves at the bottom that breathe in and out
 */
export function AuthBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Particles (rising bubbles of light)
    interface Particle {
      x: number;
      y: number;
      r: number;
      speed: number;
      opacity: number;
      hue: number;
      drift: number;
      phase: number;
    }

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 45;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 0.4 + 0.15,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.6 ? 199 : Math.random() > 0.5 ? 45 : 270, // cyan, gold, purple
        drift: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // ── Propeller
    let propellerAngle = 0;
    const PROPELLER_SPEED = 0.004;

    function drawPropeller(time: number) {
      if (!ctx) return;
      propellerAngle += PROPELLER_SPEED;

      const cx = w * 0.82;
      const cy = h * 0.25;
      const bladeLen = Math.min(w, h) * 0.12;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(propellerAngle);
      ctx.globalAlpha = 0.06;

      // 4 blades
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.rotate((Math.PI / 2) * i);
        ctx.beginPath();
        ctx.ellipse(0, -bladeLen * 0.55, bladeLen * 0.12, bladeLen * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.restore();
      }

      // Center hub
      ctx.beginPath();
      ctx.arc(0, 0, bladeLen * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = '#ffcb5d';
      ctx.globalAlpha = 0.15;
      ctx.fill();

      ctx.restore();
    }

    // ── Connecting lines between nearby particles
    function drawConnections() {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(14,165,233,${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    // ── Animation loop
    let time = 0;
    function animate() {
      time += 0.016;
      ctx!.clearRect(0, 0, w, h);

      // Draw connecting lines
      drawConnections();

      // Draw propeller
      drawPropeller(time);

      // Draw & update particles
      for (const p of particles) {
        // Rise upward
        p.y -= p.speed;
        // Gentle horizontal sway
        p.x += Math.sin(time * 0.5 + p.phase) * p.drift;

        // Reset if off screen
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        // Breathing opacity
        const breathe = Math.sin(time * 0.8 + p.phase) * 0.15;
        const alpha = Math.max(0.05, p.opacity + breathe);

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha})`;
        ctx!.fill();

        // Glow ring on larger particles
        if (p.r > 2) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx!.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha * 0.1})`;
          ctx!.fill();
        }
      }

      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {/* Base gradient — deep ocean */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, #040d1a 0%, #071629 30%, #0a1e3d 60%, #0c2445 100%)',
      }} />

      {/* Radial glow spots */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: 500,
        height: 500,
        background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '40%',
        width: 600,
        height: 300,
        background: 'radial-gradient(ellipse, rgba(255,203,93,0.04) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
      }} />

      {/* Canvas layer — particles + propeller */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Undulating waves at bottom — CSS animated */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, overflow: 'hidden' }}>
        {/* Wave 1 — furthest back */}
        <div style={{
          position: 'absolute',
          bottom: -10,
          left: '-5%',
          width: '110%',
          height: 120,
          background: 'rgba(14,165,233,0.04)',
          borderRadius: '50% 50% 0 0',
          animation: 'authWave1 8s ease-in-out infinite',
        }} />
        {/* Wave 2 — mid */}
        <div style={{
          position: 'absolute',
          bottom: -15,
          left: '-5%',
          width: '110%',
          height: 100,
          background: 'rgba(14,165,233,0.06)',
          borderRadius: '45% 55% 0 0',
          animation: 'authWave2 6s ease-in-out infinite',
        }} />
        {/* Wave 3 — closest */}
        <div style={{
          position: 'absolute',
          bottom: -5,
          left: '-5%',
          width: '110%',
          height: 70,
          background: 'rgba(14,165,233,0.03)',
          borderRadius: '55% 45% 0 0',
          animation: 'authWave3 7s ease-in-out infinite',
        }} />
      </div>

      {/* Grid overlay for depth */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.02,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Inline keyframes */}
      <style>{`
        @keyframes authWave1 {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-15px) scaleY(1.15); }
        }
        @keyframes authWave2 {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(20px) translateY(-10px); }
          66% { transform: translateX(-15px) translateY(-5px); }
        }
        @keyframes authWave3 {
          0%, 100% { transform: translateY(0) scaleX(1); }
          50% { transform: translateY(-8px) scaleX(1.02); }
        }
        @keyframes authFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes authPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes authGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(14,165,233,0.1), 0 0 60px rgba(14,165,233,0.05); }
          50% { box-shadow: 0 0 40px rgba(14,165,233,0.2), 0 0 80px rgba(14,165,233,0.08); }
        }
      `}</style>
    </div>
  );
}
