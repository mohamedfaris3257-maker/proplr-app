import { EnrollmentForm } from '@/components/enroll/EnrollmentForm';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function EnrollPage() {
  return (
    <div style={styles.root}>
      <div style={styles.inner}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoBox}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="#ffcb5d" />
              <line x1="12" y1="2" x2="12" y2="9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="12" y1="15" x2="12" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="2" y1="12" x2="9" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="15" y1="12" x2="22" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={styles.logoText}>PROPLR</span>
        </div>
        <p style={styles.logoSub}>Enroll and start your journey</p>

        <Suspense fallback={<div style={{ color: '#6e7591', fontSize: 14 }}>Loading...</div>}>
          <EnrollmentForm />
        </Suspense>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    background: '#f0f2f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: "'DM Sans', sans-serif",
  },
  inner: {
    width: '100%',
    maxWidth: 520,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  logoBox: {
    width: 42,
    height: 42,
    background: '#071629',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    fontSize: 24,
    color: '#071629',
    letterSpacing: -0.5,
  },
  logoSub: {
    fontSize: 13,
    color: '#6e7591',
    marginTop: 2,
    marginBottom: 28,
  },
};
