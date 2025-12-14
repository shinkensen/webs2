import Link from 'next/link';
import Navigation from './components/Navigation';
import DynamicBackground from './components/DynamicBackground';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <DynamicBackground />
      <Navigation />
      
      <main className="pt-20 relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-5xl w-full">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] animate-pulse">
                  Govind Nair
                </h1>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="text-2xl md:text-4xl text-white/80">I am</span>
                  <span className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-pulse drop-shadow-[0_0_20px_rgba(255,69,0,0.6)]">
                    a Developer!
                  </span>
                </div>
              </div>
              
              <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                15-year-old programmer specializing in in Javascript/Typescript, Full Stack Development, and writing innovative solutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Link
                  href="/profile"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70"
                >
                  View My Profile
                </Link>
                <Link
                  href="/projects"
                  className="px-8 py-4 border-2 border-orange-500 hover:bg-orange-500/10 text-white font-bold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30"
                >
                  See My Projects
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Info Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              About Me
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20 group">
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-500 transition-colors">Who I Am</h3>
                <p className="text-white/80 leading-relaxed">
                  I am a 15-year-old programmer from Illinois (US). I attend Adlai E. Stevenson High School 
                  and I am in 10th grade. I specialize in Javascript/Typescript, Full Stack Development, and writing innovative programs.
                </p>
              </div>
              
              <div className="p-8 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-red-500/30 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/20 group">
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-red-500 transition-colors">Quick Facts</h3>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 text-xl">▹</span>
                    I Daily Drive a Vivobook S16 OLED
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 text-xl">▹</span>
                    Use both Windows 11 and Arch Linux
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 text-xl">▹</span>
                    Love computers (Hardware and Software)
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 text-xl">▹</span>
                    Want to be either a SWE or go into CyberSec 
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 text-center text-white/50 border-t border-orange-500/20 relative z-10">
        <p>© 2025 Govind Nair. All rights reserved.</p>
      </footer>
    </div>
  );
}
