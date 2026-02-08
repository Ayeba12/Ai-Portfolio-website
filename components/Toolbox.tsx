import React from 'react';
import { useInView } from './useInView';
import { 
  FileJson, FileCode2, MessageSquareDashed, Code, PaintBucket, Github, 
  Workflow, Zap, Rocket, BrainCircuit, Figma, PenTool, TerminalSquare,
  Cpu
} from 'lucide-react';

const skills = [
  { name: 'Python', icon: <FileJson size={24} />, level: 90, desc: "Scripting & Automation" },
  { name: 'JavaScript', icon: <FileCode2 size={24} />, level: 85, desc: "Interactive Logic" },
  { name: 'Prompt Eng.', icon: <MessageSquareDashed size={24} />, level: 98, desc: "LLM Optimization" },
  { name: 'HTML5', icon: <Code size={24} />, level: 95, desc: "Structural Semantics" },
  { name: 'CSS3', icon: <PaintBucket size={24} />, level: 92, desc: "Visual Styling" },
  { name: 'GitHub', icon: <Github size={24} />, level: 88, desc: "Version Control" },
];

const tools = [
  { name: 'n8n', icon: <Workflow size={20} /> },
  { name: 'Make.com', icon: <Zap size={20} /> },
  { name: 'Antigravity', icon: <Rocket size={20} /> },
  { name: 'Google AI', icon: <BrainCircuit size={20} /> },
  { name: 'Figma', icon: <Figma size={20} /> },
  { name: 'Penpot', icon: <PenTool size={20} /> },
  { name: 'Cursor', icon: <TerminalSquare size={20} /> },
];

export const Toolbox: React.FC = () => {
  const { ref, isInView } = useInView(0.1);

  return (
    <section className="py-24 md:py-32 bg-surface border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div ref={ref} className={`grid grid-cols-1 lg:grid-cols-12 gap-16 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            
            {/* Title Section */}
            <div className="lg:col-span-4">
                <span className="text-accent-text font-mono text-sm tracking-widest mb-4 block">{`{05} — Toolbox`}</span>
                <h2 className="text-5xl md:text-6xl font-display font-medium text-primary leading-tight mb-6">
                    My creative <br/>
                    <span className="text-secondary">tech stack.</span>
                </h2>
                <p className="text-lg text-secondary font-light leading-relaxed">
                    A curated selection of cutting-edge tools and languages I use to build autonomous agents and premium interfaces.
                </p>
            </div>

            {/* Skills Grid */}
            <div className="lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill, idx) => (
                        <div key={idx} className="bg-background border border-border p-6 rounded-2xl hover:border-accent/50 transition-colors group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary group-hover:text-accent-text group-hover:bg-black transition-colors">
                                        {skill.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary">{skill.name}</h4>
                                        <p className="text-xs text-secondary">{skill.desc}</p>
                                    </div>
                                </div>
                                <span className="font-mono text-xs text-accent-text">{skill.level}%</span>
                            </div>
                            <div className="w-full h-1 bg-surface rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-accent transition-all duration-1000 ease-out delay-500" 
                                    style={{ width: isInView ? `${skill.level}%` : '0%' }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Tools Marquee */}
        <div className={`mt-24 transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <p className="text-center text-sm font-mono text-secondary uppercase tracking-widest mb-8">Powered By</p>
            
            <div className="relative w-full overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-surface to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-surface to-transparent z-10"></div>
                
                <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
                    {[...tools, ...tools, ...tools, ...tools].map((tool, i) => (
                        <div key={i} className="flex items-center gap-3 px-8 py-4 mx-4 bg-background border border-border rounded-full hover:border-accent hover:bg-surface transition-all cursor-default">
                            <div className="text-accent-text">{tool.icon}</div>
                            <span className="font-display font-medium text-primary text-lg">{tool.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};