'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Compass', href: '/compass' },
  { label: 'Showcase', href: '/showcase' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Shop', href: '/shop' },
  { label: 'Admin', href: '/admin' },
];

const PROGRAMS_LINKS = [
  { label: 'Foundation (K-12)', href: '/foundation', desc: 'Grades 8–12 co-curricular program' },
  { label: 'Impact (University)', href: '/impact', desc: 'University-level industry program' },
  { label: 'Summer Camp', href: '/summer-camp', desc: 'Intensive pre-September experience' },
];

export function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
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

  return (
    <header
      className="sticky top-0 z-50"
      style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.88)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 20, color: '#071629', letterSpacing: '-0.04em' }}>
            propl<span style={{ color: '#3d9be9' }}>r</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Programs dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProgramsOpen((o) => !o)}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-[#f5f5f7]"
              style={{ color: programsOpen ? '#3d9be9' : '#1d1d1f' }}
            >
              Programs
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                style={{ transform: programsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {programsOpen && (
              <div
                className="absolute top-full left-1/2 mt-2 w-72 rounded-2xl overflow-hidden shadow-xl"
                style={{ transform: 'translateX(-50%)', background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}
              >
                {PROGRAMS_LINKS.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setProgramsOpen(false)}
                    className="flex flex-col px-5 py-4 hover:bg-[#f5f5f7] transition-colors border-b border-gray-50 last:border-0"
                  >
                    <span className="font-semibold text-[#1d1d1f] text-sm">{p.label}</span>
                    <span className="text-xs text-[#6e6e73] mt-0.5">{p.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-[#f5f5f7]"
              style={{ color: '#1d1d1f' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA buttons (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-[#f5f5f7]"
            style={{ color: '#6e6e73' }}
          >
            Sign In
          </Link>
          <Link href="/register" className="pub-btn-primary pub-btn-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="#071629" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="#071629" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="px-6 py-4 space-y-1">
            <p className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wider mb-2 px-3">Programs</p>
            {PROGRAMS_LINKS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
              >
                {p.label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-3" />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-3" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#6e6e73] hover:bg-[#f5f5f7] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="pub-btn-primary w-full text-center mt-2 block"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
