import React, { useEffect, useState } from 'react';
import { Lang } from './types';
import { canPromptInstall, isIOS, isMobile, isStandalone, onInstallAvailabilityChange, promptInstall } from './pwa';
import { Smartphone, X, Download } from 'lucide-react';

const KEY = 'medident_academy_app_hint';

const t = {
  en: {
    title: 'Medident Academy on your home screen',
    prompt: 'Open the portal like an app, straight from your phone.',
    ios: 'On iPhone: tap the Share button, then “Add to Home Screen”.',
    android: 'In the browser menu (⋮), tap “Add to Home screen” or “Install app”.',
    install: 'Install',
    close: 'Hide this tip',
  },
  sq: {
    title: 'Akademia Medident në ekranin e telefonit',
    prompt: 'Hapeni portalin si aplikacion, direkt nga telefoni.',
    ios: 'Në iPhone: prekni butonin Share, pastaj “Add to Home Screen”.',
    android: 'Në menunë e shfletuesit (⋮), prekni “Add to Home screen” ose “Install app”.',
    install: 'Instalo',
    close: 'Fshihe këtë këshillë',
  },
};

const wasHidden = () => {
  try {
    return localStorage.getItem(KEY) === 'hidden';
  } catch {
    return false;
  }
};

/** A small, closable tip for adding the portal to the phone's home screen. */
const InstallAppCard: React.FC<{ lang: Lang }> = ({ lang }) => {
  const s = t[lang];
  const [hidden, setHidden] = useState(() => wasHidden() || isStandalone());
  const [canPrompt, setCanPrompt] = useState(canPromptInstall);

  useEffect(() => onInstallAvailabilityChange(() => setCanPrompt(canPromptInstall())), []);

  const hide = () => {
    setHidden(true);
    try {
      localStorage.setItem(KEY, 'hidden');
    } catch {
      /* private mode: hidden for this visit only */
    }
  };

  const install = async () => {
    if (await promptInstall()) hide();
  };

  if (hidden) return null;
  // Desktop: only when the browser itself offers installing. Phones: always a tip.
  const text = canPrompt ? s.prompt : isIOS() ? s.ios : isMobile() ? s.android : null;
  if (!text) return null;

  return (
    <div className="mb-8 relative bg-white border border-slate-200 rounded-2xl p-4 pr-12 flex items-center gap-3 sm:gap-4">
      <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
        <Smartphone size={18} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-black text-slate-900 text-sm tracking-tight">{s.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{text}</p>
      </div>
      {canPrompt && (
        <button
          onClick={install}
          className="flex-shrink-0 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
        >
          <Download size={13} /> {s.install}
        </button>
      )}
      <button
        onClick={hide}
        aria-label={s.close}
        title={s.close}
        className="absolute top-2 right-2 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <X size={15} />
      </button>
    </div>
  );
};

export default InstallAppCard;
