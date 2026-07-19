import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion';
import { ArrowRight, Play, ShieldCheck, Activity, MapPin, Calendar, ChevronDown } from 'lucide-react';

interface HeroProps {
  onWatchStory: () => void;
  onServicesClick?: () => void;
  onJourneyClick?: () => void;
  lang: 'en' | 'sq';
}

// Animated counter
const Counter: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const controls = animate(0, to, {
      duration: 2,
      delay: 0.8,
      ease: 'easeOut',
      onUpdate(v) { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix; }
    });
    return controls.stop;
  }, [to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
};

const Hero: React.FC<HeroProps> = ({ onWatchStory, onServicesClick, onJourneyClick, lang }) => {
  const { scrollY } = useScroll();
  // Parallax: image moves down slower than scroll
  const y = useTransform(scrollY, [0, 800], [0, 160]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const content = {
    badge: lang === 'en' ? 'Family Dental Clinic · Pejë · Since 1999' : 'Klinikë Familjare Dentare · Pejë · Qysh 1999',
    title: lang === 'en' ? 'YOUR SMILE,' : 'BUZËQESHJA JUAJ,',
    subtitle: lang === 'en' ? 'IN GOOD HANDS.' : 'NË DUAR TË SIGURTA.',
    desc: lang === 'en'
      ? 'Modern 3D-planned dentistry in a clinic your family has trusted since 1999. Led by Dr. Lendita Islami Nallbani.'
      : 'Stomatologji moderne e planifikuar në 3D në një klinikë të cilën familja juaj e ka besuar qysh nga 1999. E udhëhequr nga Dr. Lendita Islami Nallbani.',
    cta: lang === 'en' ? 'Book Free Consultation' : 'Cakto Konsultë Falas',
    play: lang === 'en' ? 'Our Story' : 'Historia Jonë',
    scroll: lang === 'en' ? 'Scroll to explore' : 'Rrëshqit për të eksploruar',
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">

      {/* ── Background: Ken Burns clinic photo ── */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        {/* Ken Burns scale animation */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 8, ease: 'easeOut' }}
        >
          <img
            src="/photos/clinic-hero.jpg"
            className="w-full h-full object-cover"
            alt="Medident Clinic Reception — Pejë"
            style={{ objectPosition: 'center 30%' }}
          />
        </motion.div>

        {/* Gradient overlays for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

        {/* Subtle vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,6,23,0.6) 100%)'
        }} />
      </motion.div>

      {/* ── Ambient light leak top-right ── */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] pointer-events-none z-0" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        <div className="max-w-3xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center space-x-2 bg-white/8 backdrop-blur-md text-slate-300 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.25em] mb-10 border border-white/10"
          >
            <ShieldCheck size={12} className="text-blue-400" />
            <span>{content.badge}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-[7rem] font-display font-black text-white leading-[0.92] tracking-tighter mb-8"
          >
            {content.title}
            <br />
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-blue-500"
            >
              {content.subtitle}
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-slate-300 text-lg md:text-xl font-medium max-w-xl leading-relaxed mb-12"
          >
            {content.desc}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-16"
          >
            <a
              href="#contact"
              className="group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/40 active:scale-95"
            >
              <Calendar size={15} />
              <span>{content.cta}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={onWatchStory}
              className="group flex items-center gap-4 text-white"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                <Play size={16} fill="currentColor" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
                {content.play}
              </span>
            </button>
          </motion.div>

          {/* Quick nav */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-3 pt-8 border-t border-white/10"
          >
            <button
              onClick={onServicesClick}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-xl border border-white/10 transition-all group text-left"
            >
              <Activity size={16} className="text-blue-400" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                {lang === 'en' ? 'Services' : 'Shërbime'}
              </span>
            </button>
            <button
              onClick={onJourneyClick}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-xl border border-white/10 transition-all group text-left"
            >
              <MapPin size={16} className="text-blue-400" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                {lang === 'en' ? 'Dental Tourism' : 'Turizëm Dentar'}
              </span>
            </button>
          </motion.div>
        </div>

        {/* ── Floating stats bottom-right ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="absolute bottom-20 right-6 hidden lg:flex flex-col gap-3"
        >
          {[
            { num: <Counter to={13000} suffix="+" />, label: lang === 'en' ? 'Patients' : 'Pacientë' },
            { num: <Counter to={4000} suffix="+" />, label: lang === 'en' ? 'Implants' : 'Implante' },
            { num: <span>27</span>, label: lang === 'en' ? 'Years' : 'Vite' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 text-right">
              <p className="text-2xl font-display font-black text-white leading-none">{stat.num}</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">{content.scroll}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} className="text-slate-500" />
        </motion.div>
      </motion.div>

      {/* ── Right-edge clinic name watermark ── */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block z-10">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/15 rotate-90 whitespace-nowrap origin-center">
          KLINIKA DENTARE MEDIDENT · PEJË · KOSOVË
        </p>
      </div>

    </section>
  );
};

export default Hero;
