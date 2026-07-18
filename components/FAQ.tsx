import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { FAQS } from '../constants';

const FAQ: React.FC<{ lang: 'en' | 'sq' }> = ({ lang }) => {
  const [openId, setOpenId] = useState<string | null>('1');

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex p-3 bg-blue-600/10 text-blue-600 rounded-2xl mb-6">
            <HelpCircle size={24} />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4">
            {lang === 'en' ? 'Common Inquiries' : 'Pyetjet e Shpeshta'}
          </h2>
          <p className="text-slate-500 text-lg">
            {lang === 'en' 
              ? 'Everything you need to know about your surgical journey at Medident.' 
              : 'Gjithçka që duhet të dini për udhëtimin tuaj kirurgjikal në Medident.'}
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <motion.div 
              key={faq.id}
              className={`rounded-2xl border transition-all duration-300 ${openId === faq.id ? 'bg-white border-blue-100 shadow-xl' : 'bg-transparent border-slate-200'}`}
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className={`text-lg font-bold transition-colors ${openId === faq.id ? 'text-blue-600' : 'text-slate-900'}`}>
                  {faq.question[lang]}
                </span>
                <div className={`p-2 rounded-lg transition-colors ${openId === faq.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {openId === faq.id ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed text-lg border-t border-slate-50 pt-4">
                      {faq.answer[lang]}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
