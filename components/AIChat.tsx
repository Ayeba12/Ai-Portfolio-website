import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Mic, Globe, BrainCircuit, X, Volume2, StopCircle, MessageSquare, ChevronDown, Minimize2, Trash2, ExternalLink, ChevronUp, Link as LinkIcon, Settings2, Check } from 'lucide-react';
import { streamMessageFromGemini, connectLiveSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { LiveServerMessage, Blob } from '@google/genai';

const STORAGE_KEY = 'sam_portfolio_chat_history';

// Helper Component for Grounding Sources
const GroundingSources: React.FC<{ chunks: any[] }> = ({ chunks }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!chunks || chunks.length === 0) return null;

  const webChunks = chunks.filter(c => c.web?.uri && c.web?.title);
  if (webChunks.length === 0) return null;

  return (
    <div className="ml-0 sm:ml-10 mt-3 w-full sm:max-w-[95%] bg-surface/40 border border-border/60 rounded-xl overflow-hidden shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2">
      {/* Header Toggle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-surface/60 transition-colors group cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shadow-sm ${
                isExpanded ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-background border border-border text-blue-400'
            }`}>
                <Globe size={12} />
            </div>
            <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-primary">
                    {webChunks.length} Sources
                </span>
                <span className="text-[10px] text-secondary font-medium">
                    Grounding data
                </span>
            </div>
        </div>
        
        {/* Preview of sources when collapsed */}
        {!isExpanded && (
             <div className="flex items-center -space-x-2 mr-2">
                 {webChunks.slice(0, 4).map((chunk, i) => (
                     <div key={i} className="w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center overflow-hidden">
                         <img 
                            src={`https://www.google.com/s2/favicons?domain=${new URL(chunk.web.uri).hostname}&sz=32`} 
                            className="w-3 h-3 opacity-80" 
                            alt=""
                         />
                     </div>
                 ))}
                 {webChunks.length > 4 && (
                    <div className="w-5 h-5 rounded-full bg-surface border border-border flex items-center justify-center text-[8px] text-secondary font-bold">
                        +{webChunks.length - 4}
                    </div>
                 )}
             </div>
        )}

        <div className={`text-secondary/50 group-hover:text-primary transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
             <ChevronDown size={14} />
        </div>
      </button>

      {/* Expanded List */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            isExpanded ? 'max-h-[600px] opacity-100 border-t border-border/50' : 'max-h-0 opacity-0'
        }`}
      >
         <div className="p-2 space-y-1 bg-background/20">
            {webChunks.map((chunk, i) => {
                 let hostname = "";
                 try { hostname = new URL(chunk.web.uri).hostname; } catch(e) {}
                 
                 return (
                    <a 
                        key={i}
                        href={chunk.web.uri}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface border border-transparent hover:border-border/50 transition-all group relative"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                             <img 
                                 src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`} 
                                 alt="" 
                                 className="w-4 h-4 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                                 onError={(e) => { 
                                     e.currentTarget.style.display = 'none'; 
                                     e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                 }}
                             />
                             <div className="hidden text-secondary">
                                <LinkIcon size={12} />
                             </div>
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-xs font-medium text-primary line-clamp-1 group-hover:text-accent transition-colors">
                                {chunk.web.title}
                            </p>
                            <p className="text-[10px] text-secondary font-mono truncate opacity-60">
                                {hostname}
                            </p>
                        </div>
                        <ExternalLink size={12} className="text-secondary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                 );
            })}
         </div>
         <div className="px-4 py-2 bg-background/40 text-[10px] text-secondary text-center border-t border-border/50">
             AI generated content can be inaccurate. Check sources.
         </div>
      </div>
    </div>
  );
};

type ChatMode = 'standard' | 'search' | 'thinking';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize from localStorage or default
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        { role: 'model', text: "Hello! I'm Sam's digital twin. Ask me anything about his work, skills, or availability." }
      ];
    } catch (e) {
      console.error("Error loading chat history:", e);
      return [{ role: 'model', text: "Hello! I'm Sam's digital twin. Ask me anything about his work, skills, or availability." }];
    }
  });

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Modes
  const [chatMode, setChatMode] = useState<ChatMode>('standard');
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const modeMenuRef = useRef<HTMLDivElement>(null);

  // Live API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioQueueRef = useRef<AudioBufferSourceNode[]>([]);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming, isOpen]);

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Error saving chat history:", e);
    }
  }, [messages]);

  // Close mode menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(event.target as Node)) {
        setIsModeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup Live API on unmount
  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      const defaultMsg: ChatMessage[] = [{ role: 'model', text: "Hello! I'm Sam's digital twin. Ask me anything about his work, skills, or availability." }];
      setMessages(defaultMsg);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMsg));
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMsg = input;
    setInput('');
    setIsStreaming(true);

    // Add user message
    const newHistory = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newHistory);

    try {
      // Add empty model message placeholder
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      let fullResponse = "";
      let groundingData: any[] = [];

      const stream = streamMessageFromGemini(newHistory, userMsg, {
        useSearch: chatMode === 'search',
        useThinking: chatMode === 'thinking'
      });

      for await (const chunk of stream) {
        if (chunk.text) fullResponse += chunk.text;
        if (chunk.groundingChunks) groundingData = chunk.groundingChunks;

        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = { 
            ...updated[lastIdx], 
            text: fullResponse,
            groundingChunks: groundingData.length > 0 ? groundingData : undefined
          };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Network error. Please try again." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  // --- Live API Logic ---

  const startLiveSession = async () => {
    try {
      setIsLiveActive(true);
      
      // Audio Contexts
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;
      nextStartTimeRef.current = audioCtx.currentTime;

      // Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new AudioContext({ sampleRate: 16000 }); // Gemini expects 16k input
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      
      inputSourceRef.current = source;
      processorRef.current = processor;

      // Connect to Gemini
      const sessionPromise = connectLiveSession({
        onopen: () => {
          console.log("Live Session Connected");
        },
        onmessage: async (msg: LiveServerMessage) => {
          const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            playAudioChunk(base64Audio, audioCtx);
          }
        },
        onclose: () => {
          console.log("Live Session Closed");
          stopLiveSession();
        },
        onerror: (e) => {
          console.error("Live Session Error", e);
          stopLiveSession();
        }
      });

      sessionRef.current = sessionPromise;

      // Process Audio Input
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBlob = createBlob(inputData);
        sessionPromise.then(session => {
          session.sendRealtimeInput({ media: pcmBlob });
        });
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);

    } catch (err) {
      console.error("Failed to start live session", err);
      setIsLiveActive(false);
    }
  };

  const stopLiveSession = () => {
    setIsLiveActive(false);
    
    // Stop Microphone
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }

    // Close Session
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => session.close());
      sessionRef.current = null;
    }

    // Stop Audio Output
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    audioQueueRef.current = [];
  };

  const playAudioChunk = async (base64: string, ctx: AudioContext) => {
    try {
      const audioBuffer = await decodeAudioData(base64, ctx);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      // Schedule playback
      const currentTime = ctx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }
      
      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;
      
      audioQueueRef.current.push(source);
      source.onended = () => {
        const index = audioQueueRef.current.indexOf(source);
        if (index > -1) audioQueueRef.current.splice(index, 1);
      };
    } catch (e) {
      console.error("Error decoding audio", e);
    }
  };

  // Helpers for Audio
  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    const binary = new Uint8Array(int16.buffer);
    let binaryString = '';
    for(let i=0; i<binary.byteLength; i++) {
        binaryString += String.fromCharCode(binary[i]);
    }
    
    return {
      data: btoa(binaryString),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const decodeAudioData = async (base64: string, ctx: AudioContext) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Convert 16-bit PCM to float32
    const dataInt16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(dataInt16.length);
    for (let i = 0; i < dataInt16.length; i++) {
      float32[i] = dataInt16[i] / 32768.0;
    }

    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);
    return buffer;
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start font-sans">
      
      {/* Chat Window */}
      <div 
        className={`
          mb-4 w-[90vw] sm:w-[380px] h-[500px] bg-surface/95 border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md transition-all duration-300 origin-bottom-left flex flex-col
          ${isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 translate-y-10 pointer-events-none absolute bottom-0 left-0'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="AI Assistant Chat"
      >
        {/* Header/Controls */}
        <div className="flex items-center justify-between px-4 py-3 bg-background border-b border-border z-10">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
             <span className="font-bold text-primary text-sm">Sam AI</span>
          </div>
          <div className="flex gap-1 items-center">
               <button 
                  onClick={clearHistory}
                  className="p-1.5 rounded-md text-secondary hover:text-red-400 hover:bg-surface transition-colors"
                  title="Clear History"
                  aria-label="Clear chat history"
              >
                  <Trash2 size={16} />
              </button>
              
              <div className="w-px h-4 bg-border mx-1"></div>
              
              {/* Mode Selector */}
              <div className="relative" ref={modeMenuRef}>
                <button 
                  onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                  className={`p-1.5 rounded-md transition-all flex items-center gap-1.5 ${chatMode !== 'standard' ? 'bg-accent/10 text-accent-text' : 'text-secondary hover:text-primary hover:bg-surface'}`}
                  title="Select Mode"
                  aria-haspopup="true"
                  aria-expanded={isModeMenuOpen}
                >
                    {chatMode === 'standard' && <Sparkles size={16} />}
                    {chatMode === 'search' && <Globe size={16} />}
                    {chatMode === 'thinking' && <BrainCircuit size={16} />}
                    <ChevronDown size={12} className={`transition-transform duration-200 ${isModeMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isModeMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                     <div className="p-1">
                        <button 
                          onClick={() => { setChatMode('standard'); setIsModeMenuOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${chatMode === 'standard' ? 'bg-background text-primary font-medium' : 'text-secondary hover:bg-background/50 hover:text-primary'}`}
                        >
                          <Sparkles size={16} />
                          <div className="text-left flex-1">
                            <div>Standard</div>
                            <div className="text-[10px] opacity-60">Fast & Creative</div>
                          </div>
                          {chatMode === 'standard' && <Check size={14} className="text-accent-text" />}
                        </button>
                        
                        <button 
                          onClick={() => { setChatMode('search'); setIsModeMenuOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${chatMode === 'search' ? 'bg-background text-primary font-medium' : 'text-secondary hover:bg-background/50 hover:text-primary'}`}
                        >
                          <Globe size={16} />
                           <div className="text-left flex-1">
                            <div>Search Grounding</div>
                            <div className="text-[10px] opacity-60">Real-time Web Data</div>
                          </div>
                          {chatMode === 'search' && <Check size={14} className="text-accent-text" />}
                        </button>

                        <button 
                          onClick={() => { setChatMode('thinking'); setIsModeMenuOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${chatMode === 'thinking' ? 'bg-background text-primary font-medium' : 'text-secondary hover:bg-background/50 hover:text-primary'}`}
                        >
                          <BrainCircuit size={16} />
                           <div className="text-left flex-1">
                            <div>Deep Thinking</div>
                            <div className="text-[10px] opacity-60">Complex Reasoning</div>
                          </div>
                          {chatMode === 'thinking' && <Check size={14} className="text-accent-text" />}
                        </button>
                     </div>
                  </div>
                )}
              </div>

              <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface ml-2"
                  aria-label="Minimize chat"
              >
                  <Minimize2 size={16} />
              </button>
          </div>
        </div>

        {/* Mode Indicator Banner */}
        {chatMode !== 'standard' && (
            <div className={`px-4 py-1.5 border-b border-border text-[10px] uppercase font-mono tracking-widest text-center flex items-center justify-center gap-2 ${
                chatMode === 'thinking' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-blue-500/10 text-blue-400'
            }`}>
                {chatMode === 'thinking' && <><BrainCircuit size={12} /> Deep Thinking Active</>}
                {chatMode === 'search' && <><Globe size={12} /> Search Grounding Active</>}
            </div>
        )}

        {/* Live Mode Overlay */}
        {isLiveActive && (
            <div className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="relative">
                  <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping"></div>
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-black mb-6 relative z-10">
                      <Volume2 size={32} className="animate-pulse" />
                  </div>
              </div>
              <p className="text-white font-display font-medium text-xl mb-2">Listening...</p>
              <p className="text-white/50 text-sm font-mono">Sam's Digital Twin (Live)</p>
              
              <button 
                  onClick={stopLiveSession}
                  className="mt-8 px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-full flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all"
                  aria-label="End voice call"
              >
                  <StopCircle size={16} /> End Call
              </button>
            </div>
        )}

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.map((msg, idx) => {
            const isLast = idx === messages.length - 1;
            return (
              <div 
                key={idx} 
                className={`
                    flex flex-col gap-1 
                    ${msg.role === 'user' ? 'items-end' : 'items-start'}
                    ${msg.role === 'user' ? 'animate-msg-right' : 'animate-msg-left'}
                `}
              >
                <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`
                    w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-white/5 
                    ${msg.role === 'user' ? 'bg-secondary text-background' : 'bg-accent text-black'}
                    transition-transform duration-300 hover:scale-110
                  `}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-body leading-relaxed shadow-sm transform transition-all duration-300 hover:shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-secondary text-background rounded-tr-none' 
                      : 'bg-background border border-border text-primary rounded-tl-none'
                  }`}>
                    {msg.text}
                    {isLast && isStreaming && msg.role === 'model' && (
                      <span className="inline-block w-1.5 h-3 ml-1 bg-accent align-middle animate-blink"></span>
                    )}
                  </div>
                </div>
                
                {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                    <GroundingSources chunks={msg.groundingChunks} />
                )}
              </div>
            );
          })}
          {isStreaming && messages[messages.length - 1].text === '' && (
            <div className="flex gap-3 animate-pulse">
              <div className="w-7 h-7 rounded-full bg-accent text-black flex items-center justify-center">
                <Bot size={14} />
              </div>
              <div className="bg-background border border-border px-3 py-2 rounded-2xl rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-secondary/50 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-background border-t border-border flex gap-2 items-center">
            <button
              type="button"
              onClick={startLiveSession}
              className="p-2.5 rounded-full bg-surface border border-border text-primary hover:bg-accent hover:text-black transition-all"
              title="Start Voice Chat"
              aria-label="Start voice chat"
            >
              <Mic size={16} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chatMode === 'thinking' ? "Ask a complex reasoning question..." : chatMode === 'search' ? "Ask about recent events..." : "Ask me anything..."}
              className="flex-1 bg-surface border border-border rounded-full py-2.5 px-4 text-xs sm:text-sm text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-secondary/50"
              aria-label="Message input"
            />
            <button 
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="p-2.5 bg-primary rounded-full text-background hover:bg-accent hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              aria-label="Send message"
            >
              {isStreaming ? <Sparkles size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
        </form>
      </div>

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 bg-primary text-background px-5 py-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:bg-accent hover:text-black hover:shadow-[0_4px_30px_rgba(196,255,97,0.4)] transition-all duration-300 transform hover:-translate-y-1"
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        aria-expanded={isOpen}
      >
        <div className="relative">
            {isOpen ? <ChevronDown size={24} /> : <MessageSquare size={24} />}
            {!isOpen && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background"></span>
            )}
        </div>
        <span className="font-bold text-sm hidden sm:block">
            {isOpen ? 'Close Chat' : 'Ask AI Agent'}
        </span>
      </button>

    </div>
  );
};