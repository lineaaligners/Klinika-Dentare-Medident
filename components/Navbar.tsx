
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Newspaper, GraduationCap, Stethoscope, MapPin } from 'lucide-react';

interface NavbarProps {
  onBlogClick?: () => void;
  onAcademyClick?: () => void;
  onServicesClick?: () => void;
  onJourneyClick?: () => void;
  lang: 'en' | 'sq';
  toggleLang: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onBlogClick, onAcademyClick, onServicesClick, onJourneyClick, lang, toggleLang }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (fn?: () => void) => {
    if (fn) fn();
    setIsMenuOpen(false);
  };

  const labels = {
    services: lang === 'en' ? 'Medical Services' : 'Shërbimet Mjekësore',
    academy: lang === 'en' ? 'Academy' : 'Akademia',
    blog: lang === 'en' ? 'Blog' : 'Blogu',
    journey: lang === 'en' ? 'Patient Journey' : 'Rrugëtimi i Pacientit',
    consultation: lang === 'en' ? 'Consultation' : 'Konsulta'
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`transition-all duration-500 rounded-2xl border ${isScrolled ? 'bg-white shadow-xl border-slate-200 px-6' : 'bg-transparent border-white/10 px-2'}`}>
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className={`text-xl font-display font-black tracking-tighter transition-colors duration-300 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                MEDIDENT<span className="text-blue-500">.</span>CLINIC
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-10">
              <button 
                onClick={() => handleNavClick(onServicesClick)}
                className={`font-black text-[10px] uppercase tracking-widest transition-colors flex items-center space-x-2 ${isScrolled ? 'text-slate-500 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}
              >
                <Stethoscope size={14} className="text-blue-500" />
                <span>{labels.services}</span>
              </button>
              
              <button onClick={() => handleNavClick(onAcademyClick)} className={`font-black text-[10px] uppercase tracking-widest transition-colors flex items-center space-x-2 ${isScrolled ? 'text-slate-500 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}>
                <GraduationCap size={14} className="text-blue-500" />
                <span>{labels.academy}</span>
              </button>
              
              <button onClick={() => handleNavClick(onBlogClick)} className={`font-black text-[10px] uppercase tracking-widest transition-colors flex items-center space-x-2 ${isScrolled ? 'text-slate-500 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}>
                <Newspaper size={14} className="text-blue-500" />
                <span>{labels.blog}</span>
              </button>
              
              <button 
                onClick={() => handleNavClick(onJourneyClick)}
                className={`font-black text-[10px] uppercase tracking-widest transition-colors flex items-center space-x-2 ${isScrolled ? 'text-slate-500 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}
              >
                <MapPin size={14} className="text-blue-500" />
                <span>{labels.journey}</span>
              </button>

              <div className="h-4 w-px bg-slate-200/20"></div>
              <button 
                onClick={toggleLang}
                className={`flex items-center space-x-1.5 font-black text-[10px] uppercase tracking-widest hover:text-blue-500 transition-colors ${isScrolled ? 'text-slate-400' : 'text-slate-400'}`}
              >
                <Globe size={12} />
                <span>{lang.toUpperCase()}</span>
              </button>
              <a href="#contact" className="bg-blue-600 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20">
                {labels.consultation}
              </a>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 rounded-lg transition-colors ${isScrolled ? 'text-slate-900 bg-slate-100' : 'text-white bg-white/10'}`}>
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-slate-950 p-8 flex flex-col space-y-8">
          <button onClick={toggleLang} className="text-left text-slate-500 text-sm font-black uppercase tracking-widest mb-4">Switch to {lang === 'en' ? 'Shqip' : 'English'}</button>
          <button onClick={() => handleNavClick(onServicesClick)} className="text-left text-white text-3xl font-display font-black">{labels.services}</button>
          <button onClick={() => handleNavClick(onAcademyClick)} className="text-left text-white text-3xl font-display font-black">{labels.academy}</button>
          <button onClick={() => handleNavClick(onBlogClick)} className="text-left text-white text-3xl font-display font-black">{labels.blog}</button>
          <button onClick={() => handleNavClick(onJourneyClick)} className="text-left text-white text-3xl font-display font-black">{labels.journey}</button>
          <div className="mt-auto">
             <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-center text-lg">{labels.consultation}</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
