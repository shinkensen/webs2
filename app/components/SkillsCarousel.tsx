'use client';

import { useEffect, useState, useRef } from 'react';
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
} from 'react-icons/si';
import { DiJava } from 'react-icons/di';
import { VscCode } from 'react-icons/vsc';
import { FaAws } from 'react-icons/fa';

const allSkills = [
  { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
  { name: 'Express', icon: SiExpress, color: '#FFFFFF' },
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'Java', icon: DiJava, color: '#007396' },
  { name: 'C++', icon: SiCplusplus, color: '#00599C' },
  { name: 'Bash', icon: SiGnubash, color: '#4EAA25' },
  { name: 'Linux', icon: SiLinux, color: '#FCC624' },
  { name: 'AWS', icon: FaAws, color: '#FF9900' },
  { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E' },
  { name: 'IntelliJ IDEA', icon: SiIntellijidea, color: '#FFFFFF' },
  { name: 'VS Code', icon: VscCode, color: '#007ACC' },
  { name: 'NPM', icon: SiNpm, color: '#CB3837' },
  { name: 'GitHub', icon: SiGithub, color: '#FFFFFF' },
  { name: 'Render', icon: SiRender, color: '#46E3B7' },
  { name: 'Vercel', icon: SiVercel, color: '#FFFFFF' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
];

// Split into 3 rows: 7, 7, 8
const row1 = allSkills.slice(0, 7);
const row2 = allSkills.slice(7, 14);
const row3 = allSkills.slice(14, 22);

export default function SkillsCarousel() {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      // Speed: 30 pixels per second (adjust this value to change speed)
      const speed = 70;
      setOffset((elapsed * speed) / 1000);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const renderSkillRow = (skills: typeof allSkills, direction: 'left' | 'right') => {
    // Duplicate skills 3 times for seamless infinite scroll
    const tripleSkills = [...skills, ...skills, ...skills];
    
    // Calculate single set width (140px card + 24px gap = 164px per item)
    const itemWidth = 164;
    const singleSetWidth = skills.length * itemWidth;
    
    // Calculate offset based on direction
    let transformOffset;
    if (direction === 'left') {
      // Left movement: as offset increases, become MORE negative (move left)
      transformOffset = (-singleSetWidth - (offset % singleSetWidth));
    } else {
      // Right movement: as offset increases, become LESS negative (move right)
      transformOffset = (-singleSetWidth + (offset % singleSetWidth));
    }

    return (
      <div className="relative overflow-hidden py-4">
        <div
          className="flex gap-6 transition-none"
          style={{
            transform: `translateX(${transformOffset}px)`,
            width: 'fit-content',
            willChange: 'transform',
          }}
        >
          {tripleSkills.map((skill, idx) => {
            const Icon = skill.icon;
            return (
              <div
                key={`${skill.name}-${idx}`}
                className="flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-orange-500/20 hover:border-orange-500 transition-colors hover:scale-110 group min-w-[140px] flex-shrink-0"
                style={{ transform: 'translateZ(0)' }}
              >
                <Icon
                  className="text-5xl mb-3 transition-transform group-hover:scale-125"
                  style={{ color: skill.color }}
                />
                <span className="text-sm font-semibold text-white whitespace-nowrap">
                  {skill.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full space-y-6">
      {renderSkillRow(row1, 'right')}
      {renderSkillRow(row2, 'left')}
      {renderSkillRow(row3, 'right')}
    </div>
  );
}
