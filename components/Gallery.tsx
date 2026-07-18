
import React from 'react';
import { motion } from 'framer-motion';
import { GALLERY } from '../constants';
import { Eye, Microscope, ShieldCheck } from 'lucide-react';

interface GalleryProps {
  lang: 'en' | 'sq';
}

const Gallery: React.FC<GalleryProps> = ({ lang }) => {
  return (
    <section id="gallery" className="py-32 bg-slate-50 scroll-mt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
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
              Outcome-Based <br /><span className="text-blue-600">Surgical Mastery.</span>
            </motion.h3>
          </div>
          <div className="max-w-md">
            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-6">
              {lang === 'en' 
                ? 'Behold actual transformations verified by our clinical board. We focus on structural integrity and natural aesthetics.' 
                : 'Vëzhgoni transformimet reale të verifikuara nga bordi ynë klinike. Ne fokusohemi në integritetin strukturor dhe estetikën natyrale.'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {GALLERY.map((item, idx) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:border-blue-500 transition-all duration-500 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row h-[500px]">
                {/* Before Image */}
                <div className="relative flex-1 bg-slate-100 group-hover:scale-[1.02] transition-transform duration-700 overflow-hidden">
                  <img src={item.before} alt="Before" className="w-full h-full object-cover grayscale" />
                  <div className="absolute top-6 left-6 bg-slate-900/60 backdrop-blur-md text-white text-[8px] px-3 py-1 rounded-full font-black tracking-widest uppercase">Pre-Op</div>
                </div>
                
                {/* After Image */}
                <div className="relative flex-1 bg-slate-200 group-hover:scale-[1.05] transition-transform duration-700 overflow-hidden border-t sm:border-t-0 sm:border-l border-white/20">
                  <img src={item.after} alt="After" className="w-full h-full object-cover" />
                  <div className="absolute top-6 left-6 bg-blue-600 text-white text-[8px] px-3 py-1 rounded-full font-black tracking-widest uppercase shadow-lg">Post-Op</div>
                </div>
              </div>
              
              <div className="p-10 border-t border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">{item.category[lang]}</p>
                    <h4 className="text-2xl font-display font-black text-slate-900 tracking-tight leading-none">Case 0{item.id}</h4>
                  </div>
                  <button className="bg-slate-50 hover:bg-blue-600 hover:text-white p-4 rounded-2xl transition-all group/btn">
                    <Eye size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-slate-900 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl"
          >
            {lang === 'en' ? 'View 100+ Professional Cases' : 'Shiko 100+ Raste Profesionale'}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
