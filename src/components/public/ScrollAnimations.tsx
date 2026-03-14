'use client';

import { useEffect } from 'react';

export function ScrollAnimations() {
  useEffect(() => {
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

    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => {
      // Immediately reveal elements already in the viewport
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in-view');
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
