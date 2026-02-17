import React, { useEffect, useState } from 'react';
import { useInView } from './useInView';
import { ArrowUpRight, Twitter, Github, Linkedin, ArrowRight } from 'lucide-react';
import { Marquee } from './Marquee';
import { getProjects, getSiteConfig } from '../services/supabaseService';

const defaultProjects = [
    {
        id: 1,
        title: "Synthetix Legal Core",
        category: "Enterprise AI Agent",
        date: "Sep 2024",
        description: "A sovereign AI legal analyst for a Tier-1 firm. The system autonomously reviews NDAs and contracts, flagging risk with 99.4% accuracy against senior partner benchmarks.",
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop",
        tags: ["LLM Agents", "Python", "RAG"],
        status: "Published"
    },
    {
        id: 2,
        title: "Velocite Supply Chain",
        category: "Predictive Analytics",
        date: "Aug 2024",
        description: "Integrated predictive ML models into a legacy logistics ERP. Resulted in a 40% reduction in shipping delays by autonomously rerouting cargo based on weather and port congestion data.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop",
        tags: ["Machine Learning", "Automation"],
        status: "Published"
    },
    {
        id: 3,
        title: "Lumina Health Voice",
        category: "Conversational AI",
        date: "Jul 2024",
        description: "Engineered a HIPAA-compliant voice agent for patient intake. Handles 5,000+ simultaneous calls, reducing wait times from 45 minutes to <10 seconds.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
        tags: ["Voice AI", "Healthcare"],
        status: "Published"
    },
    {
        id: 4,
        title: "Aether Design System",
        category: "Generative UI",
        date: "May 2024",
        description: "Created a self-evolving component library for a fintech super-app. The UI automatically adjusts density and contrast based on user trading velocity and ambient lighting.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
        tags: ["GenUI", "React", "System Design"],
        status: "Published"
    }
];

interface ProjectCardProps {
    project: any;
    index: number;
    onOpen: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onOpen }) => {
    return (
        <div
            onClick={onOpen}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center cursor-pointer border-b border-border/40 pb-20 last:border-0 last:pb-0"
        >
            <div className="hidden lg:block lg:col-span-1 text-right">
                <span className="font-mono text-sm text-secondary/50">0{index + 1}</span>
            </div>

            <div className="lg:col-span-5 relative overflow-hidden rounded-2xl aspect-[4/3] bg-surface border border-border">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10 duration-500"></div>
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full border border-border text-xs font-mono uppercase tracking-widest text-secondary group-hover:border-accent group-hover:text-accent-text transition-colors">
                        {project.category}
                    </span>
                    <span className="text-secondary text-xs">{project.date}</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-display font-medium text-primary group-hover:text-accent transition-colors leading-tight">
                    {project.title}
                </h2>

                <p className="text-lg text-secondary font-light leading-relaxed max-w-md">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags && project.tags.map((tag: string) => (
                        <span key={tag} className="text-xs font-mono text-secondary/60">#{tag}</span>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-primary font-bold pt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    View Case Study <ArrowUpRight size={18} />
                </div>
            </div>
        </div>
    );
};

interface ProjectsPageProps {
    onOpenCaseStudy?: (id: number) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenCaseStudy }) => {
    const { ref, isInView } = useInView(0.1);
    const [allProjects, setAllProjects] = useState<any[]>([]);
    const [avatar, setAvatar] = useState('/avatar.jpg');

    // Load projects from Supabase
    const loadProjects = async () => {
        try {
            const supabaseProjects = await getProjects();
            if (supabaseProjects.length > 0) {
                setAllProjects(supabaseProjects.filter((p: any) => p.status === 'Published'));
            } else {
                setAllProjects(defaultProjects);
            }
        } catch (e) {
            console.error("Failed to load projects", e);
            setAllProjects(defaultProjects);
        }
    };

    useEffect(() => {
        loadProjects();

        // Load Avatar Config from Supabase
        const loadConfig = async () => {
            try {
                const config = await getSiteConfig();
                if (config.heroAvatar) setAvatar(config.heroAvatar);
            } catch (e) { console.error(e); }
        };
        loadConfig();
    }, []);

    // Listen for live updates
    useEffect(() => {
        const handleConfigUpdate = (e: any) => {
            const data = e instanceof CustomEvent ? e.detail : e.data;
            if (data?.heroAvatar !== undefined) {
                setAvatar(data.heroAvatar || '/avatar.jpg');
            }
        };

        const handleProjectsUpdate = () => {
            loadProjects();
        };

        const projectChannel = new BroadcastChannel('portfolio_updates');
        projectChannel.onmessage = (e) => {
            if (e.data.type === 'project') handleProjectsUpdate();
            if (e.data.type === 'site-config') handleConfigUpdate(e);
        };

        const configChannel = new BroadcastChannel('site_config_updates');
        configChannel.onmessage = handleConfigUpdate;

        window.addEventListener('site-config-update', handleConfigUpdate as EventListener);
        window.addEventListener('site-projects-update', handleProjectsUpdate as EventListener);

        return () => {
            window.removeEventListener('site-config-update', handleConfigUpdate as EventListener);
            window.removeEventListener('site-projects-update', handleProjectsUpdate as EventListener);
            projectChannel.close();
            configChannel.close();
        };
    }, []);

    return (
        <div className="min-h-screen pt-20 bg-background transition-colors duration-300">

            <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">

                {/* Header */}
                <div className="text-center mb-24 md:mb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                        <span className="text-secondary text-sm font-medium tracking-wide">Engineering Case Studies</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-primary tracking-tight">
                        Selected work
                    </h1>
                </div>

                {/* Projects List */}
                <div className="space-y-24 md:space-y-32">
                    {allProjects.length > 0 ? (
                        allProjects.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} onOpen={() => onOpenCaseStudy?.(project.id)} />
                        ))
                    ) : (
                        <div className="text-center text-secondary py-20">
                            <p>No published projects found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Marquee Section - Moved here */}
            <div className="py-12">
                <Marquee />
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-24 md:pb-32">
                {/* Contact CTA */}
                <div className="pt-12 md:pt-24 pb-12">
                    <div className="flex items-center gap-2 mb-16 md:mb-24">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                        </span>
                        <span className="text-primary font-medium">Available for new ventures</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-end">
                        <div>
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-primary leading-[1.05] tracking-tight">
                                Let's build the <br />
                                <span className="text-secondary">future</span> of <br />
                                automation<span className="text-accent">.</span>
                            </h2>
                        </div>

                        <div className="space-y-12">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full overflow-hidden border border-border bg-surface shrink-0">
                                    <img
                                        src={avatar}
                                        onError={(e) => {
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop";
                                            e.currentTarget.onerror = null;
                                        }}
                                        alt="Sam"
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg text-secondary">
                                        "I don't just write code; I architect systems that scale with your ambition. Let's create something extraordinary."
                                    </p>
                                    <p className="text-sm font-bold text-primary">— Sam Ayebanate</p>
                                </div>
                            </div>

                            <button
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group flex items-center gap-4 text-2xl md:text-3xl font-display font-bold text-primary hover:text-accent transition-colors"
                            >
                                Start a Project <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
