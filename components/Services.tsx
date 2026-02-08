import React, { useState, useEffect, useRef } from 'react';
import { useInView } from './useInView';
import { Bot, Monitor, Palette, Workflow, Zap, Database, X, Check, ArrowRight } from 'lucide-react';

interface ServiceData {
  icon: React.ReactNode;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
}

const services: ServiceData[] = [
  {
    icon: <Bot strokeWidth={1.5} size={28} />,
    title: "AI Automation",
    description: "Intelligent systems that work while you sleep. Custom LLM integrations and chatbots.",
    longDescription: "We build autonomous agents that can handle complex workflows, from customer support to data analysis. By integrating state-of-the-art LLMs (like Gemini, GPT-4, and Claude) into your business processes, we reduce manual overhead and unlock new capabilities. Whether it's automating email responses or generating complex reports, our AI solutions are designed to be reliable and secure.",
    features: [
      "Custom RAG Pipelines",
      "Autonomous Agents",
      "Workflow Automation",
      "Intelligent Chatbots"
    ]
  },
  {
    icon: <Monitor strokeWidth={1.5} size={28} />,
    title: "Web Development",
    description: "High-performance React applications built for speed, SEO, and extreme scalability.",
    longDescription: "Modern web development is about more than just static pages. We build dynamic, single-page applications (SPAs) and progressive web apps (PWAs) that feel like native software. Our focus is on load speed, accessibility, and smooth animations. We use the latest frameworks like React and Next.js to ensure your site is future-proof.",
    features: [
      "React & Next.js",
      "Performance Optimization",
      "SEO Strategy",
      "Scalable Architecture"
    ]
  },
  {
    icon: <Palette strokeWidth={1.5} size={28} />,
    title: "Brand Design",
    description: "Memorable visual identities that tell a compelling story and resonate with audiences.",
    longDescription: "Your brand is your story. We craft visual identities that resonate with your target audience on an emotional level. From logo design to comprehensive style guides, we ensure consistency across every touchpoint. We believe in design that is timeless, adaptive, and distinctive.",
    features: [
      "Logo Design",
      "Visual Identity Systems",
      "Typography & Color Theory",
      "Brand Strategy"
    ]
  },
  {
    icon: <Workflow strokeWidth={1.5} size={28} />,
    title: "System Architecture",
    description: "Designing robust digital ecosystems that grow with your business needs.",
    longDescription: "Building for today while planning for tomorrow. We design robust digital ecosystems that can handle growth without breaking. We focus on security, maintainability, and choosing the right tech stack for your specific goals. From microservices to serverless functions, we architect for resilience.",
    features: [
      "Cloud Infrastructure",
      "Database Design",
      "API Development",
      "Microservices"
    ]
  },
  {
    icon: <Zap strokeWidth={1.5} size={28} />,
    title: "Rapid Prototyping",
    description: "Moving from vague concept to clickable high-fidelity prototype in record time.",
    longDescription: "Validate your ideas before writing a single line of production code. We move from rough concepts to high-fidelity, clickable prototypes in days, not months. This allows for rapid testing and iteration, saving you time and money by solving usability issues early in the process.",
    features: [
      "Figma High-Fidelity",
      "User Testing",
      "Interactive Mockups",
      "MVP Strategy"
    ]
  },
  {
    icon: <Database strokeWidth={1.5} size={28} />,
    title: "Data Strategy",
    description: "Leveraging your data to train custom models and gain competitive insights.",
    longDescription: "Data is the new oil, but only if you can refine it. We help you structure your data to train custom AI models or gain actionable business insights. We transform raw, unstructured data into clean datasets that fuel intelligent decision-making and predictive analytics.",
    features: [
      "Data Warehousing",
      "Custom Model Training",
      "Analytics Dashboards",
      "Data Cleaning"
    ]
  }
];

const ServiceModal: React.FC<{ service: ServiceData; onClose: () => void }> = ({ service, onClose }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        
        // Focus trap or just focus first element could go here
        
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
            aria-labelledby="modal-title"
        >
            <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300" 
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background border border-border hover:bg-accent hover:text-black hover:border-accent transition-colors"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>

                <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto">
                    <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center text-primary mb-6 shadow-sm">
                        {service.icon}
                    </div>
                    
                    <h3 id="modal-title" className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
                        {service.title}
                    </h3>
                    
                    <p className="text-lg text-secondary leading-relaxed mb-8">
                        {service.longDescription}
                    </p>

                    <div className="bg-background border border-border rounded-2xl p-6 mb-8">
                        <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">What's included</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {service.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-secondary">
                                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent-text">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={() => {
                            onClose();
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-4 bg-primary text-background rounded-xl font-bold text-lg hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-2 group"
                    >
                        Inquire about {service.title}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Services: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="services" className="py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
           <span className="text-accent-text font-mono text-sm tracking-widest mb-4 block">{`{02} — Services`}</span>
           <h2 className="text-5xl md:text-6xl font-display font-medium text-primary max-w-2xl leading-tight">
             Comprehensive solutions for modern challenges.
           </h2>
        </div>
        
        <div ref={ref} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {services.map((service, index) => (
            <button 
              key={index} 
              onClick={() => setSelectedService(service)}
              className="group bg-background p-10 md:p-12 hover:bg-surface transition-colors duration-300 relative overflow-hidden cursor-pointer h-full text-left"
              type="button"
              aria-label={`View details for ${service.title}`}
            >
              <div className="w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center text-primary mb-8 group-hover:bg-accent group-hover:text-black transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-display font-bold text-primary mb-4">{service.title}</h3>
              <p className="text-lg text-secondary font-light leading-relaxed mb-8">
                {service.description}
              </p>
              
              <div className="flex items-center gap-2 text-base font-medium text-primary opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute bottom-10 left-10 md:left-12">
                Learn more <span className="text-accent-text">→</span>
              </div>
              {/* Spacer to prevent overlap with absolute positioned "Learn more" */}
              <div className="h-6"></div>
            </button>
          ))}
        </div>
      </div>

      {selectedService && (
        <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </section>
  );
};