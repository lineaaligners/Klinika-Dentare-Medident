import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC<{ lang: 'en' | 'sq' }> = ({ lang }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] block mb-4"
          >
            {lang === 'en' ? 'Global Trust' : 'Besimi Global'}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-black tracking-tight"
          >
            {lang === 'en' ? 'What our international patients say' : 'Çfarë thonë pacientët tanë ndërkombëtarë'}
          </motion.h2>
        </div>

        <div className="relative h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute w-full max-w-4xl bg-white p-12 rounded-3xl shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-12"
            >
              <div className="relative shrink-0">
                <img 
                  src={TESTIMONIALS[index].image} 
                  alt={TESTIMONIALS[index].name} 
                  className="w-32 h-32 rounded-2xl object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-4 -right-4 bg-blue-600 p-3 rounded-xl text-white">
                  <Quote size={20} />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < TESTIMONIALS[index].rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} />
                  ))}
                </div>
                <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed mb-8 italic">
                  "{TESTIMONIALS[index].text}"
                </p>
                <div>
                  <h4 className="font-display font-black text-lg text-slate-900">{TESTIMONIALS[index].name}</h4>
                  <p className="text-blue-600 font-bold text-sm tracking-wide">{TESTIMONIALS[index].country}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 w-full flex justify-center gap-4">
            <button 
              onClick={prev}
              className="p-4 bg-white hover:bg-slate-900 hover:text-white rounded-full shadow-lg transition-all border border-slate-100 group"
            >
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={next}
              className="p-4 bg-white hover:bg-slate-900 hover:text-white rounded-full shadow-lg transition-all border border-slate-100 group"
            >
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
