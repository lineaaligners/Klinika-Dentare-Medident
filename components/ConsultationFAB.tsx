
import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

interface ConsultationFABProps {
  lang: 'en' | 'sq';
  onClick: () => void;
}

const ConsultationFAB: React.FC<ConsultationFABProps> = ({ lang, onClick }) => {
  const label = lang === 'en' ? 'Book Free Consultation' : 'Cakto Konsultë Falas';

  return (
    <div className="fixed bottom-8 left-8 z-[60] hidden md:block">
      <button 
        onClick={onClick}
        className="group relative flex items-center space-x-4 bg-white border border-slate-200 p-2 pr-8 rounded-full shadow-2xl hover:shadow-blue-200 transition-all duration-500 hover:-translate-y-1"
      >
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
          <Calendar size={20} />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-0.5">Contact Us</span>
          <span className="text-xs font-black uppercase tracking-widest text-slate-900">{label}</span>
        </div>
        <div className="ml-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
          <ArrowRight size={16} className="text-blue-600" />
        </div>
      </button>
    </div>
  );
};

export default ConsultationFAB;
