'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollAnimations() {
  const pathname = usePathname();

  const initObserver = useCallback(() => {
    // Mark doc so CSS can hide reveals only when JS is active
    document.documentElement.classList.add('js-animations');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    // Small delay to let the new page render its DOM
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.reveal');
      els.forEach((el) => {
        // Reset previous state so elements re-animate on navigation
        el.classList.remove('in-view');

        // Force reflow to restart CSS transition
        void (el as HTMLElement).offsetHeight;

        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('in-view');
        } else {
          observer.observe(el);
        }
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Re-run observer whenever pathname changes (client-side navigation)
  useEffect(() => {
    const cleanup = initObserver();
    return cleanup;
  }, [pathname, initObserver]);

  // Also handle dynamically added elements via MutationObserver
  useEffect(() => {
    const mutationObserver = new MutationObserver((mutations) => {
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              intersectionObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
      );

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('reveal') && !node.classList.contains('in-view')) {
              intersectionObserver.observe(node);
            }
            node.querySelectorAll('.reveal:not(.in-view)').forEach((el) => {
              intersectionObserver.observe(el);
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
    return () => mutationObserver.disconnect();
  }, []);

  return null;
}
