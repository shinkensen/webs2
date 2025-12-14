import Navigation from '../components/Navigation';
import DynamicBackground from '../components/DynamicBackground';
import { SiGithub } from 'react-icons/si';
import { FaStar } from 'react-icons/fa';
import { projectsConfig } from '../../lib/projectsConfig';

export default function Projects() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <DynamicBackground />
      <Navigation />
      
      <main className="pt-32 px-6 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Projects Header */}
          <section className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-pulse">
              My Projects
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              A showcase of my work, experiments, and learning journey in software development
            </p>
          </section>

          {/* Projects Grid */}
          <section className="grid gap-8">
            {projectsConfig.map((project, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 hover:border-orange-500 transition-all overflow-hidden hover:shadow-lg hover:shadow-orange-500/20"
              >
                {/* Preview Section */}
                {project.preview && (
                  <div className="w-full h-64 md:h-80 bg-black/40 border-b-2 border-orange-500/20 overflow-hidden relative group flex items-center justify-center">
                    {project.preview.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      // If preview is an image URL
                      <img
                        src={project.preview}
                        alt={`${project.name} preview`}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      // If preview is a website URL (iframe)
                      <iframe
                        src={project.preview}
                        className="w-full h-full border-0 pointer-events-none group-hover:pointer-events-auto"
                        title={`${project.name} preview`}
                        sandbox="allow-same-origin allow-scripts"
                        scrolling="no"
                        style={{ overflow: 'hidden' }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                <div className="p-8">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2 flex-wrap">
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                          {project.name}
                          {project.hackathonWinner && (
                            <div className="group/star relative">
                              <FaStar className="text-yellow-400 text-2xl animate-pulse" />
                              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-4 py-2 bg-yellow-500/90 text-black text-sm font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover/star:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                🏆 Hackathon Winner
                              </div>
                            </div>
                          )}
                        </h2>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          project.status === 'Active' 
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 animate-pulse' 
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/80 text-lg mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white/60 mb-3">Technologies Used:</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400 text-sm font-medium hover:bg-orange-500/20 transition-all"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all transform hover:scale-105 border border-orange-500/30 hover:border-orange-500"
                      >
                        <SiGithub className="text-xl" />
                        <span className="font-semibold">View on GitHub</span>
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all transform hover:scale-105 font-semibold shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70"
                      >
                        <span>🚀</span>
                        <span>View Live Site</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Coming Soon */}
          <section className="mt-16 text-center">
            <div className="p-12 bg-gradient-to-br from-orange-900/20 to-transparent rounded-xl border-2 border-orange-500/30 border-dashed hover:border-orange-500 transition-all">
              <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">More Projects Coming Soon!</h2>
              <p className="text-white/70 text-lg">
                I'm constantly working on new projects and learning new technologies. 
                Check back soon for updates!
              </p>
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
