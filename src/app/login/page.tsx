import { LoginForm } from '@/components/auth/LoginForm';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center shadow-glow mb-4">
            <Sparkles className="w-7 h-7 text-background" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">proplr</h1>
          <p className="text-text-secondary text-sm mt-1">UAE Student Career Development</p>
        </div>

        {/* Card */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-1">Welcome back</h2>
          <p className="text-text-muted text-sm mb-6">Sign in to continue your journey</p>
          <LoginForm />
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
