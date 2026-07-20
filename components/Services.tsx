import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';
import { SERVICES } from '../constants';
import { ChevronRight, ArrowRight } from 'lucide-react';

interface ServicesProps {
  lang: 'en' | 'sq';
  onOpenMaterials?: () => void;
}

const Services: React.FC<ServicesProps> = ({ lang, onOpenMaterials }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const featured = SERVICES.slice(0, 3);
  const secondary = SERVICES.slice(3);

  return (
    <section id="services" className="py-24 md:py-40 bg-white relative overflow-hidden scroll-mt-24">

      {/* Subtle dot grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-24 gap-8">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-[9px] font-black text-blue-600 uppercase tracking-[0.35em] mb-4">
              {lang === 'en' ? 'What We Do' : 'Çfarë Bëjmë'}
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 }}
              className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tighter leading-[0.9]">
              {lang === 'en' ? <>Every procedure.<br /><span className="text-blue-600">Done properly.</span></> : <>Çdo procedurë.<br /><span className="text-blue-600">E bërë siç duhet.</span></>}
            </motion.h2>
          </div>
          <div className="max-w-sm">
            <p className="text-slate-500 font-medium leading-relaxed mb-5">
              {lang === 'en'
                ? '3D-planned surgery, documented materials, and doctors who have been doing this in Pejë since 1999.'
                : 'Kirurgji e planifikuar 3D, materiale të dokumentuara dhe mjekë që e bëjnë këtë në Pejë që nga 1999.'}
            </p>
            <button onClick={onOpenMaterials}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-slate-900 transition-colors group">
              <Icons.Microscope size={14} />
              <span>{lang === 'en' ? 'View Material Registry' : 'Shiko Regjistrin e Materialeve'}</span>
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── Featured 3 — large cards ── */}
        <div className="grid lg:grid-cols-3 gap-5 mb-5">
          {featured.map((service, idx) => {
            const IconComponent = (Icons as any)[service.icon] || Icons.Activity;
            const isHovered = hovered === service.id;
            return (
              <motion.div key={service.id}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                onMouseEnter={() => setHovered(service.id)} onMouseLeave={() => setHovered(null)}
                className="group relative bg-slate-900 rounded-3xl overflow-hidden cursor-pointer"
                style={{ minHeight: '480px' }}>

                {/* Background image */}
                <div className="absolute inset-0">
                  <img src={service.image} alt={service.title[lang]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: 'center top' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10" />
                </div>

                {/* Top badge */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    <IconComponent size={11} />
                    {service.badge ? service.badge[lang] : service.title[lang]}
                  </span>
                  {service.highlight && (
                    <span className="bg-blue-600 text-white text-[8px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                      {service.highlight[lang]}
                    </span>
                  )}
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
                  <h3 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight leading-tight mb-3">
                    {service.title[lang]}
                  </h3>
                  <motion.p animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-slate-300 text-sm font-medium leading-relaxed overflow-hidden mb-4">
                    {service.description[lang]}
                  </motion.p>
                  <a href="#contact"
                    className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                    <span>{lang === 'en' ? 'Book consultation' : 'Cakto konsultë'}</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Secondary 3 — horizontal cards ── */}
        <div className="grid md:grid-cols-3 gap-5">
          {secondary.map((service, idx) => {
            const IconComponent = (Icons as any)[service.icon] || Icons.Heart;
            return (
              <motion.div key={service.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.3 + idx * 0.08 }}
                className="group bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-500">

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img src={service.image} alt={service.title[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ objectPosition: 'center top' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  {/* Icon chip */}
                  <div className="absolute bottom-4 left-4 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                    <IconComponent size={18} className="text-blue-600" />
                  </div>
                  {service.highlight && (
                    <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-[8px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full">
                      {service.highlight[lang]}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-display font-black text-slate-900 tracking-tight mb-2">
                    {service.title[lang]}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-5">
                    {service.description[lang]}
                  </p>
                  <a href="#contact"
                    className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                    <span>{lang === 'en' ? 'Book consultation' : 'Cakto konsultë'}</span>
                    <ChevronRight size={12} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-16 text-center">
          <a href="https://wa.me/38349772307" target="_blank" rel="noopener"
            className="inline-flex items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95">
            <Icons.MessageSquare size={15} />
            <span>{lang === 'en' ? 'Ask about any treatment on WhatsApp' : 'Pyetni për çdo trajtim në WhatsApp'}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
