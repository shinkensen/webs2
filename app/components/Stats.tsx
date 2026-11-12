'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const HACKATIME_USER = 'shinkensen';
const HACKATIME_KEY = 'd828b1d6-4bd3-4644-aca7-f42d2be7be6e';
const DAYS_WINDOW = 56;
const STREAK_MIN_MINUTES = 15;

interface Language {
  name: string;
  total_seconds: number;
  text: string;
  percent: number;
}

interface Day {
  date: string;
  seconds: number;
}

const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/* ---------- animated number ---------- */
function Counter({
  value,
  duration = 1400,
  suffix = '',
  decimals = 0,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let visible = false;

    const animate = () => {
      const from = fromRef.current;
      const start = performance.now();
      cancelAnimationFrame(raf);
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const next = from + (value - from) * eased;
        fromRef.current = next;
        setDisplay(next);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || visible) return;
        visible = true;
        animate();
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    // value may arrive after the element has already been seen
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      visible = true;
      animate();
    }

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${HACKATIME_KEY}` };
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `https://hackatime.hackclub.com/api/v1/users/${HACKATIME_USER}/stats`,
          { headers }
        );
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) {
            setTotalSeconds(json?.data?.total_seconds ?? 0);
            setLanguages(
              (json?.data?.languages ?? [])
                .filter((l: Language) => l.total_seconds > 0)
                .sort((a: Language, b: Language) => b.total_seconds - a.total_seconds)
                .slice(0, 6)
            );
          }
        }
      } catch {
        /* offline / rate limited — fall back to empty state */
      }

      // recent daily activity (bounded window, batched)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targets: Date[] = [];
      for (let i = DAYS_WINDOW - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        targets.push(d);
      }

      const out: Day[] = [];
      const BATCH = 8;
      for (let i = 0; i < targets.length; i += BATCH) {
        if (cancelled) return;
        const batch = targets.slice(i, i + BATCH);
        const results = await Promise.all(
          batch.map(async (date) => {
            const start = new Date(date).toISOString();
            const next = new Date(date);
            next.setDate(date.getDate() + 1);
            const end = next.toISOString();
            try {
              const r = await fetch(
                `https://hackatime.hackclub.com/api/v1/users/${HACKATIME_USER}/stats?start_date=${start}&end_date=${end}`,
                { headers }
              );
              if (!r.ok) return { date: fmtDate(date), seconds: 0 };
              const j = await r.json();
              return { date: fmtDate(date), seconds: j?.data?.total_seconds ?? 0 };
            } catch {
              return { date: fmtDate(date), seconds: 0 };
            }
          })
        );
        out.push(...results);
        if (!cancelled) setDays([...out]);
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const streak = useMemo(() => {
    if (!days.length) return 0;
    let count = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].seconds >= STREAK_MIN_MINUTES * 60) count++;
      else if (i !== days.length - 1) break;
    }
    return count;
  }, [days]);

  const activeDays = days.filter((d) => d.seconds > 0).length;
  const peak = Math.max(1, ...days.map((d) => d.seconds));
  const totalHours = totalSeconds / 3600;
  const windowHours = days.reduce((s, d) => s + d.seconds, 0) / 3600;

  const cards = [
    {
      label: 'Hours shipped',
      value: <Counter value={Math.round(totalHours)} suffix="h" />,
      hint: 'All-time tracked coding, outside of school',
    },
    {
      label: 'Current streak',
      value: <Counter value={streak} suffix=" d" />,
      hint: `Consecutive days over ${STREAK_MIN_MINUTES} min`,
    },
    {
      label: 'Active days',
      value: <Counter value={activeDays} />,
      hint: `Out of the last ${DAYS_WINDOW} days`,
    },
    {
      label: 'Last 8 weeks',
      value: <Counter value={windowHours} decimals={1} suffix="h" />,
      hint: 'Recent momentum',
    },
  ];

  return (
    <div className="space-y-5">
      {/* metric cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div
            key={c.label}
            data-reveal
            style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
            className="card card-glow group p-5 sm:p-6"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">{c.label}</p>
            <p className="display mt-4 text-4xl text-white sm:text-5xl">
              {loading && !totalSeconds ? <span className="text-white/20">—</span> : c.value}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-white/35">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:gap-5 lg:grid-cols-5">
        {/* activity chart */}
        <div data-reveal className="card card-glow p-5 sm:p-7 lg:col-span-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-medium text-white">Activity</h3>
            <span className="text-[11px] text-white/35">last {DAYS_WINDOW} days</span>
          </div>
          <div className="mt-7 flex h-36 items-end gap-[3px]">
            {(days.length ? days : Array.from({ length: DAYS_WINDOW }, () => null)).map((d, i) => {
              const ratio = d ? d.seconds / peak : 0;
              return (
                <div
                  key={d?.date ?? i}
                  className="group/bar relative flex-1 rounded-sm bg-white/[0.08] transition-colors duration-300 hover:bg-white"
                  style={{
                    height: `${Math.max(3, ratio * 100)}%`,
                    background:
                      ratio > 0
                        ? `rgba(255,255,255,${0.25 + ratio * 0.72})`
                        : 'rgba(255,255,255,0.06)',
                    transition: 'height 700ms cubic-bezier(0.16,1,0.3,1), background 300ms',
                    transitionDelay: `${i * 8}ms`,
                  }}
                >
                  {d && (
                    <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-2 py-1 text-[10px] text-white/80 backdrop-blur group-hover/bar:block">
                      {d.date} · {(d.seconds / 3600).toFixed(1)}h
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between text-[10px] uppercase tracking-widest text-white/25">
            <span>{days[0]?.date ?? ''}</span>
            <span>today</span>
          </div>
        </div>

        {/* languages */}
        <div data-reveal className="card card-glow p-5 sm:p-7 lg:col-span-2">
          <h3 className="text-sm font-medium text-white">Languages</h3>
          <div className="mt-7 space-y-4">
            {(languages.length
              ? languages
              : [{ name: 'Loading', text: '', percent: 0, total_seconds: 0 }]
            ).map((lang, i) => (
              <div key={lang.name}>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-white/80">{lang.name}</span>
                  <span className="tabular-nums text-white/35">
                    {lang.percent ? `${lang.percent.toFixed(1)}%` : '—'}
                  </span>
                </div>
                <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{
                      width: `${lang.percent}%`,
                      transition: 'width 1.1s cubic-bezier(0.16,1,0.3,1)',
                      transitionDelay: `${i * 110}ms`,
                      opacity: 1 - i * 0.12,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-7 text-[11px] leading-relaxed text-white/30">
            Live data via the Hackatime API — updated every time I write a line of code.
          </p>
        </div>
      </div>
    </div>
  );
}
