import React, { useState, useEffect } from 'react';
import { useInView } from './useInView';
import { ArrowUpRight, X, Github, LayoutGrid, ArrowRight, ExternalLink } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: "Synapse Automata",
    category: "Enterprise AI",
    date: "02/14/24",
    subtitle: "Autonomous RAG pipeline for legal doc processing",
    tags: ["Python", "LangChain", "n8n"],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
    longDescription: "A fully autonomous Retrieval-Augmented Generation (RAG) ecosystem designed for a Fortune 500 logistics firm. The system ingests legal contracts, invoices, and shipping manifests, allowing non-technical staff to query complex data using natural language. Built with Python and orchestrated via n8n, it reduced manual data retrieval time by 94%.",
    year: "2024",
    client: "Logistics Corp",
    links: { live: "#", github: "#" }
  },
  {
    id: 2,
    title: "Orbital Finance",
    category: "Fintech UI",
    date: "12/10/23",
    subtitle: "Sub-millisecond latency trading dashboard",
    tags: ["React", "WebSockets", "D3.js"],
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1000&auto=format&fit=crop",
    longDescription: "A next-generation institutional trading dashboard focusing on extreme performance and data visualization. Utilizing WebWorkers for data processing and WebGL for rendering, the interface handles 50,000+ ticks per second without frame drops, providing traders with a competitive edge.",
    year: "2023",
    client: "Orbital Capital",
    links: { live: "#" }
  },
  {
    id: 3,
    title: "Aether GenUI",
    category: "Generative Design",
    date: "03/22/24",
    subtitle: "Self-assembling interface system",
    tags: ["TypeScript", "OpenAI", "React"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    longDescription: "An experimental framework that generates React components on the fly based on user context and intent. By leveraging LLMs to produce structured JSON UI definitions, Aether creates personalized interfaces that adapt to the user's specific workflow in real-time.",
    year: "2024",
    client: "Internal R&D",
    links: { live: "#", github: "#" }
  },
  {
    id: 4,
    title: "Helix Agent",
    category: "Automation",
    date: "01/15/24",
    subtitle: "Multi-modal customer support agent",
    tags: ["n8n", "Gemini", "Node.js"],
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1000&auto=format&fit=crop",
    longDescription: "A sophisticated customer service agent capable of handling complex refunds, tracking inquiries, and personalized recommendations. Integrated directly with Shopify and Zendesk, Helix resolves 85% of tickets without human intervention, maintaining a CSAT score of 4.8/5.",
    year: "2024",
    client: "Helix Retail",
    links: { live: "#", github: "#" }
  }
];

const ProjectModal: React.FC<{ 
    project: typeof projects[0]; 
    onClose: () => void;
    onOpenCaseStudy?: (id: number) => void;
}> = ({ project, onClose, onOpenCaseStudy }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
    >
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-background border border-border rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-300">
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-surface/50 backdrop-blur-md text-primary hover:bg-accent hover:text-black border border-transparent transition-all"
            aria-label="Close project details"
          >
            <X size={20} />
          </button>

          <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-surface flex-shrink-0 group">
            <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:hidden"></div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto bg-background relative">
            
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent-text font-mono text-xs tracking-wider uppercase">
                        {project.category}
                    </span>
                    <span className="text-secondary font-mono text-xs">{project.date}</span>
                </div>
                
                <h3 id="project-title" className="text-4xl md:text-5xl font-display font-bold text-primary mb-4 leading-tight">
                    {project.title}
                </h3>
                <p className="text-xl text-secondary font-light">{project.subtitle}</p>
            </div>

            <div className="flex-1 space-y-8">
                <div className="prose prose-invert max-w-none">
                    <p className="text-secondary leading-relaxed font-light text-lg">
                        {project.longDescription}
                    </p>
                </div>

                <div>
                    <h4 className="text-xs font-bold text-secondary mb-4 uppercase tracking-widest">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="px-4 py-2 bg-surface border border-border rounded-lg text-sm text-secondary font-mono hover:border-accent/50 transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-10 mt-8 border-t border-border">
                <button 
                    onClick={() => {
                        if (onOpenCaseStudy) {
                            onOpenCaseStudy(project.id);
                        } else {
                            console.warn("Case study navigation handler not provided");
                        }
                    }}
                    className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-6 py-4 bg-accent text-black rounded-xl font-bold hover:bg-primary hover:text-background transition-all transform hover:-translate-y-1"
                >
                    View Case Study <ArrowUpRight size={18} />
                </button>
                
                 {project.links.github && (
                    <a href={project.links.github} className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-6 py-4 border border-border bg-surface text-primary rounded-xl font-medium hover:bg-surface/80 transition-all">
                        Source Code <Github size={18} />
                    </a>
                )}
            </div>
          </div>
      </div>
    </div>
  );
};

interface PortfolioProps {
  onNavigate?: (page: string) => void;
  onOpenCaseStudy?: (id: number) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onNavigate, onOpenCaseStudy }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const { ref, isInView } = useInView(0.1);

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'All') return true;
    const filterLower = activeFilter.toLowerCase();
    return (
      project.category.toLowerCase().includes(filterLower) ||
      project.tags.some(tag => tag.toLowerCase().includes(filterLower))
    );
  });

  return (
    <section id="work" className="py-24 md:py-32 bg-background text-primary border-t border-border relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div ref={ref} className={`flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <span className="text-accent-text font-mono text-sm tracking-widest mb-4 block">{`{04} — Selected Work`}</span>
            <h2 className="text-4xl md:text-6xl font-display font-medium text-primary leading-tight">
              Featured <span className="text-secondary">Case Studies</span>
            </h2>
          </div>
          
          <div role="group" aria-label="Project filters" className="flex flex-wrap gap-2 md:justify-end">
            {['All', 'Enterprise AI', 'Fintech UI', 'Automation', 'Brand Experience'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter 
                    ? 'bg-accent text-black shadow-[0_0_15px_rgba(196,255,97,0.3)]' 
                    : 'bg-surface border border-border text-secondary hover:text-primary hover:border-primary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Projects */}
          {filteredProjects.slice(0, activeFilter === 'All' ? 4 : undefined).map((project, index) => {
              // Layout Logic for 4 items + 1 Action Card
              // Top Row: 2 items (Half width each on LG)
              // Bottom Row: 3 items (Third width each on LG) - Item 3, Item 4, Action Card
              
              let spanClass = "lg:col-span-4"; // Default third width
              
              if (activeFilter === 'All') {
                  if (index === 0 || index === 1) {
                      spanClass = "lg:col-span-6 md:col-span-1"; // Half width on LG, Full on MD (or half if grid-cols-2)
                  } else {
                      spanClass = "lg:col-span-4 md:col-span-1"; 
                  }
              } else {
                  // Standard grid for filtered view
                  spanClass = "lg:col-span-6";
              }

              return (
                <div 
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`${spanClass} group relative flex flex-col justify-between rounded-3xl overflow-hidden bg-[#111] border border-white/10 cursor-pointer hover:border-accent/50 transition-all duration-500 min-h-[400px] lg:min-h-[450px]`}
                >
                    {/* Text Content Area */}
                    <div className="p-8 relative z-20">
                        <div className="flex flex-wrap items-baseline gap-3 mb-4">
                             <span className="text-accent font-mono text-sm tracking-wide font-medium">
                                {`{ ${project.category} }`}
                             </span>
                             <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                                {project.date}
                             </span>
                        </div>
                        
                        <h3 className="text-3xl font-display font-medium text-white mb-3 group-hover:text-accent transition-colors leading-tight">
                            {project.title}
                        </h3>
                        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 max-w-sm">
                            {project.subtitle}
                        </p>
                    </div>

                    {/* Image Area */}
                    <div className="relative mt-auto w-full h-[220px] lg:h-[260px] overflow-hidden">
                        <div className="absolute inset-x-6 top-0 bottom-[-100px] rounded-t-2xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:translate-y-[-10px]">
                            <img 
                                src={project.image} 
                                alt={project.title}
                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Inner Highlight/Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Hover Action Icon */}
                    <div className="absolute top-8 right-8 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 border border-white/10">
                        <ArrowUpRight size={18} />
                    </div>
                </div>
              );
          })}

          {/* View All Projects Card - Only in 'All' view */}
          {activeFilter === 'All' && (
             <div 
                onClick={() => onNavigate && onNavigate('work')}
                className="lg:col-span-4 md:col-span-2 relative group rounded-3xl overflow-hidden bg-accent cursor-pointer flex flex-col items-center justify-center p-8 min-h-[400px] lg:min-h-[450px] transition-transform duration-500 hover:-translate-y-1"
             >
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="relative z-10 text-center">
                    <h3 className="text-4xl font-display font-medium text-black mb-6 leading-tight">
                        View all <br/> projects
                    </h3>
                    <div className="w-16 h-16 bg-black text-accent rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <ArrowRight size={28} />
                    </div>
                </div>
             </div>
          )}

        </div>
      </div>

      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)}
          onOpenCaseStudy={onOpenCaseStudy}
        />
      )}
    </section>
  );
};