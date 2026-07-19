
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, ShieldCheck, Activity, MapPin, Calendar } from 'lucide-react';

interface HeroProps {
  onWatchStory: () => void;
  onServicesClick?: () => void;
  onJourneyClick?: () => void;
  lang: 'en' | 'sq';
}

const Hero: React.FC<HeroProps> = ({ onWatchStory, onServicesClick, onJourneyClick, lang }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);

  const content = {
    badge: lang === 'en' ? 'FAMILY DENTAL CLINIC · SINCE 1999' : 'KLINIKË FAMILJARE DENTARE · QYSH 1999',
    title: lang === 'en' ? 'YOUR SMILE,' : 'BUZËQESHJA JUAJ,',
    subtitle: lang === 'en' ? 'IN GOOD HANDS.' : 'NË DUAR TË SIGURTA.',
    desc: lang === 'en' 
      ? 'A smile you love, made with care. Modern 3D-planned dentistry in Peja, from a family clinic that has looked after smiles since 1999.' 
      : 'Një buzëqeshje që e doni, e krijuar me kujdes. Stomatologji moderne e planifikuar në 3D në Pejë, nga një klinikë familjare që kujdeset për buzëqeshjet qysh nga 1999.',
    cta: lang === 'en' ? 'Book Free Consultation' : 'Cakto Konsultë Falas',
    play: lang === 'en' ? 'See Our Clinic' : 'Shihni Klinikën Tonë',
    serv: lang === 'en' ? 'Explore Services' : 'Eksploroni Shërbimet',
    jour: lang === 'en' ? 'Start Journey' : 'Filloni Rrugëtimin'
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <img 
          src="/photos/surgery-lendita.jpg" 
          className="w-full h-full object-cover opacity-50 scale-110" 
          alt="Dr. Lendita Nallbani during oral surgery at Medident" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-md text-slate-300 px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.25em] mb-12 border border-white/10"
          >
            <ShieldCheck size={14} className="text-blue-500" />
            <span>{content.badge}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-[7rem] font-display font-black text-white leading-[0.95] md:leading-[0.9] mb-8 md:mb-12 tracking-tighter"
          >
            {content.title} <br />
            <span className="text-blue-600 block">{content.subtitle}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl font-medium max-w-xl leading-relaxed mb-16"
          >
            {content.desc}
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-8 items-stretch sm:items-center mb-20">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact" 
              className="group flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-9 py-4 rounded-full text-[15px] font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 relative overflow-hidden"
            >
              <Calendar className="mr-3" size={16} />
              {content.cta}
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={16} />
            </motion.a>
            <button onClick={onWatchStory} className="flex items-center space-x-4 text-white group text-left">
              <div className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                <Play size={18} fill="currentColor" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{content.play}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-4 pt-10 border-t border-white/10">
            <button onClick={onServicesClick} className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 px-6 py-4 rounded-xl border border-white/10 transition-all group text-left">
              <Activity size={18} className="text-blue-500" />
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{content.serv}</p>
                <p className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-blue-500 transition-colors">{lang === 'en' ? 'Smile Services' : 'Shërbimet e Buzëqeshjes'}</p>
              </div>
            </button>
            <button onClick={onJourneyClick} className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 px-6 py-4 rounded-xl border border-white/10 transition-all group text-left">
              <MapPin size={18} className="text-blue-500" />
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{content.jour}</p>
                <p className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-blue-500 transition-colors">{lang === 'en' ? 'Patient Roadmap to Peja' : 'Rrugëtimi në Pejë'}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
