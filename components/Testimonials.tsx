import React from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink, MessageSquare } from 'lucide-react';

const Testimonials: React.FC<{ lang: 'en' | 'sq' }> = ({ lang }) => (
  <section className="py-24 md:py-32 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => <Star key={i} size={24} className="fill-yellow-400 text-yellow-400" />)}
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-black text-slate-900 tracking-tighter mb-5">
          {lang === 'en' ? <>13,000+ patients.<br /><span className="text-blue-600">See what they say.</span></> : <>13,000+ pacientë.<br /><span className="text-blue-600">Shikoni çfarë thonë.</span></>}
        </h2>
        <p className="text-slate-500 font-medium text-lg mb-10 max-w-xl mx-auto">
          {lang === 'en'
            ? 'Read real patient reviews on Google — or ask us directly on WhatsApp.'
            : 'Lexoni vlerësimet reale të pacientëve në Google — ose na pyesni direkt në WhatsApp.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Klinika+Dentare+Medident+Pej%C3%AB"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg">
            <ExternalLink size={15} />
            <span>{lang === 'en' ? 'Read Google Reviews' : 'Lexo Vlerësimet në Google'}</span>
          </a>
          <a
            href="https://wa.me/38349772307"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-blue-400 text-slate-900 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all">
            <MessageSquare size={15} className="text-blue-600" />
            <span>{lang === 'en' ? 'Ask on WhatsApp' : 'Pyet në WhatsApp'}</span>
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Testimonials;
