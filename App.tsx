
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import USPSection from './components/USPSection';
import LegacySection from './components/LegacySection';
import Services from './components/Services';
import Doctors from './components/Doctors';
import TourismSection from './components/TourismSection';
import Gallery from './components/Gallery';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import PatientGuideModal from './components/PatientGuideModal';
import MaterialRegistryModal from './components/MaterialRegistryModal';
import VideoModal from './components/VideoModal';
import BlogPage from './components/BlogPage';
import AcademyPage from './components/AcademyPage';
import TourismPage from './components/TourismPage';
import AIChatbot from './components/AIChatbot';
import ConsultationFAB from './components/ConsultationFAB';
import ExitIntentPopup from './components/ExitIntentPopup'; 
import TechnologyShowcase from './components/TechnologyShowcase'; 
import Testimonials from './components/Testimonials'; 
import TrustSignals from './components/TrustSignals';
import FAQ from './components/FAQ'; 
import MobileBottomBar from './components/MobileBottomBar';
import TrustBar from './components/TrustBar';

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'sq'>(() => {
    const saved = localStorage.getItem('medident_lang');
    return (saved as 'en' | 'sq') || 'en';
  });
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isExitIntentOpen, setIsExitIntentOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'blog' | 'academy' | 'tourism'>('home');
  const spotlightRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    localStorage.setItem('medident_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--x', `${e.clientX}px`);
        spotlightRef.current.style.setProperty('--y', `${e.clientY}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY < 10) {
        setIsExitIntentOpen(true);
      }
    };
    document.addEventListener('mouseout', handleMouseOut);
    return () => document.removeEventListener('mouseout', handleMouseOut);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'sq' : 'en');

  const scrollToSection = (id: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (currentView === 'blog') {
    return <BlogPage onBack={() => setCurrentView('home')} lang={lang} />;
  }

  if (currentView === 'academy') {
    return (
      <>
        <AcademyPage 
          onBack={() => setCurrentView('home')} 
          lang={lang} 
          onOpenMaterials={() => setIsMaterialsOpen(true)}
        />
        <MaterialRegistryModal isOpen={isMaterialsOpen} onClose={() => setIsMaterialsOpen(false)} lang={lang} />
      </>
    );
  }

  if (currentView === 'tourism') {
    return (
      <>
        <TourismPage 
          onBack={() => setCurrentView('home')} 
          lang={lang} 
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenMaterials={() => setIsMaterialsOpen(true)}
        />
        <PatientGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} lang={lang} />
        <MaterialRegistryModal isOpen={isMaterialsOpen} onClose={() => setIsMaterialsOpen(false)} lang={lang} />
      </>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-blue-600 selection:text-white bg-white">
      <div className="grain" />
      <div id="cursor-spotlight" ref={spotlightRef} />
      
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-[0%] z-[100]" 
        style={{ scaleX }}
      />

      <Navbar 
        onBlogClick={() => setCurrentView('blog')} 
        onAcademyClick={() => setCurrentView('academy')} 
        onServicesClick={() => scrollToSection('services')}
        onJourneyClick={() => setCurrentView('tourism')}
        onConsultationClick={() => scrollToSection('contact')}
        lang={lang}
        setLang={setLang}
      />
      
      <main>
        <Hero 
          onWatchStory={() => setIsVideoOpen(true)} 
          onServicesClick={() => scrollToSection('services')}
          onJourneyClick={() => setCurrentView('tourism')}
          lang={lang}
        />
        <TrustBar lang={lang} />
        
        <USPSection lang={lang} />
        <LegacySection lang={lang} />
        <TechnologyShowcase lang={lang} />
        <Services lang={lang} onOpenMaterials={() => setIsMaterialsOpen(true)} />
        <Doctors lang={lang} />
        <TrustSignals lang={lang} />
        <TourismSection 
          onOpenGuide={() => setIsGuideOpen(true)} 
          onServicesClick={() => scrollToSection('services')}
          lang={lang}
          onExploreTourism={() => setCurrentView('tourism')}
        />
        <Gallery lang={lang} />
        <FAQ lang={lang} />
        <ContactForm lang={lang} />
      </main>

      <Footer 
        onOpenGuide={() => setIsGuideOpen(true)} 
        onOpenMaterials={() => setIsMaterialsOpen(true)}
        onBlogClick={() => setCurrentView('blog')} 
        lang={lang} 
      />
      
      <AnimatePresence>
        {isExitIntentOpen && (
          <ExitIntentPopup onClose={() => setIsExitIntentOpen(false)} lang={lang} />
        )}
      </AnimatePresence>

      <PatientGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} lang={lang} />
      <MaterialRegistryModal isOpen={isMaterialsOpen} onClose={() => setIsMaterialsOpen(false)} lang={lang} />
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
      <AIChatbot lang={lang} />
      <ConsultationFAB lang={lang} onClick={() => scrollToSection('contact')} />
      <MobileBottomBar lang={lang} onBookClick={() => scrollToSection('contact')} />
    </div>
  );
};

export default App;
