import React, { useState, useEffect } from 'react';
import { useInView } from './useInView';
import { ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  const { ref, isInView } = useInView(0.2);
  const [image, setImage] = useState('/avatar.jpg');

  useEffect(() => {
      const savedConfig = localStorage.getItem('site_config');
      if (savedConfig) {
          try {
              const parsed = JSON.parse(savedConfig);
              if (parsed.homeAboutImage) setImage(parsed.homeAboutImage);
          } catch (e) {
              console.error("Failed to parse site config", e);
          }
      }
  }, []);

  // Listen for live updates
  useEffect(() => {
      const handleConfigUpdate = (e: CustomEvent) => {
          if (e.detail?.homeAboutImage !== undefined) {
             setImage(e.detail.homeAboutImage || '/avatar.jpg');
          }
      };
      window.addEventListener('site-config-update', handleConfigUpdate as EventListener);
      return () => window.removeEventListener('site-config-update', handleConfigUpdate as EventListener);
  }, []);

  return (
    <section id="about" className="py-32 bg-background relative border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left: Image/Visual */}
          <div className={`relative ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-surface relative z-10 group">
              <img 
                src={image}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop";
                  e.currentTarget.onerror = null;
                }}
                alt="Sam Ayebanate" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <span className="text-white font-display text-xl">Sam Ayebanate</span>
              </div>
            </div>
            {/* Decorative offset border */}
            <div className="absolute top-8 left-8 w-full h-full border border-border rounded-2xl -z-0"></div>
          </div>

          {/* Right: Content */}
          <div className={`flex flex-col justify-center ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700 delay-200`}>
            <span className="text-accent font-mono text-sm tracking-widest mb-6 block">/// WHO I AM</span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary mb-8 leading-tight">
              Bridging the gap between <span className="text-secondary">technology</span> and <span className="text-secondary">human experience.</span>
            </h2>
            
            <div className="space-y-6 text-lg text-secondary font-light leading-relaxed">
              <p>
                I'm Sam, an AI automation expert who believes that the most powerful technologies should feel invisible. With a unique blend of technical prowess and creative vision, I help businesses leverage AI to streamline operations and unlock new possibilities.
              </p>
              <p>
                Over the last 15 years, I've worked with startups and established brands to build digital products that are not just functional, but memorable. My approach is rooted in minimalism—stripping away the unnecessary to reveal the essential.
              </p>
            </div>

            <div className="mt-12 pt-12 border-t border-border flex gap-12">
              <div>
                <span className="block text-4xl font-display font-bold text-primary mb-1">15+</span>
                <span className="text-sm text-secondary uppercase tracking-wider">Years Exp.</span>
              </div>
              <div>
                <span className="block text-4xl font-display font-bold text-primary mb-1">500+</span>
                <span className="text-sm text-secondary uppercase tracking-wider">Projects</span>
              </div>
              <div>
                <span className="block text-4xl font-display font-bold text-primary mb-1">$700k</span>
                <span className="text-sm text-secondary uppercase tracking-wider">Client Value</span>
              </div>
            </div>
            
            <div className="mt-10">
               <a href="#contact" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors border-b border-primary hover:border-accent pb-1">
                 More about my journey <ArrowRight size={16} />
               </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};