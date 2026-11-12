'use client';

import { useEffect, useState } from 'react';

const sections = [
  { id: 'about', label: 'About' },
  { id: 'stats', label: 'Stats' },
  { id: 'stack', label: 'Stack' },
  { id: 'work', label: 'Focus' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[90] flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full px-5 transition-all duration-500 ${
          scrolled
            ? 'border border-white/10 bg-black/60 py-2.5 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.9)]'
            : 'border border-transparent bg-transparent py-4'
        }`}
      >
        <a
          href="#top"
          className="group flex items-center text-sm font-medium tracking-tight text-white transition-opacity duration-300 hover:opacity-70"
        >
          <span>Govind Nair</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`relative rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-300 ${
                active === s.id ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {active === s.id && (
                <span className="absolute inset-0 -z-10 rounded-full bg-white/10 ring-1 ring-inset ring-white/10" />
              )}
              {s.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/shinkensen"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-black transition-transform duration-300 hover:scale-[1.04] active:scale-95"
          >
            GitHub
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 md:hidden"
          >
            <div className="space-y-1">
              <span
                className={`block h-px w-3.5 bg-white transition-transform duration-300 ${
                  open ? 'translate-y-[3px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-3.5 bg-white transition-transform duration-300 ${
                  open ? '-translate-y-[3px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* mobile sheet */}
      <div
        className={`absolute inset-x-4 top-20 overflow-hidden rounded-3xl border border-white/10 bg-black/90 backdrop-blur-xl transition-all duration-500 md:hidden ${
          open ? 'max-h-80 opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-2">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
