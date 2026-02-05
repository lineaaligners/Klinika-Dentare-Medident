
import React from 'react';
import { History, Users, Monitor, Globe, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface USPSectionProps {
  lang: 'en' | 'sq';
}

const getUSPs = (lang: 'en' | 'sq') => [
  {
    icon: <History size={28} />,
    title: lang === 'en' ? "27 Years of Clinical Mastery" : "27 Vite Mjeshtëri Klinike",
    description: lang === 'en' 
      ? "Operating at the forefront of dental innovation since 1997." 
      : "Duke operuar në ballë të inovacionit stomatologjik që nga viti 1997."
  },
  {
    icon: <Users size={28} />,
    title: lang === 'en' ? "13,000+ Case Studies" : "13,000+ Raste Studimore",
    description: lang === 'en' 
      ? "An extensive clinical database of successful international rehabilitations." 
      : "Një bazë të dhënash klinike e gjerë e rehabilitimeve ndërkombëtare të suksesshme."
  },
  {
    icon: <Monitor size={28} />,
    title: lang === 'en' ? "Digital Workflow Integration" : "Integrimi i Rrjedhës Digjitale",
    description: lang === 'en' 
      ? "Full digital smile design and 3D diagnostics for absolute precision." 
      : "Dizajn i plotë digjital i buzëqeshjes dhe diagnostikë 3D për precizitet absolut."
  },
  {
    icon: <Globe size={28} />,
    title: lang === 'en' ? "Multilingual Patient Liaisons" : "Koordinatorë Shumëgjuhësh",
    description: lang === 'en' 
      ? "Specialized support for international patients including VIP logistics." 
      : "Mbështetje e specializuar për pacientët ndërkombëtarë duke përfshirë logjistikën VIP."
  },
  {
    icon: <ShieldCheck size={28} />,
    title: lang === 'en' ? "Premium Component Warranty" : "Garanci për Komponentët Premium",
    description: lang === 'en' 
      ? "We utilize exclusively premium-grade materials with extensive warranties." 
      : "Ne përdorim ekskluzivisht materiale të shkallës premium me garanci të gjera."
  },
  {
    icon: <Zap size={28} />,
    title: lang === 'en' ? "Accelerated Loading Protocols" : "Protokolle të Ngarkimit të Shpejtë",
    description: lang === 'en' 
      ? "Optimized surgical workflows for efficient full-mouth restoration." 
      : "Rrjedha pune kirurgjikale të optimizuara për restaurim efikas të plotë të gojës."
  }
];

const USPSection: React.FC<USPSectionProps> = ({ lang }) => {
  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-blue-600 font-black tracking-[0.3em] uppercase text-[10px] mb-4">
            {lang === 'en' ? 'Institutional Standard' : 'Standardi Institucional'}
          </h2>
          <h3 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tight">
            {lang === 'en' ? 'Our Foundation of ' : 'Themeli ynë i '}<span className="text-blue-600">{lang === 'en' ? 'Trust.' : 'Besimit.'}</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {getUSPs(lang).map((usp, index) => (
            <div 
              key={index} 
              className="group p-10 rounded-3xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-blue-500 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-600/5 text-blue-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                {usp.icon}
              </div>
              <h4 className="text-xl font-display font-black text-slate-900 mb-4 tracking-tight">
                {usp.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
                {usp.description}
              </p>
              <a href="#contact" className="inline-flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-600 transition-colors">
                <span>{lang === 'en' ? 'Inquire' : 'Pyetni'}</span>
                <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default USPSection;
