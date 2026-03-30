import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthBackground } from '@/components/auth/AuthBackground';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
    }}>
      <AuthBackground />

      <div style={{
        width: '100%',
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 6,
          animation: 'authFloat 4s ease-in-out infinite',
        }}>
          <div style={{
            width: 46,
            height: 46,
            background: 'linear-gradient(135deg, #0ea5e9, #a855f7)',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(14,165,233,0.3)',
            animation: 'authGlow 4s ease-in-out infinite',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="#ffcb5d" />
              <line x1="12" y1="2" x2="12" y2="9" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="12" y1="15" x2="12" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="2" y1="12" x2="9" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="15" y1="12" x2="22" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: 26,
            color: '#fff',
            letterSpacing: -0.5,
          }}>PROPLR</span>
        </div>
        <p style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.4)',
          marginTop: 2,
          marginBottom: 32,
        }}>UAE Student Career Development</p>

        {/* Card */}
        <div style={{
          width: '100%',
          background: 'rgba(17,31,54,0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 24,
          padding: '32px 28px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: '#fff',
            margin: 0,
            letterSpacing: -0.3,
          }}>Join Proplr — It&apos;s Free</h2>
          <p style={{
            fontSize: 13.5,
            color: '#64748b',
            margin: '6px 0 24px',
          }}>Join our community for free. Upgrade to a program anytime.</p>
          <RegisterForm />
        </div>

        <p style={{
          fontSize: 11.5,
          color: 'rgba(255,255,255,0.25)',
          textAlign: 'center',
          marginTop: 24,
        }}>
          Join for free. No credit card required. You can upgrade anytime.
        </p>
      </div>
    </div>
  );
}
