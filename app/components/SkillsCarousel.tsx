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
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const targetScrollY = useRef(0);
  const currentScrollY = useRef(0);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    // Smooth interpolation function (lerp)
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    // Animation loop for smooth movement
    const animate = () => {
      // Smoothly interpolate towards target with lerp
      currentScrollY.current = lerp(currentScrollY.current, targetScrollY.current, 0.1);

      // Update transforms directly on DOM (no React re-renders)
      const itemWidth = 164;
      
      if (row1Ref.current) {
        const singleSetWidth = 7 * itemWidth;
        const offset = -singleSetWidth + (currentScrollY.current % singleSetWidth);
        row1Ref.current.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
      
      if (row2Ref.current) {
        const singleSetWidth = 7 * itemWidth;
        const offset = -singleSetWidth - (currentScrollY.current % singleSetWidth);
        row2Ref.current.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
      
      if (row3Ref.current) {
        const singleSetWidth = 8 * itemWidth;
        const offset = -singleSetWidth + (currentScrollY.current % singleSetWidth);
        row3Ref.current.style.transform = `translate3d(${offset}px, 0, 0)`;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Update target scroll position based on viewport scroll
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.top < viewportHeight && rect.bottom > 0) {
          const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
          targetScrollY.current = progress * 1500;
        }
      }
    };

    // Start animation loop
    animationFrameId.current = requestAnimationFrame(animate);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const renderSkillRow = (skills: typeof allSkills, direction: 'left' | 'right', rowRef: React.RefObject<HTMLDivElement>) => {
    // Duplicate skills 4 times for ultra-seamless infinite scroll
    const quadSkills = [...skills, ...skills, ...skills, ...skills];
    
    return (
      <div className="relative overflow-hidden py-4">
        <div
          ref={rowRef}
          className="flex gap-6"
          style={{
            width: 'fit-content',
            willChange: 'transform',
          }}
        >
          {quadSkills.map((skill, idx) => {
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
      {renderSkillRow(row1, 'right', row1Ref)}
      {renderSkillRow(row2, 'left', row2Ref)}
      {renderSkillRow(row3, 'right', row3Ref)}
    </div>
  );
}
