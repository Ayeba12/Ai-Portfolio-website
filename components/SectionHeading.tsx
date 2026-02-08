import React from 'react';
import { useInView } from './useInView';

interface SectionHeadingProps {
  subtitle: string;
  title: string;
  align?: 'left' | 'center';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ subtitle, title, align = 'center' }) => {
  const { ref, isInView } = useInView();

  return (
    <div 
      ref={ref}
      className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      <span 
        className={`block text-accent-text font-mono text-sm tracking-widest mb-4 transition-all duration-700 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        /// {subtitle}
      </span>
      <h2 
        className={`text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary transition-all duration-700 delay-100 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {title}
      </h2>
    </div>
  );
};