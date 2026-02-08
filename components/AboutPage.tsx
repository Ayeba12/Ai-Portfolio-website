import React, { useEffect, useState } from 'react';
import { useInView } from './useInView';
import { Code, Heart, Zap, Award, Coffee, BookOpen } from 'lucide-react';
import { Testimonials } from './Testimonials';

export const AboutPage: React.FC = () => {
  const { ref, isInView } = useInView(0.1);
  const [heroImage, setHeroImage] = useState('/avatar.jpg');

  // Load settings on mount
  useEffect(() => {
      const savedConfig = localStorage.getItem('site_config');
      if (savedConfig) {
          try {
              const parsed = JSON.parse(savedConfig);
              if (parsed.aboutHero) setHeroImage(parsed.aboutHero);
          } catch (e) {
              console.error("Failed to parse site config", e);
          }
      }
  }, []);

  // Listen for live updates
  useEffect(() => {
      const handleConfigUpdate = (e: CustomEvent) => {
          if (e.detail?.aboutHero !== undefined) {
             setHeroImage(e.detail.aboutHero || '/avatar.jpg');
          }
      };
      window.addEventListener('site-config-update', handleConfigUpdate as EventListener);
      return () => window.removeEventListener('site-config-update', handleConfigUpdate as EventListener);
  }, []);

  const values = [
    { icon: <Zap size={24} />, title: "Speed & Precision", text: "I believe in software that feels instantaneous. Performance is not a feature; it's the foundation of user experience." },
    { icon: <Heart size={24} />, title: "Human-Centric", text: "Technology should adapt to humans, not the other way around. Empathy drives every design decision I make." },
    { icon: <Code size={24} />, title: "Clean Code", text: "Maintainability is key. I write code that is self-documenting, modular, and built to scale effortlessly." }
  ];

  const experience = [
    { year: "2020 - Present", role: "Senior AI Engineer", company: "Freelance / Agency", desc: "Building autonomous agents and RAG pipelines for Enterprise clients." },
    { year: "2016 - 2020", role: "Lead Product Designer", company: "TechFlow Solutions", desc: "Led a team of 10 designers crafting SaaS interfaces used by 50k+ daily users." },
    { year: "2012 - 2016", role: "Full Stack Developer", company: "StartUp Inc", desc: "Early employee. Built the core platform from MVP to Series B." },
  ];

  return (
    <div className="min-h-screen pt-32 pb-0 px-0 max-w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <span className="text-accent font-mono text-sm tracking-widest mb-6 block">/// THE FULL STORY</span>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-medium text-primary mb-8 leading-[1.05]">
              More than just <br/> <span className="text-secondary">syntax & pixels.</span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary font-light leading-relaxed max-w-lg">
              I'm Sam, a multidisciplinary engineer situated at the intersection of aesthetic design and artificial intelligence.
            </p>
          </div>
          <div className="relative">
              <div className="aspect-video lg:aspect-square rounded-3xl overflow-hidden bg-surface border border-border">
                  <img 
                      src={heroImage}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop";
                        e.currentTarget.onerror = null;
                      }}
                      alt="Sam Ayebanate working" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 hover:scale-100"
                    />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-background p-6 rounded-2xl border border-border shadow-xl hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-black">
                        <Coffee size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-primary">Fueled by Coffee</p>
                        <p className="text-xs text-secondary">And curiosity.</p>
                    </div>
                  </div>
              </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div ref={ref} className={`grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 transition-all duration-700 mb-32 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Left Col: Biography */}
          <div className="lg:col-span-7 space-y-10 text-xl text-secondary font-light leading-relaxed">
            <h2 className="text-4xl font-display font-bold text-primary">My Journey</h2>
            <p>
              My fascination with computers started when I disassembled my father's old radio to see how the voices got inside. That curiosity never left. It evolved into disassembling code, breaking down user interfaces, and eventually, restructuring neural networks.
            </p>
            <p>
              Over the last decade and a half, I've worn every hat in the digital product lifecycle. I've been the solo developer pulling all-nighters, the designer obsessing over 1px margins, and the strategist planning 5-year roadmaps. 
            </p>
            <p>
              Today, I focus on the frontier of <strong>AI Automation</strong>. I believe we are in a renaissance of software, where interfaces will become fluid and apps will become agents. My mission is to build the tools that define this new era.
            </p>
            
            <div className="pt-12">
              <h3 className="text-3xl font-display font-bold text-primary mb-8">Experience</h3>
              <div className="space-y-10 border-l border-border ml-3 pl-8 relative">
                  {experience.map((job, index) => (
                    <div key={index} className="relative">
                        <span className="absolute -left-[39px] top-2 w-5 h-5 bg-background border border-accent rounded-full"></span>
                        <span className="text-sm font-mono text-accent mb-2 block">{job.year}</span>
                        <h4 className="text-xl font-bold text-primary">{job.role}</h4>
                        <p className="text-base text-primary/80 mb-3">{job.company}</p>
                        <p className="text-base md:text-lg text-secondary">{job.desc}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Col: Values & Education */}
          <div className="lg:col-span-5 space-y-16">
            <div>
                <h3 className="text-3xl font-display font-bold text-primary mb-8">Core Values</h3>
                <div className="space-y-6">
                  {values.map((val, i) => (
                      <div key={i} className="bg-surface border border-border p-8 rounded-2xl hover:border-accent/50 transition-colors">
                        <div className="text-accent mb-4">{val.icon}</div>
                        <h4 className="text-lg font-bold text-primary mb-2">{val.title}</h4>
                        <p className="text-base text-secondary">{val.text}</p>
                      </div>
                  ))}
                </div>
            </div>

            <div>
                <h3 className="text-3xl font-display font-bold text-primary mb-8">Education</h3>
                <div className="flex items-start gap-5 mb-6">
                  <div className="mt-1 text-secondary"><BookOpen size={24} /></div>
                  <div>
                      <h4 className="text-lg font-bold text-primary">M.Sc. Computer Science</h4>
                      <p className="text-base text-secondary">Stanford University (Online)</p>
                      <p className="text-sm text-secondary/60">Specialization in Artificial Intelligence</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="mt-1 text-secondary"><Award size={24} /></div>
                  <div>
                      <h4 className="text-lg font-bold text-primary">B.A. Graphic Design</h4>
                      <p className="text-base text-secondary">Rhode Island School of Design</p>
                  </div>
                </div>
            </div>
          </div>
        
        </div>
      </div>
      
      {/* Testimonials at the bottom */}
      <Testimonials />
    </div>
  );
};