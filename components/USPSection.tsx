
import React from 'react';
import { History, Users, Monitor, Globe, ShieldCheck, Zap, ArrowRight, Compass, Gem } from 'lucide-react';

interface USPSectionProps {
  lang: 'en' | 'sq';
}

const getUSPs = (lang: 'en' | 'sq') => [
  {
    icon: <Gem size={28} />,
    title: lang === 'en' ? "27 Years. One Family Clinic." : "27 Vite. Një Klinikë Familjare.",
    description: lang === 'en' 
      ? "Since 1999, Dr. Lendita Islami Nallbani has led this clinic through every chapter — from a 16m² room to a full surgical centre." 
      : "Që nga 1999, Dr. Lendita Islami Nallbani e ka drejtuar këtë klinikë nëpër çdo kapitull — nga një dhomë 16m² deri në një qendër kirurgjikale."
  },
  {
    icon: <Compass size={28} />,
    title: lang === 'en' ? "Rugova Is Outside Your Window" : "Rugova Është Jashtë Dritares Suaj",
    description: lang === 'en' 
      ? "Pejë sits next to one of Kosovo's most beautiful natural areas. Recover with mountain air and quiet surroundings 30 minutes from the clinic." 
      : "Peja ndodhet pranë njërit prej mjediseve natyrore më të bukura të Kosovës. Rikuperohuni me ajër malor 30 minuta nga klinika."
  },
  {
    icon: <Monitor size={28} />,
    title: lang === 'en' ? "3D-Planned Surgery" : "Kirurgji e Planifikuar në 3D",
    description: lang === 'en' 
      ? "Every implant case is planned with a CBCT 3D scan and a printed surgical guide before Dr. Lendita makes a single incision." 
      : "Çdo rast implanti planifikohet me skanim 3D CBCT dhe udhëzues kirurgjikal të printuar para se Dr. Lendita të bëjë ndonjë prerje."
  },
  {
    icon: <Globe size={28} />,
    title: lang === 'en' ? "A Real Person Coordinates Your Trip" : "Një Person i Vërtetë Koordinon Udhëtimin Tuaj",
    description: lang === 'en' 
      ? "Airport pickup from Prishtina, Hotel Dukagjini in Pejë, and a team member who answers on WhatsApp — not a call centre." 
      : "Marrje nga aeroporti i Prishtinës, Hotel Dukagjini në Pejë dhe një anëtar ekipi që përgjigjet në WhatsApp — jo qendër thirrjesh."
  },
  {
    icon: <ShieldCheck size={28} />,
    title: lang === 'en' ? "You See Exactly What We Use" : "Shihni Saktësisht Çfarë Përdorim",
    description: lang === 'en' 
      ? "Hiossen (USA) and MegaGen implants. Ivoclar ceramics. We list our materials openly so you can verify them yourself." 
      : "Implantet Hiossen (SHBA) dhe MegaGen. Qeramikë Ivoclar. I listojmë materialet tona hapur që të mund t'i verifikoni vetë."
  },
  {
    icon: <History size={28} />,
    title: lang === 'en' ? "First Implant in Kosovo by a Woman" : "Implanti i Parë në Kosovë nga një Grua",
    description: lang === 'en' 
      ? "In 2004, Dr. Lendita Islami Nallbani placed the first dental implant ever performed by a woman in Kosovo. 4,000+ implants since." 
      : "Në vitin 2004, Dr. Lendita Islami Nallbani vendosi implantin e parë dentar të kryer ndonjëherë nga një grua në Kosovë. 4,000+ implante që atëherë."
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
