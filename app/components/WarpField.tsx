'use client';

import { useEffect, useRef } from 'react';

/**
 * Hyperspace / wormhole background.
 * White particles stream radially out of (or back into) the vanishing point,
 * accelerating with scroll velocity and reversing direction every few seconds.
 */

type Star = {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
  seen: boolean;
};

const Z_NEAR = 0.45;
const Z_FAR = 6;

export default function WarpField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const spawn = (star: Star, z?: number) => {
      // uniform-ish disc so the field looks dense near the core
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 1.25;
      star.x = Math.cos(a) * r;
      star.y = Math.sin(a) * r;
      star.z = z ?? rand(Z_NEAR, Z_FAR);
      star.seen = false;
      return star;
    };

    const build = () => {
      const count = Math.round(
        Math.min(1800, Math.max(350, (w * h) / (reduce ? 4000 : 950)))
      );
      stars = Array.from({ length: count }, () =>
        spawn({ x: 0, y: 0, z: 0, px: 0, py: 0, seen: false })
      );
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      build();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ---------------------------------------------------------- interaction */
    let pointerX = 0;
    let pointerY = 0;
    const onMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // scroll velocity → warp boost (and inward pull when scrolling back up)
    let lastScroll = window.scrollY;
    let scrollBoost = 0;
    const onScroll = () => {
      const dy = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      scrollBoost = Math.max(-6, Math.min(6, scrollBoost + dy * 0.035));
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      rootMargin: '80px',
    });
    io.observe(canvas);
    const onVis = () => (visible = !document.hidden);
    document.addEventListener('visibilitychange', onVis);

    /* ---------------------------------------------------------------- loop */
    let dir = 1; // +1 = flying out of the core, -1 = falling back in
    let dirTarget = 1;
    let nextFlip = 11;
    let t = 0;
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      t += dt;

      // periodic direction reversal — eases through zero so it feels like a drag
      if (t > nextFlip) {
        dirTarget *= -1;
        nextFlip = t + rand(9, 16);
      }
      dir += (dirTarget - dir) * dt * 0.9;
      scrollBoost *= Math.pow(0.004, dt);

      const focal = Math.min(w, h) * 0.95;
      const cx = w / 2 + pointerX * 26;
      const cy = h * 0.42 + pointerY * 18;

      // motion-blur trail instead of a hard clear
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${reduce ? 1 : 0.26})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      const base = reduce ? 0.1 : 1.05;
      const speed = (base + Math.abs(scrollBoost) * 0.25) * (dir + scrollBoost * 0.18);
      const maxR = Math.hypot(w, h) / 2;

      for (const s of stars) {
        // geometric approach → constant acceleration in screen space
        s.z *= Math.exp(-speed * dt);

        if (s.z <= Z_NEAR) spawn(s, Z_FAR);
        else if (s.z >= Z_FAR) spawn(s, Z_NEAR);

        const k = (focal * Z_NEAR) / s.z;
        const sx = cx + s.x * k;
        const sy = cy + s.y * k;

        if (!s.seen) {
          s.px = sx;
          s.py = sy;
          s.seen = true;
        }

        // brightness ramps as the particle races away from the vanishing point
        const n = Math.min(1, Math.hypot(sx - cx, sy - cy) / maxR);
        const inView = sx > -140 && sx < w + 140 && sy > -140 && sy < h + 140;

        if (inView) {
          const alpha = Math.min(1, 0.1 + Math.pow(n, 0.8) * 0.95);
          const size = 0.4 + n * 1.9;
          let dx = sx - s.px;
          let dy = sy - s.py;
          const len = Math.hypot(dx, dy);
          if (len > 240) {
            dx *= 240 / len;
            dy *= 240 / len;
          }

          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(sx - dx, sy - dy);
          ctx.lineTo(sx, sy);
          ctx.stroke();

          if (n > 0.55) {
            ctx.fillStyle = `rgba(255,255,255,${(n - 0.55) * 1.3})`;
            ctx.beginPath();
            ctx.arc(sx, sy, size * 0.9, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        s.px = sx;
        s.py = sy;
      }

      ctx.globalCompositeOperation = 'source-over';
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-[0.5] [mask-image:radial-gradient(125%_95%_at_50%_42%,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.7)_34%,#000_58%,transparent_92%)]"
    />
  );
}
