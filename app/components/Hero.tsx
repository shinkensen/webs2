'use client';

import { useEffect, useRef, useState } from 'react';
import WarpField from './WarpField';

const TITLE = ['Govind', 'Nair'];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));

    const el = ref.current;
    const onMove = (e: PointerEvent) => {
      if (!el) return;
      const { innerWidth, innerHeight } = window;
      el.style.setProperty('--px', `${(e.clientX / innerWidth - 0.5) * 2}`);
      el.style.setProperty('--py', `${(e.clientY / innerHeight - 0.5) * 2}`);
      el.style.setProperty('--spot-x', `${e.clientX}px`);
      el.style.setProperty('--spot-y', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* layered background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg mask-radial absolute inset-0 opacity-40" />
        <WarpField />
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background:
              'radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 30%), rgba(255,255,255,0.09), transparent 70%)',
          }}
        />
        <div className="absolute left-1/2 top-[-18%] h-[520px] w-[820px] -translate-x-1/2 rounded-[50%] bg-white/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* floating rings */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
        <div
          className="animate-float absolute left-[8%] top-[22%] h-28 w-28 rounded-full border border-white/10"
          style={{
            transform:
              'translate3d(calc(var(--px, 0) * 18px), calc(var(--py, 0) * 18px), 0)',
          }}
        />
        <div
          className="animate-float absolute right-[10%] top-[30%] h-44 w-44 rounded-full border border-white/[0.07]"
          style={{ animationDelay: '-3s' }}
        />
        <div className="animate-spin-slow absolute bottom-[14%] right-[18%] h-24 w-24 rounded-xl border border-white/10" />
      </div>

      <div className="relative w-full max-w-6xl">
        {/* title */}
        <h1 className="display text-center text-[clamp(3.2rem,13vw,10.5rem)]">
          {TITLE.map((word, wi) => (
            <span key={word} className="mx-[0.12em] inline-block overflow-hidden pb-[0.08em]">
              {word.split('').map((char, ci) => (
                <span
                  key={`${char}-${ci}`}
                  className="gradient-text inline-block transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: mounted ? 'none' : 'translateY(110%) rotate(6deg)',
                    opacity: mounted ? 1 : 0,
                    transitionDelay: `${120 + (wi * 6 + ci) * 45}ms`,
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* subline */}
        <div
          className={`mx-auto mt-8 max-w-2xl text-center transition-all duration-1000 ${
            mounted ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-sm'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <p className="text-balance text-[17px] leading-relaxed text-white/60 sm:text-xl">
            16-year-old developer from Illinois building full-stack products with
            TypeScript, React and Next.js — obsessed with clean systems, fast
            interfaces and the details in between.
          </p>
        </div>

        {/* actions */}
        <div
          className={`mt-10 flex flex-col items-center justify-center gap-3 transition-all duration-1000 sm:flex-row ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: '860ms' }}
        >
          <a
            href="#stats"
            className="group relative w-full overflow-hidden rounded-full bg-white px-7 py-3.5 text-center text-sm font-medium text-black transition-transform duration-300 hover:scale-[1.03] active:scale-95 sm:w-auto"
          >
            <span className="relative z-10">Explore the work</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
          <a
            href="#contact"
            className="w-full rounded-full border border-white/15 px-7 py-3.5 text-center text-sm font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:text-white sm:w-auto"
          >
            Get in touch
          </a>
        </div>
      </div>

      {/* scroll hint */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-1000 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1200ms' }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/35">Scroll</span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/15 pt-1.5">
            <span className="animate-scroll-hint block h-1.5 w-1 rounded-full bg-white/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
