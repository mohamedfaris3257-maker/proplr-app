import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { ProplrIcon } from '@/components/ProplrLogo';

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
          marginBottom: 6,
          animation: 'authFloat 4s ease-in-out infinite',
        }}>
          <ProplrIcon size={52} variant="light" />
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
