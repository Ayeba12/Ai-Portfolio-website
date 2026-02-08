import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Eye, Server } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  
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
                <Shield size={14} className="text-accent" />
                <span className="text-xs font-mono text-secondary uppercase tracking-widest">Legal Documentation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-display font-bold text-primary mb-4">
                Privacy Policy
            </h1>
            <p className="text-secondary text-lg">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none text-secondary">
            <p className="lead text-xl text-primary font-light mb-12">
                I value your privacy as much as I value clean code. This policy outlines how Sam Ayebanate ("I", "me", or "my") collects, uses, and protects your information when you visit my portfolio website.
            </p>

            <div className="space-y-16">
                
                {/* Section 1 */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary border border-border">
                            <Eye size={20} />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-primary m-0">1. Information Collection</h2>
                    </div>
                    <p>
                        I believe in minimalism, and that extends to data collection. I only collect information that is strictly necessary for the functionality of this website and our potential business relationship.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-accent">
                        <li><strong>Voluntary Information:</strong> When you fill out the contact form or inquiry modal, I collect personal details such as your name, email address, company name, and project details.</li>
                        <li><strong>Usage Data:</strong> Like most modern websites, I use standard analytics tools to understand how visitors interact with the site (e.g., pages visited, time spent, browser type). This data is anonymized.</li>
                        <li><strong>AI Interaction Data:</strong> If you interact with the "Sam AI" digital assistant, the conversation logs are processed to generate responses. Do not share sensitive personal information or secrets with the AI.</li>
                    </ul>
                </section>

                {/* Section 2 */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary border border-border">
                            <Server size={20} />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-primary m-0">2. How I Use Information</h2>
                    </div>
                    <p>
                        The data collected is used solely for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-accent">
                        <li>To respond to your inquiries and discuss potential collaborations.</li>
                        <li>To provide and maintain the website's functionality.</li>
                        <li>To improve the user experience and optimize website performance.</li>
                        <li>To detect and prevent technical issues or security breaches.</li>
                    </ul>
                </section>

                {/* Section 3 */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary border border-border">
                            <Lock size={20} />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-primary m-0">3. Data Security & Storage</h2>
                    </div>
                    <p>
                        I implement industry-standard security measures to protect your data. Your information is stored on secure servers and is not sold, traded, or transferred to outside parties, except for trusted third parties who assist in operating the website (e.g., hosting providers, AI API providers), so long as those parties agree to keep this information confidential.
                    </p>
                    <p className="mt-4">
                        However, no method of transmission over the Internet is 100% secure. While I strive to use commercially acceptable means to protect your personal data, I cannot guarantee its absolute security.
                    </p>
                </section>

                {/* Section 4 */}
                <section>
                    <h2 className="text-2xl font-display font-bold text-primary mb-4">4. Third-Party Links</h2>
                    <p>
                        This website may contain links to other sites (e.g., LinkedIn, GitHub, project demos). If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by me. I strongly advise you to review the Privacy Policy of these websites. I have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                    </p>
                </section>

                 {/* Section 5 */}
                 <section>
                    <h2 className="text-2xl font-display font-bold text-primary mb-4">5. Your Rights</h2>
                    <p>
                        Depending on your location, you may have rights regarding your data, including the right to access, correct, or delete your personal information. If you wish to exercise these rights, please contact me directly.
                    </p>
                </section>

                {/* Contact */}
                <div className="bg-surface border border-border rounded-2xl p-8 mt-12">
                    <h3 className="text-xl font-bold text-primary mb-2">Questions?</h3>
                    <p className="mb-4">If you have any questions about this Privacy Policy, please contact me:</p>
                    <a href="mailto:ayebadevs@gmail.com" className="text-primary font-bold border-b-2 border-accent hover:bg-accent hover:text-black transition-all">ayebadevs@gmail.com</a>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};