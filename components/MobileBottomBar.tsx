import React from 'react';
import { Phone, MessageCircle, Calendar, ShieldCheck } from 'lucide-react';

interface MobileBottomBarProps {
  lang: 'en' | 'sq';
  onBookClick: () => void;
}

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ lang, onBookClick }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-white/10 p-3 shadow-2xl flex items-center justify-between gap-2">
        <a 
          href="tel:+38349772307" 
          className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl py-3 flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <Phone size={20} className="text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Call' : 'Telefono'}</span>
        </a>

        <a 
          href="https://wa.me/38349772307" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl py-3 flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <MessageCircle size={20} className="text-green-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
        </a>

        <button 
          onClick={onBookClick}
          className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 flex flex-col items-center justify-center gap-1 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Calendar size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'Book Now' : 'Rezervo Tani'}</span>
        </button>
      </div>
      
      {/* Visual Indicator of safety/trust */}
      <div className="mt-2 flex justify-center items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest px-2">
        <ShieldCheck size={10} className="text-blue-500" />
        <span>ISO 9001:2015 Certified Clinic</span>
      </div>
    </div>
  );
};

export default MobileBottomBar;
