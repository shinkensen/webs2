'use client';

import { useEffect, useRef, useState } from 'react';

const items = [
  {
    index: '01',
    title: 'Full-stack engineering',
    body: 'Designing and shipping end-to-end products with Next.js, React and TypeScript — typed APIs, server components, auth, storage and deployment pipelines that actually hold up.',
    tags: ['Next.js', 'React', 'TypeScript', 'Node'],
  },
  {
    index: '02',
    title: 'Interface craft',
    body: 'Motion, hierarchy and restraint. I care about the half-pixel: easing curves, focus states, perceived latency and layouts that feel inevitable rather than designed.',
    tags: ['Tailwind', 'Motion', 'Design systems'],
  },
  {
    index: '03',
    title: 'Algorithms & systems',
    body: 'A strong DSA foundation in Java, C++ and Python, plus daily life in Arch Linux and Windows — bash tooling, system configuration and understanding the machine underneath.',
    tags: ['Java', 'C++', 'Python', 'Linux'],
  },
  {
    index: '04',
    title: 'Hardware & embedded',
    body: 'Schematics, PCB layout and firmware for things that physically exist — a wireless ESP32 keyboard, an RC hypercar with active aero, custom dev boards. Software is better when you know what it runs on.',
    tags: ['ESP32', 'KiCad', 'Fusion 360', 'C++'],
  },
  {
    index: '05',
    title: 'Hackathons',
    body: 'Rapid prototyping under pressure. Recognised for IntelliNotes — an AI-assisted notes platform for students and educators built and shipped inside a weekend.',
    tags: ['Prototyping', 'Teams', 'Shipping'],
  },
];

export default function FocusScroller() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!top) return;
        const idx = refs.current.findIndex((r) => r === top.target);
        if (idx >= 0) setActive(idx);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0.1, 0.5, 0.9] }
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-20">
      {/* sticky rail */}
      <div className="hidden lg:block">
        <div className="sticky top-32">
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/35">Focus areas</p>
          <div className="mt-8 space-y-1">
            {items.map((item, i) => (
              <button
                key={item.index}
                onClick={() =>
                  refs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
                className="group flex w-full items-center gap-4 py-2 text-left"
              >
                <span
                  className="h-px bg-white transition-all duration-500"
                  style={{
                    width: active === i ? 36 : 14,
                    opacity: active === i ? 1 : 0.25,
                  }}
                />
                <span
                  className={`text-sm transition-all duration-500 ${
                    active === i ? 'text-white' : 'text-white/35 group-hover:text-white/70'
                  }`}
                >
                  {item.title}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-10 flex items-baseline gap-2">
            <span className="display text-5xl text-white">{items[active].index}</span>
            <span className="text-sm text-white/30">/ {String(items.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* panels */}
      <div className="space-y-5 sm:space-y-7">
        {items.map((item, i) => (
          <div
            key={item.index}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-reveal
            className={`card card-glow p-7 transition-all duration-700 sm:p-10 ${
              active === i ? 'lg:border-white/25 lg:bg-white/[0.06]' : 'lg:opacity-55'
            }`}
          >
            <div className="flex items-start justify-between gap-6">
              <h3 className="display text-2xl text-white sm:text-3xl">{item.title}</h3>
              <span className="mt-1 font-mono text-[11px] text-white/25">{item.index}</span>
            </div>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/55">{item.body}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/45"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
