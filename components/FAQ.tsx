import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, MessageSquare } from 'lucide-react';
import { FAQS } from '../constants';

const FAQ: React.FC<{ lang: 'en' | 'sq' }> = ({ lang }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: lang === 'en' ? 'All' : 'Të gjitha' },
    { key: 'clinical', label: lang === 'en' ? 'Clinical' : 'Klinike' },
    { key: 'logistics', label: lang === 'en' ? 'Logistics' : 'Logjistikë' },
  ];
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = FAQS.filter(f => activeCategory === 'all' || f.category === activeCategory);

  return (
    <section id="faq" className="py-24 md:py-40 bg-slate-50 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-16 md:mb-20">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-[9px] font-black text-blue-600 uppercase tracking-[0.35em] mb-4">
              {lang === 'en' ? 'Frequently Asked' : 'Pyetjet e Shpeshta'}
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 }}
              className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tighter leading-[0.9]">
              {lang === 'en' ? <>Your questions,<br /><span className="text-blue-600">answered honestly.</span></> : <>Pyetjet tuaja,<br /><span className="text-blue-600">të përgjigjet sinqerisht.</span></>}
            </motion.h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-slate-500 font-medium leading-relaxed mb-6">
              {lang === 'en'
                ? 'Can\'t find what you need? Send us a message on WhatsApp — a real person answers.'
                : 'Nuk gjeni çfarë ju nevojitet? Na dërgoni mesazh në WhatsApp — një person i vërtetë përgjigjet.'}
            </p>
            <a href="https://wa.me/38349772307" target="_blank" rel="noopener"
              className="inline-flex items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-7 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all w-fit">
              <MessageSquare size={14} />
              <span>{lang === 'en' ? 'Ask on WhatsApp' : 'Pyet në WhatsApp'}</span>
            </a>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button key={cat.key} onClick={() => { setActiveCategory(cat.key); setOpenId(null); }}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.key ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600'}`}>
              {cat.label}
            </button>
          ))}
          <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-slate-400 self-center">
            {filtered.length} {lang === 'en' ? 'questions' : 'pyetje'}
          </span>
        </div>

        {/* FAQ grid — two columns on large screens */}
        <div className="grid lg:grid-cols-2 gap-4">
          <AnimatePresence mode="wait">
            {filtered.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div key={faq.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`rounded-2xl border transition-all duration-300 ${isOpen ? 'bg-white border-blue-200 shadow-lg shadow-blue-600/5 lg:col-span-2' : 'bg-white border-slate-100 hover:border-blue-200'}`}>

                  <button onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex justify-between items-start p-6 md:p-7 text-left gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${isOpen ? 'bg-blue-600' : 'bg-slate-100'}`}>
                        <span className={`text-[10px] font-black ${isOpen ? 'text-white' : 'text-slate-400'}`}>
                          {String(FAQS.findIndex(f => f.id === faq.id) + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <span className={`text-base md:text-lg font-bold leading-snug transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-900'}`}>
                        {faq.question[lang]}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isOpen ? 'bg-blue-600 text-white rotate-45' : 'bg-slate-100 text-slate-500'}`}>
                      {isOpen ? <X size={16} /> : <Plus size={16} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="px-7 pb-7 pl-[4.75rem]">
                          <p className="text-slate-600 leading-relaxed text-base border-t border-slate-100 pt-5">
                            {faq.answer[lang]}
                          </p>
                          <a href="https://wa.me/38349772307" target="_blank" rel="noopener"
                            className="inline-flex items-center gap-2 mt-5 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-slate-900 transition-colors">
                            <MessageSquare size={12} />
                            <span>{lang === 'en' ? 'Ask a follow-up on WhatsApp' : 'Pyet më shumë në WhatsApp'}</span>
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default FAQ;
