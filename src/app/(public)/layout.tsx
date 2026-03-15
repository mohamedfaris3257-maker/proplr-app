import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ScrollAnimations } from '@/components/public/ScrollAnimations';
import { ScrollEffects } from '@/components/public/ScrollEffects';
import { ScrollProgress } from '@/components/public/ScrollProgress';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pub-root min-h-screen flex flex-col">
      <ScrollProgress />
      <PublicNav />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
      <ScrollAnimations />
      <ScrollEffects />
    </div>
  );
}
