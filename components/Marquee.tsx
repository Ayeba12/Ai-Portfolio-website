import React from 'react';
import { Asterisk } from 'lucide-react';

const stats = [
  { value: "13+", label: "years of experience" },
  { value: ">95%", label: "client retention rate" },
  { value: "18", label: "satisfied clients" },
  { value: "14", label: "projects finished" },
];

export const Marquee: React.FC = () => {
  return (
    <div className="w-full bg-[#111] py-8 border-y border-white/5 overflow-hidden">
      <div className="flex w-max animate-marquee-reverse group hover:[animation-play-state:paused]">
        {/* Repeating the content multiple times to ensure seamless infinite scroll */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-16 mx-8 shrink-0">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-accent-text font-mono font-medium text-3xl md:text-4xl">{stat.value}</span>
                <span className="text-secondary/50 font-light text-2xl">/</span>
                <span className="text-white font-display font-medium text-xl md:text-2xl tracking-wide whitespace-nowrap">{stat.label}</span>
                <Asterisk className="text-accent-text w-6 h-6 ml-12 animate-spin-slow" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};