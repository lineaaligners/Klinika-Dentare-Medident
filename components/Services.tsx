
import React from 'react';
import * as Icons from 'lucide-react';
import { SERVICES } from '../constants';

interface ServicesProps {
  lang: 'en' | 'sq';
  onOpenMaterials?: () => void;
}

const Services: React.FC<ServicesProps> = ({ lang, onOpenMaterials }) => {
  return (
    <section id="services" className="py-32 bg-white relative overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24">
          <div className="max-w-2xl">
            <h2 className="text-blue-600 font-black tracking-[0.3em] uppercase text-[10px] mb-4">Clinical Disciplines</h2>
            <h3 className="text-4xl md:text-6xl font-display font-black text-slate-900 leading-[1.1] tracking-tight">
              Evidence-Based<br />Dental Excellence.
            </h3>
          </div>
          <div className="max-w-sm mt-8 md:mt-0">
            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-6">
              Employing world-class diagnostics and digital workflows to ensure 100% predictable surgical outcomes.
            </p>
            <button 
              onClick={onOpenMaterials}
              className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-slate-900 transition-colors"
            >
              <Icons.Microscope size={14} />
              <span>Verify Clinical Material Standards</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {SERVICES.map((service, index) => {
            const IconComponent = (Icons as any)[service.icon];
            return (
              <div key={service.id} className="group relative bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:border-blue-500 transition-all duration-500 flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-48 h-56 md:h-auto rounded-2xl overflow-hidden relative shrink-0">
                  <img 
                    src={service.image} 
                    alt={service.title[lang]} 
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white p-2.5 rounded-xl shadow-sm">
                    <IconComponent size={18} className="text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  {/* Fixed Record access */}
                  <h4 className="text-2xl font-display font-black text-slate-900 mb-4 tracking-tight">{service.title[lang]}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                    {service.description[lang]}
                  </p>
                  <div className="mt-auto">
                    <a href="#contact" className="inline-flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                      <span>Clinical Protocol</span>
                      <Icons.ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
