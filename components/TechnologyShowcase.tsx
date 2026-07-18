import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Cpu, Layers, Activity } from 'lucide-react';
import { TECHNOLOGIES } from '../constants';

const TechnologyShowcase: React.FC<{ lang: 'en' | 'sq' }> = ({ lang }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] block mb-4">
              {lang === 'en' ? 'Digital Precision' : 'Saktësia Digjitale'}
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-[0.9]">
              {lang === 'en' ? 'Institutional Grade Technology.' : 'Teknologji e Shkallës Institucionale.'}
            </h2>
          </div>
          <p className="text-slate-500 max-w-sm text-lg leading-relaxed">
            {lang === 'en' 
              ? 'Our surgical protocols are powered by the same cutting-edge systems found in top European and global university hospitals.' 
              : 'Protokollet tona kirurgjikale fuqizohen nga sistemet më moderne që gjenden në spitalet më të mira evropiane dhe ndërkombëtare.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {TECHNOLOGIES.map((tech, idx) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-[400px] rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800"
            >
              <img 
                src={tech.image} 
                alt={tech.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-blue-600/30">
                  {tech.icon === 'Scan' ? <Scan /> : <Cpu />}
                </div>
                <h3 className="text-2xl font-display font-black text-white mb-2">{tech.name}</h3>
                <p className="text-slate-400 text-lg">{tech.description[lang]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologyShowcase;
