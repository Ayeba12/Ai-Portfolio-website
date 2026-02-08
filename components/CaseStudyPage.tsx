import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ExternalLink, Calendar, User, Code2, Cpu, TrendingUp, TrendingDown } from 'lucide-react';
import { useInView } from './useInView';

// Extended Data for Case Studies (Static Fallback)
const staticCaseStudies: Record<number, any> = {
  1: {
    title: "Synthetix Legal Core",
    subtitle: "Autonomous Legal Analysis for Tier-1 Firms",
    category: "Enterprise AI Agent",
    client: "Synthetix Law LLP",
    year: "2024",
    duration: "4 Months",
    role: ["AI Architecture", "Backend Engineering", "Prompt Engineering"],
    techStack: ["Python", "LangChain", "OpenAI GPT-4", "Pinecone", "React"],
    heroImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2000&auto=format&fit=crop",
    challenge: "The client, a high-volume corporate law firm, was drowning in contract reviews. Senior partners were spending 40% of their billable hours reviewing standard NDAs and vendor agreements, creating a bottleneck that slowed down deal closures and increased costs for clients.",
    solution: "We engineered 'Core', a sovereign AI legal analyst agent. Unlike standard chatbots, Core operates with a recursive critique loop. It reads documents, identifies risk clauses based on the firm's specific playbook, and drafts redlines with comments explaining its reasoning. It was integrated directly into the firm's document management system via API.",
    results: [
      { value: "99.4%", label: "Accuracy vs Human Benchmark", trendDirection: 'up' },
      { value: "15h", label: "Saved per Partner/Week", trendDirection: 'up' },
      { value: "60%", label: "Reduction in Review Time", trendDirection: 'up' }
    ],
    content: [
      {
        title: "The Architecture",
        body: "We utilized a hybrid RAG (Retrieval-Augmented Generation) approach. The system first classifies the document type, then retrieves relevant precedent from the firm's private database (vectorized in Pinecone). This context is fed into a fine-tuned GPT-4 model that acts as the 'Reviewer', followed by a second 'Auditor' model that verifies the output for hallucinations.",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop"
      },
      {
        title: "User Interface",
        body: "The frontend was built in React to resemble a standard PDF editor but with 'Superpowers'. Lawyers can accept or reject AI suggestions with a single click. The UI highlights risk levels (Low, Medium, Critical) using a traffic-light system, ensuring immediate visual focus on high-priority clauses."
      }
    ],
    nextId: 2
  },
  2: {
    title: "Velocite Supply Chain",
    subtitle: "Predictive Logistics Engine",
    category: "Predictive Analytics",
    client: "Velocite Logistics",
    year: "2024",
    duration: "6 Months",
    role: ["Data Strategy", "ML Engineering", "System Design"],
    techStack: ["TensorFlow", "Google Cloud Vertex AI", "Node.js", "PostgreSQL"],
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop",
    challenge: "Velocite faced unpredictable shipping delays due to port congestion and weather events. Their manual scheduling system couldn't adapt fast enough, leading to millions in SLA penalties and spoiled perishable cargo.",
    solution: "We built a predictive routing engine that ingests real-time satellite weather data, global port congestion indices, and historical shipping route performance. The system predicts delays up to 72 hours in advance and autonomously suggests alternative routes or modes of transport to dispatchers.",
    results: [
      { value: "40%", label: "Reduction in Late Arrivals", trendDirection: 'up' },
      { value: "$2.4M", label: "Projected Annual Savings", trendDirection: 'up' },
      { value: "<2s", label: "Reroute Calculation Time", trendDirection: 'up' }
    ],
    content: [
      {
        title: "Data Integration",
        body: "The core challenge was harmonizing data from 12 different sources, including AIS vessel tracking and NOAA weather feeds. We built an ETL pipeline using Python and Airflow to clean and normalize this stream before feeding it into our predictive models.",
      },
      {
        title: "The Interface",
        body: "Dispatchers access a 'Mission Control' dashboard. The map visualizes fleet positions in real-time, with color-coded risk paths. When the AI detects a probable delay, it triggers a 'Route Intervention' card, presenting the problem and three optimized solutions ranked by cost and speed.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
      }
    ],
    nextId: 3
  },
  3: {
    title: "Lumina Health Voice",
    subtitle: "Compassionate AI for Patient Intake",
    category: "Conversational AI",
    client: "Lumina Health Systems",
    year: "2024",
    duration: "3 Months",
    role: ["Voice UI Design", "Backend Dev", "Compliance"],
    techStack: ["OpenAI Whisper", "Twilio", "FastAPI", "Redis"],
    heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop",
    challenge: "Patient intake call centers were overwhelmed, with wait times exceeding 45 minutes. Patients were frustrated, and critical triage information was often lost or mistyped by exhausted staff.",
    solution: "We deployed a HIPAA-compliant voice agent capable of handling natural, non-linear conversations. The agent answers immediately, verifies patient identity, collects symptoms, and schedules appointments directly into the EHR system. It detects urgency and seamlessly transfers critical cases to human nurses.",
    results: [
      { value: "0min", label: "Hold Time", trendDirection: 'down' },
      { value: "5,000+", label: "Concurrent Calls Handled", trendDirection: 'up' },
      { value: "4.8/5", label: "Patient Satisfaction Score", trendDirection: 'up' }
    ],
    content: [
      {
        title: "Natural Language Understanding",
        body: "The system uses a custom-tuned LLM to understand medical terminology and accents. We focused heavily on 'compassionate prompting', ensuring the AI responds with empathy and patience, rather than robotic scripts.",
        image: "https://images.unsplash.com/photo-1516549655169-df83a092fc5b?q=80&w=1200&auto=format&fit=crop"
      }
    ],
    nextId: 4
  },
  4: {
    title: "Aether Design System",
    subtitle: "Adaptive Generative UI Framework",
    category: "Generative UI",
    client: "FinTech SuperApp",
    year: "2024",
    duration: "5 Months",
    role: ["Creative Direction", "Frontend Architecture", "React"],
    techStack: ["React", "TypeScript", "Tailwind", "Gemini Pro"],
    heroImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
    challenge: "The client needed a dashboard that could serve both high-frequency day traders and casual long-term investors. A single static layout was too complex for one group and too simple for the other.",
    solution: "We created a 'Living UI' system. The interface monitors user behavior (click velocity, feature usage, session time) and uses a lightweight AI model to adjust the density, contrast, and layout of components in real-time. It evolves with the user as they become more proficient.",
    results: [
      { value: "3x", label: "Increase in Pro Feature Adoption", trendDirection: 'up' },
      { value: "25%", label: "Reduction in Churn", trendDirection: 'down' },
      { value: "100%", label: "Dynamic Component Generation", trendDirection: 'up' }
    ],
    content: [
      {
        title: "Dynamic Component Hydration",
        body: "Using a novel approach we call 'Just-in-Time UI', the system fetches component definitions as JSON from the edge based on the user's current context. This allows us to A/B test entire interface paradigms without deploying new code.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
      }
    ],
    nextId: 1
  }
};

const TimelineWidget: React.FC<{ duration: string; year: string }> = ({ duration, year }) => {
  return (
    <div className="bg-surface border border-border rounded-3xl p-8 shadow-lg mt-6 hover:border-accent/50 transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
         <h3 className="text-sm font-mono text-accent uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} /> Timeline
         </h3>
         <span className="text-xs font-bold bg-background border border-border px-3 py-1 rounded-full text-primary shadow-sm">{duration}</span>
      </div>
      
      <div className="relative px-2">
         {/* Background Line */}
         <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 rounded-full"></div>
         
         {/* Completed Line */}
         <div className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-accent to-primary -translate-y-1/2 rounded-full w-full origin-left"></div>

         {/* Nodes */}
         <div className="relative flex justify-between w-full">
            {/* Node 1: Start */}
            <div className="relative group/node">
                <div className="w-3 h-3 rounded-full bg-accent border-2 border-surface shadow-sm z-10 relative"></div>
                <div className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-secondary uppercase opacity-100 transition-opacity whitespace-nowrap">Kickoff</div>
            </div>
            
            {/* Node 2: Milestone */}
            <div className="relative group/node">
                <div className="w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface z-10 relative"></div>
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-secondary uppercase opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap bg-background px-2 py-1 rounded border border-border shadow-sm">Milestone</div>
            </div>

            {/* Node 3: Launch */}
            <div className="relative group/node">
                <div className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-surface shadow-sm z-10 relative flex items-center justify-center">
                    <div className="w-1 h-1 bg-surface rounded-full"></div>
                </div>
                <div className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-primary font-bold uppercase opacity-100 transition-opacity whitespace-nowrap">Launch</div>
            </div>
         </div>
      </div>
      
      <div className="mt-10 pt-6 border-t border-border flex justify-between items-center">
         <div>
            <span className="block text-xs text-secondary mb-1">Status</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-accent/10 px-2 py-1 rounded text-accent-text">
                <Check size={12} strokeWidth={3} /> Delivered
            </div>
         </div>
         <div className="text-right">
             <span className="block text-xs text-secondary mb-1">Deployment</span>
             <span className="block text-xs font-bold text-primary">{year}</span>
         </div>
      </div>
    </div>
  );
};

interface CaseStudyPageProps {
  id: number;
  onBack: () => void;
  onNext: (id: number) => void;
}

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ id, onBack, onNext }) => {
  const [study, setStudy] = useState<any>(null);
  const { ref: heroRef, isInView: heroInView } = useInView(0.1);
  const { ref: statsRef, isInView: statsInView } = useInView(0.2);
  const { ref: contentRef, isInView: contentInView } = useInView(0.1);

  // Dynamic Title & Load Data
  useEffect(() => {
    // Try to find in LocalStorage first
    let foundStudy = staticCaseStudies[id];
    try {
        const stored = localStorage.getItem('site_case_studies');
        if (stored) {
            const dynamicStudies = JSON.parse(stored);
            if (dynamicStudies[id]) {
                foundStudy = dynamicStudies[id];
            }
        }
    } catch (e) {
        console.error("Failed to load case study from storage", e);
    }

    setStudy(foundStudy);

    if (foundStudy) {
      document.title = `${foundStudy.title} | Sam Ayebanate Case Study`;
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (!study) return <div className="min-h-screen flex items-center justify-center text-primary">Case Study Not Found</div>;

  return (
    <div className="min-h-screen bg-background text-primary animate-in fade-in duration-500">
      
      {/* Navigation Bar Overlay */}
      <div className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-border backdrop-blur-md hover:bg-surface hover:text-accent transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Work</span>
        </button>
      </div>

      {/* Hero Section */}
      <div ref={heroRef} className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0">
            <img src={study.heroImage} alt={study.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full px-6 pb-24 md:pb-32">
            <div className="max-w-7xl mx-auto">
                <div className={`transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-accent text-black font-bold text-xs uppercase tracking-widest rounded-full">{study.category}</span>
                        <span className="text-gray-300 font-mono text-sm">{study.year}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-[1.05]">
                        {study.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl leading-relaxed">
                        {study.subtitle}
                    </p>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24 border-b border-border pb-12">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent mb-1"><User size={16} /><span className="text-xs uppercase tracking-widest font-mono">Client</span></div>
                <p className="text-lg font-medium">{study.client}</p>
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent mb-1"><Calendar size={16} /><span className="text-xs uppercase tracking-widest font-mono">Timeline</span></div>
                <p className="text-lg font-medium">{study.duration}</p>
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent mb-1"><Code2 size={16} /><span className="text-xs uppercase tracking-widest font-mono">Role</span></div>
                <p className="text-lg font-medium">{Array.isArray(study.role) ? study.role.join(", ") : study.role}</p>
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent mb-1"><Cpu size={16} /><span className="text-xs uppercase tracking-widest font-mono">Tech Stack</span></div>
                <div className="flex flex-wrap gap-2">
                    {study.techStack && study.techStack.map((t: string) => (
                        <span key={t} className="text-sm bg-surface border border-border px-2 py-1 rounded">{t}</span>
                    ))}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
            
            {/* Left Content */}
            <div ref={contentRef} className="lg:col-span-8 space-y-20">
                
                {/* Challenge & Solution */}
                <div className={`space-y-16 transition-all duration-1000 ${contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <section>
                        <h2 className="text-3xl font-display font-bold mb-6">The Challenge</h2>
                        <p className="text-lg md:text-xl text-secondary leading-relaxed font-light">
                            {study.challenge}
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-3xl font-display font-bold mb-6">The Solution</h2>
                        <p className="text-lg md:text-xl text-secondary leading-relaxed font-light">
                            {study.solution}
                        </p>
                    </section>
                </div>

                {/* Additional Content Blocks */}
                {study.content && study.content.map((block: any, idx: number) => (
                    <section key={idx} className="space-y-8">
                        {block.image && (
                            <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
                                <img src={block.image} alt={block.title} className="w-full object-cover" />
                            </div>
                        )}
                        <h3 className="text-2xl font-display font-bold">{block.title}</h3>
                        <p className="text-lg text-secondary leading-relaxed">{block.body}</p>
                    </section>
                ))}

            </div>

            {/* Right Sticky Sidebar (Results) */}
            <div className="lg:col-span-4 relative">
                <div ref={statsRef} className={`sticky top-32 transition-all duration-1000 delay-300 ${statsInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <div className="bg-surface border border-border rounded-3xl p-8 shadow-lg">
                        <h3 className="text-sm font-mono text-accent uppercase tracking-widest mb-8">Key Results</h3>
                        <div className="space-y-8">
                            {study.results && study.results.map((res: any, i: number) => (
                                <div key={i} className="relative group">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <div className="text-4xl md:text-5xl font-display font-medium text-primary">{res.value}</div>
                                        {res.trend && (
                                            <div className={`flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-full ${
                                                res.trendDirection === 'up' ? 'bg-green-500/10 text-green-500' :
                                                res.trendDirection === 'down' ? 'bg-red-500/10 text-red-500' :
                                                'bg-secondary/10 text-secondary'
                                            }`}>
                                                {res.trendDirection === 'up' && <TrendingUp size={12} />}
                                                {res.trendDirection === 'down' && <TrendingDown size={12} />}
                                                {res.trend}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-secondary font-medium">{res.label}</div>
                                    {res.description && (
                                        <p className="text-xs text-secondary/60 mt-2 leading-relaxed max-w-[200px]">
                                            {res.description}
                                        </p>
                                    )}
                                    {i !== study.results.length - 1 && <div className="w-full h-px bg-border mt-8"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <TimelineWidget duration={study.duration} year={study.year} />

                    <div className="mt-6 flex gap-4">
                        <button className="flex-1 py-4 bg-primary text-background rounded-xl font-bold hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-2">
                             Live Demo <ExternalLink size={18} />
                        </button>
                    </div>
                </div>
            </div>

        </div>

        {/* Next Project Footer */}
        <div className="mt-32 border-t border-border pt-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <span className="text-sm font-mono text-secondary uppercase tracking-widest">Next Project</span>
                    <h3 className="text-3xl font-display font-bold text-primary mt-2">Ready to see more?</h3>
                </div>
                <button 
                    onClick={() => onNext(study.nextId)}
                    className="group flex items-center gap-4 px-8 py-12 md:py-6 bg-surface border border-border rounded-2xl hover:border-accent hover:bg-accent hover:text-black transition-all w-full md:w-auto"
                >
                    <div className="text-left">
                        <span className="block text-xs uppercase tracking-widest opacity-60 mb-1">Up Next</span>
                        <span className="block text-xl font-bold">{staticCaseStudies[study.nextId]?.title || "Synthetix Legal Core"}</span>
                    </div>
                    <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors ml-auto md:ml-4">
                        <ArrowRight size={20} />
                    </div>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};