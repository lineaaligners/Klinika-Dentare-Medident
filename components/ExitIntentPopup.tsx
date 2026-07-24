import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare } from 'lucide-react';

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'sq';
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ isOpen, onClose, lang }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] overflow-hidden shadow-2xl"
          >
            {/* Top image strip */}
            <div className="relative h-36 overflow-hidden">
              <img src="/photos/clinic-hero.jpg" alt="Medident" className="w-full h-full object-cover" style={{ objectPosition: 'center 40%' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors text-white"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-4 left-6">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/60">Klinika Dentare Medident · Pejë</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 mb-3 leading-tight">
                {lang === 'en' ? 'Get a free surgical assessment.' : 'Merr një vlerësim kirurgjikal falas.'}
              </h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-7">
                {lang === 'en'
                  ? 'Send your panoramic X-ray on WhatsApp. Dr. Lendita reviews every case personally and responds within 24 hours.'
                  : 'Dërgoni panoramen tuaj në WhatsApp. Dr. Lendita rishikon çdo rast personalisht dhe përgjigjet brenda 24 orëve.'}
              </p>

              <div className="space-y-3">
                <a
                  href="https://wa.me/38349772307"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="w-full bg-blue-600 hover:bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
                >
                  <MessageSquare size={15} />
                  <span>{lang === 'en' ? 'Send on WhatsApp' : 'Dërgo në WhatsApp'}</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-[10px] tracking-widest uppercase transition-colors"
                >
                  {lang === 'en' ? 'Maybe later' : 'Ndoshta më vonë'}
                </button>
              </div>

              <p className="text-center text-[9px] text-slate-300 font-medium mt-5">
                {lang === 'en' ? '13,000+ patients since 1999 · Pejë, Kosovë' : '13,000+ pacientë që nga 1999 · Pejë, Kosovë'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
