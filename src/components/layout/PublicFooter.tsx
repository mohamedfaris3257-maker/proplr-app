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
              Dubai&apos;s KHDA-certified student development platform. Helping students Grades 8–22
              graduate career-ready with real experience, real mentors, and real certificates.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a href="mailto:hello@proplr.ae" style={{ color: '#8ca3be', fontSize: 13 }} className="hover:text-white transition-colors">
                hello@proplr.ae
              </a>
              <span style={{ color: '#1e2f45' }}>·</span>
              <a href="https://instagram.com/proplrae" target="_blank" rel="noreferrer" style={{ color: '#8ca3be', fontSize: 13 }} className="hover:text-white transition-colors">
                @proplrae
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
      </div>
    </footer>
  );
}
