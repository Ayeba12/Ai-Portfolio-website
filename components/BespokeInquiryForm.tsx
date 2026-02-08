import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, Send } from 'lucide-react';

interface BespokeInquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'intro' | 'identity' | 'contact' | 'details' | 'budget' | 'success';

const PROJECT_TYPES = [
  "AI Automation", "Web Development", "Brand Identity", "Product Design", "Consulting", "Other"
];

const BUDGET_RANGES = [
  "< $10k", "$10k - $30k", "$30k - $60k", "$60k - $100k", "$100k +"
];

export const BespokeInquiryForm: React.FC<BespokeInquiryFormProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    projectType: [] as string[],
    details: '',
    budget: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Input refs for auto-focus
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const detailsInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset form after delay when closing
      setTimeout(() => {
        setCurrentStep('intro');
        setFormData({ name: '', company: '', email: '', projectType: [], details: '', budget: '' });
      }, 500);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Auto-focus logic
  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => {
        if (currentStep === 'identity') nameInputRef.current?.focus();
        if (currentStep === 'contact') emailInputRef.current?.focus();
        if (currentStep === 'details') detailsInputRef.current?.focus();
    }, 300);
  }, [currentStep, isOpen]);

  const handleNext = () => {
    setError(null);
    switch (currentStep) {
      case 'intro':
        setCurrentStep('identity');
        break;
      case 'identity':
        if (!formData.name.trim()) { setError('Please tell us your name.'); return; }
        setCurrentStep('contact');
        break;
      case 'contact':
        if (!formData.email.includes('@')) { setError('Please enter a valid email.'); return; }
        setCurrentStep('details');
        break;
      case 'details':
        if (formData.projectType.length === 0) { setError('Select at least one project type.'); return; }
        setCurrentStep('budget');
        break;
      case 'budget':
        if (!formData.budget) { setError('Please select a budget range.'); return; }
        
        // --- SAVE TO INBOX ---
        try {
            const newInquiry = {
                id: `MSG-${Date.now()}`,
                name: formData.name,
                email: formData.email,
                company: formData.company,
                type: 'Project Request',
                budget: formData.budget,
                services: formData.projectType,
                message: formData.details,
                date: new Date().toISOString().split('T')[0],
                status: 'New'
            };
            
            const existingStore = localStorage.getItem('sam_portfolio_inquiries');
            const items = existingStore ? JSON.parse(existingStore) : [];
            localStorage.setItem('sam_portfolio_inquiries', JSON.stringify([newInquiry, ...items]));
        } catch (e) {
            console.error("Failed to save inquiry", e);
        }
        // ---------------------

        setCurrentStep('success');
        break;
    }
  };

  const handleBack = () => {
    setError(null);
    switch (currentStep) {
      case 'identity': setCurrentStep('intro'); break;
      case 'contact': setCurrentStep('identity'); break;
      case 'details': setCurrentStep('contact'); break;
      case 'budget': setCurrentStep('details'); break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && currentStep !== 'intro' && currentStep !== 'success') {
      e.preventDefault();
      handleNext();
    }
  };

  const toggleProjectType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      projectType: prev.projectType.includes(type) 
        ? prev.projectType.filter(t => t !== type)
        : [...prev.projectType, type]
    }));
  };

  if (!isOpen) return null;

  // Calculate progress
  const getProgress = () => {
    const steps = ['intro', 'identity', 'contact', 'details', 'budget', 'success'];
    const idx = steps.indexOf(currentStep);
    return ((idx) / (steps.length - 1)) * 100;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] text-white flex flex-col animate-in fade-in duration-300">
      
      {/* Top Bar */}
      <div className="w-full px-6 py-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-display font-bold">SA</div>
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest hidden sm:block">Project Inquiry Protocol</span>
        </div>
        <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors group"
        >
            <X size={24} className="text-zinc-500 group-hover:text-white" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-zinc-900 absolute top-0 left-0">
        <div 
            className="h-full bg-[#C4FF61] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" 
            style={{ width: `${getProgress()}%` }}
        ></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full px-6 relative">
        
        {/* Step: INTRO */}
        {currentStep === 'intro' && (
            <div className="animate-in slide-in-from-bottom-8 fade-in duration-700 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C4FF61]/10 border border-[#C4FF61]/20 text-[#C4FF61] text-xs font-mono uppercase tracking-widest mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C4FF61] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C4FF61]"></span>
                    </span>
                    New Inquiry
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-medium leading-[1.1] tracking-tight">
                    Let's architect <br/> the <span className="text-[#C4FF61]">future.</span>
                </h2>
                <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-xl">
                    You're about to initiate a collaboration. I take on a limited number of projects to ensure extreme attention to detail.
                </p>
                <button 
                    onClick={handleNext}
                    className="group mt-8 flex items-center gap-4 text-2xl font-display font-bold hover:text-[#C4FF61] transition-colors"
                >
                    Start the process <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        )}

        {/* Step: IDENTITY */}
        {currentStep === 'identity' && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-12">
                <div>
                    <h3 className="text-3xl md:text-4xl font-display font-medium mb-8 text-zinc-400">
                        First, what should we call you?
                    </h3>
                    <input 
                        ref={nameInputRef}
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        onKeyDown={handleKeyDown}
                        placeholder="Your Name"
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-[#C4FF61] text-4xl md:text-6xl py-4 focus:outline-none transition-colors placeholder:text-zinc-800 font-display text-white"
                    />
                </div>
                <div>
                    <input 
                        type="text" 
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        onKeyDown={handleKeyDown}
                        placeholder="Company Name (Optional)"
                        className="w-full bg-transparent border-b border-zinc-800 focus:border-[#C4FF61] text-2xl md:text-4xl py-4 focus:outline-none transition-colors placeholder:text-zinc-800 font-display text-white"
                    />
                </div>
            </div>
        )}

        {/* Step: CONTACT */}
        {currentStep === 'contact' && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-12">
                 <h3 className="text-3xl md:text-4xl font-display font-medium mb-8 text-zinc-400">
                    Where can I send the blueprint?
                </h3>
                <input 
                    ref={emailInputRef}
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    onKeyDown={handleKeyDown}
                    placeholder="name@company.com"
                    className="w-full bg-transparent border-b border-zinc-800 focus:border-[#C4FF61] text-4xl md:text-6xl py-4 focus:outline-none transition-colors placeholder:text-zinc-800 font-display text-white"
                />
            </div>
        )}

        {/* Step: DETAILS */}
        {currentStep === 'details' && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-10">
                 <div>
                    <h3 className="text-2xl font-display font-medium mb-6 text-zinc-400">
                        What are we building? <span className="text-zinc-600 text-sm ml-2">(Select all that apply)</span>
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {PROJECT_TYPES.map(type => (
                            <button
                                key={type}
                                onClick={() => toggleProjectType(type)}
                                className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                                    formData.projectType.includes(type)
                                    ? 'bg-[#C4FF61] text-black border-[#C4FF61]'
                                    : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div>
                    <h3 className="text-2xl font-display font-medium mb-6 text-zinc-400">
                        Tell me about the vision.
                    </h3>
                    <textarea 
                        ref={detailsInputRef}
                        value={formData.details}
                        onChange={(e) => setFormData({...formData, details: e.target.value})}
                        placeholder="Project goals, timeline, and any specific challenges..."
                        rows={3}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-xl text-white focus:outline-none focus:border-[#C4FF61] transition-colors placeholder:text-zinc-700 resize-none"
                    />
                 </div>
            </div>
        )}

        {/* Step: BUDGET */}
        {currentStep === 'budget' && (
            <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-12">
                 <h3 className="text-3xl md:text-4xl font-display font-medium mb-8 text-zinc-400">
                    What is the investment range?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BUDGET_RANGES.map(range => (
                        <button
                            key={range}
                            onClick={() => setFormData({...formData, budget: range})}
                            className={`p-6 text-left rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                                formData.budget === range
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600'
                            }`}
                        >
                            <span className="text-xl font-display font-bold">{range}</span>
                            {formData.budget === range && <Check size={20} />}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Step: SUCCESS */}
        {currentStep === 'success' && (
            <div className="animate-in zoom-in-95 fade-in duration-700 flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-[#C4FF61] rounded-full flex items-center justify-center text-black mb-8 shadow-[0_0_50px_rgba(196,255,97,0.4)]">
                    <Sparkles size={40} />
                 </div>
                 <h2 className="text-5xl md:text-6xl font-display font-medium mb-6">
                    Signal Received.
                 </h2>
                 <p className="text-xl text-zinc-400 max-w-lg leading-relaxed mb-12">
                    Thank you, {formData.name}. I've received your dossier. I'll review the details and transmit a response to <span className="text-white border-b border-white/20">{formData.email}</span> within 24 hours.
                 </p>
                 <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-[#C4FF61] transition-colors"
                >
                    Return to Homepage
                </button>
            </div>
        )}

        {/* Error Message */}
        {error && (
            <div className="absolute bottom-32 left-6 text-red-400 animate-in slide-in-from-bottom-2 fade-in">
                * {error}
            </div>
        )}

      </div>

      {/* Footer Navigation */}
      {currentStep !== 'intro' && currentStep !== 'success' && (
        <div className="w-full p-6 border-t border-zinc-900 flex justify-between items-center bg-[#050505] z-20">
            <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="flex items-center gap-4">
                <span className="text-zinc-600 text-xs font-mono hidden sm:inline">
                    PRESS ENTER ↵
                </span>
                <button 
                    onClick={handleNext}
                    className="bg-[#C4FF61] text-black px-6 py-3 rounded-full font-bold hover:bg-white transition-colors flex items-center gap-2"
                >
                    {currentStep === 'budget' ? 'Submit Inquiry' : 'Next Step'}
                    {currentStep === 'budget' ? <Send size={18} /> : <ArrowRight size={18} />}
                </button>
            </div>
        </div>
      )}

    </div>
  );
};