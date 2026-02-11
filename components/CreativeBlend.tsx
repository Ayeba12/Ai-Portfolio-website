import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useInView } from './useInView';

export const CreativeBlend: React.FC = () => {
  const { ref, isInView } = useInView(0.2);

  return (
    <section id="vision" className="bg-background py-32 md:py-48 relative overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div
          ref={ref}
          className={`max-w-4xl transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></div>
            <span className="text-secondary font-mono text-sm tracking-widest uppercase">{`{01} — The Vision`}</span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-primary leading-[1.05] tracking-tight mb-12">
            I blend creativity with <br className="hidden md:block" />
            <span className="text-primary/60">technical expertise</span>
          </h2>

          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-full font-bold text-lg hover:bg-primary hover:text-background hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]"
          >
            Become a client
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-background group-hover:text-primary transition-colors">
              <ArrowUpRight size={18} />
            </div>
          </button>
        </div>
      </div>

      {/* Abstract Geometric Flower Graphic */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 md:translate-x-1/5 w-[600px] h-[600px] md:w-[1200px] md:h-[1200px] pointer-events-none opacity-[0.05] dark:opacity-[0.15]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-primary fill-none stroke-[0.3]">
          <g transform="translate(100,100)">
            {/* Outer Petals */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={`outer-${i}`}
                d="M0 0 C 60 -60 120 -40 120 0 C 120 40 60 60 0 0"
                transform={`rotate(${angle})`}
              />
            ))}
            {/* Inner Petals */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={`inner-${i}`}
                d="M0 0 C 40 -40 80 -30 80 0 C 80 30 40 40 0 0"
                transform={`rotate(${angle + 36})`}
              />
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
};