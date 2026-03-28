import Link from 'next/link';

const PLATFORM_LINKS = [
  { href: '/foundation', label: 'Foundation (K-12)' },
  { href: '/impact', label: 'Impact (University)' },
  { href: '/summer-camp', label: 'Summer Camp' },
  { href: '/compass', label: 'Compass' },
  { href: '/showcase', label: 'National Showcase' },
  { href: '/pricing', label: 'Pricing' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/partners', label: 'Partners' },
  { href: '/mentorship', label: 'Mentorship' },
  { href: '/faq', label: 'FAQ' },
  { href: '/careers', label: 'Careers' },
  { href: '/start-a-club', label: 'Start a Club' },
  { href: '/shop', label: 'Shop' },
];

export function PublicFooter() {
  return (
    <footer style={{ background: '#071629', color: '#ffffff' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 22, letterSpacing: '-0.04em', marginBottom: 12 }}>
              propl<span style={{ color: '#3d9be9' }}>r</span>
            </div>
            <p style={{ color: '#8ca3be', fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
              Dubai&apos;s KHDA-certified student development platform. Helping students Grades 8 through university
              graduate career-ready with real experience, real mentors, and real certificates.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a href="mailto:hello@proplr.ae" style={{ color: '#8ca3be', fontSize: 13 }} className="hover:text-white transition-colors">
                hello@proplr.ae
              </a>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://www.instagram.com/proplrae/" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8ca3be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="#8ca3be" stroke="none" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/proplrae/" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#8ca3be">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            <div className="mt-4">
              <span style={{ fontSize: 11, color: '#4a6785', background: 'rgba(61,155,233,0.1)', border: '1px solid rgba(61,155,233,0.2)', borderRadius: 100, padding: '4px 10px' }}>
                KHDA Permit #633441
              </span>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#4a6785', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
              Platform
            </h4>
            <ul className="space-y-2.5">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: '#8ca3be', fontSize: 14 }} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#4a6785', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
              Company
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: '#8ca3be', fontSize: 14 }} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, color: '#4a6785', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
              Legal
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
                { href: '/cookies', label: 'Cookie Policy' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: '#8ca3be', fontSize: 14 }} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e2f45', paddingTop: 24 }} className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontSize: 12, color: '#4a6785' }}>
            © {new Date().getFullYear()} Proplr. All rights reserved. Dubai, UAE.
          </p>
          <Link href="/enroll" style={{ fontSize: 13, fontWeight: 600, color: '#3d9be9' }} className="hover:text-white transition-colors">
            Get Started →
          </Link>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 16, textAlign: 'center' }}>
          Photos courtesy of <a href="https://pexels.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)' }}>Pexels</a>
        </p>
      </div>
    </footer>
  );
}
