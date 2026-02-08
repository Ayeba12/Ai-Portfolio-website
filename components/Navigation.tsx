import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Bot, Monitor, Palette, Workflow, Zap, Database, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenInquiry?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activePage, onNavigate, onOpenInquiry }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCapabilitiesOpen, setMobileCapabilitiesOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const handleNavClick = (page: string, sectionId?: string) => {
    setMobileMenuOpen(false);
    setHoveredNav(null);
    setMobileCapabilitiesOpen(false);
    
    if (page === 'home') {
       onNavigate('home');
       if (sectionId) {
         setTimeout(() => {
           document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
         }, 100);
       } else {
         window.scrollTo({ top: 0, behavior: 'smooth' });
       }
    } else {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenInquiry = () => {
      setMobileMenuOpen(false);
      setHoveredNav(null);
      if (onOpenInquiry) {
          onOpenInquiry();
      } else {
          // Fallback if not provided
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const services = [
    { title: "AI Automation", desc: "Autonomous agents & workflows", icon: <Bot size={20} />, id: "ai-automation" },
    { title: "Web Development", desc: "High-performance React apps", icon: <Monitor size={20} />, id: "web-dev" },
    { title: "Brand Design", desc: "Visual identity systems", icon: <Palette size={20} />, id: "brand" },
    { title: "System Architecture", desc: "Scalable cloud infra", icon: <Workflow size={20} />, id: "arch" },
    { title: "Rapid Prototyping", desc: "MVP in days, not months", icon: <Zap size={20} />, id: "proto" },
    { title: "Data Strategy", desc: "Analytics & Insights", icon: <Database size={20} />, id: "data" },
  ];

  // Helper for hover delay to prevent flickering
  const onMouseEnter = (navItem: string) => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setHoveredNav(navItem);
  };

  const onMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredNav(null);
    }, 150);
  };

  return (
    <nav 
      aria-label="Main Navigation"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
        mobileMenuOpen 
          ? 'bg-transparent border-transparent' // Hide main nav bg when menu is open
          : scrolled 
            ? 'bg-background/80 backdrop-blur-xl border-border py-3' 
            : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
        {/* Logo */}
        <button 
          onClick={() => handleNavClick('home', 'home')}
          className="group flex items-center gap-2 focus:outline-none z-50 relative rounded-xl"
          aria-label="Navigate to Home Page"
        >
          <div className="w-10 h-10 bg-primary text-background rounded-xl flex items-center justify-center font-display font-bold text-lg group-hover:bg-accent group-hover:text-black transition-all duration-300 shadow-lg group-hover:shadow-accent/50 group-hover:rotate-3">
            SA
          </div>
          <span className={`font-display font-bold text-xl tracking-tight transition-opacity duration-300 ${scrolled || mobileMenuOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
            Sam<span className="text-accent">.</span>
          </span>
        </button>

        {/* Desktop Nav - Centered & Floating */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1 p-1.5 rounded-full bg-surface/50 border border-border backdrop-blur-md shadow-sm">
                
                {/* Home */}
                <button 
                    onClick={() => handleNavClick('home', 'home')}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all focus:bg-background focus:text-primary ${activePage === 'home' ? 'text-primary bg-background shadow-sm' : 'text-secondary hover:text-primary hover:bg-background'}`}
                    aria-label="Navigate to Home Page"
                >
                    Home
                </button>

                {/* Services Mega Menu Trigger */}
                <div 
                    className="relative"
                    onMouseEnter={() => onMouseEnter('services')}
                    onMouseLeave={onMouseLeave}
                >
                    <button 
                        className={`flex items-center gap-1 px-5 py-2 rounded-full text-sm font-medium transition-all ${hoveredNav === 'services' ? 'bg-background text-primary shadow-sm' : 'text-secondary hover:text-primary hover:bg-background/50'} focus:bg-background focus:text-primary`}
                        onClick={() => handleNavClick('home', 'services')}
                        aria-expanded={hoveredNav === 'services'}
                        aria-haspopup="true"
                        aria-label="Capabilities Menu"
                    >
                        Capabilities <ChevronDown size={14} className={`transition-transform duration-300 ${hoveredNav === 'services' ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Mega Menu Dropdown */}
                    <div 
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[600px] transition-all duration-300 transform origin-top ${
                            hoveredNav === 'services' 
                            ? 'opacity-100 translate-y-0 visible' 
                            : 'opacity-0 translate-y-4 invisible'
                        }`}
                        role="menu"
                    >
                        <div className="bg-surface border border-border rounded-2xl p-2 shadow-2xl ring-1 ring-black/5 overflow-hidden">
                           <div className="grid grid-cols-2 gap-2 p-2">
                              {services.map((service) => (
                                  <button
                                    key={service.id}
                                    onClick={() => handleNavClick('home', 'services')}
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-background/50 transition-colors text-left group border border-transparent hover:border-border focus:bg-background/50 focus:border-border"
                                    role="menuitem"
                                    aria-label={`View ${service.title} services`}
                                  >
                                      <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-secondary group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                                          {service.icon}
                                      </div>
                                      <div>
                                          <div className="text-sm font-bold text-primary mb-0.5 group-hover:text-accent-text transition-colors">{service.title}</div>
                                          <div className="text-xs text-secondary leading-tight">{service.desc}</div>
                                      </div>
                                  </button>
                              ))}
                           </div>
                           <div className="bg-background/50 p-4 flex items-center justify-between text-xs font-medium text-secondary mt-2 rounded-xl mx-2 mb-2 border border-border">
                                <span>Looking for a custom solution?</span>
                                <button 
                                    onClick={handleOpenInquiry}
                                    className="flex items-center gap-1 text-primary hover:text-accent-text transition-colors font-bold"
                                    aria-label="Schedule a demo inquiry"
                                >
                                    Schedule a demo <ArrowRight size={14} />
                                </button>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Work */}
                <button 
                    onClick={() => handleNavClick('work')}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all focus:bg-background focus:text-primary ${activePage === 'work' ? 'text-primary bg-background shadow-sm' : 'text-secondary hover:text-primary hover:bg-background'}`}
                    aria-label="View Selected Work"
                >
                    Work
                </button>

                {/* About */}
                <button 
                    onClick={() => handleNavClick('about')}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all focus:bg-background focus:text-primary ${activePage === 'about' ? 'text-primary bg-background shadow-sm' : 'text-secondary hover:text-primary hover:bg-background'}`}
                    aria-label="Learn About Me"
                >
                    About
                </button>
            </div>
        </div>

        {/* Right Side Actions */}
        <div className="hidden lg:flex items-center gap-4 z-50">
            <ThemeToggle />
            <button 
              className="bg-primary text-background px-6 py-2.5 rounded-full text-sm font-bold hover:bg-accent hover:text-black transition-all shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              onClick={handleOpenInquiry}
              aria-label="Open Inquiry Form"
            >
              Get Started
            </button>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-4 z-50">
          <ThemeToggle />
          <button 
            className="text-primary p-2 bg-surface rounded-full border border-border transition-colors hover:bg-accent hover:text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Enhanced Mobile/Tablet Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
          {/* Inner Container */}
          <div className="flex-1 flex flex-col px-6 sm:px-12 max-w-2xl mx-auto w-full pt-28 pb-12 h-full overflow-y-auto overscroll-contain">
            
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4 shrink-0">
                <button 
                    onClick={() => handleNavClick('home', 'home')} 
                    className={`text-4xl sm:text-5xl font-display font-medium text-left hover:text-accent transition-all duration-500 delay-100 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${activePage === 'home' ? 'text-primary' : 'text-secondary'}`}
                >
                    Home
                </button>

                {/* Services Accordion */}
                <div className={`transition-all duration-500 delay-200 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <button 
                        onClick={() => setMobileCapabilitiesOpen(!mobileCapabilitiesOpen)}
                        className={`flex items-center gap-3 text-4xl sm:text-5xl font-display font-medium text-left w-full group transition-colors ${mobileCapabilitiesOpen ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                    >
                        Capabilities
                        <ChevronDown size={32} strokeWidth={1.5} className={`transition-transform duration-300 ${mobileCapabilitiesOpen ? 'rotate-180 text-accent' : 'text-secondary/50'}`} />
                    </button>
                    
                    <div className={`grid transition-all duration-500 ease-in-out overflow-hidden ${mobileCapabilitiesOpen ? 'grid-rows-[1fr] opacity-100 mt-6 mb-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 border-l border-border ml-2">
                                {services.map((s, i) => (
                                    <button 
                                        key={s.id} 
                                        onClick={() => handleNavClick('home', 'services')} 
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface/50 transition-colors text-left group/item"
                                        style={{ transitionDelay: `${i * 50}ms` }}
                                    >
                                        <div className="p-2 rounded-lg bg-surface border border-border text-secondary group-hover/item:text-accent group-hover/item:border-accent transition-colors">
                                            {React.cloneElement(s.icon as React.ReactElement, { size: 18 })}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-primary">{s.title}</span>
                                            <span className="text-[10px] text-secondary opacity-70">{s.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => handleNavClick('work')} 
                    className={`text-4xl sm:text-5xl font-display font-medium text-left hover:text-accent transition-all duration-500 delay-300 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${activePage === 'work' ? 'text-primary' : 'text-secondary'}`}
                >
                    Work
                </button>
                
                <button 
                    onClick={() => handleNavClick('about')} 
                    className={`text-4xl sm:text-5xl font-display font-medium text-left hover:text-accent transition-all duration-500 delay-400 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${activePage === 'about' ? 'text-primary' : 'text-secondary'}`}
                >
                    About
                </button>
            </nav>

            {/* Footer Actions */}
            <div className={`mt-auto pt-12 transition-all duration-500 delay-500 shrink-0 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <button 
                    className="w-full bg-primary text-background py-5 rounded-2xl font-bold text-xl hover:bg-accent hover:text-black transition-all mb-10 shadow-lg shadow-primary/5 active:scale-[0.98]"
                    onClick={handleOpenInquiry}
                >
                    Start a Project
                </button>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-border pt-8 gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-mono text-secondary uppercase tracking-widest">Connect</span>
                        <a href="mailto:ayebadevs@gmail.com" className="text-lg font-bold text-primary hover:text-accent transition-colors">
                            ayebadevs@gmail.com
                        </a>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="p-3 rounded-full bg-surface border border-border text-secondary hover:text-primary hover:border-accent transition-all hover:scale-110" aria-label="Twitter"><Twitter size={20} /></a>
                        <a href="#" className="p-3 rounded-full bg-surface border border-border text-secondary hover:text-primary hover:border-accent transition-all hover:scale-110" aria-label="GitHub"><Github size={20} /></a>
                        <a href="#" className="p-3 rounded-full bg-surface border border-border text-secondary hover:text-primary hover:border-accent transition-all hover:scale-110" aria-label="LinkedIn"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
          </div>
      </div>
    </nav>
  );
};