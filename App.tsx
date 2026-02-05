
import React, { useState, useEffect } from 'react';
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
import VideoModal from './components/VideoModal';
import BlogPage from './components/BlogPage';
import AcademyPage from './components/AcademyPage';
import AIChatbot from './components/AIChatbot';

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'sq'>('en');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'blog' | 'academy'>('home');

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
    return <AcademyPage onBack={() => setCurrentView('home')} lang={lang} />;
  }

  return (
    <div className="relative overflow-x-hidden selection:bg-blue-600 selection:text-white bg-white">
      <Navbar 
        onBlogClick={() => setCurrentView('blog')} 
        onAcademyClick={() => setCurrentView('academy')} 
        onServicesClick={() => scrollToSection('services')}
        onJourneyClick={() => scrollToSection('tourism')}
        lang={lang}
        toggleLang={toggleLang}
      />
      
      <main>
        <Hero 
          onWatchStory={() => setIsVideoOpen(true)} 
          onServicesClick={() => scrollToSection('services')}
          onJourneyClick={() => scrollToSection('tourism')}
          lang={lang}
        />
        
        <USPSection lang={lang} />
        <LegacySection lang={lang} />
        <Services lang={lang} />
        <Doctors lang={lang} />
        <TourismSection 
          onOpenGuide={() => setIsGuideOpen(true)} 
          onServicesClick={() => scrollToSection('services')}
          lang={lang}
        />
        <Gallery lang={lang} />
        <ContactForm lang={lang} />
      </main>

      <Footer onOpenGuide={() => setIsGuideOpen(true)} onBlogClick={() => setCurrentView('blog')} lang={lang} />
      
      <PatientGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} lang={lang} />
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
      <AIChatbot lang={lang} />
    </div>
  );
};

export default App;
