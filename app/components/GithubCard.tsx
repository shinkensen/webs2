'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SiGithub } from 'react-icons/si';

const USERNAME = 'shinkensen';
const FALLBACK_AVATAR = 'https://avatars.githubusercontent.com/u/181016693?v=4';

/** Curated highlights — live metadata is layered on top from the GitHub API. */
const PINNED = [
  {
    repo: 'Coulomb-Fabric',
    label: 'Coulomb Fabric',
    blurb:
      'Interactive 3D electrostatics simulator — real-time fields, equipotential surfaces and particle dynamics in WebGL.',
    language: 'JavaScript',
  },
  {
    repo: 'Zephyr',
    label: 'Zephyr',
    blurb:
      'RC hypercar built from scratch — custom PCB, active aero, cable steering and on-board ESP32 FPV.',
    language: 'Hardware',
  },
  {
    repo: 'theta',
    label: 'Theta',
    blurb:
      'Agentic voice assistant in Tauri + Rust — local speech-to-text, RAG memory and tool integrations.',
    language: 'Rust',
  },
  {
    repo: 'Xenon-KB',
    label: 'Xenon KB',
    blurb:
      '85% wireless mechanical keyboard — ESP32 BLE, 96-zone RGB and fully custom case and keycaps.',
    language: 'C++',
  },
];

interface Profile {
  name?: string;
  login?: string;
  bio?: string;
  avatar_url?: string;
  public_repos?: number;
  followers?: number;
}

type RepoMeta = Record<string, { stars: number; language: string | null; pushed: string | null }>;

export default function GithubCard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [meta, setMeta] = useState<RepoMeta>({});
  const [now, setNow] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${USERNAME}`);
        if (res.ok && !cancelled) setProfile(await res.json());
      } catch {
        /* rate limited — fall back to static copy */
      }

      const entries = await Promise.all(
        PINNED.map(async (p) => {
          try {
            const r = await fetch(`https://api.github.com/repos/${USERNAME}/${p.repo}`);
            if (!r.ok) return null;
            const j = await r.json();
            return [
              p.repo,
              {
                stars: j.stargazers_count ?? 0,
                language: j.language ?? null,
                pushed: j.pushed_at ?? null,
              },
            ] as const;
          } catch {
            return null;
          }
        })
      );

      if (!cancelled) {
        setNow(Date.now());
        setMeta(Object.fromEntries(entries.filter(Boolean) as [string, RepoMeta[string]][]));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const fmtAgo = (iso: string | null) => {
    if (!iso || !now) return null;
    const days = Math.floor((now - new Date(iso).getTime()) / 86_400_000);
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  };

  return (
    <div data-reveal="right" className="card card-glow overflow-hidden">
      {/* header */}
      <div className="relative flex items-center gap-4 px-6 pb-6 pt-7">
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-white/[0.06] blur-3xl" />

        <div className="relative shrink-0">
          <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/15 grayscale transition-all duration-700 hover:grayscale-0">
            <Image
              src={profile?.avatar_url || FALLBACK_AVATAR}
              alt="Govind Nair's GitHub avatar"
              width={112}
              height={112}
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-black bg-white text-black">
            <SiGithub className="text-[11px]" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium text-white">
            {profile?.name || 'Govind Nair'}
          </p>
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-sweep inline-block font-mono text-xs text-white/45 transition-colors hover:text-white"
          >
            @{profile?.login || USERNAME}
          </a>
          <p className="mt-1.5 truncate text-xs text-white/35">
            {profile?.bio || 'Full-Stack Dev & Hardware Enthusiast!'}
          </p>
        </div>

        <div className="hidden shrink-0 text-right sm:block">
          <p className="display text-2xl tabular-nums text-white">
            {profile?.public_repos ?? '—'}
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">repos</p>
        </div>
      </div>

      {/* pinned projects */}
      <div className="border-t border-white/[0.07] px-6 py-3">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Top projects</p>
      </div>

      <div className="divide-y divide-white/[0.07]">
        {PINNED.map((p, i) => {
          const live = meta[p.repo];
          return (
            <a
              key={p.repo}
              href={`https://github.com/${USERNAME}/${p.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block px-6 py-4 transition-colors duration-500 hover:bg-white/[0.035]"
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-white/20">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium text-white/85 transition-colors group-hover:text-white">
                  {p.label}
                </span>
                <span className="ml-auto text-white/25 transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-white">
                  ↗
                </span>
              </div>

              <p className="mt-1.5 pl-[26px] text-xs leading-relaxed text-white/40">{p.blurb}</p>

              <div className="mt-2.5 flex flex-wrap items-center gap-3 pl-[26px] text-[10px] text-white/30">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                  {live?.language || p.language}
                </span>
                {live && <span className="tabular-nums">★ {live.stars}</span>}
                {live?.pushed && <span>updated {fmtAgo(live.pushed)}</span>}
              </div>
            </a>
          );
        })}
      </div>

      <a
        href={`https://github.com/${USERNAME}?tab=repositories`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between border-t border-white/[0.07] px-6 py-4 text-xs text-white/45 transition-colors hover:bg-white/[0.035] hover:text-white"
      >
        <span>View all {profile?.public_repos ?? ''} repositories</span>
        <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
      </a>
    </div>
  );
}
