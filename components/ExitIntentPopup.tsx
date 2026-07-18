import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Send, MapPin } from 'lucide-react';

interface ExitIntentPopupProps {
  onClose: () => void;
  lang: 'en' | 'sq';
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose, lang }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-[2rem] overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900 z-10"
        >
          <X size={20} />
        </button>

        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-blue-600/30">
            <Sparkles size={32} />
          </div>
          
          <h2 className="text-3xl font-display font-black tracking-tight text-slate-900 mb-4 leading-tight">
            {lang === 'en' ? 'Wait! Start your surgical assessment for free.' : 'Prit! Fillo vlerësimin tënd kirurgjikal falas.'}
          </h2>
          
          <p className="text-slate-500 text-lg mb-10">
            {lang === 'en' 
              ? 'Send us a panoramic X-ray and receive a preliminary surgical plan from Dr. Lendita Islami Nallbani within 24 hours.'
              : 'Na dërgoni një radiografi panoramike dhe merrni një plan paraprak kirurgjikal brenda 24 orëve.'}
          </p>

          <div className="space-y-4">
            <a 
              href="https://wa.me/38349772307" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-slate-900 text-white py-5 rounded-2xl font-black text-lg tracking-wide transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
            >
              <Send size={20} />
              <span>{lang === 'en' ? 'Contact on WhatsApp' : 'Na kontaktoni në WhatsApp'}</span>
            </a>
            
            <button 
              onClick={onClose}
              className="w-full py-4 text-slate-400 hover:text-slate-900 font-bold text-sm tracking-widest uppercase transition-colors"
            >
              {lang === 'en' ? 'Maybe later' : 'Ndoshta më vonë'}
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img 
                  key={i} 
                  src={`https://i.pravatar.cc/100?u=${i}`} 
                  alt="Reviewer" 
                  className="w-10 h-10 rounded-full border-4 border-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-left">
              Join <span className="text-slate-900">13,000+</span> <br /> Successful Cases
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExitIntentPopup;
