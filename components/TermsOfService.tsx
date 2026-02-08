import React, { useEffect } from 'react';
import { ArrowLeft, Scale, FileText, AlertCircle } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16">
            <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </button>
            
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-surface border border-border">
                <Scale size={14} className="text-accent" />
                <span className="text-xs font-mono text-secondary uppercase tracking-widest">Legal Documentation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-display font-bold text-primary mb-4">
                Terms of Service
            </h1>
            <p className="text-secondary text-lg">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none text-secondary">
            <p className="lead text-xl text-primary font-light mb-12">
                By accessing this website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use this website.
            </p>

            <div className="space-y-16">
                
                {/* Section 1 */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary border border-border">
                            <FileText size={20} />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-primary m-0">1. Intellectual Property</h2>
                    </div>
                    <p>
                        The content, design, code, and aesthetics of this website—including but not limited to the "Sam AI" assistant, 3D visualizations, case studies, and copy—are the intellectual property of Sam Ayebanate, unless otherwise noted.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-accent">
                        <li>You may not copy, reproduce, or distribute any part of this site without explicit written permission.</li>
                        <li>The project case studies presented are factual representations of work performed. Client names and data may have been obfuscated for confidentiality where required by NDA.</li>
                        <li>Open source components used in this site are subject to their respective licenses.</li>
                    </ul>
                </section>

                {/* Section 2 */}
                <section>
                    <h2 className="text-2xl font-display font-bold text-primary mb-4">2. Use of AI Features</h2>
                    <p>
                        This website utilizes generative AI features (e.g., Chat, Lab Palette Generator). By using these features, you acknowledge that:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-accent">
                        <li>AI responses may occasionally be inaccurate or hallucinated. Always verify critical information.</li>
                        <li>You will not use the AI features to generate harmful, illegal, or abusive content.</li>
                        <li>Interactions with the AI are not private and may be monitored for quality and safety purposes.</li>
                    </ul>
                </section>

                {/* Section 3 */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary border border-border">
                            <AlertCircle size={20} />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-primary m-0">3. Limitation of Liability</h2>
                    </div>
                    <p>
                        In no event shall Sam Ayebanate be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website, even if notified orally or in writing of the possibility of such damage.
                    </p>
                </section>

                {/* Section 4 */}
                <section>
                    <h2 className="text-2xl font-display font-bold text-primary mb-4">4. Availability & Accuracy</h2>
                    <p>
                        I strive to keep the information on this site up to date. However, materials may include technical, typographical, or photographic errors. I do not warrant that any of the materials on the website are accurate, complete, or current. I may make changes to the materials contained on the website at any time without notice.
                    </p>
                </section>

                 {/* Section 5 */}
                 <section>
                    <h2 className="text-2xl font-display font-bold text-primary mb-4">5. Governing Law</h2>
                    <p>
                        These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which I operate and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                    </p>
                </section>

            </div>
        </div>
      </div>
    </div>
  );
};