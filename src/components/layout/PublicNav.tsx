'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ProplrIcon } from '@/components/ProplrLogo';

const NAV_LINKS = [
  { label: 'Compass', href: '/compass' },
  { label: 'Showcase', href: '/showcase' },
  { label: 'Pricing', href: '/pricing' },
];

const PROGRAMS_LINKS = [
  { label: 'Foundation (K-12)', href: '/foundation', desc: 'Grades 8-12 co-curricular program' },
  { label: 'Impact (University)', href: '/impact', desc: 'University-level industry program' },
  { label: 'Summer Camp', href: '/summer-camp', desc: 'Intensive pre-September experience' },
];

export function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasDarkHero, setHasDarkHero] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProgramsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    // Detect if the page has a dark hero (pub-hero-image class or data-dark-hero attribute)
    const checkDarkHero = () => {
      const hero = document.querySelector('.pub-hero-image, [data-dark-hero]');
      setHasDarkHero(!!hero);
    };
    checkDarkHero();
    // Re-check on route changes (Next.js client navigation)
    const observer = new MutationObserver(checkDarkHero);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Use transparent + white text only on pages with dark hero images and when not scrolled
  const isTransparent = !scrolled && hasDarkHero;
  const textColor = isTransparent ? '#ffffff' : '#1d1d1f';
  const textMuted = isTransparent ? 'rgba(255,255,255,0.75)' : '#6e6e73';
  const logoColor = isTransparent ? '#ffffff' : '#071629';
  const hoverBg = isTransparent ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.04)';
  const hamburgerColor = isTransparent ? '#ffffff' : '#071629';

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      style={{
        backdropFilter: isTransparent ? 'none' : 'blur(20px)',
        WebkitBackdropFilter: isTransparent ? 'none' : 'blur(20px)',
        background: isTransparent ? 'transparent' : 'rgba(255,255,255,0.92)',
        borderBottom: isTransparent ? '1px solid transparent' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isTransparent ? 'none' : '0 1px 12px rgba(0,0,0,0.04)',
        transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 flex-shrink-0">
          <ProplrIcon size={32} variant={isTransparent ? 'light' : 'dark'} />
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 18, color: logoColor, letterSpacing: '-0.03em', transition: 'color 0.4s ease' }}>
            PROPLR
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Programs dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProgramsOpen((o) => !o)}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                color: programsOpen ? '#3d9be9' : textColor,
                transition: 'color 0.4s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Programs
              <motion.svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                animate={{ rotate: programsOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </button>
            <AnimatePresence>
              {programsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute top-full left-1/2 mt-2 w-72 rounded-2xl overflow-hidden shadow-xl"
                  style={{ transform: 'translateX(-50%)', background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}
                >
                  {PROGRAMS_LINKS.map((p, i) => (
                    <motion.div
                      key={p.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={p.href}
                        onClick={() => setProgramsOpen(false)}
                        className="flex flex-col px-5 py-4 hover:bg-[#f5f5f7] transition-colors border-b border-gray-50 last:border-0"
                      >
                        <span className="font-semibold text-[#1d1d1f] text-sm">{p.label}</span>
                        <span className="text-xs text-[#6e6e73] mt-0.5">{p.desc}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 rounded-full text-sm font-medium group"
              style={{
                color: textColor,
                transition: 'color 0.4s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{
              color: textMuted,
              transition: 'color 0.4s ease, background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Sign In
          </Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href="/enroll" className="pub-btn-primary pub-btn-sm">
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-5 relative flex flex-col justify-center items-center">
            <motion.span
              className="absolute block w-full h-[1.8px] rounded-full"
              style={{ background: hamburgerColor, transition: 'background 0.4s ease' }}
              animate={mobileOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              className="absolute block w-full h-[1.8px] rounded-full"
              style={{ background: hamburgerColor, transition: 'background 0.4s ease' }}
              animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute block w-full h-[1.8px] rounded-full"
              style={{ background: hamburgerColor, transition: 'background 0.4s ease' }}
              animate={mobileOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
              transition={{ duration: 0.25 }}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <div className="px-6 py-4 space-y-1">
              <p className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wider mb-2 px-3">Programs</p>
              {PROGRAMS_LINKS.map((p, i) => (
                <motion.div
                  key={p.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={p.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
                  >
                    {p.label}
                  </Link>
                </motion.div>
              ))}
              <div className="h-px bg-gray-100 my-3" />
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="h-px bg-gray-100 my-3" />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-[#6e6e73] hover:bg-[#f5f5f7] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/enroll"
                  onClick={() => setMobileOpen(false)}
                  className="pub-btn-primary w-full text-center mt-2 block"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
