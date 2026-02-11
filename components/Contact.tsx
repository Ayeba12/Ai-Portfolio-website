import React, { useState } from 'react';
import { Mail, MapPin, Linkedin, Github, Twitter, MessageSquare, ChevronDown, CheckCircle2 } from 'lucide-react';
import { createInquiry } from '../services/supabaseService';

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    try {
      await createInquiry({
        name: formState.name,
        email: formState.email,
        company: '',
        type: 'General',
        subject: formState.subject || 'General Inquiry',
        budget: '',
        services: [],
        message: formState.message,
        date: new Date().toISOString(),
        status: 'New'
      });

      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (e) {
      console.error("Failed to save contact form", e);
    }
  };

  return (
    <section id="contact" className="py-32 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: Contact Form */}
          <div>
            <span className="text-accent-text font-mono text-sm tracking-widest mb-4 block">{`{08} — Get in Touch`}</span>
            <h2 className="text-5xl md:text-6xl font-display font-medium text-primary mb-8 leading-tight">
              Let's create something<br /> extraordinary together.
            </h2>

            {submitted ? (
              <div className="bg-background border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center h-[400px] animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-black mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Message Sent!</h3>
                <p className="text-secondary max-w-sm">
                  Thanks for reaching out. I'll get back to you at your email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-sm font-bold text-primary border-b-2 border-accent hover:text-accent transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-base font-medium text-secondary" htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg p-5 text-lg text-primary focus:outline-none focus:border-accent transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-base font-medium text-secondary" htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg p-5 text-lg text-primary focus:outline-none focus:border-accent transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-base font-medium text-secondary" htmlFor="subject">Subject</label>
                  <div className="relative">
                    <select
                      id="subject"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg p-5 text-lg text-primary focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a topic...</option>
                      <option value="General Inquiry">General Project Inquiry</option>
                      <hr className="border-border my-1 opacity-50" />
                      <option value="AI Automation">AI Automation & Agents</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Brand Design">Brand Design & Identity</option>
                      <option value="System Architecture">System Architecture</option>
                      <option value="Rapid Prototyping">Rapid Prototyping / MVP</option>
                      <option value="Data Strategy">Data Strategy & Analytics</option>
                      <hr className="border-border my-1 opacity-50" />
                      <option value="Collaboration">Partnership / Collaboration</option>
                      <option value="Speaking">Speaking / Podcast</option>
                      <option value="Hi">Just Saying Hi</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-base font-medium text-secondary" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg p-5 text-lg text-primary focus:outline-none focus:border-accent transition-colors"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-primary text-background py-5 rounded-lg font-bold text-xl hover:bg-accent hover:text-black transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-start gap-12 h-full">
            <div>
              <h3 className="text-xl font-display font-bold text-primary mb-8">Contact Info</h3>
              <div className="space-y-8 mb-12">
                <a href="mailto:ayebadevs@gmail.com" className="flex items-center gap-5 group" aria-label="Send email to ayebadevs@gmail.com">
                  <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center group-hover:border-accent group-hover:text-accent-text transition-colors text-secondary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <span className="block text-base text-secondary">Email me at</span>
                    <span className="text-xl text-primary font-medium group-hover:text-accent-text transition-colors">ayebadevs@gmail.com</span>
                  </div>
                </a>

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center text-secondary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <span className="block text-base text-secondary">Location</span>
                    <span className="text-xl text-primary font-medium">Remote / Global</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a href="#" className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-secondary hover:bg-primary hover:text-background hover:border-primary transition-all" aria-label="LinkedIn Profile">
                  <Linkedin size={24} />
                </a>
                <a href="#" className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-secondary hover:bg-primary hover:text-background hover:border-primary transition-all" aria-label="GitHub Profile">
                  <Github size={24} />
                </a>
                <a href="#" className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-secondary hover:bg-primary hover:text-background hover:border-primary transition-all" aria-label="Twitter Profile">
                  <Twitter size={24} />
                </a>
              </div>
            </div>

            {/* Simple CTA for Widget */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
              <div className="w-12 h-12 rounded-full bg-accent text-black flex items-center justify-center mb-4">
                <MessageSquare size={24} />
              </div>
              <h4 className="text-xl font-bold text-primary mb-2">Have a quick question?</h4>
              <p className="text-secondary leading-relaxed">
                My AI digital twin is available 24/7 to answer questions about my rates, stack, and availability. Look for the button in the bottom left corner.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};