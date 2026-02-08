import React, { useState } from 'react';
import { PaletteResult, generateDesignPalette } from '../services/geminiService';
import { FlaskConical, RefreshCcw, Sparkles, Copy, Check, ChevronRight } from 'lucide-react';
import { useInView } from './useInView';

export const Lab: React.FC = () => {
  const { ref, isInView } = useInView(0.1);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<PaletteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResult(null);
    
    // Provide a default prompt if user is lazy but clicks button
    const finalPrompt = prompt.trim() || "Futuristic minimal UI";
    
    const data = await generateDesignPalette(finalPrompt);
    if (data) {
      setResult(data);
    }
    setLoading(false);
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const suggestions = [
    "Cyberpunk Tokyo Rain",
    "Scandinavian Morning",
    "Mars Colony 2050",
    "Bio-luminescent Forest"
  ];

  return (
    <section id="lab" className="py-32 bg-background border-t border-border overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left: Controls */}
          <div ref={ref} className={`lg:col-span-5 transition-all duration-700 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="text-accent-text font-mono text-sm tracking-widest mb-4 block">{`{07} — The Lab`}</span>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6 leading-tight">
              Neural Palette <br/><span className="text-secondary">Engine</span>
            </h2>
            
            <p className="text-secondary text-lg mb-8 leading-relaxed">
              Describe a mood, a memory, or a dream. My AI model will translate your words into a harmonious color system.
            </p>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <div className="relative">
                    <input 
                      type="text" 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. 'Electric sunset over a digital ocean'"
                      className="w-full bg-surface border border-border rounded-xl p-5 pr-14 text-lg text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all shadow-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
                        <Sparkles size={20} className={loading ? 'animate-spin text-accent-text' : ''} />
                    </div>
                </div>
                {/* Suggestions */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {suggestions.map(s => (
                        <button 
                            key={s}
                            type="button"
                            onClick={() => { setPrompt(s); }}
                            className="text-xs text-secondary hover:text-primary px-3 py-1 rounded-full border border-border hover:border-accent hover:bg-surface transition-all"
                        >
                            {s}
                        </button>
                    ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full md:w-auto bg-primary text-background px-8 py-4 rounded-full font-bold text-lg hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                {loading ? 'Generating...' : 'Generate Palette'}
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Right: Visualization */}
          <div className="lg:col-span-7">
             <div className="relative min-h-[500px] h-full rounded-3xl bg-surface border border-border overflow-hidden p-2 shadow-2xl">
                {/* Loader State */}
                {loading && (
                    <div className="absolute inset-0 z-20 bg-surface/80 backdrop-blur-md flex flex-col items-center justify-center text-center">
                        <RefreshCcw size={40} className="text-accent-text animate-spin mb-4" />
                        <p className="font-mono text-primary animate-pulse">Consulting the neural network...</p>
                    </div>
                )}

                {/* Empty State */}
                {!result && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-40">
                        <div className="w-20 h-20 rounded-full bg-border flex items-center justify-center mb-6">
                            <Sparkles size={32} />
                        </div>
                        <p className="text-lg font-display text-primary">Ready to visualize.</p>
                        <p className="text-sm font-mono text-secondary mt-2">Enter a prompt to begin.</p>
                    </div>
                )}

                {/* Result State */}
                {result && (
                    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Header */}
                        <div className="p-6 md:p-8 bg-background border-b border-border">
                            <h3 className="text-2xl font-display font-bold text-primary">{result.paletteName}</h3>
                            <p className="text-secondary font-light mt-1 text-sm md:text-base">{result.description}</p>
                        </div>
                        
                        {/* Colors Grid */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            {result.colors.map((color, idx) => (
                                <div 
                                    key={idx} 
                                    className="relative group h-32 md:h-auto flex flex-col justify-end p-6 transition-all hover:flex-[1.5] duration-500"
                                    style={{ backgroundColor: color.hex }}
                                >
                                    {/* Text Content - Adaptive Color based on luminance calc is tricky in CSS-only, using generic shadow for readability */}
                                    <div className="relative z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="bg-black/20 backdrop-blur-md p-3 rounded-lg border border-white/10 text-white">
                                            <p className="font-bold text-sm mb-1">{color.name}</p>
                                            <p className="text-[10px] leading-tight opacity-80">{color.rationale}</p>
                                        </div>
                                    </div>

                                    {/* Hex Code Button */}
                                    <button 
                                        onClick={() => copyToClipboard(color.hex)}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                                        title="Copy Hex"
                                    >
                                        {copiedHex === color.hex ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                    
                                    <span className="absolute bottom-4 left-6 font-mono text-xs font-bold text-white/50 group-hover:opacity-0 transition-opacity">
                                        {color.hex}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};