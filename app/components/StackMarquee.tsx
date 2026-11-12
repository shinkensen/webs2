'use client';

import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiNodedotjs,
  SiPython,
  SiCplusplus,
  SiIntellijidea,
  SiNextdotjs,
  SiSupabase,
  SiReact,
  SiTypescript,
  SiLinux,
  SiGnubash,
  SiNpm,
  SiGithub,
  SiRender,
  SiGit,
  SiExpress,
  SiVercel,
  SiTailwindcss,
  SiArchlinux,
  SiPostgresql,
} from 'react-icons/si';
import { DiJava } from 'react-icons/di';
import { VscCode } from 'react-icons/vsc';
import { FaAws } from 'react-icons/fa';
import type { IconType } from 'react-icons';

type Skill = { name: string; icon: IconType };

const skills: Skill[] = [
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'React', icon: SiReact },
  { name: 'Next.js', icon: SiNextdotjs },
  { name: 'Node.js', icon: SiNodedotjs },
  { name: 'Express', icon: SiExpress },
  { name: 'Tailwind', icon: SiTailwindcss },
  { name: 'HTML5', icon: SiHtml5 },
  { name: 'CSS3', icon: SiCss3 },
  { name: 'Python', icon: SiPython },
  { name: 'Java', icon: DiJava },
  { name: 'C++', icon: SiCplusplus },
  { name: 'Bash', icon: SiGnubash },
  { name: 'Linux', icon: SiLinux },
  { name: 'Arch', icon: SiArchlinux },
  { name: 'Postgres', icon: SiPostgresql },
  { name: 'Supabase', icon: SiSupabase },
  { name: 'AWS', icon: FaAws },
  { name: 'Vercel', icon: SiVercel },
  { name: 'Render', icon: SiRender },
  { name: 'Git', icon: SiGit },
  { name: 'GitHub', icon: SiGithub },
  { name: 'npm', icon: SiNpm },
  { name: 'VS Code', icon: VscCode },
  { name: 'IntelliJ', icon: SiIntellijidea },
];

const rows: Skill[][] = [skills.slice(0, 9), skills.slice(9, 17), skills.slice(17)];

function Pill({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  return (
    <div className="group mx-1.5 flex shrink-0 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-3.5 backdrop-blur-sm transition-all duration-500 hover:border-white/25 hover:bg-white/[0.07]">
      <Icon className="text-xl text-white/45 transition-all duration-500 group-hover:scale-110 group-hover:text-white" />
      <span className="whitespace-nowrap text-[13px] font-medium text-white/55 transition-colors duration-500 group-hover:text-white">
        {skill.name}
      </span>
    </div>
  );
}

export default function StackMarquee() {
  return (
    <div className="mask-fade-x space-y-3 py-2">
      {rows.map((row, i) => (
        <div key={i} className="marquee-row overflow-hidden">
          <div
            className={`marquee-track ${i % 2 === 0 ? 'marquee-left' : 'marquee-right'}`}
            style={{ ['--duration' as string]: `${34 + i * 9}s` }}
          >
            {[...row, ...row, ...row, ...row].map((s, idx) => (
              <Pill key={`${s.name}-${idx}`} skill={s} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
