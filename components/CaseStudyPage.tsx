import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, ArrowUpRight, Check, ExternalLink, Calendar, ArrowDown } from 'lucide-react';
import { useInView } from './useInView';
import { getAllCaseStudies, getProjects } from '../services/supabaseService';

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

interface CaseStudyPageProps {
  id: number;
  onBack: () => void;
  onNext: (id: number) => void;
}

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ id, onBack, onNext }) => {
  const [study, setStudy] = useState<any>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  // Dynamic Title & Load Data
  useEffect(() => {
    setIsLoaded(false);
    const loadStudy = async () => {
      // Fetch all projects for "Up Next" logic
      let projectsList: any[] = [];
      try {
        const supabaseProjects = await getProjects();
        if (supabaseProjects.length > 0) {
          projectsList = supabaseProjects
            .filter((p: any) => p.status === 'Published')
            .sort((a, b) => (b.id as number) - (a.id as number));
        } else {
          // Fallback to static sequence
          projectsList = Object.values(staticCaseStudies).map((s, idx) => ({ ...s, id: idx + 1 }));
        }
        setAllProjects(projectsList);
      } catch (e) {
        console.error("Failed to load projects list", e);
      }

      // Try to find from Supabase first, fall back to static data
      let foundStudy = staticCaseStudies[Number(id)];
      try {
        const supabaseStudies = await getAllCaseStudies();
        const match = supabaseStudies[Number(id)];
        if (match) {
          foundStudy = {
            ...foundStudy,
            ...match,
            title: match.title || foundStudy?.title,
            subtitle: match.subtitle || foundStudy?.subtitle,
            heroImage: match.hero_image || foundStudy?.heroImage,
          };
        }
      } catch (e) {
        console.error("Failed to load case study from Supabase", e);
      }

      setStudy(foundStudy);
      setTimeout(() => setIsLoaded(true), 100);

      if (foundStudy) {
        document.title = `${foundStudy.title} | Sam Ayebanate Case Study`;
      }
    };

    loadStudy();
    window.scrollTo(0, 0);

    const handleUpdate = (e: any) => {
      // Handle both CustomEvent (same tab) and MessageEvent (cross-tab)
      const data = e instanceof CustomEvent ? e.detail : e.data;

      // Reload projects list for "Up Next" whenever anything changes
      loadStudy();

      // If the currently viewed project was deleted, go back
      if (data?.action === 'delete' && data?.id == id) {
        onBack();
      }
    };

    const projectChannel = new BroadcastChannel('portfolio_updates');
    projectChannel.onmessage = handleUpdate;

    window.addEventListener('site-projects-update', handleUpdate as EventListener);

    // Scroll progress listener
    const handleScroll = () => {
      const totalScroll = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('site-projects-update', handleUpdate as EventListener);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [id]);

  if (!study) return <div className="min-h-screen flex items-center justify-center text-primary font-display text-2xl">Loading Project...</div>;

  return (
    <div className="bg-background min-h-screen text-primary selection:bg-accent selection:text-white pb-32">

      {/* Scroll Progress & Nav */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-secondary/10">
        <div
          className="h-full bg-accent transition-all duration-100 ease-out"
          style={{ width: `${Math.min(scrollProgress * 100, 100)}%` }}
        />
      </div>

      <nav className="fixed top-0 w-full z-40 px-6 py-8 flex justify-between items-center mix-blend-difference text-white">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-24 overflow-hidden">
        {/* Background Image with Parallax-like fixity */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/20 z-10" />
          <img
            src={study.heroImage}
            alt={study.title}
            className={`w-full h-full object-cover transition-transform duration-[2s] ease-out ${isLoaded ? 'scale-105' : 'scale-110 blur-sm'}`}
          />
        </div>

        <div className={`relative z-20 max-w-7xl transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="flex flex-wrap gap-4 mb-8">
            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/90 text-sm font-medium uppercase tracking-wider">
              {study.category}
            </span>
            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/90 text-sm font-mono">
              {study.year}
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium text-white leading-[0.9] tracking-tight mb-8">
            {study.title}
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-white/80 font-light max-w-3xl leading-relaxed">
            {study.subtitle}
          </p>
        </div>

        <div className="absolute bottom-8 right-8 z-20 animate-bounce text-white/50 hidden md:block">
          <ArrowDown size={32} />
        </div>
      </header>

      <main className="px-6 md:px-12 lg:px-24 max-w-8xl mx-auto">

        {/* Project Meta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-24 border-b border-border">
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">Client</h3>
            <p className="text-xl font-display text-primary">{study.client}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">Timeline</h3>
            <p className="text-xl font-display text-primary">{study.duration}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">Role</h3>
            <ul className="text-lg text-primary space-y-1">
              {study.role.map((r: string, i: number) => <li key={i}>{r}</li>)}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {study.techStack.map((t: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-full bg-surface border border-border text-sm text-secondary hover:border-accent/50 transition-colors cursor-default">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Challenge & Solution (Sticky Layout) */}
        <div className="py-24 space-y-32">

          {/* Challenge Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="sticky top-32">
              <span className="text-accent text-sm font-bold uppercase tracking-widest mb-4 block">01 — The Challenge</span>
              <h2 className="text-4xl md:text-5xl font-display font-medium text-primary mb-8 leading-tight">
                Identifying the friction points.
              </h2>
            </div>
            <div className="lg:pt-12">
              <p className="text-xl md:text-2xl text-secondary font-light leading-relaxed mb-12">
                {study.challenge}
              </p>
              <div className="bg-surface p-8 rounded-3xl border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-sm font-mono text-secondary uppercase">Problem Statement</span>
                </div>
                <p className="font-mono text-sm text-primary leading-relaxed">
                  &gt; SYSTEM_DIAGNOSTIC<br />
                  &gt; ERROR: Manual processes exceeding SLA thresholds.<br />
                  &gt; ERROR: Human error rate &gt; 12%.<br />
                  &gt; STATUS: Critical bottleneck identified.
                </p>
              </div>
            </div>
          </div>

          {/* Solution Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="sticky top-32 lg:order-2">
              <span className="text-accent text-sm font-bold uppercase tracking-widest mb-4 block">02 — The Solution</span>
              <h2 className="text-4xl md:text-5xl font-display font-medium text-primary mb-8 leading-tight">
                Engineering a new paradigm.
              </h2>
            </div>
            <div className="lg:pt-12 lg:order-1">
              <p className="text-xl md:text-2xl text-secondary font-light leading-relaxed mb-12">
                {study.solution}
              </p>
              <div className="aspect-video rounded-3xl overflow-hidden relative group">
                <img
                  src={study.content?.[0]?.image || study.heroImage}
                  alt="Solution Preview"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Impact / Results Metrics - Big Typography */}
        <div className="py-24 border-y border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {study.results.map((res: any, i: number) => (
              <div key={i} className="space-y-4 group cursor-default">
                <div className="text-6xl md:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/50 group-hover:to-accent transition-all duration-500">
                  {res.value}
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">
                  {res.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Dive Content Blocks */}
        <div className="py-32 space-y-40">
          {study.content?.map((block: any, idx: number) => (
            <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
              <div className="lg:w-1/2 space-y-8">
                <span className="text-accent text-sm font-bold uppercase tracking-widest">0{idx + 3} — Deep Dive</span>
                <h3 className="text-4xl md:text-5xl font-display font-medium text-primary">{block.title}</h3>
                <p className="text-lg text-secondary leading-relaxed max-w-xl">
                  {block.body}
                </p>
              </div>
              <div className="lg:w-1/2 w-full">
                {block.image && (
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-2xl relative group">
                    <img
                      src={block.image}
                      alt={block.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Next Project Footer */}
      <footer className="bg-primary text-background py-32 px-6 md:px-12 lg:px-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-8">Up Next</p>

          {(() => {
            const currentIndex = allProjects.findIndex(p => p.id == id);
            const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

            if (!nextProject || nextProject.id == id) return null;

            return (
              <button
                onClick={() => { onNext(nextProject.id); window.scrollTo(0, 0); }}
                className="group relative inline-block"
              >
                <h2 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium text-white group-hover:text-accent transition-colors duration-500">
                  {nextProject.title}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-accent">
                  <span className="text-lg font-mono">View Case Study</span>
                  <ArrowUpRight size={24} />
                </div>
              </button>
            );
          })()}
        </div>
      </footer>

    </div>
  );
};
