import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ScrollAnimations } from '@/components/public/ScrollAnimations';
import { ScrollEffects } from '@/components/public/ScrollEffects';
import { ScrollProgress } from '@/components/public/ScrollProgress';
import { PageTransition } from '@/components/public/PageTransition';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pub-root min-h-screen flex flex-col">
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <ScrollProgress />
      <PublicNav />
      <main id="main-content" className="flex-1" role="main">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <PublicFooter />
      <ScrollAnimations />
      <ScrollEffects />
    </div>
  );
}
