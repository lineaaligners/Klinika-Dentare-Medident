import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { getProfile, signOut } from '../../services/portalApi';
import { Profile, Lang } from './types';
import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen';
import CourseScreen from './CourseScreen';
import AdminScreen from './admin/AdminScreen';
import AccountScreen from './AccountScreen';
import PortalHeader from './PortalHeader';
import { Loader2, GraduationCap, ArrowLeft } from 'lucide-react';

type Screen =
  | { name: 'dashboard' }
  | { name: 'course'; courseId: string }
  | { name: 'admin' }
  | { name: 'account' };

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  onExit: () => void; // back to the public academy page
}

const strings = {
  en: {
    notConfiguredTitle: 'Portal not available yet',
    notConfiguredBody: 'The doctor portal has not been set up on this site yet. Please check back soon.',
    backToSite: 'Back to site',
    noAccessTitle: 'No portal access',
    noAccessBody: "This account isn't part of Medident Academy. Contact the academy if you think this is a mistake.",
    signOut: 'Sign out',
  },
  sq: {
    notConfiguredTitle: 'Portali nuk është ende i disponueshëm',
    notConfiguredBody: 'Portali i mjekëve nuk është konfiguruar ende. Ju lutemi kontrolloni së shpejti.',
    backToSite: 'Kthehu në faqe',
    noAccessTitle: 'Nuk keni qasje',
    noAccessBody: 'Kjo llogari nuk është pjesë e Akademisë Medident. Kontaktoni akademinë nëse mendoni se është gabim.',
    signOut: 'Dilni',
  },
};

const DoctorPortal: React.FC<Props> = ({ lang, onToggleLang, onExit }) => {
  const s = strings[lang];
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [screen, setScreen] = useState<Screen>({ name: 'dashboard' });

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    if (session?.user) {
      setProfileLoaded(false);
      getProfile(session.user.id).then((p) => {
        if (active) {
          setProfile(p);
          setProfileLoaded(true);
        }
      });
    } else {
      setProfile(null);
      setProfileLoaded(false);
      setScreen({ name: 'dashboard' });
    }
    return () => {
      active = false;
    };
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
    setScreen({ name: 'dashboard' });
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
        <GraduationCap className="w-10 h-10 text-blue-600 mb-4" />
        <h1 className="text-2xl font-black text-slate-900 mb-2">{s.notConfiguredTitle}</h1>
        <p className="text-slate-500 max-w-md mb-8">{s.notConfiguredBody}</p>
        <button onClick={onExit} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
          <ArrowLeft size={16} /> {s.backToSite}
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <LoginScreen lang={lang} onToggleLang={onToggleLang} onExit={onExit} />;
  }

  if (!profileLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Authenticated but not an academy member (shared login pool) — deny + sign out.
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
        <GraduationCap className="w-10 h-10 text-blue-600 mb-4" />
        <h1 className="text-2xl font-black text-slate-900 mb-2">{s.noAccessTitle}</h1>
        <p className="text-slate-500 max-w-md mb-8">{s.noAccessBody}</p>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
        >
          {s.signOut}
        </button>
      </div>
    );
  }

  const isAdmin = profile.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Signature site backdrop: dotted grid + soft blue wash */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-blue-50/40 via-transparent to-transparent" />
      <div className="relative z-10">
      <PortalHeader
        lang={lang}
        onToggleLang={onToggleLang}
        profile={profile}
        isAdmin={isAdmin}
        active={screen.name}
        onDashboard={() => setScreen({ name: 'dashboard' })}
        onAdmin={() => setScreen({ name: 'admin' })}
        onAccount={() => setScreen({ name: 'account' })}
        onSignOut={handleSignOut}
        onExit={onExit}
      />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {screen.name === 'dashboard' && (
          <DashboardScreen lang={lang} onOpenCourse={(courseId) => setScreen({ name: 'course', courseId })} />
        )}
        {screen.name === 'course' && (
          <CourseScreen lang={lang} courseId={screen.courseId} onBack={() => setScreen({ name: 'dashboard' })} />
        )}
        {screen.name === 'admin' && isAdmin && <AdminScreen lang={lang} />}
        {screen.name === 'account' && (
          <AccountScreen lang={lang} profile={profile} onBack={() => setScreen({ name: 'dashboard' })} />
        )}
      </main>
      </div>
    </div>
  );
};

export default DoctorPortal;
