
import React, { useState, useEffect } from 'react';
import { TOURISM_STEPS } from '../constants';
import { Plane, Star, Shield, MapPin, Download, BriefcaseMedical, ArrowRight, Stethoscope } from 'lucide-react';

interface TourismSectionProps {
  onOpenGuide?: () => void;
  onServicesClick?: () => void;
  lang: 'en' | 'sq';
}

const TourismSection: React.FC<TourismSectionProps> = ({ onOpenGuide, onServicesClick, lang }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="tourism" className="py-32 bg-slate-950 text-white relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid gap-16">
              {TOURISM_STEPS(lang).map((step, idx) => (
                <div key={idx} className="flex gap-10 group">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-black mb-4 tracking-tight">
                      <span className="text-blue-500 mr-4 font-mono text-sm opacity-50">0{idx + 1}</span>
                      {step.title}
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 pt-16 border-t border-white/5 flex flex-wrap gap-6">
              <button 
                onClick={onOpenGuide}
                className="inline-flex items-center space-x-3 bg-white/5 hover:bg-blue-600 border border-white/10 text-white px-8 py-4 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all"
              >
                <Download size={14} />
                <span>Travel Guide to Peja (PDF)</span>
              </button>
              
              <button 
                onClick={onServicesClick}
                className="inline-flex items-center space-x-3 bg-blue-600 hover:bg-white hover:text-slate-950 text-white px-8 py-4 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all group"
              >
                <Stethoscope size={14} />
                <span>Explore Surgical Services</span>
                <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <h2 className="text-blue-500 font-black tracking-[0.3em] uppercase text-[9px] mb-8">Surgical Logistics</h2>
              <h3 className="text-5xl md:text-7xl font-display font-black mb-12 tracking-tighter leading-[0.9]">
                Structured <br />
                <span className="text-slate-500">Support.</span>
              </h3>
              
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <img 
                  src="https://gwzvtrikxkudostserwe.supabase.co/storage/v1/object/public/medident1/shutterstock_2336983021-64c16f11-1920w.webp" 
                  alt="Clinical Patient Coordination" 
                  className="w-full aspect-[4/5] object-cover mix-blend-multiply opacity-60 scale-110 transition-transform duration-100 ease-out"
                  style={{ transform: `translateY(${(scrollY - 2000) * 0.15}px)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90"></div>
                
                <div className="absolute bottom-10 left-10 right-10 p-10 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-xl">
                  <div className="flex items-center space-x-3 text-blue-500 mb-6">
                    <BriefcaseMedical size={16} />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">International Standards</span>
                  </div>
                  <p className="text-white text-xl font-bold mb-8 tracking-tight leading-relaxed">
                    VIP Transfers to Peja, Institutional Stays & Turkish Clinical Excellence.
                  </p>
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center text-slate-400 text-[8px] font-black uppercase tracking-widest">
                      <Plane size={12} className="mr-2 text-blue-500" /> Adem Jashari PRN
                    </div>
                    <div className="flex items-center text-slate-400 text-[8px] font-black uppercase tracking-widest">
                      <MapPin size={12} className="mr-2 text-blue-500" /> Peja, KS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourismSection;
