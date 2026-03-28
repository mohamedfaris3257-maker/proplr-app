'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Adds scroll-driven visual effects:
 * - Parallax offset for .pub-parallax elements
 * - Scale-up for .pub-scroll-scale elements
 * - Counter animation for .pub-counter elements
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;

        // Parallax - moves elements at different speeds
        document.querySelectorAll<HTMLElement>('.pub-parallax').forEach((el) => {
          const speed = parseFloat(el.dataset.speed || '0.3');
          const rect = el.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < vh) {
            const offset = (scrollY - el.offsetTop) * speed;
            el.style.transform = `translateY(${offset}px)`;
          }
        });

        // Scroll-scale - grows as it enters viewport center
        document.querySelectorAll<HTMLElement>('.pub-scroll-scale').forEach((el) => {
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const progress = Math.max(0, Math.min(1, 1 - Math.abs(center - vh / 2) / (vh / 2)));
          const scale = 0.85 + progress * 0.15;
          const opacity = 0.4 + progress * 0.6;
          el.style.transform = `scale(${scale})`;
          el.style.opacity = `${opacity}`;
        });

        ticking = false;
      });
    };

    // Counter animation - counts up when element enters view
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.target || '0', 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 1500;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            el.textContent = `${prefix}${current}${suffix}`;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('.pub-counter').forEach((el) => {
      counterObserver.observe(el);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', onScroll);
      counterObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
