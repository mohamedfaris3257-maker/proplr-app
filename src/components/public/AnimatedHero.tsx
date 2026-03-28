"use client";
import { motion } from "framer-motion";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Link from "next/link";

export function AnimatedHero() {
  return (
    <div className="flex flex-col overflow-hidden" style={{ background: '#fff' }}>
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center gap-6 px-4">
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'rgba(61,155,233,0.08)',
                border: '1px solid rgba(61,155,233,0.2)',
                borderRadius: 100,
                padding: '6px 18px',
                fontSize: 12,
                fontWeight: 700,
                color: '#3d9be9',
                letterSpacing: 1.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3d9be9', display: 'inline-block' }} />
              KHDA CERTIFIED &middot; PERMIT #633441 &middot; DUBAI, UAE
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: 900,
                color: '#071629',
                lineHeight: 1.05,
                letterSpacing: -2,
                margin: 0,
              }}
            >
              Your future doesn&apos;t
              <br />
              have to be a{' '}
              <span style={{
                background: 'linear-gradient(135deg, #3d9be9 0%, #ffcb5d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                guessing game.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 18,
                color: '#6e7591',
                maxWidth: 560,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Proplr gets you career-ready before you graduate - through real experiences,
              real mentors, and real industry connections. Not more homework.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <Link href="/enroll" style={{
                background: '#3d9be9',
                color: '#fff',
                borderRadius: 100,
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.3s ease',
              }}>
                Get Started &rarr;
              </Link>
              <Link href="/foundation" style={{
                background: 'transparent',
                color: '#071629',
                borderRadius: 100,
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif",
                border: '1.5px solid rgba(7,22,41,0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}>
                See How It Works
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ display: 'flex', gap: 32, marginTop: 8 }}
            >
              {[
                { num: '6', label: 'KHDA Certificates' },
                { num: '4', label: 'Program Tracks' },
                { num: 'Sep', label: '2026 Start' },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 900, color: '#071629' }}>{stat.num}</div>
                  <div style={{ fontSize: 11, color: '#6e7591', fontWeight: 600, letterSpacing: 0.5 }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        }
      >
        {/* Dashboard mockup shown inside the 3D scroll card */}
        <div style={{ width: '100%', height: '100%', background: '#f0f2f8', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Mock dashboard header */}
          <div style={{ background: '#071629', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff4757' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffcb5d' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2ed573' }} />
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 6, height: 20, maxWidth: 300 }} />
          </div>
          {/* Mock dashboard content */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '160px 1fr 200px', gap: 0 }}>
            {/* Sidebar mock */}
            <div style={{ background: '#fff', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ width: 80, height: 12, background: '#071629', borderRadius: 4 }} />
              {['Dashboard','My Program','Community','Events','Opportunities'].map((item, i) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 100, background: i === 0 ? '#3d9be9' : 'transparent' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? '#fff' : '#e0e2ea' }} />
                  <div style={{ height: 8, borderRadius: 4, background: i === 0 ? 'rgba(255,255,255,0.7)' : '#e0e2ea', flex: 1 }} />
                </div>
              ))}
            </div>
            {/* Main content mock */}
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Banner */}
              <div style={{ background: '#071629', borderRadius: 12, padding: 16, height: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
                <div style={{ width: 160, height: 12, background: 'rgba(255,255,255,0.8)', borderRadius: 4 }} />
                <div style={{ width: 100, height: 8, background: 'rgba(255,255,255,0.3)', borderRadius: 4 }} />
              </div>
              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {['#3d9be9','#ffcb5d','#2ed573','#ff4757'].map((color, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 10, padding: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: `${color}22`, marginBottom: 6 }} />
                    <div style={{ width: 24, height: 14, background: '#071629', borderRadius: 3, marginBottom: 4 }} />
                    <div style={{ width: 40, height: 8, background: '#e0e2ea', borderRadius: 3 }} />
                  </div>
                ))}
              </div>
              {/* Pillar cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { color: '#3d9be9', w: '62%' },
                  { color: '#ffcb5d', w: '38%' },
                  { color: '#2ed573', w: '100%' },
                ].map((p, idx) => (
                  <div key={idx} style={{ background: '#fff', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, borderLeft: `3px solid ${p.color}` }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: `${p.color}22` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: 80, height: 7, background: '#071629', borderRadius: 3, marginBottom: 4 }} />
                      <div style={{ height: 3, background: '#e0e2ea', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: p.w, background: p.color, borderRadius: 10 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right sidebar mock */}
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#fff', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3d9be9', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
                </div>
                <div style={{ width: 60, height: 8, background: '#071629', borderRadius: 3, margin: '0 auto 4px' }} />
                <div style={{ width: 80, height: 6, background: '#e0e2ea', borderRadius: 3, margin: '0 auto' }} />
              </div>
              <div style={{ background: '#071629', borderRadius: 10, padding: 12 }}>
                <div style={{ width: 60, height: 8, background: '#ffcb5d', borderRadius: 3, marginBottom: 10 }} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 4, height: 50 }}>
                  <div style={{ width: 28, height: 32, background: 'rgba(255,255,255,0.1)', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ width: 28, height: 48, background: '#ffcb5d', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ width: 28, height: 24, background: 'rgba(255,255,255,0.06)', borderRadius: '4px 4px 0 0' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}
