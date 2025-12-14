'use client';

import { useEffect, useState } from 'react';

interface LanguageStats {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
}

interface CodingActivityProps {
  userId: string;
  apiKey: string;
}

export default function CodingActivityChart({ userId, apiKey }: CodingActivityProps) {
  const [languages, setLanguages] = useState<LanguageStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguageStats = async () => {
      try {
        // Fetch all-time stats to get language breakdown
        const response = await fetch(
          'https://hackatime.hackclub.com/api/v1/users/shinkensen/stats',
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.data && result.data.languages) {
            // Sort by total_seconds and take top 8
            const topLanguages = result.data.languages
              .filter((lang: LanguageStats) => lang.total_seconds > 0)
              .sort((a: LanguageStats, b: LanguageStats) => b.total_seconds - a.total_seconds)
              .slice(0, 8);
            setLanguages(topLanguages);
          }
        }
      } catch (error) {
        console.error('Failed to fetch language stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguageStats();
  }, [userId, apiKey]);

  const getLanguageColor = (name: string): string => {
    const colors: { [key: string]: string } = {
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'Java': '#007396',
      'C++': '#00599c',
      'HTML': '#e34f26',
      'CSS': '#1572b6',
      'Rust': '#ce422b',
      'Go': '#00add8',
      'Ruby': '#cc342d',
      'PHP': '#777bb4',
      'Swift': '#fa7343',
      'Kotlin': '#7f52ff',
      'C#': '#239120',
    };
    return colors[name] || '#ff6347';
  };

  if (loading) {
    return (
      <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-orange-500/30">
        <h3 className="text-xl font-bold text-white mb-4">Coding Activity</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-500 transition-all">
      <h3 className="text-xl font-bold text-white mb-6">Coding Activity by Language</h3>
      
      <div className="space-y-4">
        {languages.map((lang, index) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getLanguageColor(lang.name) }}
                />
                <span className="text-white font-medium">{lang.name}</span>
              </div>
              <div className="text-right">
                <span className="text-white/80 text-sm">{lang.text}</span>
                <span className="text-white/60 text-xs ml-2">({lang.percent.toFixed(1)}%)</span>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                style={{
                  width: `${lang.percent}%`,
                  backgroundColor: getLanguageColor(lang.name),
                  boxShadow: `0 0 10px ${getLanguageColor(lang.name)}40`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {languages.length === 0 && (
        <div className="text-center text-white/50 py-8">
          No coding activity data available yet. Start coding to see your stats!
        </div>
      )}
    </div>
  );
}
