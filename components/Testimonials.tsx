import React from 'react';

const testimonials = [
  {
    name: "Alexander Vance",
    username: "CTO @ FinEdge Global",
    body: "Sam didn't just build a platform; he engineered a competitive advantage. The autonomous AI agents now handle 60% of our client intake with zero latency. Absolute precision.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Elena Rodriguez",
    username: "Director @ Aesthete",
    body: "A rare convergence of aesthetic brilliance and technical mastery. The generative UI system feels alive—it adapts to our users in real-time. It's not just code; it's craftsmanship.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Marcus Chen",
    username: "Founder @ DataFlow",
    body: "We were drowning in unstructured data. Sam's RAG pipeline turned that noise into clear, actionable intelligence. Truly transformative for our internal operations.",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Sarah Jenkins",
    username: "VP Product @ Orbital",
    body: "The predictive analytics dashboard is not just functional; it's a work of art. Operational efficiency is up 200% since the system went live. A flawless execution.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
   {
    name: "Dr. Aris Thorne",
    username: "CEO @ MedTech Solutions",
    body: "Compliance was our biggest hurdle. Sam delivered a HIPAA-compliant voice agent that is both secure and incredibly empathetic. A masterclass in engineering.",
    img: "https://randomuser.me/api/portraits/men/86.jpg",
  },
  {
    name: "Isabella G.",
    username: "Head of Digital @ Vogue",
    body: "I've worked with dozens of agencies. None have delivered this level of polish and performant code. Sam is simply in a league of his own.",
    img: "https://randomuser.me/api/portraits/women/22.jpg",
  },
];

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

interface ReviewCardProps {
  img: string;
  name: string;
  username: string;
  body: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  img,
  name,
  username,
  body,
}) => {
  return (
    <figure
      className="relative w-[400px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface p-8 hover:bg-surface/80 transition-colors"
    >
      <div className="flex flex-row items-center gap-4">
        <img className="rounded-full border border-border" width="48" height="48" alt={name} src={img} />
        <div className="flex flex-col">
          <figcaption className="text-base font-bold text-primary">
            {name}
          </figcaption>
          <p className="text-xs font-mono font-medium text-accent-text uppercase tracking-wide">{username}</p>
        </div>
      </div>
      <blockquote className="mt-6 text-lg text-secondary leading-relaxed font-light italic">"{body}"</blockquote>
    </figure>
  );
};

export const Testimonials: React.FC = () => {
  // We repeat the content 4 times to ensure it covers 4k screens easily before looping
  const row1Content = [...firstRow, ...firstRow, ...firstRow, ...firstRow];
  const row2Content = [...secondRow, ...secondRow, ...secondRow, ...secondRow];

  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden relative border-t border-border">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 mb-24 text-center relative z-10">
         <div className="inline-flex items-center gap-2 mb-6">
             <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
             <span className="text-accent-text font-mono text-sm tracking-widest">{`{06} — Endorsements`}</span>
         </div>
         <h2 className="text-5xl md:text-7xl font-display font-medium text-primary tracking-tight leading-tight">
            Trusted by those who <br/>
            <span className="text-secondary">demand the exceptional.</span>
         </h2>
      </div>

      <div className="relative flex w-full flex-col gap-8 z-10">
        
        {/* Row 1: Left */}
        <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div className="flex shrink-0 animate-scroll-left gap-6 pr-6 group hover:[animation-play-state:paused]">
                {row1Content.map((review, i) => (
                    <ReviewCard key={`r1-a-${i}`} {...review} />
                ))}
            </div>
            <div className="flex shrink-0 animate-scroll-left gap-6 pr-6 group hover:[animation-play-state:paused]">
                {row1Content.map((review, i) => (
                    <ReviewCard key={`r1-b-${i}`} {...review} />
                ))}
            </div>
        </div>

        {/* Row 2: Right */}
        <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div className="flex shrink-0 animate-scroll-right gap-6 pr-6 group hover:[animation-play-state:paused]">
                {row2Content.map((review, i) => (
                    <ReviewCard key={`r2-a-${i}`} {...review} />
                ))}
            </div>
            <div className="flex shrink-0 animate-scroll-right gap-6 pr-6 group hover:[animation-play-state:paused]">
                {row2Content.map((review, i) => (
                    <ReviewCard key={`r2-b-${i}`} {...review} />
                ))}
            </div>
        </div>
        
      </div>
    </section>
  );
};