import React from 'react';
import { useInView } from './useInView';
import { Asterisk } from 'lucide-react';

const steps = [
  {
    id: "01",
    title: "Mapping your business logic to intelligent automation",
    tag: "Strategy",
    duration: "1 week",
    points: [
      { title: "Operational Audit", desc: "I analyze your current workflows to identify high-impact AI opportunities." },
      { title: "Feasibility Study", desc: "Determining the right models and tech stack for your specific needs." },
      { title: "Roadmap Definition", desc: "Clear milestones, deliverables, and projected ROI calculation." }
    ]
  },
  {
    id: "02",
    title: "Designing intuitive interfaces for complex systems",
    tag: "Architecture",
    duration: "2 weeks",
    points: [
      { title: "System Design", desc: "Architecting secure data pipelines and robust backend infrastructure." },
      { title: "UX/UI Prototyping", desc: "Crafting premium interfaces that make advanced AI feel simple." },
      { title: "Model Selection", desc: "Choosing and fine-tuning the best LLMs (Gemini, GPT, Claude) for the task." }
    ]
  },
  {
    id: "03",
    title: "Engineering robust agents and seamless frontends",
    tag: "Development",
    duration: "3-4 weeks",
    points: [
      { title: "Full-Stack Build", desc: "Developing high-performance React applications with clean code." },
      { title: "AI Integration", desc: "Implementing RAG pipelines, agents, and automation workflows." },
      { title: "Rigorous Testing", desc: "Ensuring reliability, minimizing hallucinations, and optimizing latency." }
    ]
  },
  {
    id: "04",
    title: "Deploying autonomous systems that scale with you",
    tag: "Deployment",
    duration: "1 week",
    points: [
      { title: "Production Launch", desc: "Seamless deployment with CI/CD pipelines and monitoring setup." },
      { title: "Knowledge Transfer", desc: "Detailed documentation and training to empower your team." },
      { title: "Optimization Loop", desc: "Setting up feedback loops to improve model performance over time." }
    ]
  }
];

export const HowItWorks: React.FC = () => {
    const { ref, isInView } = useInView(0.1);

    return (
        <section className="py-24 md:py-32 bg-surface text-primary overflow-hidden border-t border-border">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-24">
                     <span className="text-accent-text font-mono text-sm tracking-widest mb-4 block">{`{03} — Process`}</span>
                     <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium leading-tight max-w-4xl">
                       Transforming complex problems into elegant solutions.
                     </h2>
                </div>

                <div className="space-y-12 md:space-y-0 relative">
                    {/* Vertical Line for Desktop */}
                    <div className="hidden md:block absolute left-[10%] top-8 bottom-8 w-px bg-border z-0"></div>

                    {steps.map((step, i) => (
                        <div key={i} className="group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative z-10 md:py-16 first:pt-0">
                             {/* Mobile Tag */}
                             <div className="md:hidden flex items-center justify-between border-b border-border pb-4 mb-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-surface border border-border text-xs uppercase tracking-widest text-secondary">{step.tag}</span>
                                <span className="text-2xl font-mono text-accent-text font-bold">/{step.id}</span>
                             </div>

                             {/* Desktop ID & Tag */}
                             <div className="hidden md:flex md:col-span-2 flex-col items-start text-right">
                                 <span className="text-4xl font-mono text-accent-text font-bold bg-surface py-2 pr-4 -ml-4">/{step.id}</span>
                             </div>
                             
                             <div className="md:col-span-1 hidden md:flex justify-center">
                                {/* Dot on the line */}
                                <div className="w-3 h-3 rounded-full bg-accent border-4 border-surface mt-6"></div>
                             </div>

                             <div className="md:col-span-7">
                                 <span className="hidden md:inline-block px-3 py-1 mb-6 rounded-full bg-background border border-border text-xs uppercase tracking-widest text-secondary">{step.tag}</span>
                                 <h3 className="text-2xl md:text-4xl font-display font-medium mb-8 leading-tight text-primary">
                                     {step.title}
                                 </h3>
                                 <ul className="space-y-4 mb-8">
                                     {step.points.map((p, j) => (
                                         <li key={j} className="flex items-start gap-3 text-secondary">
                                             <Asterisk className="w-4 h-4 text-accent-text mt-1 flex-shrink-0" />
                                             <span className="text-base font-light leading-relaxed">
                                                 <strong className="text-primary font-medium">{p.title}:</strong> {p.desc}
                                             </span>
                                         </li>
                                     ))}
                                 </ul>
                             </div>
                             <div className="md:col-span-2 text-left md:text-right">
                                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background text-xs font-mono text-secondary">
                                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                                    {step.duration}
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div ref={ref} className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    {/* Card 1: Green */}
                    <div className="bg-accent rounded-3xl p-8 md:p-10 min-h-[320px] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full border-[30px] border-black/5 group-hover:scale-110 transition-transform duration-700"></div>
                        <span className="text-6xl md:text-8xl font-display font-medium text-black">95+</span>
                        <div className="text-right z-10">
                             <p className="text-black/70 text-sm font-mono uppercase tracking-wider mb-2">Percent</p>
                             <p className="text-black text-3xl font-display font-medium leading-none">customer<br/>satisfaction</p>
                        </div>
                    </div>

                    {/* Card 2: Dark */}
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10 min-h-[320px] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 delay-100">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent/10 blur-[80px] group-hover:bg-accent/20 transition-colors"></div>
                        <span className="text-6xl md:text-8xl font-display font-medium text-white relative z-10">15+</span>
                        <div className="text-right relative z-10">
                             <p className="text-white/60 text-sm font-mono uppercase tracking-wider mb-2">Years</p>
                             <p className="text-white text-3xl font-display font-medium leading-none">of experience</p>
                        </div>
                    </div>

                    {/* Card 3: White */}
                    <div className="bg-white rounded-3xl p-8 md:p-10 min-h-[320px] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 delay-200 shadow-xl">
                         <div className="absolute -left-10 -top-10 text-gray-100 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                            <Asterisk size={200} />
                         </div>
                        <span className="text-6xl md:text-8xl font-display font-medium text-black relative z-10">500+</span>
                        <div className="text-right relative z-10">
                             <p className="text-gray-500 text-sm font-mono uppercase tracking-wider mb-2">Projects</p>
                             <p className="text-black text-3xl font-display font-medium leading-none">completed</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}