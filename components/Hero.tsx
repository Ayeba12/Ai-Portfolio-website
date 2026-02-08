import React, { useEffect, useState, useRef } from 'react';
import { ArrowUpRight, Github, Twitter, Linkedin, Sparkles } from 'lucide-react';
import * as THREE from 'three';

// --- WebGL Shader Code ---
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform vec3 u_color_bg;
uniform vec3 u_color_accent;

varying vec2 vUv;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2D Noise
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation (Cubic Hermite Curve)
    vec2 u = f*f*(3.0-2.0*f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    // Normalize coordinates
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    
    vec2 mouse = u_mouse / u_resolution.xy;
    mouse.x *= u_resolution.x / u_resolution.y;
    
    // Slow, calm time variable
    float t = u_time * 0.15;
    
    // Domain warping for liquid-like flow
    vec2 q = vec2(0.);
    q.x = noise(st + vec2(0.0, t * 0.5));
    q.y = noise(st + vec2(1.0, t * 0.3));

    vec2 r = vec2(0.);
    r.x = noise(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
    r.y = noise(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

    // Main noise pattern
    float f = noise(st + r);

    // Mouse Interaction: Subtle ripple/light around cursor
    float dist = distance(st, mouse);
    float mouseGlow = smoothstep(0.4, 0.0, dist) * 0.15;

    // Color Mixing
    // Base mix between background and a subtle blend of accent
    // We keep it very subtle (multiplying by small factors) to ensure text readability
    
    vec3 color = mix(u_color_bg, u_color_accent, clamp((f * f) * 0.15 + mouseGlow, 0.0, 1.0));
    
    // Add a second layer of flow for depth
    float f2 = noise(st * 1.5 - t * 0.1);
    color = mix(color, u_color_accent, f2 * 0.05);

    // Vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(vUv - 0.5));
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
}
`;

export const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('/avatar.jpg');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load settings on mount
  useEffect(() => {
      const savedConfig = localStorage.getItem('site_config');
      if (savedConfig) {
          try {
              const parsed = JSON.parse(savedConfig);
              if (parsed.heroAvatar) setAvatarUrl(parsed.heroAvatar);
          } catch (e) {
              console.error("Failed to parse site config", e);
          }
      }
  }, []);

  // Listen for live updates
  useEffect(() => {
      const handleConfigUpdate = (e: CustomEvent) => {
          if (e.detail?.heroAvatar !== undefined) {
             setAvatarUrl(e.detail.heroAvatar || '/avatar.jpg');
          }
      };
      window.addEventListener('site-config-update', handleConfigUpdate as EventListener);
      return () => window.removeEventListener('site-config-update', handleConfigUpdate as EventListener);
  }, []);

  // Initialize Three.js
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Initial colors
    const isDark = document.documentElement.classList.contains('dark');
    const bgHex = isDark ? 0x050505 : 0xFFFFFF;
    const accentHex = 0xC4FF61;

    const uniforms = {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2) },
        u_color_bg: { value: new THREE.Color(bgHex) },
        u_color_accent: { value: new THREE.Color(accentHex) }
    };

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
        uniforms.u_time.value = clock.getElapsedTime();
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Event Listeners
    const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        uniforms.u_resolution.value.set(width, height);
    };

    const handleMouseMove = (e: MouseEvent) => {
        uniforms.u_mouse.value.set(e.clientX, window.innerHeight - e.clientY);
    };

    // Theme Observer
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const isDarkNow = document.documentElement.classList.contains('dark');
                const newBg = isDarkNow ? 0x050505 : 0xFFFFFF;
                uniforms.u_color_bg.value.setHex(newBg);
            }
        });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        observer.disconnect();
        if (containerRef.current) {
            containerRef.current.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center py-24 md:py-32 lg:py-48 px-6 overflow-hidden bg-transparent">
      
      {/* WebGL Background Container */}
      <div ref={containerRef} className="absolute inset-0 -z-10 w-full h-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full relative pt-16 md:pt-0">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Left Column: Bio & Socials (Sticky-ish feel on Desktop) */}
          <div className={`lg:col-span-3 lg:pt-4 transition-all duration-1000 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-row lg:flex-col items-center lg:items-start gap-4 mb-6">
               <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-border shadow-sm flex-shrink-0 bg-surface/50 backdrop-blur-sm">
                 <img 
                    src={avatarUrl}
                    onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop";
                        e.currentTarget.onerror = null;
                    }}
                    alt="Sam Ayebanate" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                 />
               </div>
               <div className="text-left">
                 <h3 className="font-display font-bold text-xl md:text-lg leading-tight text-primary">Sam Ayebanate</h3>
                 <p className="text-secondary text-base md:text-sm">AI Engineer &<br/>Product Designer</p>
               </div>
            </div>
            
            <div className="hidden lg:flex gap-4 text-secondary mt-2">
               <a href="#" aria-label="Twitter Profile" className="hover:text-primary transition-colors p-2 hover:bg-surface/50 rounded-full"><Twitter size={20} /></a>
               <a href="#" aria-label="GitHub Profile" className="hover:text-primary transition-colors p-2 hover:bg-surface/50 rounded-full"><Github size={20} /></a>
               <a href="#" aria-label="LinkedIn Profile" className="hover:text-primary transition-colors p-2 hover:bg-surface/50 rounded-full"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Right Column: Main Typography Content */}
          <div className="lg:col-span-9 relative">
              {/* Availability Badge */}
              <div className={`
                inline-flex items-center gap-2 mb-8 
                transition-all duration-1000 delay-100 ease-out transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                </span>
                <span className="text-secondary text-base md:text-sm font-medium tracking-wide">Available for new projects</span>
              </div>

              {/* Huge Responsive Typography with Pills - Sizes Increased */}
              <div className="font-display font-medium text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] md:leading-[1.1] text-primary tracking-tight mb-8 select-none cursor-default">
                
                {/* Line 1 */}
                <div className={`flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-2 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] delay-200 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                  <span>I'm</span>
                  <span className="px-4 py-1.5 md:px-5 md:py-1.5 bg-surface/50 border border-border backdrop-blur-sm rounded-full shadow-sm text-[0.6em] leading-none inline-flex items-center justify-center whitespace-nowrap hover:scale-105 transition-transform duration-300 origin-center text-primary">
                     Sam Ayebanate
                  </span>
                </div>
                
                {/* Line 2 */}
                <div className={`flex flex-wrap items-center gap-x-3 md:gap-x-4 gap-y-2 mt-2 md:mt-3 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] delay-300 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                  <span>an</span>
                  <span className="px-4 py-1.5 md:px-5 md:py-1.5 bg-primary text-background rounded-full text-[0.6em] leading-none inline-flex items-center justify-center whitespace-nowrap hover:rotate-1 transition-transform duration-300">
                     AI Engineer
                  </span>
                  <span>in</span>
                  <span className="px-4 py-1.5 md:px-5 md:py-1.5 bg-surface/50 border border-border backdrop-blur-sm rounded-full shadow-sm text-[0.6em] leading-none inline-flex items-center justify-center whitespace-nowrap hover:-rotate-1 transition-transform duration-300 text-primary">
                     Port Harcourt
                  </span>
                </div>

                {/* Line 3 */}
                <div className={`block mt-2 md:mt-3 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] delay-[400ms] transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                  crafting intelligent
                </div>

                {/* Line 4 */}
                <div className={`block text-secondary mt-2 md:mt-3 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] delay-[500ms] transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                  digital experiences
                </div>
              </div>

              {/* Description & CTA - Stacked Vertical */}
              <div className="flex flex-col gap-8 items-start mt-10 md:mt-12">
                 <p className={`max-w-md text-lg md:text-xl text-secondary leading-relaxed font-light transition-all duration-1000 ease-out delay-[700ms] transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                   I build autonomous AI agents and premium interfaces for forward-thinking brands.
                 </p>
                 
                 <div className={`transition-all duration-1000 ease-out delay-[900ms] transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    <button 
                      onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                      className="group flex items-center gap-3 px-8 py-4 bg-accent text-black rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(196,255,97,0.4)] transition-all duration-300 transform hover:-translate-y-1 focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                    >
                      See my work
                      <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-accent transition-colors">
                          <ArrowUpRight size={18} />
                      </div>
                    </button>
                 </div>
              </div>

              {/* Mobile Only Socials */}
              <div className="lg:hidden flex gap-8 text-secondary mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-[1000ms] fill-mode-backwards">
                 <a href="#" aria-label="Twitter Profile" className="hover:text-primary"><Twitter size={24} /></a>
                 <a href="#" aria-label="GitHub Profile" className="hover:text-primary"><Github size={24} /></a>
                 <a href="#" aria-label="LinkedIn Profile" className="hover:text-primary"><Linkedin size={24} /></a>
              </div>
          </div>
        </div>

        {/* Decorative Floating Element */}
        <div className={`hidden xl:block absolute bottom-0 right-0 animate-float transition-all duration-1000 delay-[1100ms] ${mounted ? 'opacity-90' : 'opacity-0'}`}>
            <div className="p-4 bg-background/60 border border-border backdrop-blur-md rounded-2xl shadow-xl flex items-center gap-3 w-64">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <Sparkles size={20} className="text-black" />
                </div>
                <div>
                    <p className="text-xs text-secondary font-mono uppercase">Expertise</p>
                    <p className="text-sm font-bold text-primary">AI Agents & GenUI</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};