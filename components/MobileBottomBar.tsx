import React from 'react';
import { Phone, MessageCircle, Calendar, ShieldCheck } from 'lucide-react';

interface MobileBottomBarProps {
  lang: 'en' | 'sq';
  onBookClick: () => void;
}

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ lang, onBookClick }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="bg-slate-950/85 backdrop-blur-2xl rounded-[1.75rem] border border-white/10 p-2.5 shadow-2xl flex items-center justify-between gap-2">
        <a 
          href="tel:+38349272803" 
          className="flex-1 bg-white/10 active:bg-white/15 text-white rounded-[1.25rem] py-3 flex flex-col items-center justify-center gap-1 transition-all duration-200"
        >
          <Phone size={20} className="text-blue-500" />
          <span className="text-[11px] font-semibold">{lang === 'en' ? 'Call' : 'Telefono'}</span>
        </a>

        <a 
          href="https://wa.me/38349772307" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 bg-white/10 active:bg-white/15 text-white rounded-[1.25rem] py-3 flex flex-col items-center justify-center gap-1 transition-all duration-200"
        >
          <MessageCircle size={20} className="text-green-500" />
          <span className="text-[11px] font-semibold">WhatsApp</span>
        </a>

        <button 
          onClick={onBookClick}
          className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white rounded-[1.25rem] py-3 flex flex-col items-center justify-center gap-1 transition-all duration-200 shadow-lg shadow-blue-600/30 active:scale-[0.97]"
        >
          <Calendar size={20} />
          <span className="text-[11px] font-semibold">{lang === 'en' ? 'Book Now' : 'Rezervo Tani'}</span>
        </button>
      </div>
      
      {/* Visual Indicator of safety/trust */}
      <div className="mt-2 flex justify-center items-center gap-1.5 text-[10px] text-slate-400 font-medium px-2">
        <ShieldCheck size={10} className="text-blue-500" />
        <span>ISO 9001:2015 certified clinic</span>
      </div>
    </div>
  );
};

export default MobileBottomBar;
