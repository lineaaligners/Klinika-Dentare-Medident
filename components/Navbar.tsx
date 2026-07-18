
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Newspaper, GraduationCap, Smile, MapPin, Plane, Calendar } from 'lucide-react';

interface NavbarProps {
  onBlogClick?: () => void;
  onAcademyClick?: () => void;
  onServicesClick?: () => void;
  onJourneyClick?: () => void;
  onConsultationClick?: () => void;
  lang: 'en' | 'sq';
  setLang: (lang: 'en' | 'sq') => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onBlogClick, 
  onAcademyClick, 
  onServicesClick, 
  onJourneyClick, 
  onConsultationClick,
  lang, 
  setLang
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

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
    services: lang === 'en' ? 'Dental Services' : 'Shërbimet Dentare',
    academy: lang === 'en' ? 'Academy' : 'Akademia',
    blog: lang === 'en' ? 'Blog' : 'Blogu',
    tourism: lang === 'en' ? 'Dental Tourism' : 'Turizmi Dentar',
    consultation: lang === 'en' ? 'Free Consultation' : 'Konsultë Falas'
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'sq', name: 'Shqip', flag: '🇦🇱' }
  ] as const;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`transition-all duration-500 rounded-2xl border ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-xl border-slate-200 px-6' : 'bg-transparent border-white/10 px-2'}`}>
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
                <Smile size={14} className="text-blue-500" />
                <span>{labels.services}</span>
              </button>
              
              <button onClick={() => handleNavClick(onAcademyClick)} className={`font-black text-[10px] uppercase tracking-widest transition-colors flex items-center space-x-2 ${isScrolled ? 'text-slate-500 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}>
                <GraduationCap size={14} className="text-blue-500" />
                <span>{labels.academy}</span>
              </button>
              
              <button 
                onClick={() => handleNavClick(onJourneyClick)}
                className={`font-black text-[10px] uppercase tracking-widest transition-colors flex items-center space-x-2 ${isScrolled ? 'text-slate-500 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}
              >
                <Plane size={14} className="text-blue-500" />
                <span>{labels.tourism}</span>
              </button>

              <button onClick={() => handleNavClick(onBlogClick)} className={`font-black text-[10px] uppercase tracking-widest transition-colors flex items-center space-x-2 ${isScrolled ? 'text-slate-500 hover:text-blue-600' : 'text-slate-300 hover:text-white'}`}>
                <Newspaper size={14} className="text-blue-500" />
                <span>{labels.blog}</span>
              </button>

              <div className="h-4 w-px bg-slate-200/20"></div>
              
              <div className="relative group">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className={`flex items-center space-x-1.5 font-black text-[10px] uppercase tracking-widest hover:text-blue-500 transition-colors ${isScrolled ? 'text-slate-400' : 'text-slate-300'}`}
                >
                  <Globe size={12} />
                  <span>{lang.toUpperCase()}</span>
                </button>
                
                <div className={`absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 ${isLangOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center space-x-2 ${lang === l.code ? 'text-blue-600' : 'text-slate-600'}`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleNavClick(onConsultationClick)}
                className="bg-blue-600 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center space-x-2 group"
              >
                <Calendar size={14} className="group-hover:scale-110 transition-transform" />
                <span>{labels.consultation}</span>
              </button>
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
        <div className="md:hidden fixed inset-0 z-[60] bg-slate-950 p-8 flex flex-col space-y-8 animate-in fade-in duration-300 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-display font-black tracking-tighter text-white">
              MEDIDENT<span className="text-blue-500">.</span>
            </span>
            <button onClick={() => setIsMenuOpen(false)} className="text-white p-2">
              <X size={24} />
            </button>
          </div>
          
          <button
            onClick={() => setLang(lang === 'en' ? 'sq' : 'en')}
            className="text-left text-slate-400 text-sm font-black uppercase tracking-widest mb-4 flex items-center space-x-2"
          >
            <Globe size={16} className="text-blue-500" />
            <span>{lang === 'en' ? '🇦🇱 Kalo në Shqip' : '🇬🇧 Switch to English'}</span>
          </button>

          <div className="flex flex-col space-y-6">
            <button onClick={() => handleNavClick(onServicesClick)} className="text-left text-white text-3xl font-display font-black flex items-center space-x-4"><Smile size={24} className="text-blue-500 shrink-0" /><span>{labels.services}</span></button>
            <button onClick={() => handleNavClick(onAcademyClick)} className="text-left text-white text-3xl font-display font-black flex items-center space-x-4"><GraduationCap size={24} className="text-blue-500 shrink-0" /><span>{labels.academy}</span></button>
            <button onClick={() => handleNavClick(onJourneyClick)} className="text-left text-white text-3xl font-display font-black flex items-center space-x-4"><Plane size={24} className="text-blue-500 shrink-0" /><span>{labels.tourism}</span></button>
            <button onClick={() => handleNavClick(onBlogClick)} className="text-left text-white text-3xl font-display font-black flex items-center space-x-4"><Newspaper size={24} className="text-blue-500 shrink-0" /><span>{labels.blog}</span></button>
          </div>

          <div className="mt-auto space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <a href="tel:+38349272803" className="bg-white/10 border border-white/15 text-white px-4 py-4 rounded-2xl font-black text-center text-sm">
                 {lang === 'en' ? 'Call Us' : 'Na Telefononi'}
               </a>
               <a href="https://wa.me/38349772307" target="_blank" rel="noopener" className="bg-emerald-600 text-white px-4 py-4 rounded-2xl font-black text-center text-sm">
                 WhatsApp
               </a>
             </div>
             <button 
               onClick={() => handleNavClick(onConsultationClick)} 
               className="w-full bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-center text-lg shadow-xl shadow-blue-600/20"
             >
               {labels.consultation}
             </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
