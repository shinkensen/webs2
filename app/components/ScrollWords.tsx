'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const words = text.split(' ');

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 when element top hits 80% of viewport, 1 when bottom passes 35%
        const start = vh * 0.85;
        const end = vh * 0.3;
        const p = (start - rect.top) / (start - end + rect.height * 0.6);
        setProgress(Math.min(1, Math.max(0, p)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p
      ref={ref}
      className="display mx-auto max-w-5xl text-center text-[clamp(1.6rem,4.6vw,3.6rem)] leading-[1.15]"
    >
      {words.map((word, i) => {
        const point = i / words.length;
        const local = Math.min(1, Math.max(0, (progress - point) / 0.14));
        return (
          <span
            key={`${word}-${i}`}
            className="inline-block"
            style={{
              color: `rgba(255,255,255,${0.12 + local * 0.88})`,
              filter: `blur(${(1 - local) * 4}px)`,
              transform: `translateY(${(1 - local) * 8}px)`,
              transition: 'color 200ms linear, filter 200ms linear, transform 200ms linear',
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        );
      })}
    </p>
  );
}
