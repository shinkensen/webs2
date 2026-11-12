import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';
import StackMarquee from './components/StackMarquee';
import FocusScroller from './components/FocusScroller';
import ScrollWords from './components/ScrollWords';
import ScrollEffects from './components/ScrollEffects';
import GithubCard from './components/GithubCard';
import { SiGithub } from 'react-icons/si';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div data-reveal className="flex items-center gap-3">
      <span className="h-px w-8 bg-white/25" />
      <span className="text-[11px] uppercase tracking-[0.25em] text-white/40">{children}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="noise relative min-h-screen bg-black text-white">
      <ScrollEffects />
      <Nav />

      <main>
        <Hero />

        {/* ---------------- ABOUT ---------------- */}
        <section id="about" className="relative px-6 py-28 sm:py-40">
          <div className="mx-auto max-w-6xl">
            <Eyebrow>About</Eyebrow>

            <div className="mt-10 grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
              <div>
                <h2
                  data-reveal
                  className="display text-balance text-[clamp(2rem,5vw,3.75rem)] text-white"
                >
                  I build things for the web, and I&nbsp;don&apos;t stop at
                  &ldquo;it&nbsp;works&rdquo;.
                </h2>
                <div
                  data-reveal
                  style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
                  className="mt-8 space-y-5 text-[15px] leading-relaxed text-white/55 sm:text-base"
                >
                  <p>
                    I&apos;m Govind — a 16-year-old programmer from Illinois, currently a
                    junior at Adlai E. Stevenson High School. I spend most of my free
                    time writing TypeScript, breaking things in Arch Linux, and turning
                    half-formed ideas into deployed products.
                  </p>
                  <p>
                    My work sits at the intersection of engineering and design: full-stack
                    architecture on one side, obsessive interface detail on the other. I
                    like systems I can reason about, interfaces that feel instant, and code
                    that someone else can read six months later.
                  </p>
                </div>

                <div
                  data-reveal
                  style={{ '--reveal-delay': '200ms' } as React.CSSProperties}
                  className="mt-10 flex flex-wrap gap-6"
                >
                  <a
                    href="https://github.com/shinkensen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-sweep flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    <SiGithub /> @shinkensen
                  </a>
                  <a
                    href="#stats"
                    className="underline-sweep text-sm text-white/70 transition-colors hover:text-white"
                  >
                    See live coding stats
                  </a>
                </div>
              </div>

              {/* github card */}
              <GithubCard />
            </div>
          </div>
        </section>

        {/* ---------------- SCROLL STATEMENT ---------------- */}
        <section className="relative overflow-hidden px-6 py-32 sm:py-48">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-white/[0.045] blur-[130px]"
            data-parallax="0.06"
          />
          <ScrollWords text="Code is the cheapest material in the world. The hard part is taste — knowing what to build, what to cut, and what to make feel effortless." />
        </section>

        {/* ---------------- STATS ---------------- */}
        <section id="stats" className="relative px-6 pb-28 sm:pb-40">
          <div className="mx-auto max-w-6xl">
            <Eyebrow>Live metrics</Eyebrow>
            <h2
              data-reveal
              className="display mt-8 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] text-white"
            >
              Receipts, not claims.
            </h2>
            <p
              data-reveal
              style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/50"
            >
              Every hour below is tracked automatically while I code — pulled straight
              from the Hackatime API, outside of school hours.
            </p>

            <div className="mt-14">
              <Stats />
            </div>
          </div>
        </section>

        {/* ---------------- STACK ---------------- */}
        <section id="stack" className="relative border-y border-white/[0.07] py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <Eyebrow>Toolkit</Eyebrow>
            <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <h2 data-reveal className="display max-w-xl text-[clamp(2rem,5vw,3.5rem)] text-white">
                The stack I reach for.
              </h2>
              <p
                data-reveal="right"
                className="max-w-sm text-sm leading-relaxed text-white/45"
              >
                Languages, frameworks and tools I use daily — hover to pause.
              </p>
            </div>
          </div>

          <div className="mt-14">
            <StackMarquee />
          </div>
        </section>

        {/* ---------------- FOCUS ---------------- */}
        <section id="work" className="relative px-6 py-28 sm:py-40">
          <div className="mx-auto max-w-6xl">
            <Eyebrow>What I do</Eyebrow>
            <h2
              data-reveal
              className="display mb-16 mt-8 max-w-2xl text-[clamp(2rem,5vw,3.5rem)] text-white"
            >
              Five things I&apos;m deliberately good at.
            </h2>
            <FocusScroller />
          </div>
        </section>

        {/* ---------------- CONTACT ---------------- */}
        <section id="contact" className="relative overflow-hidden px-6 py-32 sm:py-44">
          <div className="grid-bg mask-radial pointer-events-none absolute inset-0 -z-10 opacity-60" />
          <div
            className="pointer-events-none absolute bottom-[-30%] left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-[50%] bg-white/[0.06] blur-[140px]"
            data-parallax="0.04"
          />
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>
              <span className="mx-auto">Contact</span>
            </Eyebrow>
            <h2
              data-reveal
              className="display mt-8 text-balance text-[clamp(2.2rem,7vw,5rem)] text-white"
            >
              Let&apos;s build something
              <br />
              worth shipping.
            </h2>
            <p
              data-reveal
              style={{ '--reveal-delay': '140ms' } as React.CSSProperties}
              className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-white/50 sm:text-base"
            >
              Open to collaborations, hackathon teams and ambitious side projects.
              The fastest way to reach me is GitHub.
            </p>
            <div
              data-reveal
              style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
              className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <a
                href="https://github.com/shinkensen"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-transform duration-300 hover:scale-[1.03] active:scale-95 sm:w-auto"
              >
                <SiGithub className="text-base" />
                github.com/shinkensen
              </a>
              <a
                href="#top"
                className="w-full rounded-full border border-white/15 px-8 py-4 text-sm font-medium text-white/80 transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:text-white sm:w-auto"
              >
                Back to top
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.07] px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} Govind Nair. All rights reserved.</p>
          <p className="font-mono">Built with Next.js · Deployed on Vercel</p>
        </div>
      </footer>
    </div>
  );
}
