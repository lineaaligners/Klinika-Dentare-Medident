import React from 'react';
import { Profile, Lang } from './types';
import { LogOut, LayoutGrid, Shield, Globe2, UserRound } from 'lucide-react';

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  profile: Profile | null;
  isAdmin: boolean;
  active: 'dashboard' | 'course' | 'admin' | 'account';
  onDashboard: () => void;
  onAdmin: () => void;
  onAccount: () => void;
  onSignOut: () => void;
  onExit: () => void;
}

const t = {
  en: { dashboard: 'My Courses', admin: 'Admin', signOut: 'Sign out', portal: 'Portal', account: 'Account' },
  sq: { dashboard: 'Kurset e Mia', admin: 'Admin', signOut: 'Dilni', portal: 'Portali', account: 'Llogaria' },
};

const PortalHeader: React.FC<Props> = ({
  lang, onToggleLang, profile, isAdmin, active, onDashboard, onAdmin, onAccount, onSignOut, onExit,
}) => {
  const s = t[lang];
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button onClick={onExit} className="flex flex-col leading-none text-left" title="Medident Academy">
            <span className="text-base font-display font-black tracking-tighter text-slate-900">
              MEDIDENT<span className="text-blue-600">.</span>ACADEMY
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-400">{s.portal}</span>
          </button>
          <nav className="hidden sm:flex items-center gap-1">
            <button
              onClick={onDashboard}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors ${
                active !== 'admin' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid size={13} /> {s.dashboard}
            </button>
            {isAdmin && (
              <button
                onClick={onAdmin}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors ${
                  active === 'admin' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                <Shield size={13} /> {s.admin}
              </button>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 px-2 py-2"
          >
            <Globe2 size={14} /> {lang === 'en' ? 'SQ' : 'EN'}
          </button>
          {profile && (
            <>
              <button
                onClick={onAccount}
                title={s.account}
                className="hidden md:block text-[11px] font-bold text-slate-500 hover:text-blue-600 max-w-[160px] truncate transition-colors"
              >
                {profile.full_name || profile.email}
              </button>
              <button
                onClick={onAccount}
                title={s.account}
                aria-label={s.account}
                className={`md:hidden p-2 rounded-lg transition-colors ${active === 'account' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-900'}`}
              >
                <UserRound size={16} />
              </button>
            </>
          )}
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <LogOut size={13} /> <span className="hidden sm:inline">{s.signOut}</span>
          </button>
        </div>
      </div>
      {isAdmin && (
        <div className="sm:hidden border-t border-slate-100 flex">
          <button
            onClick={onDashboard}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest ${active !== 'admin' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            {s.dashboard}
          </button>
          <button
            onClick={onAdmin}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest ${active === 'admin' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            {s.admin}
          </button>
        </div>
      )}
    </header>
  );
};

export default PortalHeader;
