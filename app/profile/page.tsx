'use client';

import { useEffect, useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import SkillsCarousel from '../components/SkillsCarousel';
import DynamicBackground from '../components/DynamicBackground';
import CodingActivityChart from '../components/CodingActivityChart';
import { SiGithub } from 'react-icons/si';
import { FaFire } from 'react-icons/fa';
//s
interface HackatimeStats {
  data: {
    total_seconds: number;
    human_readable_total: string;
    languages: Array<{
      name: string;
      total_seconds: number;
      text: string;
      hours: number;
      minutes: number;
      percent: number;
    }>;
  };
}

interface DailyData {
  date: string;
  stats: {
    total_seconds: number;
  };
}

export default function Profile() {
  const [hackatimeStats, setHackatimeStats] = useState<HackatimeStats | null>(null);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);
  const streakMinMinutes = 15; // Minimum minutes per day to count toward streak

  // Date formatting helper
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Subtract days helper
  const subtractDays = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - days);
    return newDate;
  };

  useEffect(() => {
    // Fetch all-time Hackatime stats and daily breakdown for the year
    const fetchHackatime = async () => {
      try {
        // Fetch all-time total stats
        const statsResponse = await fetch(
          'https://hackatime.hackclub.com/api/v1/users/shinkensen/stats',
          {
            headers: {
              Authorization: `Bearer d828b1d6-4bd3-4644-aca7-f42d2be7be6e`,
            },
          }
        );
        
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          setHackatimeStats(data);
        }

        // Fetch daily data for entire year
        const today = new Date();
        const currentYear = today.getFullYear();
        const startDate = new Date(`${currentYear}-01-01`);
        
        const daysToFetch: Date[] = [];
        let d = new Date(startDate);
        const todayMidnight = new Date(today);
        todayMidnight.setHours(0, 0, 0, 0);

        while (d <= todayMidnight) {
          daysToFetch.push(new Date(d));
          d.setDate(d.getDate() + 1);
        }

        // Fetch in batches to avoid overwhelming the API
        const BATCH_SIZE = 10;
        const allData: DailyData[] = [];

        for (let i = 0; i < daysToFetch.length; i += BATCH_SIZE) {
          const batch = daysToFetch.slice(i, i + BATCH_SIZE);
          const batchResults = await Promise.all(
            batch.map(async (date) => {
              const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).toISOString();
              const nextDay = new Date(date);
              nextDay.setDate(date.getDate() + 1);
              const end = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate(), 0, 0, 0, 0).toISOString();

              const url = `https://hackatime.hackclub.com/api/v1/users/shinkensen/stats?start_date=${start}&end_date=${end}`;

              try {
                const res = await fetch(url, {
                  headers: {
                    Authorization: `Bearer d828b1d6-4bd3-4644-aca7-f42d2be7be6e`,
                  },
                });
                if (!res.ok) {
                  return {
                    date: formatDate(date),
                    stats: { total_seconds: 0 }
                  };
                }
                const json = await res.json();
                return {
                  date: formatDate(date),
                  stats: json.data || { total_seconds: 0 }
                };
              } catch (e) {
                return {
                  date: formatDate(date),
                  stats: { total_seconds: 0 }
                };
              }
            })
          );
          allData.push(...batchResults);
        }

        setDailyData(allData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } catch (error) {
        console.error('Failed to fetch Hackatime stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackatime();
  }, []);

  // Calculate current streak
  const currentStreak = useMemo(() => {
    if (dailyData.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    const todayStr = formatDate(today);
    
    // Create a map for quick lookup
    const dataMap = new Map(dailyData.map(d => [d.date, d]));
    
    // Check if coded today
    const todayData = dataMap.get(todayStr);
    const codedToday = (todayData?.stats.total_seconds || 0) >= streakMinMinutes * 60;
    
    let checkDate = codedToday ? today : subtractDays(today, 1);
    
    // Check consecutive days (max 365 days lookback)
    for (let i = 0; i < 365; i++) {
      const dateStr = formatDate(checkDate);
      const dayData = dataMap.get(dateStr);
      const seconds = dayData?.stats.total_seconds || 0;
      
      if (seconds >= streakMinMinutes * 60) {
        streak++;
        checkDate = subtractDays(checkDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  }, [dailyData, streakMinMinutes]);

  // Calculate total days tracked (from first coding day to today)
  const totalDaysTracked = useMemo(() => {
    if (dailyData.length === 0) return 0;
    
    // Find first day with any coding activity
    const firstCodingDay = dailyData.find(d => d.stats.total_seconds > 0);
    if (!firstCodingDay) return 0;
    
    const firstDate = new Date(firstCodingDay.date);
    const today = new Date();
    
    // Calculate difference in days
    const diffTime = Math.abs(today.getTime() - firstDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }, [dailyData]);

  const hours = hackatimeStats?.data.human_readable_total || '0h';

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <DynamicBackground />
      <Navigation />
      
      <main className="pt-32 px-6 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <section className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-pulse">
              My Profile
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Passionate developer with expertise across multiple technologies and frameworks
            </p>
          </section>

          {/* GitHub & Hackatime Stats */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              Coding Stats
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Hackatime Total */}
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20">
                <h3 className="text-xl font-bold text-white mb-2">Total Hours</h3>
                {loading ? (
                  <div className="animate-pulse text-4xl font-bold text-white/50">Loading...</div>
                ) : (
                  <>
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 drop-shadow-[0_0_10px_rgba(255,69,0,0.4)] animate-pulse">
                      {hours}
                    </div>
                    <p className="text-white/60 text-sm mt-2">All-time coding hours (Hackatime)</p>
                    <p className="text-white/40 text-xs mt-1">Outside of School</p>
                  </>
                )}
              </div>

              {/* GitHub Link */}
              <a
                href="https://github.com/shinkensen"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-red-500/30 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/20 group flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <SiGithub className="text-3xl" />
                    GitHub Profile
                  </h3>
                  <p className="text-white/60 text-sm">@shinkensen</p>
                </div>
                <span className="text-4xl group-hover:translate-x-2 transition-transform">→</span>
              </a>

              {/* Current Streak */}
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-yellow-500/30 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <FaFire className={`text-2xl ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-600'}`} />
                  Current Streak
                </h3>
                {loading ? (
                  <div className="animate-pulse text-4xl font-bold text-white/50">Loading...</div>
                ) : (
                  <>
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 drop-shadow-[0_0_10px_rgba(255,165,0,0.4)] animate-pulse">
                      {currentStreak + 1}
                    </div>
                    <p className="text-white/60 text-sm mt-2">Consecutive days coding</p>
                  </>
                )}
              </div>

              {/* Total Days Tracked */}
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-blue-500/30 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                <h3 className="text-xl font-bold text-white mb-2">Days Tracked</h3>
                {loading ? (
                  <div className="animate-pulse text-4xl font-bold text-white/50">Loading...</div>
                ) : (
                  <>
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.4)] animate-pulse">
                      {totalDaysTracked}
                    </div>
                    <p className="text-white/60 text-sm mt-2">Since first coding day</p>
                  </>
                )}
              </div>
            </div>

            {/* Custom Coding Activity Chart */}
            <CodingActivityChart 
              userId="U091RNMRAH2" 
              apiKey="d828b1d6-4bd3-4644-aca7-f42d2be7be6e" 
            />
          </section>

          {/* Education Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              Education
            </h2>
            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-2">
                Adlai E. Stevenson High School
              </h3>
              <p className="text-white/80 text-lg mb-4">Grade 10 | Illinois, United States</p>
              <p className="text-white/70">
                Focused on computer science and technology. Active in programming clubs and competitions.
              </p>
            </div>
          </section>

          {/* Skills Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-8 text-white text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              My Skills
            </h2>
            <p className="text-center text-white/70 mb-12 text-lg">
              Technologies and tools I work with daily - scroll to see them move!
            </p>
            <SkillsCarousel />
          </section>

          {/* Experience Highlights */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              Experience Highlights
            </h2>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-orange-500/20 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/10">
                <h3 className="text-2xl font-bold text-white mb-3">Web Development</h3>
                <p className="text-white/80 leading-relaxed">
                  Specialized in building modern, responsive web applications using React, Next.js, and TypeScript. 
                  Experience with both frontend and backend development, creating full-stack solutions.
                </p>
              </div>
              
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-red-500/20 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/10">
                <h3 className="text-2xl font-bold text-white mb-3">Data Structures & Algorithms</h3>
                <p className="text-white/80 leading-relaxed">
                  Strong foundation in DSA with experience in Java, C++, and Python. 
                  Regularly solve algorithmic problems and participate in coding challenges.
                </p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-orange-500/20 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/10">
                <h3 className="text-2xl font-bold text-white mb-3">Cybersecurity</h3>
                <p className="text-white/80 leading-relaxed">
                  Growing interest and knowledge in cybersecurity, including network security, ethical hacking concepts, 
                  and secure coding practices. Continuously learning about threat analysis and security best practices.
                </p>
              </div>

              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-yellow-500/20 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/10">
                <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                  🏆 Hackathons
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Active participant in hackathons, building innovative solutions under time constraints. 
                  Won recognition for IntelliNotes - a comprehensive web app for students and educators with AI-powered features.
                  Experienced in rapid prototyping, team collaboration, and delivering functional products within tight deadlines.
                </p>
              </div>
              
              <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-red-500/20 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/10">
                <h3 className="text-2xl font-bold text-white mb-3">System Administration</h3>
                <p className="text-white/80 leading-relaxed">
                  Proficient with both Windows 11 and Arch Linux. Experience with Bash scripting, 
                  system configuration, and development environment setup.
                </p>
              </div>
            </div>
          </section>

          {/* Interests */}
          <section>
            <h2 className="text-4xl font-bold mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              Interests & Goals
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-orange-900/20 to-transparent rounded-xl border border-orange-500/30 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/10">
                <h3 className="text-xl font-bold text-white mb-3">Hardware & Software</h3>
                <p className="text-white/80">
                  Passionate about both the hardware and software sides of computing. 
                  Love exploring how systems work at every level.
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-red-900/20 to-transparent rounded-xl border border-red-500/30 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/10">
                <h3 className="text-xl font-bold text-white mb-3">Future in CS</h3>
                <p className="text-white/80">
                  Aspiring to pursue a career in Computer Science, with interests in software engineering, 
                  web development, cybersecurity, and system design.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="py-8 text-center text-white/50 border-t border-orange-500/20 relative z-10">
        <p>© 2025 Govind Nair. All rights reserved.</p>
      </footer>
    </div>
  );
}
