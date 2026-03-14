import { RegisterForm } from '@/components/auth/RegisterForm';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
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
        <p style={styles.logoSub}>UAE Student Career Development</p>

        {/* Card */}
        <div style={styles.card}>
          <h2 style={styles.heading}>Create your account</h2>
          <p style={styles.subheading}>Start building your career path</p>
          <RegisterForm />
        </div>

        <p style={styles.footer}>
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
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
    maxWidth: 400,
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
  card: {
    width: '100%',
    background: '#fff',
    borderRadius: 20,
    padding: '28px 24px',
    border: '0.5px solid rgba(7,22,41,.08)',
  },
  heading: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: '#071629',
    margin: 0,
  },
  subheading: {
    fontSize: 13.5,
    color: '#6e7591',
    margin: '4px 0 22px',
  },
  footer: {
    fontSize: 11.5,
    color: '#6e7591',
    textAlign: 'center',
    marginTop: 20,
  },
};
