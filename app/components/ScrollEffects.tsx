'use client';

import { useEffect } from 'react';

/**
 * Global client-side motion engine:
 *  - reveal-on-scroll for any [data-reveal] element
 *  - top scroll progress bar (--scroll-progress on <html>)
 *  - cursor-follow border glow for .card-glow elements
 *  - lightweight parallax for [data-parallax="<speed>"]
 */
export default function ScrollEffects() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- reveal ---------- */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    const register = () => {
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach((el) => {
        if (reduce) el.classList.add('is-visible');
        else observer.observe(el);
      });
    };
    register();

    const mo = new MutationObserver(register);
    mo.observe(document.body, { childList: true, subtree: true });

    /* ---------- scroll driven ---------- */
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        document.documentElement.style.setProperty('--scroll-progress', String(progress));

        if (reduce) return;
        const vh = window.innerHeight;
        for (const el of parallaxEls) {
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2 - vh / 2;
          const speed = parseFloat(el.dataset.parallax || '0');
          el.style.transform = `translate3d(0, ${(-center * speed).toFixed(2)}px, 0)`;
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    /* ---------- pointer glow ---------- */
    const onPointer = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('.card-glow');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      target.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 top-0 z-[101] h-px w-full origin-left bg-white/80"
      style={{ transform: 'scaleX(var(--scroll-progress, 0))' }}
    />
  );
}
