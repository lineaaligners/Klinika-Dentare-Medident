
import React from 'react';
import { History, Users, Monitor, Globe, ShieldCheck, Zap, ArrowRight, Compass, Gem } from 'lucide-react';

interface USPSectionProps {
  lang: 'en' | 'sq';
}

const getUSPs = (lang: 'en' | 'sq') => [
  {
    icon: <Gem size={28} />,
    title: lang === 'en' ? "Luxury Clinical Experience" : "Përvojë Klinike Luksoze",
    description: lang === 'en' 
      ? "This isn't just a dental job. It's a transformative surgical journey curated for global patients." 
      : "Kjo nuk është vetëm një punë dentare. Është një rrugëtim kirurgjikal transformues i kuruar."
  },
  {
    icon: <Compass size={28} />,
    title: lang === 'en' ? "Holistic Recovery Nature" : "Natyrë Restauruese Holistike",
    description: lang === 'en' 
      ? "Recovery at the foot of Rugova Mountains, utilizing pure air to accelerate clinical healing." 
      : "Shërimi rrëzë Bjeshkëve të Rugovës, duke shfrytëzuar ajrin e pastër për shërim klinik."
  },
  {
    icon: <Monitor size={28} />,
    title: lang === 'en' ? "Integrated Digital Workflow" : "Rrjedha e Integruar Digjitale",
    description: lang === 'en' 
      ? "Full digital smile design and 3D diagnostics for absolute precision." 
      : "Dizajn i plotë digjital i buzëqeshjes dhe diagnostikë 3D për precizitet absolut."
  },
  {
    icon: <Globe size={28} />,
    title: lang === 'en' ? "Concierge Liaison" : "Lidhja Concierge",
    description: lang === 'en' 
      ? "Personalized support including VIP transfers, 5-star hospitality, and cultural curation." 
      : "Mbështetje e personalizuar duke përfshirë transferta VIP dhe mikpritje me 5 yje."
  },
  {
    icon: <ShieldCheck size={28} />,
    title: lang === 'en' ? "Global Material Passport" : "Pasaporta Globale e Materialeve",
    description: lang === 'en' 
      ? "Every component of your experience is traceable to elite global manufacturers." 
      : "Çdo komponent i përvojës suaj është i gjurmueshëm deri te prodhuesit elitarë."
  },
  {
    icon: <History size={28} />,
    title: lang === 'en' ? "27 Years of Mastery" : "27 Vite Mjeshtëri",
    description: lang === 'en' 
      ? "A deep legacy of clinical excellence that ensures your journey is safe and predictable." 
      : "Një trashëgimi e thellë e ekselencës klinike që siguron që rrugëtimi juaj të jetë i sigurt."
  }
];

const USPSection: React.FC<USPSectionProps> = ({ lang }) => {
  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-blue-600 font-black tracking-[0.3em] uppercase text-[10px] mb-4">
            {lang === 'en' ? 'The Medident Standard' : 'Standardi Medident'}
          </h2>
          <h3 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tight">
            {lang === 'en' ? 'A Foundation of ' : 'Një Themeli i '}<span className="text-blue-600">{lang === 'en' ? 'Experience.' : 'Përvojës.'}</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {getUSPs(lang).map((usp, index) => (
            <div 
              key={index} 
              className="group p-10 rounded-[3rem] bg-slate-50 border border-slate-200 hover:bg-white hover:border-blue-500 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-600/5 text-blue-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm shadow-blue-600/5">
                {usp.icon}
              </div>
              <h4 className="text-xl font-display font-black text-slate-900 mb-4 tracking-tight">
                {usp.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
                {usp.description}
              </p>
              <a href="#contact" className="inline-flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-600 transition-colors">
                <span>{lang === 'en' ? 'Learn More' : 'Mëso më shumë'}</span>
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
