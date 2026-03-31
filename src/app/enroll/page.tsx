import { EnrollmentForm } from '@/components/enroll/EnrollmentForm';
import { ProplrIcon } from '@/components/ProplrLogo';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function EnrollPage() {
  return (
    <div style={styles.root}>
      <div style={styles.inner}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <ProplrIcon size={38} variant="dark" />
          <span style={styles.logoText}>PROPLR</span>
        </div>
        <p style={styles.logoSub}>Join for free — decide on a program later</p>

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
