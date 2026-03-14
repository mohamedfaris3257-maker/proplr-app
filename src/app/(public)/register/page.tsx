import type { Metadata } from 'next';
import RegistrationForm from '@/components/register/RegistrationForm';

export const metadata: Metadata = {
  title: 'Register — Proplr',
};

export default function RegisterPage() {
  return (
    <div style={{ background: '#f5f5f7', minHeight: '100vh' }}>
      {/* Subtle orbs */}
      <div className="relative overflow-hidden" style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '40px 24px 36px' }}>
        <div className="pub-orb-blue" style={{ width: 400, height: 400, top: -150, right: -100, opacity: 0.06 }} />
        <div className="pub-orb-yellow" style={{ width: 300, height: 300, top: -100, left: -80, opacity: 0.06 }} />
        <div className="max-w-[640px] mx-auto relative z-10 text-center">
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 22, color: '#071629', letterSpacing: '-0.04em', marginBottom: 8 }}>
            propl<span style={{ color: '#3d9be9' }}>r</span>
          </div>
          <h1 className="pub-heading" style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: '#071629', marginBottom: 8 }}>
            Join Proplr
          </h1>
          <p style={{ color: '#6e6e73', fontSize: 15 }}>
            UAE Student Career Development · KHDA Permit #633441
          </p>
        </div>
      </div>

      <div className="max-w-[640px] mx-auto px-4 py-10">
        <RegistrationForm />
        <p className="text-center mt-6 pb-8" style={{ fontSize: 12, color: '#9ca3af' }}>
          By registering, you agree to our Terms of Service and Privacy Policy.
          Already have an account? <a href="/login" style={{ color: '#3d9be9' }}>Sign in →</a>
        </p>
      </div>
    </div>
  );
}
