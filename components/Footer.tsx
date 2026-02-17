import React from 'react';
import { ArrowUp, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: string, id?: string) => {
    onNavigate(page);
    if (id) {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-background border-t border-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary text-background rounded-xl flex items-center justify-center font-display font-bold text-lg shadow-lg">
                SA
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-primary">
                Sam<span className="text-accent">.</span>
              </span>
            </div>
            <p className="text-secondary text-sm leading-relaxed">
              Crafting intelligent digital experiences that scale. Based remotely, working globally.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-6">Navigation</h4>
            <ul className="space-y-4 text-sm text-secondary">
              <li><button onClick={() => handleNav('home', 'home')} className="hover:text-accent transition-colors text-left">Home</button></li>
              <li><button onClick={() => handleNav('about')} className="hover:text-accent transition-colors text-left">About</button></li>
              <li><button onClick={() => handleNav('home', 'work')} className="hover:text-accent transition-colors text-left">Work</button></li>
              <li><button onClick={() => handleNav('home', 'services')} className="hover:text-accent transition-colors text-left">Services</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-6">Socials</h4>
            <ul className="space-y-4 text-sm text-secondary">
              <li><a href="https://www.linkedin.com/in/sam-ayebanate/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" aria-label="LinkedIn">LinkedIn</a></li>
              <li><a href="https://x.com/AyebaDevs" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" aria-label="X (formerly Twitter)">X / Twitter</a></li>
              <li><a href="https://github.com/Ayeba12" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" aria-label="GitHub">GitHub</a></li>
              <li><a href="#" className="hover:text-accent transition-colors" aria-label="Instagram">Instagram</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-secondary">
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-accent transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-accent transition-colors text-left">Terms of Service</button></li>
              <li>
                <button onClick={() => onNavigate('admin')} className="flex items-center gap-2 hover:text-accent transition-colors text-left opacity-50 hover:opacity-100">
                  <Lock size={12} /> Admin
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-secondary text-xs">
            © {new Date().getFullYear()} Sam Ayebanate. All rights reserved. Built with React, Tailwind & Gemini.
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-xs font-medium text-primary hover:text-accent transition-colors"
            aria-label="Scroll back to top"
          >
            BACK TO TOP
            <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center group-hover:border-accent group-hover:bg-accent group-hover:text-black transition-all">
              <ArrowUp size={12} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};