import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY } from '../constants';
import { Eye, ShieldCheck, X, User, Clock, Package, ChevronRight } from 'lucide-react';
import { BeforeAfter } from '../types';

interface GalleryProps {
  lang: 'en' | 'sq';
}

const CaseModal: React.FC<{ item: BeforeAfter; lang: 'en' | 'sq'; onClose: () => void }> = ({ item, lang, onClose }) => {
  const p = item.procedure;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Images */}
          <div className="flex h-56 sm:h-72 rounded-t-[2rem] overflow-hidden">
            <div className="relative flex-1 bg-slate-100 overflow-hidden">
              <img src={item.before} alt="Before" className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-sm text-white text-[8px] px-3 py-1 rounded-full font-black tracking-widest uppercase">
                {item.labelBefore || (lang === 'en' ? 'Before' : 'Para')}
              </span>
            </div>
            <div className="relative flex-1 bg-slate-200 overflow-hidden border-l border-white/20">
              <img src={item.after} alt="After" className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-[8px] px-3 py-1 rounded-full font-black tracking-widest uppercase shadow">
                {item.labelAfter || (lang === 'en' ? 'After' : 'Pas')}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-10">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">{item.category[lang]}</p>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight leading-tight">
                  {p?.title[lang] || item.category[lang]}
                </h2>
              </div>
              <button onClick={onClose} className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors ml-4 flex-shrink-0">
                <X size={18} className="text-slate-600" />
              </button>
            </div>

            {p && (
              <>
                {/* Meta row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{lang === 'en' ? 'Performed by' : 'Kryer nga'}</p>
                      <p className="text-xs font-black text-slate-900">{p.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{lang === 'en' ? 'Treatment time' : 'Koha e trajtimit'}</p>
                      <p className="text-xs font-black text-slate-900">{p.duration[lang]}</p>
                    </div>
                  </div>
                  {p.materials && (
                    <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{lang === 'en' ? 'Materials used' : 'Materialet'}</p>
                        <p className="text-xs font-black text-slate-900">{p.materials[lang]}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Procedure steps */}
                <div className="mb-8">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5">
                    {lang === 'en' ? 'Procedure Steps' : 'Hapat e Procedurës'}
                  </p>
                  <div className="space-y-3">
                    {p.steps[lang].map((step, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-7 h-7 rounded-xl bg-blue-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="https://wa.me/38349772307"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all"
                >
                  <span>{lang === 'en' ? 'Ask About This Treatment' : 'Pyetni Për Këtë Trajtim'}</span>
                  <ChevronRight size={14} />
                </a>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Gallery: React.FC<GalleryProps> = ({ lang }) => {
  const [selected, setSelected] = useState<BeforeAfter | null>(null);

  return (
    <section id="gallery" className="py-32 bg-slate-50 scroll-mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 md:mb-24 gap-8 md:gap-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest mb-6"
            >
              <ShieldCheck size={14} />
              <span>{lang === 'en' ? 'Clinical Excellence' : 'Ekselenca Klinike'}</span>
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-8 tracking-tight leading-[0.95]"
            >
              {lang === 'en' ? <>Real Cases.<br /><span className="text-blue-600">Real Results.</span></> : <>Raste Reale.<br /><span className="text-blue-600">Rezultate Reale.</span></>}
            </motion.h3>
          </div>
          <div className="max-w-md">
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              {lang === 'en'
                ? 'Tap any case to see the full procedure — who performed it, what was used, and how long it took.'
                : 'Shtypni çdo rast për të parë procedurën e plotë — kush e kreu, çfarë u përdor dhe sa kohë zgjati.'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {GALLERY.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:border-blue-500 transition-all duration-500 shadow-sm cursor-pointer"
              onClick={() => setSelected(item)}
            >
              <div className="flex flex-col sm:flex-row h-[420px] sm:h-[500px]">
                <div className="relative flex-1 bg-slate-100 group-hover:scale-[1.02] transition-transform duration-700 overflow-hidden">
                  <img src={item.before} alt="Before" className="w-full h-full object-cover" />
                  <div className="absolute top-6 left-6 bg-slate-900/60 backdrop-blur-md text-white text-[8px] px-3 py-1 rounded-full font-black tracking-widest uppercase">{item.labelBefore || 'Before'}</div>
                </div>
                <div className="relative flex-1 bg-slate-200 group-hover:scale-[1.05] transition-transform duration-700 overflow-hidden border-t sm:border-t-0 sm:border-l border-white/20">
                  <img src={item.after} alt="After" className="w-full h-full object-cover" />
                  <div className="absolute top-6 left-6 bg-blue-600 text-white text-[8px] px-3 py-1 rounded-full font-black tracking-widest uppercase shadow-lg">{item.labelAfter || 'After'}</div>
                </div>
              </div>

              <div className="p-8 sm:p-10 border-t border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">{item.category[lang]}</p>
                    <h4 className="text-xl sm:text-2xl font-display font-black text-slate-900 tracking-tight leading-none">
                      {lang === 'en' ? 'View Procedure' : 'Shiko Procedurën'}
                    </h4>
                  </div>
                  <div className="bg-blue-600 group-hover:bg-blue-700 p-4 rounded-2xl transition-all">
                    <Eye size={20} className="text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 md:mt-24 text-center">
          <motion.a
            href="https://wa.me/38349772307"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-slate-900 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl"
          >
            {lang === 'en' ? 'Ask to See More Cases on WhatsApp' : 'Kërkoni Më Shumë Raste në WhatsApp'}
          </motion.a>
        </div>
      </div>

      {selected && (
        <CaseModal item={selected} lang={lang} onClose={() => setSelected(null)} />
      )}
    </section>
  );
};

export default Gallery;
