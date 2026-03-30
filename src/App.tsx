/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useAnimation, AnimatePresence, useSpring } from 'motion/react';
import { Hexagon, Menu, X, ChevronDown } from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [count50, setCount50] = useState(0);
  const [count10, setCount10] = useState(0);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset and rerun 50+
          setCount50(0);
          let s1 = 0;
          const t1 = setInterval(() => {
            s1 += 50 / (1500 / 16);
            if (s1 >= 50) { setCount50(50); clearInterval(t1); }
            else setCount50(Math.floor(s1));
          }, 16);
          // Reset and rerun 10X
          setCount10(0);
          let s2 = 0;
          const t2 = setInterval(() => {
            s2 += 10 / (1200 / 16);
            if (s2 >= 10) { setCount10(10); clearInterval(t2); }
            else setCount10(Math.floor(s2));
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Cloud parallax: slow vertical shift on scroll
  const cloudBgY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);

  // Pillar scroll animation: slides down as user scrolls past hero
  const pillarY = useTransform(scrollYProgress, [0, 0.15], ['0%', '80%']);



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
    <div ref={containerRef} className={`relative min-h-[500vh] transition-colors duration-700 ${isDarkMode ? 'bg-[#0A0A0A] text-white' : 'bg-[#f5f5f5] text-[#050505]'} overflow-x-hidden selection:bg-brand-orange selection:text-white font-sans`}>
      {/* Grainy Texture */}
      <div className={`grainy-bg transition-opacity duration-700 ${isDarkMode ? 'opacity-100' : 'opacity-20'}`} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-center items-center py-6">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-8 px-8 py-3"
        >
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center font-display font-black text-white text-xl shadow-[0_0_20px_rgba(255,77,0,0.4)]">P.</div>
            <span className={`hidden sm:block font-display font-black text-lg tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>Previewlabs</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.3em] font-black text-white/80">
            <a href="#features" className="hover:text-brand-orange transition-all duration-300 relative group">
              Solutions
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#about" className="hover:text-brand-orange transition-all duration-300 relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full" />
            </a>
          </div>

          {/* Header CTA Button */}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.3em] font-black text-white"
            style={{
              background: '#FF4D00',
              textDecoration: 'none',
            }}
          >
            Get In Touch
          </motion.a>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={isDarkMode ? 'md:hidden text-white' : 'md:hidden text-black'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        id="home"
        className="relative h-screen overflow-hidden"
        style={{
          backgroundImage: 'url(/clouds-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPositionX: 'center',
          backgroundPositionY: cloudBgY,
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Gradient overlay — dark top/bottom, clouds show through middle */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.3) 40%, rgba(10,10,10,0.2) 60%, rgba(10,10,10,0.8) 100%)',
          }}
        />

        {/* Headline + Subheadline */}
        <div
          className="absolute left-0 right-0 flex flex-col items-center text-center px-6"
          style={{ paddingTop: '22vh', zIndex: 15 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="font-display font-black uppercase"
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                lineHeight: '1.08',
                letterSpacing: '-0.01em',
                textAlign: 'center',
                color: '#ffffff',
                WebkitTextFillColor: '#ffffff',
              }}
            >
              AI Systems <br />
              Built to Run <br />
              Your Business
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            style={{ marginTop: '1.5rem' }}
          >
            <p
              className="uppercase font-bold"
              style={{
                fontSize: '13px',
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.72)',
                textAlign: 'center',
                maxWidth: '480px',
                lineHeight: '2',
                textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              }}
            >
              We engineer AI that handles the work <br />
              — so your team doesn't have to
            </p>
          </motion.div>
        </div>

        {/* Orange Pillar */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: '66%',
            height: '34%',
            width: '80px',
            zIndex: 5,
            borderRadius: '4px 4px 0 0',
            background: '#FF4D00',
            boxShadow: '0 0 30px rgba(255,60,0,0.7), 0 0 60px rgba(255,40,0,0.4)',
            animation: 'pillarGlow 4s ease-in-out infinite',
            y: pillarY,
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 50+ Stat — left of pillar, lower */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: 'absolute', bottom: '18%', left: '20%', zIndex: 10, textAlign: 'right' }}
        >
          <div className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white/90">{count50}+</div>
          <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30">AI Deployments</div>
        </motion.div>

        {/* 10X Stat — right of pillar, higher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ position: 'absolute', bottom: '30%', right: '18%', zIndex: 10, textAlign: 'left' }}
        >
          <div className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white/90">{count10}X</div>
          <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30">Revenue Impact</div>
        </motion.div>

        {/* CTA Button */}
        <motion.a
          href="#contact"
          className="absolute"
          style={{
            background: '#FF4D00',
            color: '#FFFFFF',
            padding: '14px 36px',
            borderRadius: '8px',
            fontSize: '13px',
            letterSpacing: '0.15em',
            fontWeight: '600',
            textTransform: 'uppercase' as const,
            border: 'none',
            cursor: 'pointer',
            zIndex: 15,
            bottom: '3%',
            marginTop: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            textDecoration: 'none',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          whileHover={{ scale: 1.04 }}
        >
          Get In Touch
        </motion.a>

      </motion.section>

      {/* Content Section */}
      <section id="features" className="relative z-[60] py-16 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 15 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-150px" }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter mb-4 uppercase leading-[0.85] drop-shadow-2xl text-white">
            What We <br />
            Build
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'AI Voice Reception', desc: 'Xseller.ai answers every call, qualifies leads, and books appointments — 24/7. No missed calls. No voicemail black holes.' },
            { title: 'Workflow Automation', desc: 'We map your operations and automate the repeatable parts — data entry, follow-ups, reporting, approvals.' },
            { title: 'Integration & Deploy', desc: 'We plug into your existing stack — Shopify, Xero, CRM, whatever you run. Scoping to live in 2–4 weeks.' },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: '#1A1A1A',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '2rem',
              }}
            >
              <h3 className="font-display font-black uppercase text-white text-lg tracking-wide mb-4">{card.title}</h3>
              <p className="font-sans leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px' }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Workflow Section: Identify, Develop, Adopt */}
      <section id="services" className={`relative z-[60] py-16 px-6 max-w-7xl mx-auto border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
        <div className="text-center mb-10">
          <h2 className={`text-5xl md:text-8xl font-display font-black tracking-tighter uppercase mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>How We Work</h2>
          <p className={`max-w-2xl mx-auto text-xl font-medium ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
            A focused four-step process. No fluff. No 12-month roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { title: "Discover", desc: "We audit your current operations and find the automation opportunities with the highest ROI.", icon: "01" },
            { title: "Build", desc: "We engineer custom AI systems fitted to your actual workflow. Not off-the-shelf templates.", icon: "02" },
            { title: "Launch", desc: "We deploy your system into production and go live. Real environments, real data, real users.", icon: "03" },
            { title: "Train & Optimise", desc: "We train your team, monitor performance, and optimise until the system runs without us.", icon: "04" }
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

      {/* About Section */}
      <section id="team" className={`relative z-[60] px-6 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`} style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          <h2 className={`text-5xl md:text-8xl font-display font-black tracking-tighter uppercase mb-12 ${isDarkMode ? 'text-white' : 'text-black'}`}>Who We Are</h2>
          <p className={`text-xl leading-relaxed font-medium mb-8 ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
            Preview Labs is a focused AI automation agency based in Auckland. We don't sell software licences — we build systems that run your business operations. Founded by an operator who spent 15+ years in business before picking up AI, we approach every project from the business problem first, technology second.
          </p>
          <p className={`text-xl leading-relaxed font-medium ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
            Currently serving businesses across New Zealand and Australia.
          </p>
        </div>
      </section>

      {/* Contact Section Placeholder */}
      <section id="contact" className={`relative z-[60] py-16 px-6 max-w-7xl mx-auto border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
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
      <footer className={`relative z-[60] py-16 px-6 border-t ${isDarkMode ? 'border-white/10 bg-[#0A0A0A]' : 'border-black/10 bg-white/40'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <Hexagon className="w-10 h-10 text-brand-orange fill-brand-orange" />
              <span className={`font-display font-black text-2xl tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>Preview Labs</span>
            </div>
            <p className={`text-[11px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
              Preview Labs — AI automation and workflow systems.
            </p>
          </div>

          <div className={`flex items-center gap-10 text-[11px] uppercase tracking-[0.3em] font-black ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>
            <a href="#features" className="hover:text-brand-orange transition-colors">Solutions</a>
            <a href="#xseller" className="hover:text-brand-orange transition-colors">Xseller.ai</a>
            <a href="#about" className="hover:text-brand-orange transition-colors">About</a>
            <a href="#contact" className="hover:text-brand-orange transition-colors">Contact</a>
          </div>
        </div>
        <div className={`max-w-7xl mx-auto mt-12 pt-8 border-t text-[11px] uppercase tracking-[0.4em] text-center font-black ${isDarkMode ? 'border-white/10 text-white/20' : 'border-black/10 text-black/20'}`}>
          © 2026 Preview Labs Limited | Auckland, New Zealand
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
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-16 ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#f5f5f5]'}`}
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className={`absolute top-12 right-12 transition-colors ${isDarkMode ? 'text-white hover:text-brand-orange' : 'text-black hover:text-brand-orange'}`}
            >
              <X size={48} />
            </button>
            {[{ label: 'Solutions', id: 'features' }, { label: 'About', id: 'about' }, { label: 'Get In Touch', id: 'contact' }].map((item) => (
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
