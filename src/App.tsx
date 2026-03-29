/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useAnimation, AnimatePresence, useSpring } from 'motion/react';
import { Hexagon, ArrowRight, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const testimonials = [
    { quote: "Previewlabs transformed our data strategy. Their AI framework is years ahead of anything we've seen.", name: "Sarah Chen", company: "TechFlow Systems" },
    { quote: "The speed of deployment and the depth of insights provided by their team is unparalleled.", name: "Marcus Thorne", company: "Global Logistics" },
    { quote: "A true partner in innovation. They didn't just give us a tool; they gave us a competitive edge.", name: "Elena Rodriguez", company: "FinTech Solutions" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update hash without jumping
      window.history.pushState(null, '', `#${id}`);
    }
    setIsMenuOpen(false);
  };
  
  // Use a spring for smoother scroll animations
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  

  const controls = useAnimation();

  const triggerSubscribeAnimation = async () => {
    // Dramatic pulse animation - runs twice
    for (let i = 0; i < 2; i++) {
      await controls.start({ 
        scale: 1.15,
        boxShadow: "0 0 100px rgba(255, 77, 0, 1)",
        backgroundColor: "#FFFFFF",
        color: "#FF4D00",
        transition: { duration: 0.1, ease: "easeOut" } 
      });
      await controls.start({ 
        scale: 1,
        boxShadow: "0 0 50px rgba(255, 77, 0, 0.4)",
        backgroundColor: "#FF4D00",
        color: "#FFFFFF",
        transition: { duration: 0.1, ease: "easeIn" } 
      });
    }
  };

  return (
    <div ref={containerRef} className={`relative min-h-[500vh] transition-colors duration-700 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#f5f5f5] text-[#050505]'} overflow-x-hidden selection:bg-brand-orange selection:text-white font-sans`}>
      {/* Grainy Texture */}
      <div className={`grainy-bg transition-opacity duration-700 ${isDarkMode ? 'opacity-100' : 'opacity-20'}`} />
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-[90] transition-all duration-500 flex justify-center items-center ${isScrolled ? 'py-6' : 'py-10'}`}>
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className={`flex items-center gap-8 backdrop-blur-2xl px-8 py-3 rounded-full border transition-all duration-500 ${
            isScrolled 
              ? (isDarkMode ? 'bg-black/80 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]' : 'bg-white/80 border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)]')
              : (isDarkMode ? 'bg-black/60 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'bg-white/60 border-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.05)]')
          }`}
        >
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center font-display font-black text-white text-xl shadow-[0_0_20px_rgba(255,77,0,0.4)]">P.</div>
            <span className={`hidden sm:block font-display font-black text-lg tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>Previewlabs</span>
          </div>
          <div className={`hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.3em] font-black ${isDarkMode ? 'text-white/80' : 'text-black/80'}`}>
            {[{ label: 'Solutions', id: 'features' }, { label: 'Xseller.ai', id: 'services' }, { label: 'About', id: 'team' }, { label: 'Contact', id: 'contact' }].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                className="hover:text-brand-orange transition-all duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Header CTA Button */}
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#FF4D00", color: "#FFFFFF" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('contact')}
            className={`hidden md:block px-6 py-2.5 rounded-full border text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 ${
              isDarkMode ? 'border-white/20 text-white' : 'border-black/20 text-black'
            }`}
          >
            Get Started
          </motion.button>

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-500 ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/10 text-black hover:bg-black/20'}`}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isDarkMode ? 'dark' : 'light'}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
            </AnimatePresence>
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={isDarkMode ? 'md:hidden text-white' : 'md:hidden text-black'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        style={{
          backgroundImage: 'url(/clouds-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          paddingTop: '88px',
        }}
      >
        {/* Dark overlay for warm tone */}
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ backgroundColor: 'rgba(8,4,4,0.60)' }}
        />

        {/* Left cloud orange glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: 0,
            top: '30%',
            width: '35%',
            height: '55%',
            background: 'radial-gradient(ellipse at 0% 60%, rgba(180,40,0,0.28) 0%, rgba(120,20,0,0.12) 50%, transparent 75%)',
            zIndex: 2,
          }}
        />

        {/* Right cloud orange glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: 0,
            top: '30%',
            width: '35%',
            height: '55%',
            background: 'radial-gradient(ellipse at 100% 60%, rgba(180,40,0,0.28) 0%, rgba(120,20,0,0.12) 50%, transparent 75%)',
            zIndex: 2,
          }}
        />

        {/* Landing Animation Wrapper */}
        <div className="z-40 max-w-6xl relative mt-[-15vh]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className={`font-display font-black tracking-tighter mb-8 uppercase ${isDarkMode ? 'text-white' : 'text-black'}`} style={{ fontSize: 'clamp(2.2rem, 5.5vw, 5rem)', lineHeight: '1.05' }}>
              AI Systems <br />
              Built to Run <br />
              Your Business
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          >
            <p className={`text-[11px] md:text-sm uppercase tracking-[0.5em] font-bold leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>
              We engineer AI that handles the work <br />
              — so your team doesn't have to
            </p>
          </motion.div>
        </div>

        {/* Orange Pillar Bar */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: '52%',
            height: '48%',
            width: '140px',
            zIndex: 10,
            borderRadius: '4px',
            background: 'linear-gradient(to bottom, rgba(255,100,20,0.88), rgba(255,45,0,0.96), rgba(190,15,0,0.9))',
            boxShadow: '0 0 35px rgba(255,60,0,0.9), 0 0 80px rgba(255,40,0,0.55), 0 0 160px rgba(255,20,0,0.25)',
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Bottom Mist & Grounding */}
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent z-[2] pointer-events-none" />

        {/* Stats - Exact placement from image */}
        <div className="absolute bottom-[15%] w-full max-w-5xl px-12 flex justify-between items-end z-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left"
          >
            <div className={`text-5xl md:text-7xl font-display font-black tracking-tighter ${isDarkMode ? 'text-white/90' : 'text-black/90'}`}>50+</div>
            <div className={`text-[9px] uppercase tracking-[0.3em] font-bold ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>AI Deployments</div>
          </motion.div>

          <motion.a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-medium text-sm tracking-widest uppercase"
            style={{
              background: 'linear-gradient(135deg, #FF4D00, #CC2200)',
              boxShadow: '0 0 30px rgba(255,77,0,0.4)',
              position: 'absolute',
              bottom: '8%',
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap' as const,
              zIndex: 20,
              textDecoration: 'none',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 45px rgba(255,77,0,0.6)' }}
          >
            Get In Touch →
          </motion.a>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-right"
          >
            <div className={`text-5xl md:text-7xl font-display font-black tracking-tighter ${isDarkMode ? 'text-white/90' : 'text-black/90'}`}>10X</div>
            <div className={`text-[9px] uppercase tracking-[0.3em] font-bold ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>Revenue Impact</div>
          </motion.div>
        </div>

        {/* Orange radial glow at base */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-[3]"
          style={{
            width: '1000px',
            height: '520px',
            background: 'radial-gradient(ellipse at 50% 100%, rgba(255,55,0,0.45) 0%, rgba(200,30,0,0.18) 42%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
      </section>

      {/* Content Section */}
      <section id="features" className="relative z-[60] py-64 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-40 items-center">
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className={`text-6xl md:text-8xl font-display font-black tracking-tighter mb-12 uppercase leading-[0.85] drop-shadow-2xl ${isDarkMode ? 'text-white' : 'text-black'}`}>
              What We <br />
              <span className="text-brand-orange drop-shadow-[0_0_30px_rgba(255,77,0,0.4)]">Build</span>
            </h2>
            <p className={`text-xl leading-relaxed mb-16 max-w-2xl font-medium drop-shadow-lg ${isDarkMode ? 'text-white' : 'text-[#333]'}`}>
              Preview Labs — AI automation and workflow systems.
              We build intelligent systems that handle operations end-to-end,
              so your team can focus on growth.
            </p>
            <div className="flex flex-wrap gap-8">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 77, 0, 0.7)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="bg-brand-orange text-white px-14 py-7 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-brand-orange transition-all duration-500 flex items-center gap-4 group shadow-[0_0_60px_rgba(255,77,0,0.5)]"
              >
                Get in touch
                <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-8">
            {[
              { val: "99.9%", label: "Uptime", h: "h-56" },
              { val: "24/7", label: "Support", h: "h-72" },
              { val: "Global", label: "Infrastructure", h: "h-72" },
              { val: "Secure", label: "Encryption", h: "h-56" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 100, scale: 0.8, rotateY: 20 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className={`${stat.h} rounded-[3rem] border p-10 flex flex-col justify-end group transition-all duration-700 cursor-default shadow-2xl ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-brand-orange/30 hover:border-brand-orange/50' 
                    : 'bg-black/5 border-black/10 hover:bg-brand-orange/10 hover:border-brand-orange/30'
                }`}
              >
                <div className="text-brand-orange font-black text-5xl mb-3 group-hover:scale-110 transition-transform origin-left drop-shadow-[0_0_10px_rgba(255,77,0,0.3)]">{stat.val}</div>
                <div className={`text-[13px] uppercase tracking-[0.5em] font-black group-hover:text-white transition-colors ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section: Identify, Develop, Adopt */}
      <section id="services" className={`relative z-[60] py-64 px-6 max-w-7xl mx-auto border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
        <div className="text-center mb-32">
          <h2 className={`text-5xl md:text-8xl font-display font-black tracking-tighter uppercase mb-8 ${isDarkMode ? 'text-white' : 'text-black'}`}>Our Workflow</h2>
          <p className={`max-w-2xl mx-auto text-xl font-medium ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
            A systematic approach to integrating AI into your business architecture.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { title: "Identify", desc: "We analyze your existing infrastructure to find high-impact AI opportunities.", icon: "01" },
            { title: "Develop", desc: "Our engineers build custom AI frameworks tailored to your specific data landscape.", icon: "02" },
            { title: "Adopt", desc: "We integrate the AI solutions seamlessly into your daily operations and workflows.", icon: "03" }
          ].map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className={`p-12 rounded-[3rem] border transition-all duration-500 group hover:scale-[1.02] ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:border-brand-orange/50' 
                  : 'bg-black/5 border-black/10 hover:border-brand-orange/30'
              }`}
            >
              <div className="text-brand-orange font-display font-black text-6xl mb-8 opacity-20 group-hover:opacity-100 transition-opacity">{card.icon}</div>
              <h3 className={`text-3xl font-display font-black uppercase mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>{card.title}</h3>
              <p className={`text-lg leading-relaxed font-medium ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className={`relative z-[60] py-64 px-6 max-w-5xl mx-auto text-center`}>
        <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className={`text-3xl md:text-5xl font-display font-black italic tracking-tight mb-12 leading-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
                "{testimonials[currentTestimonial].quote}"
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-brand-orange font-black uppercase tracking-[0.3em] text-sm">{testimonials[currentTestimonial].name}</div>
                <div className={`text-[10px] uppercase tracking-[0.5em] font-bold ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>{testimonials[currentTestimonial].company}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex justify-center gap-4 mt-8">
          {testimonials.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentTestimonial(i)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                currentTestimonial === i ? 'bg-brand-orange w-12' : (isDarkMode ? 'bg-white/10' : 'bg-black/10')
              }`}
            />
          ))}
        </div>
      </section>

      {/* Partners Logo Scroll */}
      <section className={`relative z-[60] py-40 border-y overflow-hidden ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
        <div className="flex whitespace-nowrap animate-marquee">
          {[
            "Google", "Anthropic", "OpenAI", "DeepMind", "Mistral", "Meta", "NVIDIA", "Microsoft", "Amazon", "Cohere"
          ].concat(["Google", "Anthropic", "OpenAI", "DeepMind", "Mistral", "Meta", "NVIDIA", "Microsoft", "Amazon", "Cohere"]).map((logo, i) => (
            <div key={i} className={`mx-20 text-4xl font-display font-black uppercase tracking-tighter ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>
              {logo}
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className={`relative z-[60] py-64 px-6 max-w-7xl mx-auto border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className={`text-5xl md:text-8xl font-display font-black tracking-tighter uppercase mb-12 ${isDarkMode ? 'text-white' : 'text-black'}`}>About</h2>
            <p className={`text-xl leading-relaxed font-medium mb-16 ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
              A focused team building AI systems for operators.
            </p>
            <div className="flex flex-wrap gap-8">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)" }}
                whileTap={{ scale: 0.95 }}
                className={`border-2 px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] text-sm transition-all duration-500 ${
                  isDarkMode ? 'border-white/20 text-white' : 'border-black/20 text-black'
                }`}
              >
                Mission Partners
              </motion.button>
            </div>
          </div>
          <div className={`aspect-square rounded-[4rem] border flex items-center justify-center relative overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-transparent" />
            <span className={`font-black uppercase tracking-[0.5em] relative z-10 ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>Team Previewlabs</span>
          </div>
        </div>
      </section>

      {/* Contact Section Placeholder */}
      <section id="contact" className={`relative z-[60] py-64 px-6 max-w-7xl mx-auto border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
        <div className={`rounded-[4rem] p-16 md:p-32 text-center border ${isDarkMode ? 'bg-brand-orange/10 border-brand-orange/20' : 'bg-brand-orange/5 border-brand-orange/10'}`}>
          <h2 className={`text-5xl md:text-8xl font-display font-black tracking-tighter uppercase mb-12 ${isDarkMode ? 'text-white' : 'text-black'}`}>Ready to automate your operations?</h2>
          <p className={`text-xl mb-16 max-w-2xl mx-auto font-medium ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
            Get in touch to see how Preview Labs can transform your workflow with AI.
          </p>
          <button className="bg-brand-orange text-white px-16 py-8 rounded-full font-black uppercase tracking-[0.2em] text-lg hover:bg-white hover:text-brand-orange transition-all duration-500 shadow-[0_0_50px_rgba(255,77,0,0.4)]">
            Contact Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-[60] py-40 px-6 border-t backdrop-blur-xl ${isDarkMode ? 'border-white/10 bg-black/40' : 'border-black/10 bg-white/40'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-24">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <Hexagon className="w-16 h-16 text-brand-orange fill-brand-orange" />
              <span className={`font-display font-black text-5xl tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>Previewlabs</span>
            </div>
            <p className={`max-w-sm text-sm font-bold uppercase tracking-widest leading-loose ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
              Preview Labs — AI automation and workflow systems.
            </p>
          </div>
          
          <div className={`flex flex-wrap gap-24 text-[12px] uppercase tracking-[0.4em] font-black ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
            <div className="flex flex-col gap-8">
              <span className={isDarkMode ? 'text-white' : 'text-black'}>Product</span>
              <button onClick={() => scrollToSection('features')} className="text-left hover:text-brand-orange transition-colors">Solutions</button>
              <a href="#" className="hover:text-brand-orange transition-colors">Integrations</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Pricing</a>
            </div>
            <div className="flex flex-col gap-8">
              <span className={isDarkMode ? 'text-white' : 'text-black'}>Company</span>
              <button onClick={() => scrollToSection('team')} className="text-left hover:text-brand-orange transition-colors">About</button>
              <a href="#" className="hover:text-brand-orange transition-colors">Careers</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Blog</a>
            </div>
            <div className="flex flex-col gap-8">
              <span className={isDarkMode ? 'text-white' : 'text-black'}>Legal</span>
              <a href="#" className="hover:text-brand-orange transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Terms</a>
            </div>
          </div>
        </div>
        <div className={`max-w-7xl mx-auto mt-40 pt-16 border-t text-[12px] uppercase tracking-[0.5em] text-center font-black ${isDarkMode ? 'border-white/10 text-white/20' : 'border-black/10 text-black/20'}`}>
          © 2026 Preview Labs Limited. All rights reserved.
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-16 ${isDarkMode ? 'bg-[#050505]' : 'bg-[#f5f5f5]'}`}
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className={`absolute top-12 right-12 transition-colors ${isDarkMode ? 'text-white hover:text-brand-orange' : 'text-black hover:text-brand-orange'}`}
            >
              <X size={48} />
            </button>
            {[{ label: 'Solutions', id: 'features' }, { label: 'Xseller.ai', id: 'services' }, { label: 'About', id: 'team' }, { label: 'Contact', id: 'contact' }].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                className={`text-6xl font-display font-black uppercase tracking-tighter hover:text-brand-orange transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
