
import React from 'react';
import { Award, Users, History, Globe, Landmark } from 'lucide-react';

interface LegacySectionProps {
  lang: 'en' | 'sq';
}

const LegacySection: React.FC<LegacySectionProps> = ({ lang }) => {
  const content = {
    badge: lang === 'en' ? 'Clinical Foundation Est. 1999' : 'Fondacioni Klinik i themeluar më 1999',
    title: lang === 'en' ? 'TWENTY-SEVEN YEARS' : 'NJËZET E SHTATË VITE',
    subtitle: lang === 'en' ? 'EXCELLENCE.' : 'EKSELENCË.',
    desc: lang === 'en' 
      ? 'Medident Clinic serves as a primary reference for advanced dentistry in the region. Our history is defined by clinical precision.' 
      : 'Klinika Medident shërben si një referencë primare për stomatologjinë e avancuar në rajon. Historia jonë përcaktohet nga preciziteti klinik.',
    stat1: lang === 'en' ? 'Certified Case Records' : 'Raste Klinike të Certifikuara',
    stat2: lang === 'en' ? 'Years Institutional Legacy' : 'Vite Trashëgimi Institucionale',
    stat3: lang === 'en' ? 'National Patient Origins' : 'Origjina Kombëtare e Pacientëve',
    quality: lang === 'en' ? 'Quality Standard' : 'Standardi i Cilësisë',
    certified: lang === 'en' ? 'ISO 9001:2015 CERTIFIED' : 'I CERTIFIKUAR ME ISO 9001:2015'
  };

  return (
    <section className="bg-slate-950 py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          <div>
            <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded mb-10">
              <Landmark size={16} className="text-blue-500" />
              <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{content.badge}</span>
            </div>
            <h2 className="text-5xl md:text-8xl font-display font-black text-white leading-[0.9] mb-12 tracking-tighter">
              {content.title} <br />
              <span className="text-blue-600">{content.subtitle}</span>
            </h2>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-xl">
              {content.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/5">
            <div className="bg-slate-950 p-12 hover:bg-slate-900 transition-colors">
              <Users className="text-blue-600 mb-8" size={32} />
              <p className="text-5xl font-display font-black text-white mb-2 tracking-tighter">13,000</p>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">{content.stat1}</p>
            </div>
            
            <div className="bg-slate-950 p-12 hover:bg-slate-900 transition-colors">
              <Award className="text-blue-600 mb-8" size={32} />
              <p className="text-5xl font-display font-black text-white mb-2 tracking-tighter">27</p>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">{content.stat2}</p>
            </div>

            <div className="bg-slate-950 p-12 hover:bg-slate-900 transition-colors">
              <Globe className="text-blue-600 mb-8" size={32} />
              <p className="text-5xl font-display font-black text-white mb-2 tracking-tighter">45</p>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">{content.stat3}</p>
            </div>

            <div className="bg-slate-950 p-12 hover:bg-slate-900 transition-colors">
               <div className="h-full flex flex-col justify-end">
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">{content.quality}</p>
                  <p className="text-white font-display font-black text-2xl tracking-tight leading-none uppercase">{content.certified}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacySection;
