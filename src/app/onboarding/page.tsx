import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-background" />
          </div>
          <span className="text-xl font-bold text-text-primary">proplr</span>
        </div>

        <OnboardingFlow />
      </div>
    </div>
  );
}
