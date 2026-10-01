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

// Lazy-loaded so the Supabase client + portal code stay out of the public bundle.
const DoctorPortal = React.lazy(() => import('./components/portal/DoctorPortal'));
const VerifyCertificatePage = React.lazy(() => import('./components/portal/VerifyCertificatePage'));

type View = 'home' | 'blog' | 'academy' | 'tourism' | 'portal' | 'verify';
type DeepRoute = { view: View; id?: string };

// Map URL paths to views
const PATH_TO_VIEW: Record<string, View> = {
  '/': 'home',
  '/blog': 'blog',
  '/academy': 'academy',
  '/academy/portal': 'portal',
  '/academy/verify': 'verify',
  '/tourism': 'tourism',
};
const VIEW_TO_PATH: Record<View, string> = {
  home: '/',
  blog: '/blog',
  academy: '/academy',
  tourism: '/tourism',
  portal: '/academy/portal',
  verify: '/academy/verify',
};

const parseRoute = (): DeepRoute => {
  const path = window.location.pathname;
  // /blog/b1 or /academy/c1
  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) return { view: 'blog', id: blogMatch[1] };
  // Doctor portal — must win over the /academy/:id course deep-route below.
  if (path === '/academy/portal' || path.startsWith('/academy/portal/')) return { view: 'portal' };
  // Public certificate check: /academy/verify or /academy/verify/MA-XXXX-XXXX
  const verifyMatch = path.match(/^\/academy\/verify(?:\/([^/]+))?\/?$/);
  if (verifyMatch) {
    let code: string | undefined;
    try {
      code = verifyMatch[1] ? decodeURIComponent(verifyMatch[1]) : undefined;
    } catch {
      code = verifyMatch[1];
    }
    return { view: 'verify', id: code };
  }
  const academyMatch = path.match(/^\/academy\/([^/]+)$/);
  if (academyMatch) return { view: 'academy', id: academyMatch[1] };
  return { view: PATH_TO_VIEW[path] ?? 'home' };
};

const getInitialView = (): View => parseRoute().view;
// Deep-link ids only belong to the view they were opened with.
const getInitialIdFor = (view: View) => (): string | undefined => {
  const route = parseRoute();
  return route.view === view ? route.id : undefined;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'sq'>(() => {
    const saved = localStorage.getItem('medident_lang');
    return (saved as 'en' | 'sq') || 'en';
  });
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isExitIntentOpen, setIsExitIntentOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>(getInitialView);
  const [initialPostId] = useState<string | undefined>(getInitialIdFor('blog'));
  const [initialCourseId] = useState<string | undefined>(getInitialIdFor('academy'));
  const [initialVerifyCode] = useState<string | undefined>(getInitialIdFor('verify'));
  const spotlightRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<View>(currentView);
  viewRef.current = currentView;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Sync URL when view changes
  const navigateTo = (view: View, id?: string) => {
    const basePath = VIEW_TO_PATH[view];
    const path = (id && id !== '') ? basePath + '/' + id : basePath;
    window.history.pushState({ view, id }, '', path);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  // Handle browser back/forward
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const view = (e.state?.view as View) ?? PATH_TO_VIEW[window.location.pathname] ?? parseRoute().view;
      setCurrentView(view);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    // Set initial history state. The portal and the certificate check keep their full
    // address: the portal needs the #access_token from password-reset emails, and a
    // /academy/verify/<code> link must stay shareable.
    const keepUrl = currentView === 'portal' || currentView === 'verify';
    const { pathname, search, hash } = window.location;
    window.history.replaceState({ view: currentView }, '', keepUrl ? pathname + search + hash : VIEW_TO_PATH[currentView]);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    localStorage.setItem('medident_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Update page title per view
  useEffect(() => {
    const titles: Record<View, string> = {
      home: 'Klinika Dentare Medident | Dental Implants & Oral Surgery — Pejë, Kosovo',
      blog: 'Blog — Klinika Dentare Medident',
      academy: 'Medident Academy — Clinical Courses, Pejë',
      tourism: 'Dental Tourism Kosovo — Medident, Pejë',
      portal: 'Medident Academy — Doctor Portal',
      verify: 'Verify a certificate — Medident Academy',
    };
    document.title = titles[currentView];
  }, [currentView]);

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
    const dismissed = localStorage.getItem('medident_exit_popup');
    if (dismissed) return; // never show again once dismissed
    const handleMouseOut = (e: MouseEvent) => {
      // Never on the private portal or the certificate check.
      if (viewRef.current === 'portal' || viewRef.current === 'verify') return;
      if (!e.relatedTarget && e.clientY < 10) setIsExitIntentOpen(true);
    };
    document.addEventListener('mouseout', handleMouseOut);
    return () => document.removeEventListener('mouseout', handleMouseOut);
  }, []);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'sq' : 'en');

  const scrollToSection = (id: string) => {
    if (currentView !== 'home') {
      navigateTo('home');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simple display toggle — clean and reliable across all browsers
  const vis = (view: View): React.CSSProperties =>
    currentView === view ? {} : { display: 'none' };

  return (
    <>
      {/* Blog */}
      <div style={vis('blog')}>
        <BlogPage
          onBack={() => navigateTo('home')}
          lang={lang}
          initialPostId={initialPostId}
          onNavigatePost={(id) => navigateTo('blog', id)}
        />
      </div>

      {/* Academy */}
      <div style={vis('academy')}>
        <AcademyPage
          onBack={() => navigateTo('home')}
          lang={lang}
          onOpenMaterials={() => setIsMaterialsOpen(true)}
          initialCourseId={initialCourseId}
          onNavigateCourse={(id) => navigateTo('academy', id)}
          onOpenPortal={() => navigateTo('portal')}
          active={currentView === 'academy'}
        />
      </div>

      {/* Doctor Portal — lazy-loaded standalone private area */}
      {currentView === 'portal' && (
        <React.Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
          <DoctorPortal lang={lang} onToggleLang={toggleLang} onExit={() => navigateTo('academy')} />
        </React.Suspense>
      )}

      {/* Public certificate verification — lazy-loaded like the portal */}
      {currentView === 'verify' && (
        <React.Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
          <VerifyCertificatePage lang={lang} onToggleLang={toggleLang} initialCode={initialVerifyCode} onExit={() => navigateTo('academy')} />
        </React.Suspense>
      )}

      {/* Tourism */}
      <div style={vis('tourism')}>
        <TourismPage
          onBack={() => navigateTo('home')}
          lang={lang}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenMaterials={() => setIsMaterialsOpen(true)}
        />
      </div>

      {/* Home */}
      <div style={vis('home')}>
        <div className="relative min-h-screen selection:bg-blue-600 selection:text-white bg-white">
          <div className="grain" />
          <div id="cursor-spotlight" ref={spotlightRef} />
          <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-blue-600 origin-left z-[100]" style={{ scaleX }} />
          <Navbar
            lang={lang}
            setLang={setLang}
            onBlogClick={() => navigateTo('blog')}
            onAcademyClick={() => navigateTo('academy')}
            onJourneyClick={() => navigateTo('tourism')}
            onServicesClick={() => scrollToSection('services')}
            onDoctorsClick={() => scrollToSection('doctors')}
            onGalleryClick={() => scrollToSection('gallery')}
            onBookClick={() => scrollToSection('contact')}
          />
          <Hero
            onWatchStory={() => setIsVideoOpen(true)}
            onServicesClick={() => scrollToSection('services')}
            onJourneyClick={() => navigateTo('tourism')}
            lang={lang}
          />
          <TrustBar lang={lang} />
          <USPSection lang={lang} />
          <LegacySection lang={lang} />
          <Services lang={lang} onOpenMaterials={() => setIsMaterialsOpen(true)} />
          <Gallery lang={lang} />
          <Doctors lang={lang} />
          <TrustSignals lang={lang} onOpenJourney={() => navigateTo('tourism')} onOpenGuide={() => setIsGuideOpen(true)} />
          <TourismSection lang={lang} onOpenJourney={() => navigateTo('tourism')} />
          <TechnologyShowcase lang={lang} onOpenMaterials={() => setIsMaterialsOpen(true)} />
          <Testimonials lang={lang} />
          <FAQ lang={lang} />
          <ContactForm lang={lang} />
          <Footer
            lang={lang}
            onBlogClick={() => navigateTo('blog')}
            onAcademyClick={() => navigateTo('academy')}
            onJourneyClick={() => navigateTo('tourism')}
            onOpenGuide={() => setIsGuideOpen(true)}
            onOpenMaterials={() => setIsMaterialsOpen(true)}
          />
          <ConsultationFAB lang={lang} onClick={() => scrollToSection('contact')} />
          <MobileBottomBar lang={lang} onBookClick={() => scrollToSection('contact')} />
          <AIChatbot lang={lang} />
          <AnimatePresence>
            {isVideoOpen && <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />}
          </AnimatePresence>
        </div>
      </div>

      {/* Global modals — always mounted */}
      <PatientGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} lang={lang} />
      <MaterialRegistryModal isOpen={isMaterialsOpen} onClose={() => setIsMaterialsOpen(false)} lang={lang} />
      <ExitIntentPopup isOpen={isExitIntentOpen && currentView !== 'portal' && currentView !== 'verify'} onClose={() => { setIsExitIntentOpen(false); localStorage.setItem('medident_exit_popup', '1'); }} lang={lang} />
    </>
  );
};

export default App;
