
import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, ShieldCheck, Activity, MapPin } from 'lucide-react';

interface HeroProps {
  onWatchStory: () => void;
  onServicesClick?: () => void;
  onJourneyClick?: () => void;
  lang: 'en' | 'sq';
}

const Hero: React.FC<HeroProps> = ({ onWatchStory, onServicesClick, onJourneyClick, lang }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const content = {
    badge: lang === 'en' ? 'GLOBAL SURGICAL EXCELLENCE' : 'EKSELENCA KIRURGJIKALE GLOBALE',
    title: lang === 'en' ? 'SURGICAL' : 'KIRURGJI',
    subtitle: lang === 'en' ? 'PRECISION.' : 'PRECIZE.',
    desc: lang === 'en' 
      ? 'Medident Clinical Center in Peja, Kosovo. 27 years of advanced oral surgery and implantology, led by our Chief Oral Surgeon.' 
      : 'Qendra Klinike Medident në Pejë, Kosova. 27 vite kirurgji orale e avancuar dhe implantologji, nën udhëheqjen e Kryekirurges sonë Orale.',
    cta: lang === 'en' ? 'Request Case Review' : 'Kërkoni Rishikim të Rastit',
    play: lang === 'en' ? 'Observe Practice Standards' : 'Vëzhgoni Standardet e Praktikës',
    serv: lang === 'en' ? 'Explore Services' : 'Eksploroni Shërbimet',
    jour: lang === 'en' ? 'Start Journey' : 'Filloni Rrugëtimin'
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/freepik__recreate-the-locations-more-modern-bright-natural-__5205.jpeg" 
          className="w-full h-full object-cover opacity-50 scale-110 transition-transform duration-100 ease-out" 
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          alt="Medident Modern Clinical Interior" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-md text-slate-300 px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.25em] mb-12 border border-white/10">
            <ShieldCheck size={14} className="text-blue-500" />
            <span>{content.badge}</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-black text-white leading-[0.95] mb-12 tracking-tight">
            {content.title} <br />
            <span className="text-blue-600">{content.subtitle}</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl leading-relaxed mb-16">
            {content.desc}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 items-stretch sm:items-center mb-20">
            <a href="#contact" className="group flex items-center justify-center bg-blue-600 hover:bg-white hover:text-slate-950 text-white px-12 py-5 rounded-lg text-[11px] font-black transition-all shadow-2xl uppercase tracking-[0.2em]">
              {content.cta}
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={16} />
            </a>
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
                <p className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-blue-500 transition-colors">{lang === 'en' ? 'Surgical Disciplines' : 'Disciplinat Kirurgjikale'}</p>
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
