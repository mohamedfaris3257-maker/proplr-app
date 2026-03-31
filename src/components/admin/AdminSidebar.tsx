'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProplrIcon } from '@/components/ProplrLogo';

const adminNav = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Students', href: '/admin/students' },
  { label: 'Courses', href: '/admin/courses' },
  { label: 'Events', href: '/admin/events' },
  { label: 'Opportunities', href: '/admin/opportunities' },
  { label: 'Certificates', href: '/admin/certificates' },
  { label: 'Badges', href: '/admin/badges' },
  { label: 'Communities', href: '/admin/communities' },
  { label: 'Tasks', href: '/admin/tasks' },
  { label: 'Blog', href: '/admin/blog' },
  { label: 'FAQ', href: '/admin/faq' },
  { label: 'Partners', href: '/admin/partners' },
  { label: 'Club Interest', href: '/admin/club-interest' },
  { label: 'Summer Camp', href: '/admin/summer-camp' },
  { label: 'Showcase', href: '/admin/showcase' },
  { label: 'Careers', href: '/admin/careers' },
  { label: 'Mentors', href: '/admin/mentors' },
  { label: 'Newsletter', href: '/admin/newsletter' },
  { label: 'Merch Store', href: '/admin/merch' },
  { label: 'Applications', href: '/admin/applications' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: '#fff',
        borderRight: '0.5px solid rgba(7,22,41,0.08)',
        display: 'flex',
        flexDirection: 'column',
        padding: '18px 10px',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 8px 8px',
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          fontSize: 16,
          color: '#071629',
          textDecoration: 'none',
        }}
      >
        <ProplrIcon size={26} />
        PROPLR
      </Link>

      {/* Admin badge */}
      <div
        style={{
          margin: '0 8px 16px',
          background: 'rgba(61,155,233,0.1)',
          borderRadius: 8,
          padding: '4px 10px',
          fontSize: 11,
          fontWeight: 600,
          color: '#3d9be9',
          textAlign: 'center',
        }}
      >
        ADMIN PANEL
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {adminNav.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '7px 11px',
                borderRadius: 100,
                fontSize: 12.5,
                color: active ? '#3d9be9' : '#6e7591',
                background: active ? 'rgba(61,155,233,0.08)' : 'transparent',
                textDecoration: 'none',
                fontWeight: active ? 600 : 400,
                transition: 'all .15s',
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div style={{ borderTop: '0.5px solid rgba(7,22,41,0.08)', paddingTop: 10, marginTop: 10 }}>
        <Link
          href="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '7px 11px',
            borderRadius: 100,
            fontSize: 12.5,
            color: '#6e7591',
            textDecoration: 'none',
          }}
        >
          ← Student Dashboard
        </Link>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '7px 11px',
            borderRadius: 100,
            fontSize: 12.5,
            color: '#6e7591',
            textDecoration: 'none',
          }}
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
